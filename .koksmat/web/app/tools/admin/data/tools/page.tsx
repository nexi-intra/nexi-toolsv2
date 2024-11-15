
import ToolForm from "@/components/tool-form";
import { ToolList } from "@/components/tool-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",

};
export default function Page() {

  //TODO: add ToolForm as property to ToolList component
  return (
    <ToolList />
    // <ToolForm />
  )
}

