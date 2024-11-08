
import CategoryEditor from "@/components/form-category";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",

};
export default function Page() {


  return (
    <CategoryEditor />
  )
}

