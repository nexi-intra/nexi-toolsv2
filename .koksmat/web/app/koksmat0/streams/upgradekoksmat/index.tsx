"use client";
import { useEffect, useState } from "react";
import { streamProcess } from "@/app/koksmat0/server/streamprocess";

export default function UpgradeKoksmat() {
  const [processOutput, setProcessOutput] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      const ui = await streamProcess(
        "go",
        ["install", "github.com/koksmat-com/koksmat@v2.1.5.19"],
        2,
        {}
      );
      setProcessOutput(ui);
    };
    load();
  }, []);

  return <div>{processOutput}</div>;
}
