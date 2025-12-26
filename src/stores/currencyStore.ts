import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'outsyd-currency',
    }
  )
);
