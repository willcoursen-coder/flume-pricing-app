'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function AdvancedControls() {
  const { inputs, updateInput, showAdvanced } = usePricingStore();

  if (!showAdvanced) return null;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Advanced Configuration</CardTitle>
      </CardHeader>
      <CardContent>
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

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Loaded Cost / Hour
            </label>
            <FormattedNumberInput
              value={inputs.loadedCostPerHour}
              onChange={(value) => updateInput('loadedCostPerHour', Math.round(value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Data Cost per 1M Rows
            </label>
            <FormattedNumberInput
              value={inputs.dataCostPer1M}
              onChange={(value) => updateInput('dataCostPer1M', Math.round(value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
          </div>
        </div>
          </div>

          {/* Custom Trade Pricing */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-xs font-medium text-gray-700 mb-3">
              Custom Trade Pricing (Override Defaults)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Small Trade Cost
                </label>
                <FormattedNumberInput
                  value={inputs.smallTradeCost}
                  onChange={(value) => updateInput('smallTradeCost', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Default: $3,800 (40 hrs)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Medium Trade Cost
                </label>
                <FormattedNumberInput
                  value={inputs.mediumTradeCost}
                  onChange={(value) => updateInput('mediumTradeCost', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Default: $10,300 (120 hrs)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Large Trade Cost
                </label>
                <FormattedNumberInput
                  value={inputs.largeTradeCost}
                  onChange={(value) => updateInput('largeTradeCost', Math.round(value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Default: $16,840 (240 hrs)</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
