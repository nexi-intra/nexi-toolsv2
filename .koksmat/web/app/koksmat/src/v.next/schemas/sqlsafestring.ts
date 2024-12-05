import { z } from "zod";

export const sanitizeSQLInput = (input: string): string => {
  // Replace dangerous characters to mitigate SQL injection risks
  return input
    .replace(/;/g, "\\;") // Escape semicolons
    .replace(/--/g, "\\--") // Escape double dashes
    .replace(/'/g, "''") // Escape single quotes
    .replace(/"/g, '\\"'); // Escape double quotes
};

export const SQLSafeString = z
  .string()
  .min(1, "Input cannot be empty")
  .transform((input) => sanitizeSQLInput(input)) // Sanitize the input
  .refine((input) => {
    // Additional custom validations if necessary
    return true; // Example: always true, replace with actual validation logic
  }, "Invalid input detected.");
