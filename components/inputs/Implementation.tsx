'use client';

import { usePricingStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function Implementation() {
  const { inputs, updateInput, results } = usePricingStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalWeeks = results.implementation.totalHours / 40;
  const calendarWeeks = totalWeeks / 2; // Assuming 2 FTEs working in parallel

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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Discovery Type Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Deployment Type
          </label>
          <select
            value={inputs.discoveryType}
            onChange={(e) => {
              const newType = e.target.value as 'none' | 'standard' | 'strategic' | 'custom';
              updateInput('discoveryType', newType);
              // Sync hasDiscovery for backward compatibility
              updateInput('hasDiscovery', newType !== 'none');
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          >
            <option value="none">None</option>
            <option value="standard">Standard Deployment (200 hrs - $85K)</option>
            <option value="strategic">Strategic Deployment (400 hrs - $170K)</option>
            <option value="custom">Custom (set hours)</option>
          </select>
        </div>

        {/* Custom Deployment Hours */}
        {inputs.discoveryType === 'custom' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Custom Deployment Hours
            </label>
            <input
              type="number"
              value={inputs.discoveryHours}
              onChange={(e) => updateInput('discoveryHours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter hours"
            />
            <p className="text-xs text-gray-500 mt-1">
              Will be priced at loaded cost + margin
            </p>
          </div>
        )}

        {/* Automation Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-semibold text-green-900">
                  AI-Powered Automation
                </div>
                <div className="text-xs text-green-700 mt-1">
                  Reduces implementation time by 50% using automated mapping and code generation
                </div>
              </div>
              <button
                onClick={() => updateInput('automationEnabled', !inputs.automationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  inputs.automationEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    inputs.automationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {inputs.automationEnabled && (
              <div className="text-xs text-green-800 mt-2 font-medium">
                ✓ Automation enabled - Hours reduced by 50%
              </div>
            )}
          </div>
        </div>

        {/* Live Cost Preview */}
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-blue-900 mb-2">
              Implementation Summary
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Total Cost (to Customer)</span>
              <span className="text-sm font-bold text-blue-900">
                {formatCurrency(results.implementation.totalRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Total Effort</span>
              <span className="text-xs font-semibold text-blue-900">
                {results.implementation.totalHours.toFixed(0)} hrs = {totalWeeks.toFixed(1)} weeks
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Timeline (2 FTEs)</span>
              <span className="text-xs font-semibold text-blue-900">
                ~{calendarWeeks.toFixed(1)} weeks ({(calendarWeeks / 4.33).toFixed(1)} months)
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-xs text-blue-700">Margin</span>
              <span className="text-xs font-bold text-green-600">
                {formatCurrency(results.implementation.margin)} ({((results.implementation.margin / results.implementation.totalRevenue) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
