import LanguageEditor from "@/components/language-form";
import { LanguageList } from "@/components/language-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Languages",

};

export default function Page() {


  return (
    <LanguageList />
  )
}

