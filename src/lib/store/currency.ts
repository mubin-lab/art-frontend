"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "BDT" | "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  currency: Currency;
  currencySymbol: string;
}

export const COUNTRIES: Record<Currency, CountryInfo> = {
  BDT: {
    name: "Bangladesh",
    code: "BD",
    flag: "🇧🇩",
    currency: "BDT",
    currencySymbol: "৳",
  },
  USD: {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
  },
  EUR: {
    name: "Europe",
    code: "EU",
    flag: "🇪🇺",
    currency: "EUR",
    currencySymbol: "€",
  },
  GBP: {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
  },
  CAD: {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "CA$",
  },
  AUD: {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "AU$",
  },
};

interface CurrencyStore {
  currency: Currency;
  country: CountryInfo;
  setCurrency: (c: Currency) => void;
  symbols: Record<Currency, string>;
  rates: Record<Currency, number>; // relative to USD (1 USD = 120 BDT)
  convert: (amount: number, baseCurrency?: string) => number;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      // Defaults to Bangladesh & BDT Taka for every new visitor
      currency: "BDT",
      country: COUNTRIES.BDT,
      symbols: {
        BDT: "৳",
        USD: "$",
        EUR: "€",
        GBP: "£",
        CAD: "CA$",
        AUD: "AU$",
      },
      rates: {
        BDT: 120,
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        CAD: 1.36,
        AUD: 1.52,
      },
      setCurrency: (currency) => {
        set({
          currency,
          country: COUNTRIES[currency] || COUNTRIES.BDT,
        });
      },
      convert: (amount: number, baseCurrency: string = "BDT") => {
        const targetCurrency = get().currency;
        const rates = get().rates;

        // If already in target currency, return directly
        if (baseCurrency.toUpperCase() === targetCurrency) {
          return Math.round(amount);
        }

        // Convert base currency to USD
        let amountInUSD = amount;
        if (baseCurrency.toUpperCase() === "BDT") {
          amountInUSD = amount / (rates.BDT || 120);
        } else if (rates[baseCurrency as Currency]) {
          amountInUSD = amount / rates[baseCurrency as Currency];
        }

        // Convert USD to target currency
        const targetRate = rates[targetCurrency] || 1;
        const result = amountInUSD * targetRate;

        // Clean rounding (nearest 10 for BDT)
        return targetCurrency === "BDT"
          ? Math.round(result / 10) * 10
          : Math.round(result);
      },
    }),
    {
      name: "emptybd-currency-v3", // Fresh storage key ensures all visitors start with BDT & Bangladesh by default
    }
  )
);
