"use client";

import { useContext, useEffect, useMemo, useState } from "react";

import { run } from "@/app/koksmat0/magicservices";
import { Result } from "./httphelper";
import { MagicboxContext } from "./magicbox-context";
import { stat } from "fs";

export const version = 1;

export function useService<T>(
  servicename: string,
  args: string[],
  body: string,
  timeout: number,
  transactionid: string,

  //setran?: (ran: boolean) => void,
  //setresult?: (result: Result<T>) => void,
  debug?: boolean
) {
  const [data, setdata] = useState<T>();
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState("");
  const [didRun, setdidRun] = useState(false);
  const magicbox = useContext(MagicboxContext);
  const status = useMemo(() => {
    return { running: false, key: "" };
  }, []);
  const timing = useMemo(() => {
    return { calledTimestamp: new Date() };
  }, [servicename, timeout, args, transactionid]);
  useEffect(() => {
    const load = async () => {
      const key = transactionid + servicename + args.join(",");

      console.log("useService load", transactionid, servicename, args, status);
      if (status.key === key) return;
      //if (status.running) return;
      setisLoading(true);
      status.running = true;

      status.key = key;
      //debugger;
      //if (didRun) return;

      seterror("");
      console.log(
        "useService step 1",
        transactionid,
        servicename,
        args,
        status
      );

      const result = await run<T>(
        servicename,
        args,
        body,
        timeout,
        transactionid
      );
      magicbox.logServiceCall({
        calledTimestamp: timing.calledTimestamp,
        responedTimestamp: new Date(),
        request: {
          args,
          body,
          channel: servicename,
          timeout,
        },
        servicename,
        response: result,
        transactionId: transactionid,
      });
      console.log(
        "useService step 2",
        transactionid,
        servicename,
        args,
        status
      );

      status.running = false;
      setisLoading(false);
      // if (setresult) {
      //   setresult(result);
      // }
      if (result.hasError) {
        if (result.errorMessage === "503") {
          result.errorMessage = "Service unavailable";
        }
        seterror(result.errorMessage ?? "Unknown error");
      } else {
        setdata(result.data);
      }
    };
    if (transactionid && servicename && timeout) {
      load();
    }
  }, [servicename, timeout, args, transactionid]);

  return {
    data,
    error,
    isLoading,
  };
}
