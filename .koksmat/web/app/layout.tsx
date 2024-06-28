"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import type { Metadata } from "next";
import "./globals.css";
import { MagicboxProvider } from "@/app/koksmat/magicbox-providers";
import { MSALWrapper } from "@/app/koksmat/msal/auth";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { ServiceInspector } from "@/app/koksmat/components/service-inspector";

import { ToastProvider } from "@/components/ui/toast";
import { CLARITY } from "./global";

export default function RootLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script id="clarityinjection">
          {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${CLARITY}");            
            `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MagicboxProvider>
            <MSALWrapper>
              {children}
              <TailwindIndicator />
              <ServiceInspector />
              <ToastProvider />
            </MSALWrapper>
          </MagicboxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
