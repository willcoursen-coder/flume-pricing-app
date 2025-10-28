'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function PricingSummary() {
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

  const avgGrowth =
    ((Math.pow(results.tco3Year / results.year1Total, 1 / 3) - 1) * 100).toFixed(1);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Year 1 Total
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {formatCurrency(results.year1Total)}
            </div>
            <div className="text-xs text-gray-500 mt-1">CAPEX + OPEX</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              3-Year TCO
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {formatCurrency(results.tco3Year)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{avgGrowth}% CAGR</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Monthly Rows
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {(results.monthlyRows / 1000000).toFixed(0)}M
            </div>
            <div className="text-xs text-gray-500 mt-1">After CDC</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              OPEX PEPM
            </div>
            <div className="text-xl font-semibold text-gray-900">
              ${results.opexPepm.toFixed(4)}
            </div>
            <div
              className={`text-xs mt-1 ${
                results.pepmBenchmark < 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Math.abs(results.pepmBenchmark).toFixed(0)}%{' '}
              {results.pepmBenchmark < 0 ? 'below' : 'above'} target
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-xs text-gray-600">Implementation Cost</span>
            <span className="text-xs font-semibold text-gray-900">
              {formatCurrency(results.implementation.totalRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-xs text-gray-600">Annual Platform</span>
            <span className="text-xs font-semibold text-gray-900">
              {formatCurrency(results.platformLicense)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-xs text-gray-600">Annual Data Cost</span>
            <span className="text-xs font-semibold text-gray-900">
              {formatCurrency(results.annualDataCost)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-xs text-gray-600">Total FTE Weeks</span>
            <span className="text-xs font-semibold text-gray-900">
              {(results.implementation.totalHours / 40).toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
