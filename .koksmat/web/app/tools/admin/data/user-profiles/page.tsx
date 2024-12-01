
import { UserProfileList } from "@/components/userprofile-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",

};
export default function Page() {


  return (
    <UserProfileList />

  )
}

