import LanguageEditor from "@/components/form-language";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Languages",

};

export default function Page() {


  return (
    <LanguageEditor />
  )
}

