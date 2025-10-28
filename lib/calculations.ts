import { domainTaxonomy } from './domainTaxonomy';
import type {
  PricingInputs,
  Domain,
  DomainRowResult,
  ImplementationCost,
  YearlyFinancials,
  PricingResults,
} from './types';

/**
 * Calculate monthly events for a given domain based on inputs
 */
export function calculateDomainEvents(
  domain: Domain,
  inputs: PricingInputs
): number {
  let monthlyEvents = 0;

  switch (domain.eventDriver) {
    case 'memberChurn':
      monthlyEvents = inputs.memberLives * (inputs.memberChurn / 100);
      break;
    case 'authRate':
      monthlyEvents = (inputs.memberLives / 1000) * inputs.authRate;
      break;
    case 'claims':
      monthlyEvents = (inputs.claimsVolume / 12) * (domain.eventRatio || 1);
      break;
    case 'members':
      monthlyEvents = inputs.memberLives * (domain.eventRatio || 0.01);
      break;
    case 'employers':
      monthlyEvents = inputs.employers * (domain.eventRatio || 1);
      break;
    case 'providerChurn':
      monthlyEvents = inputs.providers * 0.02;
      break;
    case 'admissions':
      monthlyEvents = inputs.claimsVolume / 12 / 10;
      break;
  }

  return monthlyEvents;
}

/**
 * Calculate domain row results for all domains of a given org type
 */
export function calculateDomainRows(
  inputs: PricingInputs
): DomainRowResult[] {
  const domains = domainTaxonomy[inputs.orgType];
  const results: DomainRowResult[] = [];

  domains.forEach((domain) => {
    const monthlyEvents = calculateDomainEvents(domain, inputs);
    const expandedRows = monthlyEvents * domain.expansion * domain.versioning;

    results.push({
      domain: domain.name,
      eventDriver: domain.eventDriver,
      monthlyEvents,
      expansion: domain.expansion,
      versioning: domain.versioning,
      estimatedRows: expandedRows, // Raw estimated rows WITHOUT CDC reduction
      cdcEligible: domain.cdcEligible,
      billable: domain.billable,
    });
  });

  return results;
}

/**
 * Calculate total monthly billable rows
 */
export function calculateMonthlyRows(
  inputs: PricingInputs,
  volumeMultiplier: number = 1
): number {
  const adjustedInputs: PricingInputs = {
    ...inputs,
    memberLives: inputs.memberLives * volumeMultiplier,
    claimsVolume: inputs.claimsVolume * volumeMultiplier,
    rxVolume: inputs.rxVolume * volumeMultiplier,
    employers: inputs.employers * volumeMultiplier,
    providers: inputs.providers * volumeMultiplier,
  };

  const domainRows = calculateDomainRows(adjustedInputs);
  let billableMonthlyRows = 0;
  let rawTotalRows = 0;

  domainRows.forEach((row) => {
    if (row.billable) {
      rawTotalRows += row.estimatedRows;
      // Apply CDC reduction to eligible rows
      if (row.cdcEligible) {
        const cdcReduction = (adjustedInputs.cdcCoverage / 100) * 0.8;
        billableMonthlyRows += row.estimatedRows * (1 - cdcReduction);
      } else {
        billableMonthlyRows += row.estimatedRows;
      }
    }
  });

  // Add Rx claims (with CDC reduction applied)
  // Rx expansion: Full PBM processing including DUR, formulary, pricing lookups, rebate processing
  const rxMonthlyRows = (adjustedInputs.rxVolume / 12) * 70;
  rawTotalRows += rxMonthlyRows;
  const cdcReduction = (adjustedInputs.cdcCoverage / 100) * 0.8;
  billableMonthlyRows += rxMonthlyRows * (1 - cdcReduction);

  // Apply pipeline multiplier (ETL staging layers)
  const afterPipeline = billableMonthlyRows * inputs.pipelineMultiplier;
  const finalRows = afterPipeline * inputs.globalRowMultiplier;

  // Debug logging
  if (volumeMultiplier === 1) {
    console.log('📊 Monthly Rows Calculation:');
    console.log('  Raw total rows (business logic):', rawTotalRows.toLocaleString());
    console.log('  CDC coverage:', inputs.cdcCoverage + '%');
    console.log('  CDC reduction:', (cdcReduction * 100).toFixed(1) + '%');
    console.log('  After CDC:', billableMonthlyRows.toLocaleString());
    console.log('  Pipeline multiplier:', inputs.pipelineMultiplier + 'x (ETL staging layers)');
    console.log('  After pipeline:', afterPipeline.toLocaleString());
    console.log('  Global multiplier:', inputs.globalRowMultiplier);
    console.log('  Final monthly rows:', finalRows.toLocaleString());
  }

  return finalRows;
}

/**
 * Calculate implementation costs
 */
export function calculateImplementationCost(
  inputs: PricingInputs
): ImplementationCost {
  const tradeCosts =
    inputs.smallTrades * 3800 +
    inputs.mediumTrades * 10300 +
    inputs.largeTrades * 16840;

  const dbReplicationCost = inputs.dbReplication * 45000;
  const discoveryCost = inputs.hasDiscovery ? 85000 : 0;
  const totalRevenue = tradeCosts + dbReplicationCost + discoveryCost;

  const totalHours =
    inputs.smallTrades * 40 +
    inputs.mediumTrades * 120 +
    inputs.largeTrades * 240 +
    inputs.dbReplication * 80 +
    (inputs.hasDiscovery ? 200 : 0);

  const totalCost = totalHours * inputs.loadedCostPerHour;
  const margin = totalRevenue - totalCost;

  return {
    tradeCosts,
    dbReplicationCost,
    discoveryCost,
    totalRevenue,
    totalHours,
    totalCost,
    margin,
  };
}

/**
 * Calculate yearly financials for a given year
 */
export function calculateYearlyFinancials(
  inputs: PricingInputs,
  year: number,
  implementation: ImplementationCost,
  cumulativeRevenue: number,
  cumulativeProfit: number
): YearlyFinancials {
  const volumeGrowth = Math.pow(1 + inputs.growthRate / 100, year - 1);

  // Volume for this year
  const yearMembers = Math.round(inputs.memberLives * volumeGrowth);
  const yearEmployers = Math.round(inputs.employers * volumeGrowth);
  const yearProviders = Math.round(inputs.providers * volumeGrowth);

  // Calculate monthly rows for this year
  const yearMonthlyRows = calculateMonthlyRows(inputs, volumeGrowth);
  const annualDataCost = (yearMonthlyRows * 12 / 1000000) * inputs.dataCostPer1M;

  // Platform costs
  const platformLicense = 85000;
  const premiumSLA = inputs.hasPremiumSLA ? 50000 : 0;

  // Revenue
  const implRevenue = year === 1 ? implementation.totalRevenue : 0;
  const ongoingRevenue = platformLicense + premiumSLA + annualDataCost;
  const totalRevenue = implRevenue + ongoingRevenue;

  // Costs
  const implCost = year === 1 ? implementation.totalCost : 0;
  const ongoingCostPct =
    (inputs.platformCostPct + inputs.dataCostPct + inputs.supportCostPct) / 100;
  const ongoingCost = ongoingRevenue * ongoingCostPct;
  const totalCost = implCost + ongoingCost;

  // Profitability
  const grossProfit = totalRevenue - totalCost;
  const grossMargin = (grossProfit / totalRevenue) * 100;

  // Unit Economics
  const revenuePEPM = totalRevenue / yearEmployers / 12;
  const costPEPM = totalCost / yearEmployers / 12;
  const profitPEPM = revenuePEPM - costPEPM;

  const revenuePMPM = totalRevenue / yearMembers / 12;
  const costPMPM = totalCost / yearMembers / 12;
  const dataCostPMPM = annualDataCost / yearMembers / 12;

  // Update cumulative
  const newCumulativeRevenue = cumulativeRevenue + totalRevenue;
  const newCumulativeProfit = cumulativeProfit + grossProfit;

  return {
    year,
    members: yearMembers,
    employers: yearEmployers,
    providers: yearProviders,
    implRevenue,
    ongoingRevenue,
    totalRevenue,
    implCost,
    ongoingCost,
    totalCost,
    grossProfit,
    grossMargin,
    revenuePEPM,
    costPEPM,
    profitPEPM,
    revenuePMPM,
    costPMPM,
    dataCostPMPM,
    monthlyRows: yearMonthlyRows,
    annualDataCost,
    cumulativeRevenue: newCumulativeRevenue,
    cumulativeProfit: newCumulativeProfit,
  };
}

/**
 * Main calculation function - computes all pricing results
 */
export function calculatePricing(inputs: PricingInputs): PricingResults {
  // Implementation costs
  const implementation = calculateImplementationCost(inputs);

  // Year 1 calculations
  const monthlyRows = calculateMonthlyRows(inputs);
  const annualDataCost = (monthlyRows * 12 / 1000000) * inputs.dataCostPer1M;
  const platformLicense = 85000;
  const premiumSLA = inputs.hasPremiumSLA ? 50000 : 0;
  const totalOpex = platformLicense + premiumSLA + annualDataCost;

  const year1Total = implementation.totalRevenue + totalOpex;

  // 5-year analysis
  const yearlyFinancials: YearlyFinancials[] = [];
  let cumulativeRevenue = 0;
  let cumulativeProfit = 0;

  for (let year = 1; year <= 5; year++) {
    const yearData = calculateYearlyFinancials(
      inputs,
      year,
      implementation,
      cumulativeRevenue,
      cumulativeProfit
    );
    yearlyFinancials.push(yearData);
    cumulativeRevenue = yearData.cumulativeRevenue;
    cumulativeProfit = yearData.cumulativeProfit;
  }

  // 3-year TCO
  const tco3Year = yearlyFinancials
    .slice(0, 3)
    .reduce((sum, year) => sum + year.totalRevenue, 0);

  // OPEX PEPM
  const opexPepm = totalOpex / inputs.memberLives / 12;
  const benchmarkPEPM = 0.06;
  const pepmBenchmark = ((opexPepm - benchmarkPEPM) / benchmarkPEPM) * 100;

  // Domain breakdown
  const domainRows = calculateDomainRows(inputs);

  return {
    year1Total,
    tco3Year,
    monthlyRows,
    opexPepm,
    pepmBenchmark,
    implementation,
    platformLicense,
    premiumSLA,
    annualDataCost,
    totalOpex,
    yearlyFinancials,
    domainRows,
  };
}
