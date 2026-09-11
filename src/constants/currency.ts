export interface MultiCurrencyPrice {
  usd?: number | string | null;
  egp?: number | string | null;
  eur?: number | string | null;
}

export type DisplayCurrencyCode = "USD" | "EUR" | "EGP";

export const CURRENCY_STORAGE_KEY = "egyptus_display_currency";
export const CURRENCY_COOKIE_KEY = "egyptus_currency";
export const DEFAULT_CURRENCY: DisplayCurrencyCode = "USD";

export const CURRENCY_OPTIONS: Array<{ code: DisplayCurrencyCode; symbol: string }> = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "EGP", symbol: "£" },
];

export type CurrencyRates = Record<DisplayCurrencyCode, number>;

// Static exchange rates from EGP base (used only as fallback when backend multi-currency values are absent)
export const STATIC_RATES: CurrencyRates = {
  EGP: 1,
  USD: 0.020,  // 1 EGP ≈ 0.020 USD
  EUR: 0.019,  // 1 EGP ≈ 0.019 EUR
};

export function normalizeCurrency(value: string | null | undefined): DisplayCurrencyCode {
  const upper = value?.toUpperCase();
  return CURRENCY_OPTIONS.some((option) => option.code === upper)
    ? (upper as DisplayCurrencyCode)
    : DEFAULT_CURRENCY;
}

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

export interface DashboardCurrencyConfig {
  code: "USD" | "EUR" | "EGP";
  symbol: string;
  label: string;
}

/**
 * Centralized dashboard default currency.
 * Changing this single constant will update the currency symbol, code, and labels across all dashboard catalog forms.
 */
export const DASHBOARD_CURRENCY: DashboardCurrencyConfig = {
  code: "USD",
  symbol: "$",
  label: "USD ($)",
};

/**
 * Format a numeric price value for display:
 * - Strips trailing .00 or .0 decimals
 * - Adds thousands commas (e.g. 3000 → 3,000)
 * - Prepends the given symbol (defaults to DASHBOARD_CURRENCY.symbol)
 *
 * Examples:
 *   formatPrice("3134.00")  → "$3,134"
 *   formatPrice(300)        → "$300"
 *   formatPrice("2575.50")  → "$2,575.50"
 */
export function formatPrice(
  value: string | number | null | undefined,
  symbol: string = DASHBOARD_CURRENCY.symbol
): string {
  if (value === null || value === undefined || value === "") return "-";
  const num = parseFloat(String(value));
  if (isNaN(num)) return "-";

  // Remove trailing zeros after decimal point
  const formatted = num % 1 === 0
    ? num.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `${symbol}${formatted}`;
}

