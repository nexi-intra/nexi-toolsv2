

import { ToolGroupsList } from "@/components/toolgroup-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Groups",

};
export default function Page() {


  return (
    <ToolGroupsList />
  )
}

