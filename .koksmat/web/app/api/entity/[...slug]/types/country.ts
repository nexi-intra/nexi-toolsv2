import { z } from "zod";
import {
  createInputSchema,
  updateInputSchema,
  responseSchema,
  listResponseSchema,
} from ".";
import { SharedAttributes } from "./_shared";

export const CountrySchema = SharedAttributes.extend({
  name: z.string().describe("Name of the country"),
  code: z.string().length(2).describe("ISO 3166-1 alpha-2 country code"),
  continent: z.string().describe("Continent where the country is located"),
  currency: z.string().describe("Currency code used in the country"),
  phoneCode: z.string().describe("International phone code for the country"),
});

export const CreateCountryInputSchema = createInputSchema(CountrySchema);
export const UpdateCountryInputSchema = updateInputSchema(CountrySchema);
export const CountryResponseSchema = responseSchema(CountrySchema);
export const CountriesListResponseSchema = listResponseSchema(CountrySchema);

export type Country = z.infer<typeof CountrySchema>;
export type CreateCountryInput = z.infer<typeof CreateCountryInputSchema>;
export type UpdateCountryInput = z.infer<typeof UpdateCountryInputSchema>;
export type CountryResponse = z.infer<typeof CountryResponseSchema>;
export type CountriesListResponse = z.infer<typeof CountriesListResponseSchema>;
