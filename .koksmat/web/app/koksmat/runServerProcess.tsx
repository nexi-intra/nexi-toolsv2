"use client";
import { useEffect, useState } from "react";
import { streamProcess } from "./server/streamprocess";

export default function ServerProcess(props: { count: number }) {
  const [processOutput, setProcessOutput] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      const ui = await streamProcess(
        "ping",
        ["-c", props.count.toString(), "google.com"],
        200,
        {}
      );
      setProcessOutput(ui);
    };
    load();
  }, []);

  return <div>{processOutput}</div>;
}
