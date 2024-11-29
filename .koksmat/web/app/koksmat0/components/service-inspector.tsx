import { useEffect, useState } from "react";
import DebuggerSheet from "./DebuggerSheet";
import { cn } from "@/lib/utils";
import { Toolbar } from "./toolbar";

export function ServiceInspector() {
  const [open, setopen] = useState(false);
  const [leaving, setleaving] = useState(false);
  useEffect(() => {
    let second: NodeJS.Timeout;
    if (leaving && open) {
      second = setTimeout(() => {
        setopen(false);
      }, 500);
    }

    return () => {
      clearTimeout(second);
    };
  }, [open, leaving]);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      style={{ bottom: "20px" }}
      onMouseLeave={() => {
        setleaving(true);
      }}
      onMouseEnter={() => {
        setopen(true);
        setleaving(false);
      }}
      className={`transition duration-150 ease-in-out fixed z-50 flex h-6  items-center flex justify-center rounded-full
        p-3 font-mono text-xs text-white bottom-1 right-10  ${
          open ? "w-48" : "w-6"
        } transition-all duration-1000`}
    >
      {open ? <Toolbar /> : <div className="text-center">🔧</div>}
    </div>
  );
}
