"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Debugger from "@/app/koksmat0/components/debugger";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";
import { useContext } from "react";

export default function DebuggerSheet() {
  const magicbox = useContext(MagicboxContext);
  return (
    <div>
      <Sheet>
        <SheetTrigger>M</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Debugger</SheetTitle>
          </SheetHeader>

          <Debugger />
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
