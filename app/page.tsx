'use client';

import { useState } from 'react';
import { usePricingStore } from '@/lib/store';
import { Stepper } from '@/components/ui/Stepper';
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
  const [activeTab, setActiveTab] = useState<'fiveyear' | 'domains' | 'effort'>('effort');
  const { currentStep, nextStep, prevStep } = usePricingStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
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
        {/* Stepper */}
        <Stepper />

        {/* Two Column Layout: Inputs on left, Results on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Step Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Profile */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <CustomerProfile />
              </div>
            )}

            {/* Step 2: Implementation Scope */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Implementation />

                {/* Show effort breakdown for this step */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resourcing Estimate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EffortBreakdown />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Volume Drivers */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <VolumeDrivers />
              </div>
            )}

            {/* Step 4: Architecture & Settings */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Settings />
                <AdvancedControls />

                {/* Show domain volumes for this step */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Volume Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DomainVolumes />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 5: Pricing & Margins */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <MarginControls />

                {/* Show 5-year analysis for this step */}
                <Card>
                  <CardHeader>
                    <CardTitle>5-Year Financial Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FiveYearPL />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ← Back
              </button>

              <div className="text-xs text-gray-500">
                Step {currentStep} of 5
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === 5}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentStep === 5
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentStep === 5 ? 'Complete' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Right Column - Pricing Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PricingSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
