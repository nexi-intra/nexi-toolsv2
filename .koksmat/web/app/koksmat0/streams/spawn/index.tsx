"use client";
import { useEffect, useState } from "react";
import { streamProcess } from "@/app/koksmat0/server/streamprocess";

export function StreamSpawnProcess(props: {
  cmd: string;
  args: string[];
  timeout: number;
  cwd?: string;
}) {
  const { cmd, args, timeout, cwd } = props;
  const [processOutput, setProcessOutput] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      const ui = await streamProcess(cmd, args, timeout, { cwd });
      setProcessOutput(ui);
    };
    load();
  }, []);

  return <div>{processOutput}</div>;
}
