'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CustomerProfile } from '../inputs/CustomerProfile';
import { VolumeDrivers } from '../inputs/VolumeDrivers';
import { MarginControls } from '../inputs/MarginControls';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function OngoingCostsSection() {
  const { inputs, updateInput, results } = usePricingStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  // Calculate ongoing costs and revenue
  const year1 = results.yearlyFinancials?.[0] || { totalRevenue: 0, totalCost: 0, grossProfit: 0, grossMargin: 0 };
  const monthlyCost = year1.totalCost / 12;
  const monthlyRevenue = year1.totalRevenue / 12;
  const pepm = results.opexPepm || 0;
  const arr = year1.totalRevenue;
  const monthlyDataCost = results.annualDataCost / 12;

  // Calculate component breakdowns
  const annualPlatformLicense = inputs.platformLicense;
  const monthlyPlatformLicense = annualPlatformLicense / 12;

  const annualStoragePrice = inputs.hasStorage
    ? inputs.storageCost + (inputs.storageCost * inputs.storageMargin / 100)
    : 0;
  const monthlyStoragePrice = annualStoragePrice / 12;

  const annualDataConsumption = results.annualDataCost || 0;
  const monthlyDataConsumption = annualDataConsumption / 12;

  // Support revenue calculation (based on percentage of total ongoing revenue)
  const totalOngoingRevenue = year1.totalRevenue - (results.implementation?.totalRevenue || 0);
  const annualSupportRevenue = totalOngoingRevenue * ((inputs.supportCostPct + (inputs.supportMarginPct || 0)) / 100);
  const monthlySupportRevenue = annualSupportRevenue / 12;

  // Calculate cost and margin breakdown for each component
  // Platform License (no separate cost/margin - it's a fixed price)
  const platformCost = monthlyPlatformLicense;
  const platformMargin = 0; // Fixed price, no margin breakdown
  const platformRevenue = monthlyPlatformLicense;

  // Storage
  const storageCost = inputs.hasStorage ? inputs.storageCost / 12 : 0;
  const storageMarginPct = inputs.storageMargin || 0;
  const storageRevenue = monthlyStoragePrice;

  // Data Consumption
  const dataCost = monthlyDataConsumption * (inputs.dataCostPct / 100);
  const dataMarginPct = inputs.dataMarginPct || 0;
  const dataRevenue = monthlyDataConsumption;

  // Support Services
  const supportCost = monthlySupportRevenue * (inputs.supportCostPct / (inputs.supportCostPct + (inputs.supportMarginPct || 0)));
  const supportMarginPct = inputs.supportMarginPct || 0;
  const supportRevenue = monthlySupportRevenue;

  // Totals
  const monthlyTotalCost = platformCost + storageCost + dataCost + supportCost;
  const monthlyTotalRevenue = platformRevenue + storageRevenue + dataRevenue + supportRevenue;
  const monthlyTotalMargin = monthlyTotalRevenue - monthlyTotalCost;
  const blendedMarginPct = monthlyTotalCost > 0 ? (monthlyTotalMargin / monthlyTotalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ongoing Costs (OpEx)</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure customer profile, data volumes, and recurring pricing
        </p>
      </div>

      {/* Software License */}
      <Card>
        <CardHeader>
          <CardTitle>Software License</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Annual Platform License
              </label>
              <FormattedNumberInput
                value={inputs.platformLicense}
                onChange={(value) => updateInput('platformLicense', Math.round(value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(inputs.platformLicense / 12)}/month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage (Optional) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Storage (Optional)</CardTitle>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.hasStorage}
                onChange={(e) => updateInput('hasStorage', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">Include Storage</span>
            </label>
          </div>
        </CardHeader>
        {inputs.hasStorage && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Annual Storage Cost (Internal)
                  </label>
                  <FormattedNumberInput
                    value={inputs.storageCost}
                    onChange={(value) => updateInput('storageCost', Math.round(value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(inputs.storageCost / 12)}/month internal cost
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-600">
                      Storage Margin
                    </label>
                    <span className="text-xs text-gray-900 font-semibold">
                      {inputs.storageMargin}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={inputs.storageMargin}
                    onChange={(e) => updateInput('storageMargin', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Margin applied to storage cost
                  </p>
                </div>
              </div>

              {/* Customer Price Display */}
              <div className="pt-3 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">
                      Customer Price (Annual)
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(inputs.storageCost + (inputs.storageCost * inputs.storageMargin / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-blue-700">Monthly</span>
                    <span className="text-sm font-semibold text-blue-700">
                      {formatCurrency((inputs.storageCost + (inputs.storageCost * inputs.storageMargin / 100)) / 12)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Customer Profile & Volume Drivers */}
      <div className="grid grid-cols-2 gap-4">
        <CustomerProfile />
        <VolumeDrivers />
      </div>

      {/* Change Data Capture Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Change Data Capture Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">
                  CDC Timeline
                </label>
                <span className="text-xs text-gray-900 font-semibold">
                  {inputs.cdcTimeline}mo
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                value={inputs.cdcTimeline}
                onChange={(e) => updateInput('cdcTimeline', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">
                  CDC Coverage
                </label>
                <span className="text-xs text-gray-900 font-semibold">
                  {inputs.cdcCoverage}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={inputs.cdcCoverage}
                onChange={(e) => updateInput('cdcCoverage', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Consumption Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Consumption Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">Total Monthly Rows</div>
              <div className="text-lg font-bold text-blue-900">
                {formatNumber((results.monthlyRows || 0) / 1000000)}M
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Based on {inputs.orgType} domain taxonomy
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Monthly Data Revenue</div>
              <div className="text-lg font-bold text-green-900">
                {formatCurrency(monthlyDataCost)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                ${inputs.dataCostPer1M} price per 1M rows
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain & Event Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Domain & Event Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Advanced Configuration */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-900 mb-4">
              Advanced Configuration
            </div>

            <div className="space-y-4">
              {/* Pipeline Architecture */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Data Pipeline Architecture
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateInput('pipelineMultiplier', 1.5)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      inputs.pipelineMultiplier === 1.5
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Monolithic (1.5x)
                  </button>
                  <button
                    onClick={() => updateInput('pipelineMultiplier', 3)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      inputs.pipelineMultiplier === 3
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Warehouse (3x)
                  </button>
                  <button
                    onClick={() => updateInput('pipelineMultiplier', 5)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      inputs.pipelineMultiplier === 5
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Lakehouse (5x)
                  </button>
                  <button
                    onClick={() => updateInput('pipelineMultiplier', 8)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      inputs.pipelineMultiplier === 8
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Data Mesh (8x)
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {inputs.pipelineMultiplier === 1.5 && 'Single database, minimal staging'}
                  {inputs.pipelineMultiplier === 3 && 'Operational + analytical warehouse'}
                  {inputs.pipelineMultiplier === 5 && 'Lake + warehouse + feature stores'}
                  {inputs.pipelineMultiplier === 8 && 'Distributed domain-owned data products'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Data Price per 1M Rows
                  </label>
                  <FormattedNumberInput
                    value={inputs.dataCostPer1M}
                    onChange={(value) => updateInput('dataCostPer1M', Math.round(value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customer price per million rows processed</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Global Row Multiplier
                  </label>
                  <FormattedNumberInput
                    value={inputs.globalRowMultiplier}
                    onChange={(value) => updateInput('globalRowMultiplier', value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    isDecimal
                  />
                  <p className="text-xs text-gray-500 mt-1">Final adjustment to total row count</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Domain
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Event Driver
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Monthly Events
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Expansion
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Versioning
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    Est. Rows/Mo
                  </th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
                    CDC
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.domainRows?.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-gray-900 font-medium">
                      {row.domain}
                    </td>
                    <td className="py-2 px-3 text-gray-600 capitalize">
                      {row.eventDriver}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900">
                      {formatNumber(row.monthlyEvents)}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600">
                      {row.expansion}x
                    </td>
                    <td className="py-2 px-3 text-right text-purple-600">
                      {row.versioning}x
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                      {formatNumber(row.estimatedRows)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {row.cdcEligible ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Rx Claims Row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 bg-blue-50">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    Rx Claims (PBM)
                  </td>
                  <td className="py-2 px-3 text-gray-600">
                    Rx Volume
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatNumber(inputs.rxVolume / 12)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    70x
                  </td>
                  <td className="py-2 px-3 text-right text-purple-600">
                    1x
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                    {formatNumber((inputs.rxVolume / 12) * 70)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-green-600">✓</span>
                  </td>
                </tr>

                {/* Total Row */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="py-2 px-3 text-gray-900" colSpan={5}>
                    Total Monthly Rows (after CDC, pipeline, multipliers)
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 font-bold">
                    {formatNumber(results.monthlyRows)}
                  </td>
                  <td className="py-2 px-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CDC Info */}
          {inputs.cdcCoverage > 0 && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-green-800">
                <strong>CDC Optimization:</strong> {inputs.cdcCoverage}% coverage reduces eligible rows by {(inputs.cdcCoverage * 0.8).toFixed(0)}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing & Margins */}
      <MarginControls />

      {/* Ongoing Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Component
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Cost
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Margin
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Platform License */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    Platform License
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(platformCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-500">
                    N/A
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                    {formatCurrency(platformRevenue)}
                  </td>
                </tr>

                {/* Storage (if enabled) */}
                {inputs.hasStorage && (
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-900 font-medium">
                      Storage
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900">
                      {formatCurrency(storageCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600">
                      {storageMarginPct}%
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                      {formatCurrency(storageRevenue)}
                    </td>
                  </tr>
                )}

                {/* Data Consumption */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    Data Consumption
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(dataCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    {dataMarginPct}%
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                    {formatCurrency(dataRevenue)}
                  </td>
                </tr>

                {/* Support Services */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    Support Services
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(supportCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    {supportMarginPct}%
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                    {formatCurrency(supportRevenue)}
                  </td>
                </tr>

                {/* Total */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="py-2 px-3 text-gray-900">
                    Total Monthly OpEx
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(monthlyTotalCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    {blendedMarginPct.toFixed(0)}%
                  </td>
                  <td className="py-2 px-3 text-right text-green-600 font-bold">
                    {formatCurrency(monthlyTotalRevenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Metrics */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">
                  Annual Recurring Revenue (ARR)
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(monthlyTotalRevenue * 12)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">PEPM</span>
                <span className="text-lg font-bold text-green-600">
                  ${pepm.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
