import { create } from 'zustand';
import { defaultInputs } from './domainTaxonomy';
import { calculatePricing } from './calculations';
import type { PricingInputs, PricingResults } from './types';

interface PricingStore {
  inputs: PricingInputs;
  results: PricingResults;
  showMargins: boolean;
  showAdvanced: boolean;
  currentStep: number; // Wizard step (1-5)

  // Actions
  updateInput: <K extends keyof PricingInputs>(
    key: K,
    value: PricingInputs[K]
  ) => void;
  updateInputs: (updates: Partial<PricingInputs>) => void;
  toggleMargins: () => void;
  toggleAdvanced: () => void;
  resetInputs: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const usePricingStore = create<PricingStore>((set) => ({
  inputs: defaultInputs,
  results: calculatePricing(defaultInputs),
  showMargins: false,
  showAdvanced: false,
  currentStep: 1,

  updateInput: (key, value) =>
    set((state) => {
      const newInputs = { ...state.inputs, [key]: value };

      // Auto-calculate volumes when Member Lives changes
      if (key === 'memberLives') {
        newInputs.claimsVolume = value * 10; // 10 claims per member per year
        newInputs.rxVolume = value * 20; // 20 Rx fills per member per year
      }

      return {
        inputs: newInputs,
        results: calculatePricing(newInputs),
      };
    }),

  updateInputs: (updates) =>
    set((state) => {
      const newInputs = { ...state.inputs, ...updates };
      return {
        inputs: newInputs,
        results: calculatePricing(newInputs),
      };
    }),

  toggleMargins: () => set((state) => ({ showMargins: !state.showMargins })),

  toggleAdvanced: () => set((state) => ({ showAdvanced: !state.showAdvanced })),

  resetInputs: () =>
    set({
      inputs: defaultInputs,
      results: calculatePricing(defaultInputs),
    }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 5)
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
}));
