'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FormattedNumberInput } from '../ui/FormattedNumberInput';

export function CustomerProfile() {
  const { inputs, updateInput } = usePricingStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Organization Type
          </label>
          <select
            value={inputs.orgType}
            onChange={(e) =>
              updateInput('orgType', e.target.value as 'payer' | 'tpa' | 'provider')
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="payer">Payer</option>
            <option value="tpa">TPA</option>
            <option value="provider">Provider</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Member Lives
          </label>
          <FormattedNumberInput
            value={inputs.memberLives}
            onChange={(value) => updateInput('memberLives', Math.round(value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Churn % / Month
          </label>
          <FormattedNumberInput
            value={inputs.memberChurn}
            onChange={(value) => updateInput('memberChurn', value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            isDecimal
          />
        </div>

        {(inputs.orgType === 'payer' || inputs.orgType === 'tpa') && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Providers
            </label>
            <FormattedNumberInput
              value={inputs.providers}
              onChange={(value) => updateInput('providers', Math.round(value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {inputs.orgType === 'tpa' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Employers
            </label>
            <FormattedNumberInput
              value={inputs.employers}
              onChange={(value) => updateInput('employers', Math.round(value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
