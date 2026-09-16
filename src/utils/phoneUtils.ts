import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js/max";
import { COUNTRIES, CountryInfo } from "@/data/countries";

export interface ExtractedPhone {
  dial: string;
  countryCode: string;
  nationalNumber: string;
  full: string;
}

export interface ParsedPhoneInput extends ExtractedPhone {
  hasCountryCode: boolean;
}

const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);

/**
 * Finds country info from COUNTRIES array by dial code or ISO country code.
 */
export function findCountry(dialOrCode?: string): CountryInfo | undefined {
  if (!dialOrCode) return undefined;
  const lower = dialOrCode.toLowerCase().trim();

  // Try matching by 2-letter ISO code (e.g. "eg", "us")
  const byCode = COUNTRIES.find((c) => c.code.toLowerCase() === lower);
  if (byCode) return byCode;

  // Try matching by dial code (e.g. "+20", "+1")
  const formattedDial = lower.startsWith("+") ? lower : `+${lower}`;
  return COUNTRIES.find((c) => c.dial.toLowerCase() === formattedDial);
}

/**
 * Accurately extracts the dial code, country code, and national number from any full phone value.
 * Avoids greedy regexes that devour the entire string on unspaced numbers like "+201012345678".
 */
export function extractDialAndNational(
  value: string | undefined | null,
  fallbackDial = "+20",
  fallbackCountry = "eg"
): ExtractedPhone {
  if (!value || !value.trim()) {
    return {
      dial: fallbackDial,
      countryCode: fallbackCountry,
      nationalNumber: "",
      full: "",
    };
  }

  let cleaned = value.trim();
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // 1. If starts with +, try parsing with libphonenumber-js first
  if (cleaned.startsWith("+")) {
    try {
      const parsed = parsePhoneNumberFromString(cleaned);
      if (parsed && parsed.countryCallingCode) {
        const dial = `+${parsed.countryCallingCode}`;
        const found =
          (parsed.country && findCountry(parsed.country)) ||
          COUNTRIES.find((c) => c.dial === dial);

        return {
          dial,
          countryCode: found ? found.code : (parsed.country ? parsed.country.toLowerCase() : fallbackCountry),
          nationalNumber: parsed.nationalNumber || "",
          full: `${dial} ${parsed.nationalNumber || ""}`.trim(),
        };
      }
    } catch {
      // Continue to fallback
    }

    // If libphonenumber-js did not return a full parsed number (e.g. partial number while typing),
    // match the dial code from our known countries list (sorted longest first)
    const matchedCountry = SORTED_COUNTRIES.find((c) => cleaned.startsWith(c.dial));
    if (matchedCountry) {
      const remainder = cleaned.slice(matchedCountry.dial.length).trim();
      return {
        dial: matchedCountry.dial,
        countryCode: matchedCountry.code,
        nationalNumber: remainder,
        full: `${matchedCountry.dial} ${remainder}`.trim(),
      };
    }

    // Generic fallback for any unrecognized +prefix
    const plusMatch = cleaned.match(/^(\+\d{1,4})(.*)$/);
    if (plusMatch) {
      const dial = plusMatch[1];
      const remainder = plusMatch[2].trim();
      return {
        dial,
        countryCode: fallbackCountry,
        nationalNumber: remainder,
        full: `${dial} ${remainder}`.trim(),
      };
    }
  }

  // 2. Doesn't start with + (e.g. pure national number entered or autofilled without country code)
  const matchedCountry = SORTED_COUNTRIES.find((c) => cleaned.startsWith(c.dial));
  if (matchedCountry) {
    const remainder = cleaned.slice(matchedCountry.dial.length).trim();
    return {
      dial: matchedCountry.dial,
      countryCode: matchedCountry.code,
      nationalNumber: remainder,
      full: `${matchedCountry.dial} ${remainder}`.trim(),
    };
  }

  // Check if it's a valid local number in the fallback country (e.g. 01012345678 in Egypt)
  try {
    const parsed = parsePhoneNumberFromString(cleaned, fallbackCountry.toUpperCase() as CountryCode);
    if (parsed && parsed.countryCallingCode) {
      const dial = `+${parsed.countryCallingCode}`;
      const found =
        (parsed.country && findCountry(parsed.country)) ||
        COUNTRIES.find((c) => c.dial === dial);

      return {
        dial,
        countryCode: found ? found.code : fallbackCountry,
        nationalNumber: parsed.nationalNumber || cleaned,
        full: `${dial} ${parsed.nationalNumber || cleaned}`.trim(),
      };
    }
  } catch {
    // Continue to fallback
  }

  return {
    dial: fallbackDial,
    countryCode: fallbackCountry,
    nationalNumber: cleaned,
    full: `${fallbackDial} ${cleaned}`.trim(),
  };
}

/**
 * Handles raw input changes from typing, pasting, or browser autofill.
 * Detects whether the input contains an international prefix, separates it cleanly,
 * and formats the resulting full value.
 */
export function parsePhoneInput(
  rawInput: string,
  currentDial = "+20",
  currentCountry = "eg"
): ParsedPhoneInput {
  const trimmed = (rawInput || "").trim();

  // If user pasted or browser autofilled a full number starting with + or 00
  if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
    const extracted = extractDialAndNational(trimmed, currentDial, currentCountry);
    return {
      ...extracted,
      hasCountryCode: true,
    };
  }

  // Check if rawInput starts with a known dial code without + (e.g. "201012345678")
  // Only if digits length is substantial (e.g. >= 9) to avoid false positives with local numbers
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length >= 9) {
    for (const country of SORTED_COUNTRIES) {
      const dialDigits = country.dial.replace(/\D/g, "");
      if (dialDigits && digitsOnly.startsWith(dialDigits)) {
        try {
          const parsed = parsePhoneNumberFromString(`+${digitsOnly}`);
          if (parsed && parsed.isValid()) {
            return {
              dial: country.dial,
              countryCode: country.code,
              nationalNumber: parsed.nationalNumber,
              full: `${country.dial} ${parsed.nationalNumber}`,
              hasCountryCode: true,
            };
          }
        } catch {
          // ignore
        }
      }
    }
  }

  // User typed national digits
  const sanitized = rawInput.replace(/[^0-9+\-()\s]/g, "");
  const full = `${currentDial} ${sanitized}`.trim();

  return {
    dial: currentDial,
    countryCode: currentCountry,
    nationalNumber: sanitized,
    full,
    hasCountryCode: false,
  };
}
