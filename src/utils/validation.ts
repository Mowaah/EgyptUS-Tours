/**
 * Reusable form validation utility functions.
 * Designed to return error messages (string) or null if valid.
 */

export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "Please enter an email address.";
  }
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
};

const COMMON_PASSWORDS = new Set([
  "password", "password1", "123456", "12345678", "qwerty", "abc123",
  "monkey", "1234567", "letmein", "trustno1", "dragon", "baseball",
  "iloveyou", "master", "sunshine", "ashley", "bailey", "passw0rd",
  "shadow", "123123", "654321", "superman", "qazwsx", "michael",
  "football", "password123", "admin", "welcome", "login", "hello",
  "charlie", "donald", "password2", "qwerty123", "car123", "test123",
  "pass123", "111111", "000000", "1234", "12345", "123456789",
]);

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === "") {
    return "Please enter a password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "This password is too common. Please choose a more unique password.";
  }

  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Please enter your full name.";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  return null;
};
