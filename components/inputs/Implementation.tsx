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
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Small Trades
          </label>
          <input
            type="number"
            value={inputs.smallTrades}
            onChange={(e) => updateInput('smallTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Medium Trades
          </label>
          <input
            type="number"
            value={inputs.mediumTrades}
            onChange={(e) => updateInput('mediumTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Large Trades
          </label>
          <input
            type="number"
            value={inputs.largeTrades}
            onChange={(e) => updateInput('largeTrades', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
