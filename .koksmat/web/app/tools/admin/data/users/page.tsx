import RegionEditor from "@/components/form-region";
import UserEditor from "@/components/form-user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",

};
export default function Page() {


  return (
    <UserEditor />
  )
}

