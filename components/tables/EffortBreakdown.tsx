'use client';

import { usePricingStore } from '@/lib/store';

export function EffortBreakdown() {
  const { inputs, results } = usePricingStore();

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  const formatHours = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Calculate effort breakdown based on implementation costs
  const impl = results.implementation;

  // Hours per FTE week (standard 40 hour work week)
  const hoursPerWeek = 40;

  const efforts = [
    {
      component: 'Strategic Deployment Setup + Discovery',
      count: inputs.discoveryHours > 0 ? 1 : 0,
      hoursEach: inputs.discoveryHours,
      description: 'Strategic consulting, data profiling, architecture design, and change management',
      isOptional: false,
    },
    {
      component: `Small Trades (${inputs.smallTradeHours} hrs)`,
      count: inputs.smallTrades,
      hoursEach: inputs.smallTradeHours,
      description: 'Standard 834/835 flat files, simple CSV imports',
      isOptional: false,
    },
    {
      component: `Medium Trades (${inputs.mediumTradeHours} hrs)`,
      count: inputs.mediumTrades,
      hoursEach: inputs.mediumTradeHours,
      description: '837 with custom fields, HL7 messages, complex mapping',
      isOptional: false,
    },
    {
      component: `Large Trades (${inputs.largeTradeHours} hrs)`,
      count: inputs.largeTrades,
      hoursEach: inputs.largeTradeHours,
      description: 'REST/SOAP APIs, real-time integrations, custom transforms',
      isOptional: false,
    },
    {
      component: `Database Replication (${inputs.dbReplicationHours} hrs)`,
      count: inputs.dbReplication,
      hoursEach: inputs.dbReplicationHours,
      description: 'Legacy system data migration and replication',
      isOptional: false,
    },
  ];

  const baseHours = efforts.reduce((sum, e) => sum + e.count * e.hoursEach, 0);
  const automationMultiplier = inputs.automationEnabled ? 0.5 : 1.0;
  const totalHours = baseHours * automationMultiplier;
  const totalWeeks = totalHours / hoursPerWeek;
  const totalCost = totalHours * inputs.loadedCostPerHour;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Component
            </th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Description
            </th>
            <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Count
            </th>
            <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Hours Each
            </th>
            <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Total Hours
            </th>
            <th className="text-right py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              FTE Weeks
            </th>
          </tr>
        </thead>
        <tbody>
          {efforts.map((effort, index) => {
            const totalEffortHours = effort.count * effort.hoursEach;
            const fteWeeks = totalEffortHours / hoursPerWeek;

            // Skip if count is 0
            if (effort.count === 0) return null;

            return (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  effort.isOptional ? 'bg-blue-50' : ''
                }`}
              >
                <td className="py-2 px-3 text-gray-900 font-medium">
                  {effort.component}
                  {effort.isOptional && (
                    <span className="ml-2 text-xs text-blue-600">(Optional)</span>
                  )}
                </td>
                <td className="py-2 px-3 text-gray-600 text-xs">
                  {effort.description}
                </td>
                <td className="py-2 px-3 text-right text-gray-900">
                  {effort.count}
                </td>
                <td className="py-2 px-3 text-right text-gray-700">
                  {formatNumber(effort.hoursEach)}
                </td>
                <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                  {formatNumber(totalEffortHours)}
                </td>
                <td className="py-2 px-3 text-right text-blue-600 font-semibold">
                  {formatHours(fteWeeks)}
                </td>
              </tr>
            );
          })}

          {/* Automation row if enabled */}
          {inputs.automationEnabled && (
            <tr className="bg-green-50 border-t-2 border-green-200">
              <td className="py-2 px-3 text-green-900 font-medium" colSpan={4}>
                AI Automation (50% reduction)
              </td>
              <td className="py-2 px-3 text-right text-green-600 font-semibold">
                -{formatNumber(baseHours * 0.5)} hrs
              </td>
              <td className="py-2 px-3 text-right text-green-600 font-semibold">
                -{formatHours((baseHours * 0.5) / hoursPerWeek)} weeks
              </td>
            </tr>
          )}

          {/* Totals row */}
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              {inputs.automationEnabled ? 'Total with Automation' : 'Total Implementation Effort'}
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-bold">
              {formatNumber(totalHours)} hrs
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-bold">
              {formatHours(totalWeeks)} weeks
            </td>
          </tr>

          {/* Cost Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={6}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              COST BREAKDOWN
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Loaded Cost per Hour
            </td>
            <td className="py-2 px-3 text-right text-gray-900" colSpan={2}>
              ${formatNumber(inputs.loadedCostPerHour)}
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Total Internal Cost
            </td>
            <td className="py-2 px-3 text-right text-gray-900 font-semibold" colSpan={2}>
              ${formatNumber(totalCost)}
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Implementation Margin ({inputs.implMargin}%)
            </td>
            <td className="py-2 px-3 text-right text-gray-900" colSpan={2}>
              +${formatNumber(totalCost * (inputs.implMargin / 100))}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-green-600 font-semibold" colSpan={4}>
              Customer Implementation Price
            </td>
            <td className="py-2 px-3 text-right text-green-600 font-bold" colSpan={2}>
              ${formatNumber(impl.totalCost * (1 + inputs.implMargin / 100))}
            </td>
          </tr>

          {/* Timeline Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={6}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              ESTIMATED TIMELINE
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Assumed Team Size
            </td>
            <td className="py-2 px-3 text-right text-gray-900" colSpan={2}>
              {inputs.fteCount} FTEs (parallel work)
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Calendar Weeks (with {inputs.fteCount} FTEs)
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-semibold" colSpan={2}>
              {formatHours(totalWeeks / inputs.fteCount)} weeks
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={4}>
              Calendar Months (approx)
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-semibold" colSpan={2}>
              {formatHours((totalWeeks / inputs.fteCount) / 4.33)} months
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 bg-yellow-50">
            <td className="py-2 px-3 text-gray-600 text-xs" colSpan={6}>
              <strong>Note:</strong> Timeline assumes {inputs.fteCount} FTEs working in parallel. Actual timeline
              may vary based on dependencies, customer availability, and resource allocation.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
