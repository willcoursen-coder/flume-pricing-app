'use client';

import { useState } from 'react';
import { CustomerProfile } from '@/components/inputs/CustomerProfile';
import { VolumeDrivers } from '@/components/inputs/VolumeDrivers';
import { Implementation } from '@/components/inputs/Implementation';
import { Settings } from '@/components/inputs/Settings';
import { MarginControls } from '@/components/inputs/MarginControls';
import { AdvancedControls } from '@/components/inputs/AdvancedControls';
import { PricingSummary } from '@/components/outputs/PricingSummary';
import { FiveYearPL } from '@/components/tables/FiveYearPL';
import { DomainVolumes } from '@/components/tables/DomainVolumes';
import { EffortBreakdown } from '@/components/tables/EffortBreakdown';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'fiveyear' | 'domains' | 'effort'>(
    'fiveyear'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/flume-icon.svg"
                alt="Flume Health"
                className="w-8 h-8"
              />
              <h1 className="text-lg font-semibold text-gray-900">
                Flume Health Pricing Model
              </h1>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Export Model
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomerProfile />
          <VolumeDrivers />
          <Implementation />
          <Settings />
        </div>

        {/* Margin & Advanced Controls */}
        <MarginControls />
        <AdvancedControls />

        {/* Pricing Summary */}
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
    </div>
  );
}
