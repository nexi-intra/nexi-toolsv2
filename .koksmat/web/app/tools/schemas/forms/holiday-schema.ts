import { dateSchema } from "@/app/koksmat/src/v.next/schemas/date";
import { z } from "zod";

export const CountryCode = z.string();

export const HolidaySchema = z.object({
  name: z.string(),
  date: dateSchema,
  countries: z.array(z.string()),
});

const sampleHolidays = [
  {
    name: "New Year's Day",
    date: "2024-01-01",
    countries: [
      "us",
      "cn",
      "za",
      "at",
      "be",
      "bg",
      "cz",
      "dk",
      "ee",
      "fi",
      "fr",
      "de",
      "gr",
      "hu",
      "ie",
      "it",
      "lv",
      "lt",
      "lu",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "sk",
      "si",
      "es",
      "se",
    ],
  },
  {
    name: "Martin Luther King Jr. Day",
    date: "2024-01-15",
    countries: ["us"],
  },
  {
    name: "Presidents' Day",
    date: "2024-02-19",
    countries: ["us"],
  },
  {
    name: "Chinese New Year",
    date: "2024-02-10",
    countries: ["cn"],
  },
  {
    name: "Good Friday",
    date: "2024-03-29",
    countries: ["za", "dk", "ee", "fi", "de", "ie", "mt", "no", "se", "uk"],
  },
  {
    name: "Human Rights Day",
    date: "2024-03-21",
    countries: ["za"],
  },
  {
    name: "Qingming Festival",
    date: "2024-04-04",
    countries: ["cn"],
  },
  {
    name: "Family Day",
    date: "2024-04-01",
    countries: ["za"],
  },
  {
    name: "Freedom Day",
    date: "2024-04-27",
    countries: ["za"],
  },
  {
    name: "Labor Day",
    date: "2024-05-01",
    countries: [
      "us",
      "cn",
      "za",
      "at",
      "be",
      "bg",
      "cz",
      "de",
      "dk",
      "ee",
      "fi",
      "fr",
      "gr",
      "hu",
      "it",
      "lv",
      "lt",
      "lu",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "sk",
      "si",
      "es",
      "se",
    ],
  },
  {
    name: "Memorial Day",
    date: "2024-05-27",
    countries: ["us"],
  },
  {
    name: "Dragon Boat Festival",
    date: "2024-06-10",
    countries: ["cn"],
  },
  {
    name: "Juneteenth National Independence Day",
    date: "2024-06-19",
    countries: ["us"],
  },
  {
    name: "Independence Day",
    date: "2024-07-04",
    countries: ["us"],
  },
  {
    name: "Youth Day",
    date: "2024-06-16",
    countries: ["za"],
  },
  {
    name: "Mid-Autumn Festival",
    date: "2024-09-19",
    countries: ["cn"],
  },
  {
    name: "National Day",
    date: "2024-10-01",
    countries: ["cn"],
  },
  {
    name: "Thanksgiving Day",
    date: "2024-11-28",
    countries: ["us"],
  },
  {
    name: "Veterans Day",
    date: "2024-11-11",
    countries: ["us"],
  },
  {
    name: "Christmas Day",
    date: "2024-12-25",
    countries: [
      "us",
      "za",
      "at",
      "be",
      "bg",
      "cz",
      "dk",
      "ee",
      "fi",
      "fr",
      "de",
      "gr",
      "hu",
      "ie",
      "it",
      "lv",
      "lt",
      "lu",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "sk",
      "si",
      "es",
      "se",
    ],
  },
  {
    name: "New Year's Day",
    date: "2025-01-01",
    countries: [
      "us",
      "cn",
      "za",
      "at",
      "be",
      "bg",
      "cz",
      "dk",
      "ee",
      "fi",
      "fr",
      "de",
      "gr",
      "hu",
      "ie",
      "it",
      "lv",
      "lt",
      "lu",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "sk",
      "si",
      "es",
      "se",
    ],
  },
  {
    name: "Martin Luther King Jr. Day",
    date: "2025-01-20",
    countries: ["us"],
  },
  {
    name: "Chinese New Year",
    date: "2025-01-29",
    countries: ["cn"],
  },
  {
    name: "Qingming Festival",
    date: "2025-04-04",
    countries: ["cn"],
  },
  {
    name: "Labor Day",
    date: "2025-05-01",
    countries: [
      "us",
      "cn",
      "za",
      "at",
      "be",
      "bg",
      "cz",
      "de",
      "dk",
      "ee",
      "fi",
      "fr",
      "gr",
      "hu",
      "it",
      "lv",
      "lt",
      "lu",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "sk",
      "si",
      "es",
      "se",
    ],
  },
];

export const HolidaysSchemaArray = z.array(HolidaySchema);
export const getSampleHolidays = () =>
  HolidaysSchemaArray.parse(sampleHolidays);

export type Holiday = z.infer<typeof HolidaySchema>;
export type Holidays = Holiday[];
