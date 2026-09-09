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
    const b = abs / 1_000_000_000;
    const formatted = b % 1 === 0 ? b.toFixed(0) : b.toFixed(1).replace(/\.0$/, "");
    return `${sign}${prefix}${formatted}B`;
  }
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    const formatted = m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, "");
    return `${sign}${prefix}${formatted}M`;
  }
  if (abs >= 1_000) {
    const k = Math.round(abs / 1_000);
    return `${sign}${prefix}${k}k`;
  }
  return `${sign}${prefix}${Math.round(abs)}`;
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
