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

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === "") {
    return "Please enter a password.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
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
