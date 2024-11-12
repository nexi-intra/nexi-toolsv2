import RegionEditor from "@/components/form-region";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regions",

};
export default function Page() {


  return (
    <RegionEditor />
  )
}

