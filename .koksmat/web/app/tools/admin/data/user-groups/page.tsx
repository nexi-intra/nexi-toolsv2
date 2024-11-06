
import UserGroupEditor from "@/components/form-usergroup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Groups",

};
export default function Page() {


  return (
    <UserGroupEditor />
  )
}

