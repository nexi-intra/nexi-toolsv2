import PurposeEditor from "@/components/form-purpose";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purposes",

};

export default function Page() {


  return (
    <PurposeEditor />
  )
}

