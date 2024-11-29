import RegionEditor from "@/components/region-form";
import { RegionList } from "@/components/region-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regions",

};
export default function Page() {


  return (
    // <RegionEditor />
    <RegionList />
  )
}

