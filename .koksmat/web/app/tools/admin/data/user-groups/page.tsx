
import UserGroupForm from "@/components/usergroup-form";
import { UserGroupsList } from "@/components/usergroup-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Groups",

};
export default function Page() {


  return (
    <UserGroupsList />
  )
}

