/**
 * Formats large dashboard metric numbers into compact strings (e.g. 47k, 476k, $1.7M)
 * and strips trailing decimals.
 */
export function formatCompactMetric(
  value: number | string | undefined | null,
  isCurrency: boolean = false
): string {
  if (value === undefined || value === null || value === "") {
    return isCurrency ? "$0" : "0";
  }
  const cleanStr = String(value).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return String(value);

  const prefix = isCurrency ? "$" : "";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const b = Math.round(abs / 1_000_000_000);
    return `${sign}${prefix}${b.toLocaleString("en-US")}B`;
  }
  if (abs >= 1_000_000) {
    const m = Math.round(abs / 1_000_000);
    return `${sign}${prefix}${m.toLocaleString("en-US")}M`;
  }
  if (abs >= 1_000) {
    const k = Math.round(abs / 1_000);
    return `${sign}${prefix}${k.toLocaleString("en-US")}k`;
  }
  return `${sign}${prefix}${Math.round(abs).toLocaleString("en-US")}`;
}

/**
 * Formats a count number with commas and NO decimals.
 * If number is too big (>= compactThreshold, default 100,000), adds k/M/B.
 */
export function formatCountWithCommas(
  value: number | string | undefined | null,
  compactThreshold: number = 100_000
): string {
  if (value === undefined || value === null || value === "") return "0";
  const cleanStr = String(value).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return String(value);

  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}${Math.round(abs / 1_000_000_000).toLocaleString("en-US")}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${Math.round(abs / 1_000_000).toLocaleString("en-US")}M`;
  }
  if (abs >= compactThreshold) {
    return `${sign}${Math.round(abs / 1_000).toLocaleString("en-US")}k`;
  }
  return `${sign}${Math.round(abs).toLocaleString("en-US")}`;
}

/**
 * Formats trend percentage strings to remove decimal places (e.g. "+150.0%" -> "+150%").
 */
export function formatTrendPct(pct?: string): string {
  if (!pct) return "0%";
  const hasPlus = pct.startsWith("+");
  const num = parseFloat(pct.replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return pct;
  const rounded = Math.round(num);
  if (rounded === 0) return "0%";
  return `${hasPlus || rounded > 0 ? "+" : ""}${rounded}%`;
}

/**
 * Formats full currency amounts with thousands commas and NO decimals (e.g. $265,601).
 */
export function formatCurrencyAmount(
  value: number | string | undefined | null,
  currencySymbol: string = "$"
): string {
  if (value === undefined || value === null || value === "") return `${currencySymbol}0`;
  const cleanStr = String(value).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return `${currencySymbol}0`;
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  return `${sign}${currencySymbol}${Math.round(abs).toLocaleString("en-US")}`;
}

/**
 * Formats amounts in thousands (k) with commas and NO decimals (e.g. $11,233k, $206k, $8,920k).
 */
export function formatThousandsMetric(
  value: number | string | undefined | null,
  isCurrency: boolean = true
): string {
  if (value === undefined || value === null || value === "") return isCurrency ? "$0" : "0";
  const cleanStr = String(value).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleanStr);
  if (isNaN(num) || num === 0) return isCurrency ? "$0" : "0";
  const prefix = isCurrency ? "$" : "";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs >= 1_000) {
    return `${sign}${prefix}${Math.round(abs / 1_000).toLocaleString("en-US")}k`;
  }
  return `${sign}${prefix}${Math.round(abs).toLocaleString("en-US")}`;
}

