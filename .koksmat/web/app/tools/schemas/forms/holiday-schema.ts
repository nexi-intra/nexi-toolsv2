import { z } from "zod";

export const CountryCode = z.string();

export const HolidaySchema = z.object({
  date: z.string(),
  countries: z.array(CountryCode),
  name: z.string(),
});

export const HolidaysSchema = z.array(HolidaySchema);

export type Holiday = z.infer<typeof HolidaySchema>;
export type Holidays = z.infer<typeof HolidaysSchema>;
