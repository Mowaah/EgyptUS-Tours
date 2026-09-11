"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import {
  MultiCurrencyPrice,
  DisplayCurrencyCode,
  CURRENCY_STORAGE_KEY,
  CURRENCY_COOKIE_KEY,
  DEFAULT_CURRENCY,
  CURRENCY_OPTIONS,
  CurrencyRates,
  STATIC_RATES,
  normalizeCurrency,
  resolveMultiCurrencyPrice,
} from "@/constants/currency";

export {
  type DisplayCurrencyCode,
  CURRENCY_STORAGE_KEY,
  CURRENCY_COOKIE_KEY,
  DEFAULT_CURRENCY,
  CURRENCY_OPTIONS,
  type CurrencyRates,
  STATIC_RATES,
  normalizeCurrency,
  resolveMultiCurrencyPrice,
};

interface CurrencyContextValue {
  currency: DisplayCurrencyCode;
  setCurrency: (currency: DisplayCurrencyCode) => void;
  rates: CurrencyRates;
  getCurrencyPrice: (amount?: MultiCurrencyPrice | number | string | null) => number;
  formatCurrency: (amount?: MultiCurrencyPrice | number | string | null, options?: Intl.NumberFormatOptions) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
  children: React.ReactNode;
  initialCurrency?: DisplayCurrencyCode;
}

export function CurrencyProvider({ children, initialCurrency }: CurrencyProviderProps) {
  const router = useRouter();
  const [currency, setCurrencyState] = useState<DisplayCurrencyCode>(
    initialCurrency || DEFAULT_CURRENCY
  );

  // Sync state if initialCurrency changes (e.g. server re-render on cookie change)
  useEffect(() => {
    if (initialCurrency && initialCurrency !== currency) {
      setCurrencyState(initialCurrency);
    }
  }, [initialCurrency]);

  // Restore persisted currency preference on mount
  useEffect(() => {
    const stored =
      Cookies.get(CURRENCY_COOKIE_KEY) ||
      (typeof window !== "undefined" ? window.localStorage.getItem(CURRENCY_STORAGE_KEY) : null);

    const normalized = normalizeCurrency(stored);
    if (normalized !== currency) {
      setCurrencyState(normalized);
      Cookies.set(CURRENCY_COOKIE_KEY, normalized, { expires: 365, path: "/" });
    }
  }, []);

  const setCurrency = useCallback(
    (nextCurrency: DisplayCurrencyCode) => {
      const normalized = normalizeCurrency(nextCurrency);
      setCurrencyState(normalized);
      try {
        window.localStorage.setItem(CURRENCY_STORAGE_KEY, normalized);
        Cookies.set(CURRENCY_COOKIE_KEY, normalized, { expires: 365, path: "/" });
        // Refresh router so server-side fetched data re-runs with the new currency cookie
        router.refresh();
      } catch (e) {
        console.error("Error persisting currency preference:", e);
      }
    },
    [router]
  );

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
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  rates: STATIC_RATES,
  getCurrencyPrice: (amount?: MultiCurrencyPrice | number | string | null) => resolveMultiCurrencyPrice(amount, DEFAULT_CURRENCY),
  formatCurrency: (amount?: MultiCurrencyPrice | number | string | null, options?: Intl.NumberFormatOptions) => {
    const value = resolveMultiCurrencyPrice(amount, DEFAULT_CURRENCY);
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options,
    }).format(value);
    return `$${formattedNumber}`;
  },
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  return ctx || defaultCurrencyValue;
}
