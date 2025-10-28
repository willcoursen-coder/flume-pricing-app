'use client';

import { usePricingStore } from '@/lib/store';

export function FiveYearPL() {
  const { results, inputs } = usePricingStore();

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

  const total5YRevenue = results.yearlyFinancials.reduce(
    (sum, y) => sum + y.totalRevenue,
    0
  );
  const total5YCost = results.yearlyFinancials.reduce(
    (sum, y) => sum + y.totalCost,
    0
  );
  const total5YProfit = results.yearlyFinancials.reduce(
    (sum, y) => sum + y.grossProfit,
    0
  );
  const total5YMargin = (total5YProfit / total5YRevenue) * 100;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              Metrics
            </th>
            {results.yearlyFinancials.map((year) => (
              <th
                key={year.year}
                className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide"
              >
                Year {year.year}
              </th>
            ))}
            <th className="text-left py-2 px-3 font-semibold text-gray-700 uppercase tracking-wide">
              5Y Total
            </th>
          </tr>
        </thead>
        <tbody>
          {/* VOLUME Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={7}
              className="py-2 px-3 font-semibold text-gray-700 text-xs"
            >
              VOLUME
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Membership</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatNumber(year.members)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Employers</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatNumber(year.employers)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>

          {/* REVENUE Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={7}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              REVENUE (TO FLUME)
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Implementation</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.implRevenue)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Ongoing</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.ongoingRevenue)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-gray-900">Total Revenue</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.totalRevenue)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-900">
              {formatCurrency(total5YRevenue)}
            </td>
          </tr>

          {/* COSTS Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={7}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              COSTS (FLUME INTERNAL)
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Implementation</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.implCost)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Ongoing</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.ongoingCost)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 font-semibold">
            <td className="py-2 px-3 text-gray-900">Total Cost</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.totalCost)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-900">
              {formatCurrency(total5YCost)}
            </td>
          </tr>

          {/* PROFITABILITY Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={7}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              PROFITABILITY
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Gross Profit</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-green-600 font-semibold">
                {formatCurrency(year.grossProfit)}
              </td>
            ))}
            <td className="py-2 px-3 text-green-600 font-semibold">
              {formatCurrency(total5YProfit)}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Gross Margin %</td>
            {results.yearlyFinancials.map((year) => {
              const color =
                year.grossMargin > 30
                  ? 'text-green-600'
                  : year.grossMargin > 20
                  ? 'text-yellow-600'
                  : 'text-red-600';
              return (
                <td key={year.year} className={`py-2 px-3 ${color}`}>
                  {year.grossMargin.toFixed(1)}%
                </td>
              );
            })}
            <td
              className={`py-2 px-3 ${
                total5YMargin > 30
                  ? 'text-green-600'
                  : total5YMargin > 20
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {total5YMargin.toFixed(1)}%
            </td>
          </tr>

          {/* PEPM Section - Only for TPA */}
          {inputs.orgType === 'tpa' && (
            <>
              <tr className="bg-gray-100">
                <td
                  colSpan={7}
                  className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
                >
                  PEPM METRICS (PER EMPLOYER PER MONTH)
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">Revenue PEPM</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-gray-900">
                    ${year.revenuePEPM.toFixed(2)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">Cost PEPM</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-gray-900">
                    ${year.costPEPM.toFixed(2)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-3 text-green-600 font-semibold">Profit PEPM</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-green-600 font-semibold">
                    ${year.profitPEPM.toFixed(2)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
            </>
          )}

          {/* PMPM Section - Only for Payer */}
          {inputs.orgType === 'payer' && (
            <>
              <tr className="bg-gray-100">
                <td
                  colSpan={7}
                  className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
                >
                  PMPM METRICS - DATA CONSUMPTION ONLY
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">Data Volume (M rows)</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-gray-900">
                    {formatNumber(year.monthlyRows / 1000000)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">Data Revenue PMPM</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-gray-900">
                    ${year.revenuePMPM.toFixed(4)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">Data Cost PMPM (Internal)</td>
                {results.yearlyFinancials.map((year) => (
                  <td key={year.year} className="py-2 px-3 text-gray-900">
                    ${year.dataCostPMPM.toFixed(4)}
                  </td>
                ))}
                <td className="py-2 px-3 text-gray-500">-</td>
              </tr>
            </>
          )}

          {/* CUMULATIVE Section */}
          <tr className="bg-gray-100">
            <td
              colSpan={7}
              className="py-2 px-3 font-semibold text-gray-700 text-xs pt-4"
            >
              CUMULATIVE TOTALS
            </td>
          </tr>
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 px-3 text-gray-900">Cumulative Revenue</td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-gray-900">
                {formatCurrency(year.cumulativeRevenue)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-2 px-3 text-green-600 font-semibold">
              Cumulative Profit
            </td>
            {results.yearlyFinancials.map((year) => (
              <td key={year.year} className="py-2 px-3 text-green-600 font-semibold">
                {formatCurrency(year.cumulativeProfit)}
              </td>
            ))}
            <td className="py-2 px-3 text-gray-500">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
