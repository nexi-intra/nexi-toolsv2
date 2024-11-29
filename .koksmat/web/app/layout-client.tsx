"use client"
import { MagicboxProvider } from "@/app/koksmat0/magicbox-providers";
import { MSALWrapper } from "@/app/koksmat0/msal/auth";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ServiceInspector } from "@/app/koksmat0/components/service-inspector";

import { ToastProvider } from "@/components/ui/toast";
import KoksmatClient from "@/components/koksmat-client";
import { KoksmatSessionProvider } from "@/components/koksmat-provider";
import { BreadcrumbProvider } from "@/components/breadcrumb-context";
import { useExampleHook } from "@/components/lookup-provider";

export default function RootLayoutClientSide({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <MagicboxProvider>
      <MSALWrapper>
        <BreadcrumbProvider lookupHandlers={[useExampleHook()]}>
          <KoksmatSessionProvider>
            <div className=" w-full min-w-full min-h-full">
              {children}
            </div>

          </KoksmatSessionProvider>
        </BreadcrumbProvider>
        <TailwindIndicator />
        {/* <ServiceInspector /> */}
        <ToastProvider />
        <KoksmatClient />
      </MSALWrapper>
    </MagicboxProvider>

  );
}
