import { z } from "zod";
// Define the schema
export const dateSchema = z.preprocess((input) => {
  // If the input is already a Date, return it as is
  if (input instanceof Date) {
    return input;
  }

  // If the input is a string, try parsing it
  if (typeof input === "string") {
    const date = new Date(input);
    // Check if it's a valid date
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Return the original input if it doesn't match the criteria
  return input;
}, z.date());
