import { CountryList } from "@/components/country-list";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries",

};
export default function Page() {


  return (
    <CountryList />

  )
}

