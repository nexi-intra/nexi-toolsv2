import RegionEditor from "@/components/form-region";
import UserProfileTableEditor from "@/components/form-userprofile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",

};
export default function Page() {


  return (
    <UserProfileTableEditor />
  )
}

