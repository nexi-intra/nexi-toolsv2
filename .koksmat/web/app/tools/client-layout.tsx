"use client";
import { AppProvider } from "@/components/appcontextprovider";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ApplicationRoot } from "@/components/application-root";
import KoksmatSession from "@/components/koksmat-session";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import TabNavigatorWithReorder from "../koksmat/src/v.next/components/tab-navigator-with-reorder";
import ErrorBoundary from "@/components/error-boundary";
import Authenticate, { UserProfileAPI } from "../koksmat/src/v.next/components/authenticate";
export default function AppClientLayout(props: { children: any }) {
  const { children } = props;
  // const magicbox = useContext(MagicboxContext);
  // if (!magicbox.user) {
  //   return (

  //     <div className="flex h-screen">
  //       <div className="grow"></div>
  //       <div className="flex flex-col">
  //         <div className="grow"></div>
  //         <div>
  //           {" "}
  //           <Button
  //             onClick={async () => {
  //               const signedIn = await magicbox.signIn(["User.Read"], "");

  //               magicbox.refresh();
  //             }}
  //           >
  //             Sign In using Microsoft 365 account
  //           </Button>
  //         </div>
  //         <div className="grow"></div>
  //       </div>
  //       <div className="grow"></div>
  //     </div>

  //   );
  // }
  return (
    <SidebarProvider>
      <AppProvider>
        <ErrorBoundary>
          <Authenticate apiScope={UserProfileAPI}>
            <ApplicationRoot hideBreadcrumb topnav={<TabNavigatorWithReorder />} >
              <GlobalBreadcrumb />
              {children}
              <KoksmatSession />
            </ApplicationRoot>
          </Authenticate>
        </ErrorBoundary>
      </AppProvider>
    </SidebarProvider>
  );
}
