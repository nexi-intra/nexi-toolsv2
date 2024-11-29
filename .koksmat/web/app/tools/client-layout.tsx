"use client";
import { AppProvider } from "@/components/appcontextprovider";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ApplicationRoot } from "@/components/application-root";
import KoksmatSession from "@/components/koksmat-session";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import TabNavigatorWithReorder from "../koksmat/src/v.next/components/tab-navigator-with-reorder";
import ErrorBoundary from "@/components/error-boundary";
import Authenticate, { UserProfileAPI } from "../koksmat/src/v.next/components/authenticate";
import { useIsInIframe } from "@/app/koksmat/src/v.next/components/use-isiniframe"

export default function AppClientLayout(props: { children: any }) {
  const { children } = props;
  const isInIframe = useIsInIframe()
  return (
    <SidebarProvider>
      <AppProvider>
        <ErrorBoundary>
          <Authenticate apiScope={UserProfileAPI}>
            <ApplicationRoot hideBreadcrumb topnav={<TabNavigatorWithReorder />} >

              {children}
              <KoksmatSession />
            </ApplicationRoot>
          </Authenticate>
        </ErrorBoundary>
      </AppProvider>
    </SidebarProvider>
  );
}
