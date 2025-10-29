'use client';

import { usePricingStore } from '@/lib/store';

const steps = [
  { number: 1, title: 'Customer Profile', description: 'Who is the customer?' },
  { number: 2, title: 'Implementation Scope', description: 'What needs to be built?' },
  { number: 3, title: 'Volume Drivers', description: 'How much data?' },
  { number: 4, title: 'Architecture & Settings', description: 'Technical configuration' },
  { number: 5, title: 'Pricing & Margins', description: 'Set pricing strategy' },
];

export function Stepper() {
  const { currentStep, setStep } = usePricingStore();

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isClickable = true; // Allow clicking any step

            return (
              <button
                key={step.number}
                onClick={() => isClickable && setStep(step.number)}
                className={`flex flex-col items-center group ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                disabled={!isClickable}
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center max-w-[140px]">
                  <div
                    className={`text-xs font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
