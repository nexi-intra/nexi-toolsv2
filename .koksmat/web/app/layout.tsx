import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

import { CLARITY } from "./global";
import RootLayoutClientSide from "./layout-client";

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
        ><RootLayoutClientSide>

            {children}</RootLayoutClientSide>
        </ThemeProvider>
      </body>
    </html>
  );
}
