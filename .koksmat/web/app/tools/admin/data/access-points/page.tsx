import AccesspointEditor from "@/components/form-access-point";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Points",

};
export default function Page() {


  return (
    <AccesspointEditor />
  )
}

