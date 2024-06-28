"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { useContext } from "react";
import { AppProvider } from "@/components/appcontextprovider";
import AppLeftRail from "@/components/appleftrail";
import AppTopMenu from "@/components/apptopmenu";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Tracer from "@/app/koksmat/components/tracer";

import { leftRailApps } from "../../components/navigation";
export default function Layout(props: { children: any }) {
  const { children } = props;
  const magicbox = useContext(MagicboxContext);
  if (!magicbox) {
    return <div>no magicbox</div>;
  }
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
    <AppProvider>
      <div className="flex bg-[#2D32A9] h-[80px]">
        <div className="hidden md:block w-14 "></div>
        <div className="p-2 text-white font-extralight text-2xl  md:text-4xl mt-3 ml-10 md:mt-2 md:ml-0 w-full">
          <div className="flex">
            <div>
              <Link href="/">{"master"}</Link>
            </div>
            <div className="grow"></div>
            <div>
              <div className="text-lg right-0">{magicbox?.user?.name}</div>
              <div className="text-sm  right-0">{magicbox?.user?.email}</div>
            </div>
          </div>
        </div>
        $$
      </div>
      <div className="flex min-h-[calc(100vh-80px)]">
        <div className="hidden md:block">
          <AppLeftRail {...leftRailApps} />
        </div>
        <div className="grow bg-slate-50 dark:bg-slate-800"></div>
        <div className="container p-8">{children}</div>
        <div className="grow  bg-slate-50  dark:bg-slate-800"></div>
        <div className="hidden md:block">
          {magicbox.showTracer && <Tracer />}
        </div>
      </div>
      <div className=""></div>
    </AppProvider>
  );
}
