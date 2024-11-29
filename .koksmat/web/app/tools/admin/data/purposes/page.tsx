import PurposeForm from "@/components/purpose-form";
import { PurposesList } from "@/components/purpose-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purposes",

};

export default function Page() {


  return (
    <PurposesList />
  )
}

