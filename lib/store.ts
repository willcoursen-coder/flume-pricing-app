import { create } from 'zustand';
import { defaultInputs } from './domainTaxonomy';
import { calculatePricing } from './calculations';
import type { PricingInputs, PricingResults } from './types';

export type NavSection = 'implementation' | 'ongoing' | 'results';

interface PricingStore {
  inputs: PricingInputs;
  results: PricingResults;
  activeSection: NavSection;

  // Actions
  updateInput: <K extends keyof PricingInputs>(
    key: K,
    value: PricingInputs[K]
  ) => void;
  updateInputs: (updates: Partial<PricingInputs>) => void;
  resetInputs: () => void;
  setActiveSection: (section: NavSection) => void;
}

export const usePricingStore = create<PricingStore>((set) => ({
  inputs: defaultInputs,
  results: calculatePricing(defaultInputs),
  activeSection: 'implementation',

  updateInput: (key, value) =>
    set((state) => {
      const newInputs = { ...state.inputs, [key]: value };

      // Auto-calculate volumes when Member Lives changes
      if (key === 'memberLives' && typeof value === 'number') {
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

  resetInputs: () =>
    set({
      inputs: defaultInputs,
      results: calculatePricing(defaultInputs),
    }),

  setActiveSection: (section) => set({ activeSection: section }),
}));
