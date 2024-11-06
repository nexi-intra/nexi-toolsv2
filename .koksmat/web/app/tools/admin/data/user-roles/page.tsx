
import UserRoleEditor from "@/components/form-userrole";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Roles",

};
export default function Page() {


  return (
    <UserRoleEditor />
  )
}

