import AccesspointEditor from "@/components/access-point-form";
import { AccessPointList } from "@/components/access-point-list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Points",

};
export default function Page() {


  return (
    <AccessPointList />
  )
}

