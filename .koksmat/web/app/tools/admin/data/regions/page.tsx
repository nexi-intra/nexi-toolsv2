import RegionEditor from "@/components/form-region";
import { kInfo } from "@/lib/koksmat-logger-client";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Regions",

};
export default function Page() {


  return (
    <RegionEditor />
  )
}

