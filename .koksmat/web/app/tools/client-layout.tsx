"use client";
import { useContext } from "react";
import { AppProvider } from "@/components/appcontextprovider";
import AppLeftRail from "@/components/appleftrail";
import AppTopMenu from "@/components/apptopmenu";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Tracer from "@/app/koksmat0/components/tracer";

import { leftRailApps } from "../../components/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicationRoot } from "@/components/application-root";
import KoksmatSession from "@/components/koksmat-session";
import { BreadcrumbProvider } from "@/components/breadcrumb-context";
import { useExampleHook } from "@/components/lookup-provider";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import { KoksmatDatabaseProvider } from "../koksmat/src/v.next/components/database-context-provider";
import { MessageToKoksmatDatabase } from "../koksmat/src/v.next/endpoints/database-messages-client";
import TabNavigatorWithReorder from "../koksmat/src/v.next/components/tab-navigator-with-reorder";
export default function AppClientLayout(props: { children: any }) {
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
        <ApplicationRoot hideBreadcrumb topnav={<TabNavigatorWithReorder />} >

          <KoksmatDatabaseProvider initialMessageProvider={new MessageToKoksmatDatabase(async () => "NEED REAL TOKEN HERE")}>

            <GlobalBreadcrumb />
            <div className="w-ful">

              {children}
            </div>

            <KoksmatSession />
          </KoksmatDatabaseProvider>
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
