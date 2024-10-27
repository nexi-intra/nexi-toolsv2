"use client"
import { MagicboxProvider } from "@/app/koksmat/magicbox-providers";
import { MSALWrapper } from "@/app/koksmat/msal/auth";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ServiceInspector } from "@/app/koksmat/components/service-inspector";

import { ToastProvider } from "@/components/ui/toast";
import KoksmatClient from "@/components/koksmat-client";

export default function RootLayoutClientSide({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <MagicboxProvider>
      <MSALWrapper>
        {children}
        <TailwindIndicator />
        <ServiceInspector />
        <ToastProvider />
        <KoksmatClient />
      </MSALWrapper>
    </MagicboxProvider>

  );
}
