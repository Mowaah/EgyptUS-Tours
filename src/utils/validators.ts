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
 * Validates if a phone number string contains between 7 and 15 digits.
 * (ignores spaces, dashes, plus signs, and parentheses)
 */
export const isValidPhone = (phone: string): boolean => {
  const digitCount = phone.replace(/[^0-9]/g, "").length;
  return phone.trim() !== "" && digitCount >= 7 && digitCount <= 15;
};
