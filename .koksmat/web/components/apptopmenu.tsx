"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import Link from "next/link";

export default function AppTopMenu(props: {}) {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>MagicApp</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/" className="w-full">
              Open
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/magic/dev" className="w-full">
              Develop
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Services</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/magic/msaltest" className="w-full">
              MSAL Test
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/magic/services" className="w-full">
              Microservices
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
