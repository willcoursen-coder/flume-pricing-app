'use client';

import { usePricingStore } from '@/lib/store';
import { domainTaxonomy } from '@/lib/domainTaxonomy';

export function DomainVolumes() {
  const { inputs, results } = usePricingStore();

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  // Get domains for current org type
  const domains = domainTaxonomy[inputs.orgType];

  // Use pre-calculated domain rows from results
  const domainRows = results.domainRows;

  return (
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
              Est. Rows/Month
            </th>
            <th className="text-center py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              CDC Eligible
            </th>
            <th className="text-center py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Billable
            </th>
          </tr>
        </thead>
        <tbody>
          {domainRows.map((row) => (
            <tr
              key={row.domain}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-2 px-3 text-gray-900 font-medium">
                {row.domain}
              </td>
              <td className="py-2 px-3 text-gray-700">
                {row.eventDriver}
              </td>
              <td className="py-2 px-3 text-right text-gray-900">
                {formatNumber(row.monthlyEvents)}
              </td>
              <td className="py-2 px-3 text-right text-gray-700">
                {row.expansion}x
              </td>
              <td className="py-2 px-3 text-right text-gray-700">
                {row.versioning}x
              </td>
              <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                {formatNumber(row.estimatedRows)}
              </td>
              <td className="py-2 px-3 text-center">
                {row.cdcEligible ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    No
                  </span>
                )}
              </td>
              <td className="py-2 px-3 text-center">
                {row.billable ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    No
                  </span>
                )}
              </td>
            </tr>
          ))}

          {/* Add Rx Claims row for payer/TPA */}
          {(inputs.orgType === 'payer' || inputs.orgType === 'tpa') && (
            <tr className="border-b border-gray-100 hover:bg-gray-50 bg-blue-50">
              <td className="py-2 px-3 text-gray-900 font-medium">
                Rx Claims Processing
              </td>
              <td className="py-2 px-3 text-gray-700">
                rxVolume
              </td>
              <td className="py-2 px-3 text-right text-gray-900">
                {formatNumber(inputs.rxVolume / 12)}
              </td>
              <td className="py-2 px-3 text-right text-gray-700">
                70x
              </td>
              <td className="py-2 px-3 text-right text-gray-700">
                1.0x
              </td>
              <td className="py-2 px-3 text-right text-gray-900 font-semibold">
                {formatNumber((inputs.rxVolume / 12) * 70)}
              </td>
              <td className="py-2 px-3 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Yes
                </span>
              </td>
              <td className="py-2 px-3 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Yes
                </span>
              </td>
            </tr>
          )}

          {/* Totals row */}
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-gray-900" colSpan={2}>
              Total Billable Rows (Monthly)
            </td>
            <td className="py-2 px-3 text-right text-gray-900">
              -
            </td>
            <td className="py-2 px-3 text-right text-gray-900">
              -
            </td>
            <td className="py-2 px-3 text-right text-gray-900">
              -
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-bold">
              {formatNumber(
                domainRows.reduce((sum, row) => sum + (row.billable ? row.estimatedRows : 0), 0) +
                ((inputs.orgType === 'payer' || inputs.orgType === 'tpa') ? (inputs.rxVolume / 12) * 70 : 0)
              )}
            </td>
            <td className="py-2 px-3 text-center text-gray-900">
              -
            </td>
            <td className="py-2 px-3 text-center text-gray-900">
              -
            </td>
          </tr>

          {/* CDC Impact Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={8}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              CDC IMPACT
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={5}>
              CDC Coverage ({inputs.cdcCoverage}% of eligible rows)
            </td>
            <td className="py-2 px-3 text-right text-gray-900">
              Reduction: 80%
            </td>
            <td className="py-2 px-3 text-center text-gray-900" colSpan={2}>
              After {inputs.cdcTimeline} months
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-gray-900" colSpan={5}>
              Effective Monthly Rows (with CDC applied)
            </td>
            <td className="py-2 px-3 text-right text-green-600 font-bold">
              {formatNumber(
                domainRows.reduce((sum, row) => {
                  if (!row.billable) return sum;
                  if (row.cdcEligible) {
                    const cdcReduction = (inputs.cdcCoverage / 100) * 0.8;
                    return sum + row.estimatedRows * (1 - cdcReduction);
                  }
                  return sum + row.estimatedRows;
                }, 0) +
                ((inputs.orgType === 'payer' || inputs.orgType === 'tpa')
                  ? (inputs.rxVolume / 12) * 70 * (1 - (inputs.cdcCoverage / 100) * 0.8)
                  : 0)
              )}
            </td>
            <td className="py-2 px-3 text-center text-gray-900" colSpan={2}>
              -
            </td>
          </tr>

          {/* Pipeline Multiplier Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={8}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              ETL PIPELINE IMPACT
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900" colSpan={5}>
              Pipeline Multiplier ({inputs.pipelineMultiplier}x staging layers)
            </td>
            <td className="py-2 px-3 text-right text-gray-900">
              Raw → Bronze → Silver → Gold
            </td>
            <td className="py-2 px-3 text-center text-gray-900" colSpan={2}>
              {inputs.pipelineMultiplier}x
            </td>
          </tr>
          <tr className="border-t-2 border-gray-300 bg-blue-50 font-bold">
            <td className="py-2 px-3 text-gray-900" colSpan={5}>
              TOTAL MONTHLY ROWS (Final)
            </td>
            <td className="py-2 px-3 text-right text-blue-600 font-bold text-lg">
              {formatNumber(results.monthlyRows)}
            </td>
            <td className="py-2 px-3 text-center text-gray-900" colSpan={2}>
              = {Math.round(results.monthlyRows / 1000000)}M
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
