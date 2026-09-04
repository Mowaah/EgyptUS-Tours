export interface MultiCurrencyPrice {
  usd?: number | string | null;
  egp?: number | string | null;
  eur?: number | string | null;
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

