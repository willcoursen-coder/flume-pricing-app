# Flume Health Pricing Model

A Next.js-based pricing calculator for healthcare data platform services. This model calculates data volumes, infrastructure costs, and 5-year financial projections for health insurance payers, TPAs, and healthcare providers.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

## 📊 What This Model Does

This pricing calculator estimates:
- **Monthly data volumes** based on member lives, claims, and Rx utilization
- **Infrastructure costs** including implementation, platform licenses, and data storage
- **5-year financial projections** with growth rates and profitability analysis
- **Change Data Capture (CDC) impact** on data volumes
- **ETL pipeline staging** multipliers for data architecture patterns

## 🏗️ Model Architecture

### Core Calculation Flow

```
Member Lives (250K)
    ↓
Auto-Calculate Volumes
    ├── Medical Claims: 2.5M/year (10 claims/member/year)
    ├── Rx Claims: 5M/year (20 fills/member/year)
    └── Other metrics (auth rate, providers, employers)
    ↓
Domain-Based Row Calculations
    ├── 834 Enrollment
    ├── 837 Claims Processing (90x expansion)
    ├── 835 ERA/Payments (25x expansion)
    ├── Rx Claims Processing (70x expansion)
    └── Other domains...
    ↓
Apply CDC Reduction (80% reduction on eligible data)
    ↓
Apply Pipeline Multiplier (4x for ETL staging: Raw → Bronze → Silver → Gold)
    ↓
Final Monthly Rows (~213M for 250K lives)
```

### Key Concepts

#### 1. Expansion Factors

Expansion factors represent how many database rows are created from a single business event:

- **837 Claims (90x)**:
  - Each claim → 4-5 claim lines
  - Each line → pricing, audit, versions, GL integration
  - Total: ~90 database rows per claim

- **Rx Processing (70x)**:
  - PBM processing, DUR checks, formulary lookups
  - Pricing, rebate processing, versions
  - Total: ~70 database rows per Rx fill

- **835 ERA (25x)**:
  - Payment reconciliation, GL integration
  - Bank file generation, versions
  - Total: ~25 database rows per ERA

#### 2. Pipeline Multiplier

Data flows through multiple staging layers in modern data architectures:

| Architecture | Multiplier | Description |
|-------------|-----------|-------------|
| **Monolithic** | 1.5x | Single database, minimal staging |
| **Warehouse** | 3x | Operational + analytical warehouse |
| **Lakehouse** | 5x | Lake + warehouse + feature stores |
| **Data Mesh** | 8x | Distributed domain-owned data products |

**Default: 4x (Warehouse)** = Raw → Bronze → Silver → Gold layers

#### 3. Change Data Capture (CDC)

CDC reduces data volumes by only processing changed records:

- **Eligible Data**: Transactional data (claims, enrollment, etc.)
- **Reduction**: 80% of eligible rows (only 20% change monthly)
- **Timeline**: Configured in months (e.g., implement CDC in 6 months)
- **Impact**: Can reduce monthly rows from 53M to ~10M (business logic)

#### 4. Auto-Calculated Volumes

When you change **Member Lives**, these auto-update:

```javascript
Medical Claims = Member Lives × 10 claims/year
Rx Claims = Member Lives × 20 fills/year
```

Users can still manually override these values for custom utilization patterns.

## 📁 Project Structure

```
flume-pricing-app/
├── app/
│   ├── page.tsx                 # Main pricing calculator page
│   ├── layout.tsx               # App layout with fonts
│   └── globals.css              # Global styles
├── components/
│   ├── inputs/
│   │   ├── CustomerProfile.tsx  # Member lives, org type, providers
│   │   ├── VolumeDrivers.tsx    # Claims, Rx, auth rates
│   │   ├── Implementation.tsx   # Trades, DB replication, discovery
│   │   ├── Settings.tsx         # CDC settings, premium SLA
│   │   ├── MarginControls.tsx   # Cost percentages
│   │   └── AdvancedControls.tsx # Pipeline architecture, cost params
│   ├── outputs/
│   │   └── PricingSummary.tsx   # KPI cards (Year 1, TCO, Monthly Rows, PEPM)
│   ├── tables/
│   │   ├── DomainVolumes.tsx    # Domain-by-domain row breakdown
│   │   ├── FiveYearPL.tsx       # 5-year financial projections
│   │   └── EffortBreakdown.tsx  # Implementation effort hours
│   └── ui/
│       ├── Card.tsx             # Reusable card component
│       └── FormattedNumberInput.tsx  # Number input with comma formatting
├── lib/
│   ├── store.ts                 # Zustand state management
│   ├── types.ts                 # TypeScript type definitions
│   ├── domainTaxonomy.ts        # Domain definitions & default values
│   └── calculations.ts          # Core pricing calculations
└── README.md                    # This file
```

## 🔢 Calculation Details

### Monthly Rows Calculation

```typescript
// 1. Calculate base domain rows
domains.forEach(domain => {
  monthlyEvents = calculateDomainEvents(domain, inputs);
  estimatedRows = monthlyEvents × expansion × versioning;
});

// 2. Add Rx claims
rxMonthlyRows = (rxVolume / 12) × 70;

// 3. Apply CDC reduction (80% reduction on eligible data)
if (cdcEligible) {
  effectiveRows = estimatedRows × (1 - 0.8 × cdcCoverage/100);
}

// 4. Apply pipeline multiplier (ETL staging)
afterPipeline = effectiveRows × pipelineMultiplier;

// 5. Apply global multiplier (edge cases)
finalRows = afterPipeline × globalRowMultiplier;
```

### Example Calculation (250K Members)

```
Raw Business Logic:      53,237,893 rows/month
├── 837 Claims:          18,750,000 rows (2.5M claims × 90x / 12)
├── Rx Processing:       29,166,667 rows (5M Rx × 70x / 12)
├── 835 ERA:              4,687,500 rows
├── 834 Enrollment:         625,000 rows
└── Other domains:       ~1,000,000 rows

CDC Applied (0%):        53,237,893 rows (no CDC initially)

Pipeline (4x):         212,951,573 rows
├── Raw layer:          53,237,893
├── Bronze layer:       53,237,893
├── Silver layer:       53,237,893
└── Gold layer:         53,237,893

TOTAL: ~213M rows/month
```

### Financial Calculations

#### Year 1 Revenue
```
Implementation:
  - Small Trades (40 hrs): 5 × $3,800 = $19,000
  - Medium Trades (120 hrs): 8 × $10,300 = $82,400
  - Large Trades (240 hrs): 3 × $16,840 = $50,520
  - Discovery Phase: $85,000
  Total Implementation: ~$237,000

Annual OPEX:
  - Platform License: $85,000
  - Data Cost: (213M × 12 / 1M) × $47 = $120,000
  - Premium SLA: $50,000 (optional)
  Total OPEX: ~$255,000

YEAR 1 TOTAL: ~$492,000
```

#### Data Cost Formula
```
Annual Data Cost = (MonthlyRows × 12 / 1,000,000) × DataCostPer1M
                 = (213M × 12 / 1M) × $47
                 = $120,000/year
```

#### PEPM (Per Employee Per Month)
```
OPEX PEPM = Total OPEX / Member Lives / 12 months
          = $255,000 / 250,000 / 12
          = $0.085 PEPM

Benchmark: $0.06 PEPM
```

## 🎯 Organization Types

### Payer
- Health insurance companies
- Domains: Enrollment, Claims, ERA, Authorizations, HEDIS, Risk Adjustment
- Higher regulatory overhead
- Focus on quality metrics and risk adjustment

### TPA (Third-Party Administrator)
- Claims administration for self-funded employers
- Domains: Claims Processing (90x), ERA (25x), Employer Funding, Bank Reconciliation
- Complex financial integrations
- COB/Subrogation workflows

### Provider
- Hospitals, health systems
- Domains: ADT Events, Orders (ORM), Results (ORU), Charge Capture, 837 Generation
- Clinical data integration
- Denials management, patient finance

## 🛠️ How to Modify the Model

### Adding a New Domain

1. **Edit `lib/domainTaxonomy.ts`**:
```typescript
{
  name: 'New Domain',
  eventDriver: 'claims',        // What drives volume
  eventRatio: 1.0,              // Multiplier for event driver
  expansion: 10,                // Rows per event
  versioning: 1.05,             // Version history multiplier
  billable: true,               // Include in pricing
  cdcEligible: true,            // Can benefit from CDC
}
```

2. **Event Drivers**:
- `memberChurn`: Member turnover rate
- `claims`: Annual claims volume
- `members`: Total member lives
- `employers`: Number of employers
- `providerChurn`: Provider turnover
- `authRate`: Authorizations per 1K members/month
- `admissions`: Hospital admissions

### Adjusting Expansion Factors

Expansion factors should reflect the full data lifecycle:

```typescript
expansion = claim_lines × business_logic_tables × audit_versions

Example for 837 Claims:
  - 4.5 claim lines per claim
  - 20 related tables (pricing, audit, GL, etc.)
  - 1.05 version history
  = 4.5 × 20 × 1.05 ≈ 90x expansion
```

### Changing Default Utilization Rates

Edit `lib/store.ts`:

```typescript
if (key === 'memberLives') {
  newInputs.claimsVolume = value × 12;  // Change to 12 claims/member/year
  newInputs.rxVolume = value × 25;      // Change to 25 fills/member/year
}
```

### Modifying Pipeline Architectures

Edit `components/inputs/AdvancedControls.tsx`:

```tsx
<button onClick={() => updateInput('pipelineMultiplier', 6)}>
  Custom (6x)
</button>
```

## 📈 Growth Rate Model

Growth scales all volumes proportionally:

```
Year 1: 250K members → 2.5M claims → 213M rows/month
Year 2 (10% growth): 275K members → 2.75M claims → 234M rows/month
Year 3 (10% growth): 302.5K members → 3.025M claims → 257M rows/month
```

All metrics scale together:
- Member Lives
- Medical Claims
- Rx Claims
- Employers
- Providers

## 🔄 State Management

Uses **Zustand** for reactive state management:

```typescript
// Automatic recalculation on every input change
updateInput: (key, value) => {
  const newInputs = { ...state.inputs, [key]: value };

  // Auto-calculate dependent values
  if (key === 'memberLives') {
    newInputs.claimsVolume = value × 10;
    newInputs.rxVolume = value × 20;
  }

  return {
    inputs: newInputs,
    results: calculatePricing(newInputs),  // Recalculate everything
  };
}
```

All components automatically re-render when state changes.

## 🐛 Troubleshooting

### UI Not Updating

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check blur**: FormattedNumberInput updates on blur (click outside field or press Enter)
3. **Check console**: Look for calculation logs showing updates
4. **Clear cache**: Close browser completely and reopen

### Numbers Seem Wrong

1. **Check CDC settings**: CDC at 80% reduces volumes significantly
2. **Check pipeline multiplier**: Default 4x increases volumes
3. **Check all three inputs**: Member Lives, Claims Volume, Rx Volume must all be set correctly
4. **Check org type**: Different org types have different domains

### Performance Issues

1. **Reduce console logging**: Comment out debug logs in `lib/calculations.ts`
2. **Optimize re-renders**: Components already optimized with proper React keys
3. **Check browser extensions**: Disable extensions that modify DOM

## 📝 Development Workflow

```bash
# Make changes to code
# Files auto-reload in browser at localhost:3000

# Commit changes
git add .
git commit -m "Description of changes"

# View history
git log --oneline
```

**Do NOT push to production** - this is a local development model.

## 🔐 Data & Privacy

- All calculations run client-side (no data sent to servers)
- No backend database or API
- State persists only in browser memory (resets on refresh)
- Safe for exploring real customer scenarios

## 💡 Future Enhancements

Potential additions:
- [ ] Export to Excel/CSV
- [ ] Save/load scenarios
- [ ] Multi-scenario comparison
- [ ] Custom domain builder UI
- [ ] Integration cost templates
- [ ] Benchmark comparison data
- [ ] ROI calculator
- [ ] Break-even analysis

## 📚 Key Files Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `lib/domainTaxonomy.ts` | Domain definitions, defaults | Adding/modifying domains |
| `lib/calculations.ts` | All pricing calculations | Changing calculation logic |
| `lib/store.ts` | State management | Adding new inputs/auto-calculations |
| `lib/types.ts` | TypeScript types | Adding new data fields |
| `components/tables/DomainVolumes.tsx` | Domain breakdown display | Changing table UI |
| `components/outputs/PricingSummary.tsx` | KPI cards | Adding/modifying metrics |

## 🤝 Contributing

This is an internal pricing model. To modify:

1. Make changes locally
2. Test thoroughly with realistic scenarios
3. Commit to git with descriptive messages
4. Document changes in this README
5. Share updates with team

## 📞 Support

For questions about:
- **Model logic**: Review this README and calculation code
- **Healthcare domain questions**: Consult domain experts
- **Technical issues**: Check Next.js documentation
- **Pricing assumptions**: Review with finance team

---

**Version**: 1.0
**Last Updated**: October 2024
**Technology**: Next.js 15, TypeScript, Zustand, Tailwind CSS
