import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/max";

/**
 * Reusable form validation helper functions
 */

/**
 * Validates if a string is a standard email format.
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates if a phone number string is valid internationally.
 * Ensures the phone number has country dial code and valid length/area code for that country.
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || !phone.trim()) return false;
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");
  // If only country code was entered or no digits
  if (digitsOnly.length < 5) return false;

  const formatted = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  try {
    return isValidPhoneNumber(formatted);
  } catch {
    return false;
  }
};

/**
 * Formats a phone number to standard E.164 (e.g. +12025550111) for backend APIs.
 */
export const formatPhoneE164 = (phone: string): string => {
  if (!phone) return "";
  const trimmed = phone.trim();
  const formatted = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  try {
    const parsed = parsePhoneNumber(formatted);
    return parsed ? parsed.format("E.164") : formatted.replace(/\s+/g, "");
  } catch {
    return formatted.replace(/\s+/g, "");
  }
};
