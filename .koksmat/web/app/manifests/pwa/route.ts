import { appName, appShortName } from "@/lib/appName";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    name: appName(),
    short_name: appShortName(),
    description: "Your all-in-one platform for efficient tool management",
    start_url: "/tools/pages/app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    screenshots: [
      {
        src: "/appimages/narrow.png",
        sizes: "710x954",
        type: "image/png",
        form_factor: "narrow",
        label: "productivity",
      },
      {
        src: "/appimages/wide.png",
        sizes: "1560x954",
        type: "image/png",
        form_factor: "wide",
        label: "productivity",
      },
    ],

    icons: [
      {
        src: "/appimages/ios/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/appimages/ios/512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return NextResponse.json(manifest);
}
