"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";

import { MultiCurrencyPrice } from "@/constants/currency";

export type DisplayCurrencyCode = "EGP" | "USD" | "EUR";

export const CURRENCY_OPTIONS: Array<{ code: DisplayCurrencyCode; symbol: string }> = [
  { code: "EGP", symbol: "£" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
];

type CurrencyRates = Record<DisplayCurrencyCode, number>;

// Static exchange rates from EGP base (used only as fallback when backend multi-currency values are absent)
const STATIC_RATES: CurrencyRates = {
  EGP: 1,
  USD: 0.020,  // 1 EGP ≈ 0.020 USD
  EUR: 0.019,  // 1 EGP ≈ 0.019 EUR
};

export function resolveMultiCurrencyPrice(
  amount: MultiCurrencyPrice | number | string | null | undefined,
  currency: DisplayCurrencyCode
): number {
  if (amount == null) return 0;

  if (typeof amount === "object") {
    let rawVal: number | string | null | undefined;
    if (currency === "USD") {
      rawVal = amount.usd ?? (amount.egp != null ? Number(amount.egp) * STATIC_RATES.USD : amount.eur != null ? Number(amount.eur) : 0);
    } else if (currency === "EUR") {
      rawVal = amount.eur ?? (amount.usd != null ? Number(amount.usd) * (STATIC_RATES.EUR / STATIC_RATES.USD) : amount.egp != null ? Number(amount.egp) * STATIC_RATES.EUR : 0);
    } else {
      // EGP
      rawVal = amount.egp ?? (amount.usd != null ? Number(amount.usd) / STATIC_RATES.USD : 0);
    }
    const parsed = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal ?? 0));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  // Primitive number or string (legacy EGP base)
  const parsed = typeof amount === "number" ? amount : parseFloat(String(amount ?? 0).replace(/,/g, ""));
  const rate = STATIC_RATES[currency] ?? 1;
  return Number.isFinite(parsed) ? parsed * rate : 0;
}

interface CurrencyContextValue {
  currency: DisplayCurrencyCode;
  setCurrency: (currency: DisplayCurrencyCode) => void;
  rates: CurrencyRates;
  getCurrencyPrice: (amount?: MultiCurrencyPrice | number | string | null) => number;
  formatCurrency: (amount?: MultiCurrencyPrice | number | string | null, options?: Intl.NumberFormatOptions) => string;
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

  const getCurrencyPrice = useCallback(
    (amount?: MultiCurrencyPrice | number | string | null) => {
      return resolveMultiCurrencyPrice(amount, currency);
    },
    [currency]
  );

  const formatCurrency = useCallback(
    (amount?: MultiCurrencyPrice | number | string | null, options: Intl.NumberFormatOptions = {}) => {
      const value = resolveMultiCurrencyPrice(amount, currency);
      const isWhole = value % 1 === 0;
      const defaultFractionDigits = currency === "EGP" || isWhole ? 0 : 2;

      const currencyDef = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];
      const formattedNumber = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: defaultFractionDigits,
        maximumFractionDigits: 2,
        ...options,
      }).format(value);
      
      return `${currencyDef.symbol}${formattedNumber}`;
    },
    [currency]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates: STATIC_RATES, getCurrencyPrice, formatCurrency }),
    [currency, setCurrency, getCurrencyPrice, formatCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

const defaultCurrencyValue: CurrencyContextValue = {
  currency: "EGP",
  setCurrency: () => {},
  rates: STATIC_RATES,
  getCurrencyPrice: (amount?: MultiCurrencyPrice | number | string | null) => resolveMultiCurrencyPrice(amount, "EGP"),
  formatCurrency: (amount?: MultiCurrencyPrice | number | string | null, options?: Intl.NumberFormatOptions) => {
    const value = resolveMultiCurrencyPrice(amount, "EGP");
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
