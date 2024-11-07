"use client";

import React, { use, useContext, useEffect, useState } from "react";
import { set } from "date-fns";

import { Result } from "@/app/koksmat0/httphelper";
import { useProcess } from "@/app/koksmat0/useprocess";

import { MessageType } from "../server/MessageType";
import { Button } from "@/components/ui/button";

interface RunServerProcessProps {
  cmd: string;
  ran?: boolean;
  setran?: (ran: boolean) => void;
  showDebug?: boolean;
  args: string[];
  timeout: number;
  channelname: string;
  cwd?: string;
  caption?: string;
  onMessage?: (data: MessageType) => void;
  onData?: (data: string) => void;
  onError?: (errorMessage: string) => void;
  setresult?: (result: Result<string>) => void;
}

export default function RunServerProcess(props: RunServerProcessProps) {
  const {
    cmd,
    args,
    timeout,
    channelname,
    cwd,
    onMessage,
    onData,
    onError,
    ran,
    setran,
    showDebug,
  } = props;
  const { isLoading, error, data } = useProcess(
    cmd,
    args,
    timeout,
    channelname,
    cwd,

    props.ran,
    props.setran,
    props.setresult
  );

  const [showTrace, setshowTrace] = useState(false);
  const [showCmd, setshowCmd] = useState(false);
  const [showDebugForThis, setshowDebugForThis] = useState(false);

  useEffect(() => {
    if (data && onData) {
      onData(data);
    }
    if (error && onError) {
      onError(error);
    }
  }, [data, error]);

  return (
    <div>
      {showDebugForThis && (
        <div>
          {isLoading && <div>Loading...</div>}

          <div className="mb-4 mr-4 mt-[-10px] flex bg-slate-100 p-4">
            <div className="font-bold">Server script: {props.caption}</div>

            <div className="grow"></div>

            <Button
              variant={"default"}
              onClick={() => setshowTrace(!showTrace)}
            >
              {showTrace ? "Hide Terminal" : "Show Terminal"}
            </Button>
          </div>
          {error && <div className="m-3 text-red-700">{error}</div>}
        </div>
      )}
      {showTrace && (
        <div>
          <div className="flex">
            {ran ? (
              <Button
                variant={"link"}
                onClick={() => {
                  if (setran) setran(false);
                }}
              >
                Run again
              </Button>
            ) : (
              <div></div>
            )}

            <Button variant={"link"} onClick={() => setshowCmd(!showCmd)}>
              {showCmd ? "Hide cmd" : "Show cmd"}
            </Button>
          </div>
          {showCmd && (
            <div>
              <textarea
                className="h-[300px] w-[800px]"
                value={cmd + " " + args.join(" ")}
              ></textarea>{" "}
              <pre>{cwd}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
