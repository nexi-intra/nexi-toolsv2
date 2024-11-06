import CountryEditor from "@/components/form-country";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries",

};
export default function Page() {


  return (
    <CountryEditor />
  )
}

