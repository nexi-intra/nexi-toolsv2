"use client"
import { ItemViewerComponent } from "@/app/koksmat/src/v.next/components/item-viewer";
import CountryEditor from "@/components/country-form";
import { kInfo } from "@/lib/koksmat-logger-client";

import type { Metadata } from "next";
import { FaCircle, FaSquare, FaStar } from "react-icons/fa";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Countries",

};
export function CountryList() {

  const properties = [
    {
      name: "continent",
      values: [
        { value: "europe", icon: <FaCircle color="red" />, color: "red" },
        { value: "north-america", icon: <FaCircle color="green" />, color: "green" },
        { value: "south-america", icon: <FaCircle color="blue" />, color: "blue" },
        { value: "asia", icon: <FaCircle color="yellow" />, color: "yellow" },
        { value: "africa", icon: <FaCircle color="purple" />, color: "purple" },
        { value: "oceania", icon: <FaCircle color="purple" />, color: "purple" },
      ],
    },
    {
      name: "population",
      values: [
        { value: "small", icon: <FaCircle />, color: "black" },
        { value: "+50M", icon: <FaSquare />, color: "black" },
        { value: "+250M", icon: <FaStar />, color: "black" },
      ],
    },
  ]
  // Schema for countries
  const CountrySchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    continent: z.string().min(1),
    population: z.number().int().positive(),
    capital: z.string().min(1),
    constitutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  })

  type Country = z.infer<typeof CountrySchema>

  // Schema for arrays of countries
  const CountriesArraySchema = z.array(CountrySchema)
  const countries: Country[] = [
    { id: 1, name: 'United States', continent: 'North America', population: 331002651, capital: 'Washington, D.C.', constitutionDate: '1787-09-17' },
    { id: 2, name: 'China', continent: 'Asia', population: 1439323776, capital: 'Beijing', constitutionDate: '1982-12-04' },
    { id: 3, name: 'India', continent: 'Asia', population: 1380004385, capital: 'New Delhi', constitutionDate: '1950-01-26' },
    { id: 4, name: 'Brazil', continent: 'South America', population: 212559417, capital: 'Brasília', constitutionDate: '1988-10-05' },
    { id: 5, name: 'Russia', continent: 'Europe/Asia', population: 145934462, capital: 'Moscow', constitutionDate: '1993-12-25' },
    { id: 6, name: 'Japan', continent: 'Asia', population: 126476461, capital: 'Tokyo', constitutionDate: '1947-05-03' },
    { id: 7, name: 'Germany', continent: 'Europe', population: 83783942, capital: 'Berlin', constitutionDate: '1949-05-23' },
    { id: 8, name: 'United Kingdom', continent: 'Europe', population: 67886011, capital: 'London', constitutionDate: '1215-06-15' },
    { id: 9, name: 'France', continent: 'Europe', population: 65273511, capital: 'Paris', constitutionDate: '1958-10-04' },
    { id: 10, name: 'Italy', continent: 'Europe', population: 60461826, capital: 'Rome', constitutionDate: '1948-01-01' },
    { id: 11, name: 'South Africa', continent: 'Africa', population: 59308690, capital: 'Pretoria, Cape Town, Bloemfontein', constitutionDate: '1996-12-10' },
    { id: 12, name: 'South Korea', continent: 'Asia', population: 51269185, capital: 'Seoul', constitutionDate: '1948-07-17' },
    { id: 13, name: 'Colombia', continent: 'South America', population: 50882891, capital: 'Bogotá', constitutionDate: '1991-07-04' },
    { id: 14, name: 'Spain', continent: 'Europe', population: 46754778, capital: 'Madrid', constitutionDate: '1978-12-29' },
    { id: 15, name: 'Argentina', continent: 'South America', population: 45195774, capital: 'Buenos Aires', constitutionDate: '1853-05-01' },
  ]

  return (
    <ItemViewerComponent
      items={countries}
      properties={properties}
      onSearch={(query) => kInfo("component", 'Search query:', query)}
      options={{ pageSize: 10, heightBehaviour: 'Full' }}
    />

  )
}

