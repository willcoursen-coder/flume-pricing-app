'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function ImplementationSection() {
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

  const impl = results.implementation || { totalHours: 0, totalCost: 0, margin: 0, totalRevenue: 0, discoveryCost: 0 };
  const totalWeeks = impl.totalHours / 40;
  const calendarWeeks = totalWeeks / (inputs.fteCount || 2); // Based on FTE count

  // Calculate hours breakdown
  const tradesHours = (
    inputs.smallTrades * inputs.smallTradeHours +
    inputs.mediumTrades * inputs.mediumTradeHours +
    inputs.largeTrades * inputs.largeTradeHours
  ) * (inputs.automationEnabled ? 0.5 : 1.0);

  const dbReplicationHours = (inputs.dbReplication * inputs.dbReplicationHours) * (inputs.automationEnabled ? 0.5 : 1.0);

  // Trades & Integration breakdown (excluding DB replication)
  const tradesCost = tradesHours * inputs.loadedCostPerHour;
  const tradesMargin = tradesCost * (inputs.implMargin / 100);
  const tradesRevenue = tradesCost + tradesMargin;

  // Database Replication breakdown (if count > 0)
  const dbReplicationCost = dbReplicationHours * inputs.loadedCostPerHour;
  const dbReplicationMargin = dbReplicationCost * (inputs.implMargin / 100);
  const dbReplicationRevenue = dbReplicationCost + dbReplicationMargin;

  // Discovery breakdown (if hours > 0)
  const discoveryInternalCost = inputs.discoveryHours > 0
    ? inputs.discoveryHours * inputs.discoveryLoadedCostPerHour
    : 0;
  const discoveryMarginAmount = discoveryInternalCost * (inputs.discoveryMargin / 100);
  const discoveryRevenue = discoveryInternalCost + discoveryMarginAmount;

  // Totals
  const totalCost = tradesCost + dbReplicationCost + discoveryInternalCost;
  const totalMargin = tradesMargin + dbReplicationMargin + discoveryMarginAmount;
  const totalRevenue = tradesRevenue + dbReplicationRevenue + discoveryRevenue;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Implementation (CapEx)</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure trade setups, deployment type, and capacity planning
        </p>
      </div>

      {/* Trade Setup & Integrations - Consolidated */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Setup & Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trade Definitions Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-900 mb-2">
              Trade Sizing Guide
            </div>
            <div className="space-y-1.5 text-xs text-blue-800">
              <div>
                <span className="font-medium">Small (40 hrs):</span> Simple files, standard formats (834, 835 flat files)
              </div>
              <div>
                <span className="font-medium">Medium (120 hrs):</span> Complex files, custom mapping (837 with extensions, HL7)
              </div>
              <div>
                <span className="font-medium">Large (240 hrs):</span> API integrations, real-time feeds, custom transformations
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Small Trades ({inputs.smallTradeHours} hrs each)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputs.smallTrades}
                  onChange={(e) => updateInput('smallTrades', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Count"
                />
                <input
                  type="number"
                  value={inputs.smallTradeHours}
                  onChange={(e) => updateInput('smallTradeHours', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Hours"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Standard 834, 835 flat files
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Medium Trades ({inputs.mediumTradeHours} hrs each)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputs.mediumTrades}
                  onChange={(e) => updateInput('mediumTrades', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Count"
                />
                <input
                  type="number"
                  value={inputs.mediumTradeHours}
                  onChange={(e) => updateInput('mediumTradeHours', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Hours"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                837 with custom fields, HL7
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Large Trades ({inputs.largeTradeHours} hrs each)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputs.largeTrades}
                  onChange={(e) => updateInput('largeTrades', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Count"
                />
                <input
                  type="number"
                  value={inputs.largeTradeHours}
                  onChange={(e) => updateInput('largeTradeHours', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Hours"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                REST/SOAP APIs, real-time feeds
              </p>
            </div>
          </div>

          {/* Database Replication - within same card */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Database Replication
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Database Replication ({inputs.dbReplicationHours} hrs each)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputs.dbReplication}
                  onChange={(e) => updateInput('dbReplication', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Count"
                />
                <input
                  type="number"
                  value={inputs.dbReplicationHours}
                  onChange={(e) => updateInput('dbReplicationHours', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Hours"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Legacy system data migration and CDC replication
              </p>
            </div>
          </div>

          {/* AI Automation - within same card */}
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-semibold text-green-900">
                    Enable AI Automation
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Reduces implementation time by 50% using automated mapping and code generation
                  </div>
                </div>
                <button
                  onClick={() => updateInput('automationEnabled', !inputs.automationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    inputs.automationEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inputs.automationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {inputs.automationEnabled && (
                <div className="text-xs text-green-800 mt-2 font-medium">
                  ✓ Automation enabled - Implementation hours reduced by 50%
                </div>
              )}
            </div>
          </div>

          {/* Resource Planning - within same card */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Resource Planning
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Total Hours</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(impl.totalHours)} hrs
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">FTE Weeks</div>
                <div className="text-lg font-bold text-gray-900">
                  {totalWeeks.toFixed(1)} weeks
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Timeline ({inputs.fteCount} FTEs)</div>
                <div className="text-lg font-bold text-blue-600">
                  {calendarWeeks.toFixed(1)} weeks
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({(calendarWeeks / 4.33).toFixed(1)} months)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Number of FTEs (parallel resources)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={inputs.fteCount}
                onChange={(e) => updateInput('fteCount', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                More FTEs = shorter calendar time (assumes work can be parallelized)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Deployment Setup + Discovery */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Deployment Setup + Discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-800">
              Strategic consulting, data profiling, architecture design, and change management
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Discovery Hours
              </label>
              <input
                type="number"
                value={inputs.discoveryHours}
                onChange={(e) => updateInput('discoveryHours', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Loaded Cost/Hour
              </label>
              <FormattedNumberInput
                value={inputs.discoveryLoadedCostPerHour}
                onChange={(value) => updateInput('discoveryLoadedCostPerHour', Math.round(value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Discovery Margin (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.discoveryMargin}
                onChange={(e) => updateInput('discoveryMargin', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Discovery Resource Planning */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Resource Planning
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Discovery Hours</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(inputs.discoveryHours)} hrs
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">FTE Weeks</div>
                <div className="text-lg font-bold text-gray-900">
                  {(inputs.discoveryHours / 40).toFixed(1)} weeks
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Timeline</div>
                <div className="text-lg font-bold text-blue-600">
                  {(inputs.discoveryHours / 40).toFixed(1)} weeks
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({(inputs.discoveryHours / 40 / 4.33).toFixed(1)} months)
                </div>
              </div>
            </div>
          </div>

          {/* Discovery Pricing Breakdown */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Discovery Pricing
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Internal Cost</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(inputs.discoveryHours * inputs.discoveryLoadedCostPerHour)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Margin ({inputs.discoveryMargin}%)
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  +{formatCurrency((inputs.discoveryHours * inputs.discoveryLoadedCostPerHour) * (inputs.discoveryMargin / 100))}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">
                  Discovery Price
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(impl.discoveryCost || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Pricing Summary</CardTitle>
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
                {/* Trades & Integration */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    Trades & Integration
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(tradesCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    {inputs.implMargin}%
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                    {formatCurrency(tradesRevenue)}
                  </td>
                </tr>

                {/* Database Replication (if count > 0) */}
                {inputs.dbReplication > 0 && (
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-900 font-medium">
                      Database Replication
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900">
                      {formatCurrency(dbReplicationCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600">
                      {inputs.implMargin}%
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                      {formatCurrency(dbReplicationRevenue)}
                    </td>
                  </tr>
                )}

                {/* Discovery (if enabled) */}
                {inputs.discoveryHours > 0 && (
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-900 font-medium">
                      Discovery
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900">
                      {formatCurrency(discoveryInternalCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600">
                      {inputs.discoveryMargin}%
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                      {formatCurrency(discoveryRevenue)}
                    </td>
                  </tr>
                )}

                {/* Total */}
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="py-2 px-3 text-gray-900">
                    Total CapEx
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900">
                    {formatCurrency(totalCost)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    {totalRevenue > 0 ? ((totalMargin / totalCost) * 100).toFixed(0) : '0'}%
                  </td>
                  <td className="py-2 px-3 text-right text-green-600 font-bold">
                    {formatCurrency(totalRevenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
