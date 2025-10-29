export type OrgType = 'payer' | 'tpa' | 'provider';

export type EventDriver =
  | 'memberChurn'
  | 'authRate'
  | 'claims'
  | 'members'
  | 'employers'
  | 'providerChurn'
  | 'admissions';

export interface Domain {
  name: string;
  eventDriver: EventDriver;
  eventRatio?: number;
  expansion: number;
  versioning: number;
  billable: boolean;
  cdcEligible: boolean;
}

export interface DomainTaxonomy {
  payer: Domain[];
  tpa: Domain[];
  provider: Domain[];
}

export interface PricingInputs {
  // Customer Profile
  orgType: OrgType;
  memberLives: number;
  memberChurn: number;
  providers: number;
  employers: number;

  // Volume Drivers
  claimsVolume: number;
  rxVolume: number;
  authRate: number;
  growthRate: number;

  // Implementation
  smallTrades: number;
  mediumTrades: number;
  largeTrades: number;
  dbReplication: number;
  hasDiscovery: boolean;
  automationEnabled: boolean; // Reduces implementation hours by 50%

  // Settings
  cdcTimeline: number;
  cdcCoverage: number;
  hasPremiumSLA: boolean;

  // Margins (Internal)
  implMargin: number;
  platformCostPct: number;
  dataCostPct: number;
  supportCostPct: number;

  // Advanced
  loadedCostPerHour: number;
  dataCostPer1M: number;
  globalRowMultiplier: number;
  pipelineMultiplier: number; // ETL staging layers multiplier (2x-10x)
}

export interface DomainRowResult {
  domain: string;
  eventDriver: string;
  monthlyEvents: number;
  expansion: number;
  versioning: number;
  estimatedRows: number;
  cdcEligible: boolean;
  billable: boolean;
}

export interface ImplementationCost {
  tradeCosts: number;
  dbReplicationCost: number;
  discoveryCost: number;
  totalRevenue: number;
  totalHours: number;
  totalCost: number;
  margin: number;
}

export interface YearlyFinancials {
  year: number;
  members: number;
  employers: number;
  providers: number;

  // Revenue
  implRevenue: number;
  ongoingRevenue: number;
  totalRevenue: number;

  // Costs
  implCost: number;
  ongoingCost: number;
  totalCost: number;

  // Profitability
  grossProfit: number;
  grossMargin: number;

  // Unit Economics
  revenuePEPM: number;
  costPEPM: number;
  profitPEPM: number;
  revenuePMPM: number;
  costPMPM: number;
  dataCostPMPM: number;

  // Data
  monthlyRows: number;
  annualDataCost: number;

  // Cumulative
  cumulativeRevenue: number;
  cumulativeProfit: number;
}

export interface PricingResults {
  // Summary
  year1Total: number;
  tco3Year: number;
  monthlyRows: number;
  opexPepm: number;
  pepmBenchmark: number;

  // Implementation
  implementation: ImplementationCost;

  // Annual costs
  platformLicense: number;
  premiumSLA: number;
  annualDataCost: number;
  totalOpex: number;

  // 5-year analysis
  yearlyFinancials: YearlyFinancials[];

  // Domain breakdown
  domainRows: DomainRowResult[];
}
