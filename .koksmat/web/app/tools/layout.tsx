"use client";
import { useContext } from "react";
import { AppProvider } from "@/components/appcontextprovider";
import AppLeftRail from "@/components/appleftrail";
import AppTopMenu from "@/components/apptopmenu";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Tracer from "@/app/koksmat/components/tracer";

import { leftRailApps } from "../../components/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicationRoot } from "@/components/application-root";
import KoksmatSession from "@/components/koksmat-session";
export default function Layout(props: { children: any }) {
  const { children } = props;
  const magicbox = useContext(MagicboxContext);
  if (!magicbox.user) {
    return (

      <div className="flex h-screen">
        <div className="grow"></div>
        <div className="flex flex-col">
          <div className="grow"></div>
          <div>
            {" "}
            <Button
              onClick={async () => {
                const signedIn = await magicbox.signIn(["User.Read"], "");

                magicbox.refresh();
              }}
            >
              Sign In using Microsoft 365 account
            </Button>
          </div>
          <div className="grow"></div>
        </div>
        <div className="grow"></div>
      </div>

    );
  }
  return (
    <SidebarProvider>
      <AppProvider>
        <ApplicationRoot hideBreadcrumb  >

          {children}
          <KoksmatSession />
        </ApplicationRoot>
        {/*         
        <div className="flex min-h-[calc(100vh-80px)]">
       
          <div className="grow bg-slate-50 dark:bg-slate-800"></div>
          <div className="container p-8">

            {children}</div>
          <div className="grow  bg-slate-50  dark:bg-slate-800"></div>
          <div className="hidden md:block">
            {magicbox.showTracer && <Tracer />}
          </div>
        </div>
        <div className=""></div> */}
      </AppProvider>
    </SidebarProvider>
  );
}
