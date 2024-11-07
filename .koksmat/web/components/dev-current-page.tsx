//"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { https } from "@/app/koksmat0/httphelper";
import { LayersIcon, MessageCircleIcon } from "lucide-react";
export default function DevCurrentPage(props: { children: React.ReactNode }) {
  const children = props.children;
  const pathname = usePathname();

  const [pageName, setPageName] = useState("");
  const openInVSCode = async (pageName: string) => {

    const body = JSON.stringify({
      sessionid: "sessionid",
      action: "open",
      command: "code",
      args: [pageName],
    });
    const result = await fetch("/koksmat/api/autopilot/openincode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const j = await result.json();
  };
  useEffect(() => {
    const fetchPageName = async () => {
      const pageInfo = await https<string>(
        "",
        "POST",
        "/koksmat/api/autopilot/pageinfo",
        {
          url: pathname,
        }
      );
      setPageName(pageInfo.data!);
    };

    fetchPageName();
  }, [pathname]);
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div>
      <div
        onClick={() => {

          openInVSCode(pageName);
        }}
      >
        {children}
      </div>
    </div>
  );
}
