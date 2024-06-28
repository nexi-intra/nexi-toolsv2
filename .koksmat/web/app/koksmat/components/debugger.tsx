"use client";
import Tracer from "./tracer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MagicboxContext } from "../magicbox-context";
import { useContext, useEffect } from "react";

export function SwitchTracer() {
  const magicbox = useContext(MagicboxContext);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="showtracer-mode"
        checked={magicbox.showTracer}
        onCheckedChange={magicbox.setShowTracer}
      />
      <Label htmlFor="showtracer-mode">Show tracer</Label>
    </div>
  );
}

export default function Debugger() {
  return (
    <div>
      <SwitchTracer />
      <Tracer />
    </div>
  );
}
