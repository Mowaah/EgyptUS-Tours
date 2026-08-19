import { COUNTRIES } from "@/data/countries";

/** Resolve a 2-letter ISO country code from any input (code, nationality word, or country name). */
export function resolveCountryCode(value: string): string {
  if (!value) return "un";
  const lower = value.toLowerCase().trim();

  // Already a 2-letter code
  const byCode = COUNTRIES.find((c) => c.code === lower);
  if (byCode) return byCode.code;

  // Full nationality word e.g. "Spanish" → "es"
  const byNationality = COUNTRIES.find(
    (c) => c.nationality.toLowerCase() === lower
  );
  if (byNationality) return byNationality.code;

  // Full country name e.g. "Spain" → "es"
  const byName = COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (byName) return byName.code;

  // Last-resort: treat as a code (may produce a broken flag)
  return lower.substring(0, 2);
}

export function getNationalityName(value: string): string {
  if (!value) return "Unknown";

  const lower = value.toLowerCase().trim();

  // If the input is already a full nationality word, return it capitalised
  const byNationality = COUNTRIES.find(
    (c) => c.nationality.toLowerCase() === lower
  );
  if (byNationality) return byNationality.nationality;

  // If it's a country name, return the nationality label
  const byName = COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (byName) return byName.nationality;

  // If it's a 2-letter code, look up the nationality label
  const byCode = COUNTRIES.find((c) => c.code === lower);
  if (byCode?.nationality) return byCode.nationality;

  // Fallback: Intl API for unknown codes
  try {
    const regionName = new Intl.DisplayNames(["en"], { type: "region" }).of(
      value.toUpperCase()
    );
    return regionName || value;
  } catch {
    return value;
  }
}
