'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function Implementation() {
  const { inputs, updateInput } = usePricingStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Trade Definitions Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-blue-900 mb-2">
            Trade Sizing Guide
          </div>
          <div className="space-y-1.5 text-xs text-blue-800">
            <div>
              <span className="font-medium">Small (40 hrs):</span> Simple files, standard formats (834, 835 flat files)
            </div>
            <div>
              <span className="font-medium">Medium (120 hrs):</span> Complex files, custom mapping (837 with extensions, HL7)
            </div>
            <div>
              <span className="font-medium">Large (240 hrs):</span> API integrations, real-time feeds, custom transformations
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Small Trades (40 hrs each)
          </label>
          <input
            type="number"
            value={inputs.smallTrades}
            onChange={(e) => updateInput('smallTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Standard 834, 835 flat files, simple CSV imports
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Medium Trades (120 hrs each)
          </label>
          <input
            type="number"
            value={inputs.mediumTrades}
            onChange={(e) => updateInput('mediumTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            837 with custom fields, HL7 messages, complex mapping
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Large Trades (240 hrs each)
          </label>
          <input
            type="number"
            value={inputs.largeTrades}
            onChange={(e) => updateInput('largeTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            REST/SOAP APIs, real-time integrations, custom transforms
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Database Replication
          </label>
          <input
            type="number"
            value={inputs.dbReplication}
            onChange={(e) => updateInput('dbReplication', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => updateInput('hasDiscovery', true)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              inputs.hasDiscovery
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Discovery
          </button>
          <button
            onClick={() => updateInput('hasDiscovery', false)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              !inputs.hasDiscovery
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            No Discovery
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
