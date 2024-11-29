"use client";
import { useEffect, useState } from "react";
import { streamProcess } from "@/app/koksmat0/server/streamprocess";

export default function Ping(props: { domain: string; count: number }) {
  const [processOutput, setProcessOutput] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      const ui = await streamProcess(
        "ping",
        ["-c", props.count.toString(), props.domain],
        2,
        {}
      );
      setProcessOutput(ui);
    };
    load();
  }, []);

  return <div>{processOutput}</div>;
}
