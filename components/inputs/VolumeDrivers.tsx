'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function VolumeDrivers() {
  const { inputs, updateInput } = usePricingStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume Drivers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Medical Claims / Year
          </label>
          <FormattedNumberInput
            value={inputs.claimsVolume}
            onChange={(value) => updateInput('claimsVolume', Math.round(value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto: 10 claims/member/year (editable)
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Rx Claims / Year
          </label>
          <FormattedNumberInput
            value={inputs.rxVolume}
            onChange={(value) => updateInput('rxVolume', Math.round(value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto: 20 fills/member/year (editable)
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Auths per 1K / Month
          </label>
          <FormattedNumberInput
            value={inputs.authRate}
            onChange={(value) => updateInput('authRate', Math.round(value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Growth Rate
          </label>
          <select
            value={inputs.growthRate}
            onChange={(e) => updateInput('growthRate', parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>0% Stable</option>
            <option value={5}>5% Moderate</option>
            <option value={10}>10% Standard</option>
            <option value={15}>15% High</option>
            <option value={20}>20% Rapid</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
