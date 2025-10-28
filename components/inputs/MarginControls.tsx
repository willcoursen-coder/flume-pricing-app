'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function MarginControls() {
  const { inputs, updateInput, showMargins } = usePricingStore();

  if (!showMargins) return null;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Internal Margin Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-600">
                Impl Margin
              </label>
              <span className="text-xs text-gray-900 font-semibold">
                {inputs.implMargin}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={inputs.implMargin}
              onChange={(e) => updateInput('implMargin', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-600">
                Platform Cost
              </label>
              <span className="text-xs text-gray-900 font-semibold">
                {inputs.platformCostPct}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              value={inputs.platformCostPct}
              onChange={(e) => updateInput('platformCostPct', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-600">
                Data Cost
              </label>
              <span className="text-xs text-gray-900 font-semibold">
                {inputs.dataCostPct}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={inputs.dataCostPct}
              onChange={(e) => updateInput('dataCostPct', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-600">
                Support Cost
              </label>
              <span className="text-xs text-gray-900 font-semibold">
                {inputs.supportCostPct}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={inputs.supportCostPct}
              onChange={(e) => updateInput('supportCostPct', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
