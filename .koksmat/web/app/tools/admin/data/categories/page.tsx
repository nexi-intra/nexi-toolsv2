
import { CategoryList } from "@/components/category-list";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",

};
export default function Page() {


  return (
    <CategoryList />

  )
}

