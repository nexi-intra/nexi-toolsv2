

import { UserRoleList } from "@/components/userrole-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Roles",

};
export default function Page() {


  return (
    <UserRoleList />
  )
}

