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
  // Calculate base hours for trades and DB replication (NO discovery hours here)
  const baseHours =
    inputs.smallTrades * inputs.smallTradeHours +
    inputs.mediumTrades * inputs.mediumTradeHours +
    inputs.largeTrades * inputs.largeTradeHours +
    inputs.dbReplication * inputs.dbReplicationHours;

  // Apply automation reduction (50% if enabled)
  const automationMultiplier = inputs.automationEnabled ? 0.5 : 1.0;
  const totalHours = baseHours * automationMultiplier;

  // Calculate internal cost for implementation (Cost)
  const totalCost = totalHours * inputs.loadedCostPerHour;

  // Calculate margin in dollars for implementation (Margin)
  const margin = totalCost * (inputs.implMargin / 100);

  // Calculate customer price for implementation (Price = Cost + Margin)
  const totalRevenue = totalCost + margin;

  // Discovery is calculated separately (only if hours > 0)
  let discoveryCost = 0;
  if (inputs.discoveryHours > 0) {
    const discoveryInternalCost = inputs.discoveryHours * inputs.discoveryLoadedCostPerHour;
    const discoveryMarginAmount = discoveryInternalCost * (inputs.discoveryMargin / 100);
    discoveryCost = discoveryInternalCost + discoveryMarginAmount;
  }

  // Legacy fields for compatibility
  const tradeCosts = 0;
  const dbReplicationCost = 0;

  return {
    tradeCosts,
    dbReplicationCost,
    discoveryCost,
    totalRevenue: totalRevenue + discoveryCost, // Total includes discovery
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

  // For TPAs: Employees (subscribers) = Members / 1.8
  const yearEmployees = inputs.orgType === 'tpa'
    ? Math.round(yearMembers / 1.8)
    : yearMembers;

  // Calculate monthly rows for this year
  const yearMonthlyRows = calculateMonthlyRows(inputs, volumeGrowth);
  const annualDataCost = (yearMonthlyRows * 12 / 1000000) * inputs.dataCostPer1M;

  // Platform costs
  const platformLicense = inputs.platformLicense;
  const premiumSLA = inputs.hasPremiumSLA ? 50000 : 0;

  // Storage (optional)
  const storagePrice = inputs.hasStorage
    ? inputs.storageCost + (inputs.storageCost * inputs.storageMargin / 100)
    : 0;

  // Revenue
  const implRevenue = year === 1 ? implementation.totalRevenue : 0;
  const ongoingRevenue = platformLicense + premiumSLA + annualDataCost + storagePrice;
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

  // Unit Economics - org type specific
  // TPAs: PEPM (Per Employee Per Month) - using subscribers/employees
  // Payers: PMPM (Per Member Per Month) - using members
  const revenuePEPM = inputs.orgType === 'tpa'
    ? totalRevenue / yearEmployees / 12
    : 0;
  const costPEPM = inputs.orgType === 'tpa'
    ? totalCost / yearEmployees / 12
    : 0;
  const profitPEPM = revenuePEPM - costPEPM;

  const revenuePMPM = inputs.orgType === 'payer'
    ? totalRevenue / yearMembers / 12
    : 0;
  const costPMPM = inputs.orgType === 'payer'
    ? totalCost / yearMembers / 12
    : 0;
  const dataCostPMPM = inputs.orgType === 'payer'
    ? annualDataCost / yearMembers / 12
    : 0;

  // Update cumulative
  const newCumulativeRevenue = cumulativeRevenue + totalRevenue;
  const newCumulativeProfit = cumulativeProfit + grossProfit;

  return {
    year,
    members: yearMembers,
    employees: yearEmployees,
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
  const platformLicense = inputs.platformLicense;
  const premiumSLA = inputs.hasPremiumSLA ? 50000 : 0;

  // Storage (optional)
  const storagePrice = inputs.hasStorage
    ? inputs.storageCost + (inputs.storageCost * inputs.storageMargin / 100)
    : 0;

  const totalOpex = platformLicense + premiumSLA + annualDataCost + storagePrice;

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
