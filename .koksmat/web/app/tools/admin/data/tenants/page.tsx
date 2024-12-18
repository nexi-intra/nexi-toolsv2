

import { TenantList } from "@/components/tenant-list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenants",

};

export default function Page() {


  return (
    <TenantList />
  )
}

