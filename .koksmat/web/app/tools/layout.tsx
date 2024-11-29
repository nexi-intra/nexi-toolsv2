import { APPNAME } from "../global";
import AppClientLayout from "./client-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://tools.intra.nexigroup.com"
  ),
  title: {
    template: "%s | Nexi Tools",
    default: "Nexi Tools",
  },
  openGraph: {
    title: "Nexi Tools",
    description: "Nexi tools provide access to your tools",
    images: [
      {
        url: "/" + APPNAME + "/og",
        width: 1200,
        height: 600,

        alt: "Koksmat image",
      },
    ],
  },

  applicationName: "Koksmat Studio",
  referrer: "origin-when-cross-origin",
  keywords: ["no code", "low code", "power apps", "power automate"],
  creator: "Niels Gregers Johansen",
  publisher: "Niels Gregers Johansen",
  description: "Nexi tools provide access to your tools",
};
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppClientLayout>
      {children}
    </AppClientLayout>
  );
}
