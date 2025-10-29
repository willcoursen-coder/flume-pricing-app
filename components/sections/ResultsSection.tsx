'use client';

import { useState } from 'react';
import { PricingSummary } from '../outputs/PricingSummary';
import { FiveYearPL } from '../tables/FiveYearPL';
import { DomainVolumes } from '../tables/DomainVolumes';
import { EffortBreakdown } from '../tables/EffortBreakdown';
import { Card, CardHeader, CardContent } from '../ui/Card';

export function ResultsSection() {
  const [activeTab, setActiveTab] = useState<'fiveyear' | 'domains' | 'effort'>('fiveyear');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Results & Analysis</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete financial summary and detailed breakdowns
        </p>
      </div>

      {/* Pricing Summary KPIs */}
      <PricingSummary />

      {/* Tabbed Tables */}
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex gap-6 border-b border-gray-200 -mb-3">
            <button
              onClick={() => setActiveTab('fiveyear')}
              className={`pb-3 px-1 text-xs font-medium transition-colors relative ${
                activeTab === 'fiveyear'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              5-Year Analysis
              {activeTab === 'fiveyear' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`pb-3 px-1 text-xs font-medium transition-colors relative ${
                activeTab === 'domains'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Domain Volumes
              {activeTab === 'domains' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('effort')}
              className={`pb-3 px-1 text-xs font-medium transition-colors relative ${
                activeTab === 'effort'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Effort Breakdown
              {activeTab === 'effort' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'fiveyear' && <FiveYearPL />}
          {activeTab === 'domains' && <DomainVolumes />}
          {activeTab === 'effort' && <EffortBreakdown />}
        </CardContent>
      </Card>
    </div>
  );
}
