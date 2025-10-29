'use client';

import { usePricingStore } from '@/lib/store';
import { LeftNav } from '@/components/navigation/LeftNav';
import { ImplementationSection } from '@/components/sections/ImplementationSection';
import { OngoingCostsSection } from '@/components/sections/OngoingCostsSection';
import { ResultsSection } from '@/components/sections/ResultsSection';

export default function Home() {
  const { activeSection } = usePricingStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Navigation */}
      <LeftNav />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {activeSection === 'implementation' && <ImplementationSection />}
          {activeSection === 'ongoing' && <OngoingCostsSection />}
          {activeSection === 'results' && <ResultsSection />}
        </div>
      </div>
    </div>
  );
}
