"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";

export type DisplayCurrencyCode = "EGP" | "USD" | "EUR";

export const CURRENCY_OPTIONS: Array<{ code: DisplayCurrencyCode; symbol: string }> = [
  { code: "EGP", symbol: "£" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
];

type CurrencyRates = Record<DisplayCurrencyCode, number>;

// Static exchange rates from EGP base.
// Update these values whenever the exchange rate changes.
const STATIC_RATES: CurrencyRates = {
  EGP: 1,
  USD: 0.020,  // 1 EGP ≈ 0.020 USD
  EUR: 0.019,  // 1 EGP ≈ 0.019 EUR
};

interface CurrencyContextValue {
  currency: DisplayCurrencyCode;
  setCurrency: (currency: DisplayCurrencyCode) => void;
  rates: CurrencyRates;
  formatCurrency: (amountEgp: number, options?: Intl.NumberFormatOptions) => string;
}

const STORAGE_KEY = "egyptus_display_currency";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function normalizeCurrency(value: string | null): DisplayCurrencyCode {
  const upper = value?.toUpperCase();
  return CURRENCY_OPTIONS.some((option) => option.code === upper)
    ? (upper as DisplayCurrencyCode)
    : "EGP";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrencyCode>("EGP");

  // Restore persisted currency preference on mount
  useEffect(() => {
    const stored = normalizeCurrency(window.localStorage.getItem(STORAGE_KEY));
    if (stored !== "EGP") {
      window.requestAnimationFrame(() => setCurrencyState(stored));
    }
  }, []);

  const setCurrency = useCallback((nextCurrency: DisplayCurrencyCode) => {
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(STORAGE_KEY, nextCurrency);
  }, []);

  const formatCurrency = useCallback(
    (amountEgp: number, options: Intl.NumberFormatOptions = {}) => {
      const rate = STATIC_RATES[currency] ?? 1;
      const value = Number.isFinite(amountEgp) ? amountEgp * rate : 0;
      const fractionDigits = currency === "EGP" ? 0 : 2;

      const currencyDef = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];
      const formattedNumber = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        ...options,
      }).format(value);
      
      return `${currencyDef.symbol}${formattedNumber}`;
    },
    [currency]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates: STATIC_RATES, formatCurrency }),
    [currency, setCurrency, formatCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

const defaultCurrencyValue: CurrencyContextValue = {
  currency: "EGP",
  setCurrency: () => {},
  rates: STATIC_RATES,
  formatCurrency: (amountEgp: number, options?: Intl.NumberFormatOptions) => {
    const value = Number.isFinite(amountEgp) ? amountEgp : 0;
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options,
    }).format(value);
    return `£${formattedNumber}`;
  },
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  return ctx || defaultCurrencyValue;
}
