'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function MarginControls() {
  const { inputs, updateInput } = usePricingStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate prices from cost + margin
  const dataInternalCost = inputs.dataCostPer1M / (1 + inputs.dataCostPct / 100);
  const dataPrice = inputs.dataCostPer1M;

  const supportInternalCost = 10000; // Example base - this would need to be an input
  const supportPrice = supportInternalCost * (1 + inputs.supportCostPct / 100);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Pricing & Margins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Data Infrastructure */}
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Data Infrastructure
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Cost % of Revenue
                </label>
                <FormattedNumberInput
                  value={inputs.dataCostPct}
                  onChange={(value) => updateInput('dataCostPct', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Internal infrastructure cost</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Margin %
                </label>
                <FormattedNumberInput
                  value={inputs.dataMarginPct || 0}
                  onChange={(value) => updateInput('dataMarginPct', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Markup percentage</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Price % of Revenue
                </label>
                <div className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50">
                  <span className="font-semibold text-blue-600">
                    {(inputs.dataCostPct + (inputs.dataMarginPct || 0)).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Calculated customer price</p>
              </div>
            </div>
          </div>

          {/* Support Services */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Support Services
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Cost % of Revenue
                </label>
                <FormattedNumberInput
                  value={inputs.supportCostPct}
                  onChange={(value) => updateInput('supportCostPct', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Internal support cost</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Margin %
                </label>
                <FormattedNumberInput
                  value={inputs.supportMarginPct || 0}
                  onChange={(value) => updateInput('supportMarginPct', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Markup percentage</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Price % of Revenue
                </label>
                <div className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50">
                  <span className="font-semibold text-blue-600">
                    {(inputs.supportCostPct + (inputs.supportMarginPct || 0)).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Calculated customer price</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
