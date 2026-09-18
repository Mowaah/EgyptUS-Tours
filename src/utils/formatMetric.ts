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

/**
 * Formats a budget range with currency symbol, thousands commas, and NO decimals.
 * Examples:
 *   formatBudgetRange("3000.00", "5000.00") => "$3,000 - $5,000"
 *   formatBudgetRange("3000.00", null) => "$3,000+"
 *   formatBudgetRange(null, null, "$3000.00 - $5000.00") => "$3,000 - $5,000"
 */
export function formatBudgetRange(
  min?: number | string | null,
  max?: number | string | null,
  fallback?: string | null,
  currencySymbol: string = "$"
): string {
  if (min !== undefined && min !== null && min !== "") {
    const formattedMin = formatCurrencyAmount(min, currencySymbol);
    if (max !== undefined && max !== null && max !== "") {
      const formattedMax = formatCurrencyAmount(max, currencySymbol);
      return `${formattedMin} - ${formattedMax}`;
    }
    return `${formattedMin}+`;
  }

  if (fallback && fallback !== "-") {
    return fallback.replace(/\$?\s*(\d+(?:\.\d+)?)/g, (_, numStr) => {
      const num = parseFloat(numStr);
      return isNaN(num) ? numStr : `${currencySymbol}${Math.round(num).toLocaleString("en-US")}`;
    });
  }

  return fallback || "-";
}

/**
 * Formats an expected attendee count or range into the standard range display label.
 * Maps stored numbers (e.g. 10, 51, 101, 251, 500) back to dropdown ranges ("10-50", "101-250", etc.).
 */
export function formatExpectedAttendees(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  const str = String(value).trim();
  if (!str) return "";
  if (str.includes("-") || str.includes("+")) return str;

  const num = parseInt(str, 10);
  if (isNaN(num)) return str;

  if (num >= 500) return "500+";
  if (num >= 251) return "251-500";
  if (num >= 101) return "101-250";
  if (num >= 51) return "51-100";
  if (num >= 10) return "10-50";

  return str;
}

const CITY_NAME_MAP: Record<string, string> = {
  cairo: "Cairo",
  alexandria: "Alexandria",
  sharm: "Sharm El-Sheikh",
  "sharm el-sheikh": "Sharm El-Sheikh",
  "sharm el sheikh": "Sharm El-Sheikh",
  hurghada: "Hurghada",
  luxor: "Luxor",
  aswan: "Aswan",
  giza: "Giza",
};

/**
 * Formats a city slug/value (e.g. "sharm", "cairo") into its full display label (e.g. "Sharm El-Sheikh").
 */
export function formatPreferredCity(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (CITY_NAME_MAP[clean]) return CITY_NAME_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const EVENT_TYPE_MAP: Record<string, string> = {
  conference: "Conference",
  meeting: "Meeting",
  incentive: "Incentive Travel",
  "incentive travel": "Incentive Travel",
  exhibition: "Exhibition",
  retreat: "Corporate Retreat",
  "corporate retreat": "Corporate Retreat",
};

/**
 * Formats an event type slug/value (e.g. "incentive", "retreat") into its full display label (e.g. "Incentive Travel").
 */
export function formatEventType(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (EVENT_TYPE_MAP[clean]) return EVENT_TYPE_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const VENUE_TYPE_MAP: Record<string, string> = {
  hotel: "Hotel Conference Center",
  "hotel conference center": "Hotel Conference Center",
  exhibition_hall: "Dedicated Exhibition Hall",
  "dedicated exhibition hall": "Dedicated Exhibition Hall",
  historical: "Historical Landmark",
  "historical landmark": "Historical Landmark",
  outdoor: "Outdoor/Resort Context",
  "outdoor/resort context": "Outdoor/Resort Context",
  other: "Other",
};

/**
 * Formats a venue type slug/value (e.g. "hotel", "exhibition_hall") into its full display label (e.g. "Hotel Conference Center").
 */
export function formatVenueType(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (VENUE_TYPE_MAP[clean]) return VENUE_TYPE_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const ADDITIONAL_SERVICE_MAP: Record<string, string> = {
  hotel: "Hotel Accommodation",
  "hotel accommodation": "Hotel Accommodation",
  transportation: "Transportation",
  catering: "Catering Services",
  "catering services": "Catering Services",
  technical: "Technical Support",
  "technical support": "Technical Support",
  translation: "Translation / Interpretation",
  "translation / interpretation": "Translation / Interpretation",
  entertainment: "Entertainment Program",
  "entertainment program": "Entertainment Program",
};

/**
 * Formats additional services array or comma-separated string into human-readable labels.
 */
export function formatAdditionalServices(value?: string[] | string | null): string {
  if (!value) return "";
  const list = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (list.length === 0) return "";

  return list
    .map((item) => {
      const clean = item.trim().toLowerCase();
      if (ADDITIONAL_SERVICE_MAP[clean]) return ADDITIONAL_SERVICE_MAP[clean];
      return item
        .split(/[\s_-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    })
    .join(", ");
}

const BUDGET_RANGE_MAP: Record<string, string> = {
  "10k-25k": "$10,000 - $25,000",
  "25k-50k": "$25,000 - $50,000",
  "50k-100k": "$50,000 - $100,000",
  "100k-plus": "$100,000+",
};

/**
 * Formats budget range slugs (e.g. "10k-25k", "100k-plus") into readable labels (e.g. "$10,000 - $25,000").
 */
export function formatBudgetRangeLabel(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (BUDGET_RANGE_MAP[clean]) return BUDGET_RANGE_MAP[clean];
  return value;
}

const BUDGET_FLEXIBILITY_MAP: Record<string, string> = {
  fixed: "Fixed Budget",
  somewhat: "Some What Flexible",
  very: "Very Flexible",
};

/**
 * Formats budget flexibility value (e.g. "somewhat") into readable label (e.g. "Some What Flexible").
 */
export function formatBudgetFlexibility(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (BUDGET_FLEXIBILITY_MAP[clean]) return BUDGET_FLEXIBILITY_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const SOURCE_MAP: Record<string, string> = {
  google: "Google Search",
  social: "Social Media",
  referral: "Referral / Word of mouth",
  ad: "Advertisement",
  other: "Other",
};

/**
 * Formats source value (e.g. "google", "social") into readable label (e.g. "Google Search").
 */
export function formatSource(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (SOURCE_MAP[clean]) return SOURCE_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const INDUSTRY_MAP: Record<string, string> = {
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  manufacturing: "Manufacturing",
  other: "Other",
};

/**
 * Formats industry value (e.g. "technology") into readable label (e.g. "Technology").
 */
export function formatIndustry(value?: string | null): string {
  if (!value) return "";
  const clean = value.trim().toLowerCase();
  if (INDUSTRY_MAP[clean]) return INDUSTRY_MAP[clean];
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}



