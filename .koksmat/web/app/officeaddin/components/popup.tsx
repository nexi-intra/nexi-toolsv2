"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { formattedMoney } from "@/app/koksmat0/formats";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useEffect, useState } from "react";

type PopupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toogleOpen: () => void;
};
export function Popup(props: PopupProps): JSX.Element {
  const { children, title, isOpen, toogleOpen } = props;

  return (
    <Sheet defaultOpen={true} onOpenChange={toogleOpen}>
      {/* <SheetTrigger asChild>
          <Button variant={"link"}>
            View 
          </Button>
        </SheetTrigger> */}
      <SheetContent side="bottom" className=" bg-slate-200">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="max-h-[80vh] min-h-[80vh] overflow-scroll">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
