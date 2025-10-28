'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function Settings() {
  const { inputs, updateInput, toggleMargins, toggleAdvanced } = usePricingStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => updateInput('hasPremiumSLA', false)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              !inputs.hasPremiumSLA
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => updateInput('hasPremiumSLA', true)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              inputs.hasPremiumSLA
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Premium SLA
          </button>
        </div>

        <button
          onClick={toggleMargins}
          className="w-full mt-2 px-3 py-2 bg-gray-500 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition-colors"
        >
          ⚙️ Margins
        </button>

        <button
          onClick={toggleAdvanced}
          className="w-full px-3 py-2 bg-gray-500 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition-colors"
        >
          🔧 Advanced Mode
        </button>
      </CardContent>
    </Card>
  );
}
