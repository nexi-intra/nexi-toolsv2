"use client";

import { useContext, useEffect, useState } from "react";

import { run } from "@/app/koksmat0/magicservices";
import { Result } from "./httphelper";
import { MagicboxContext } from "./magicbox-context";

export const version = 1;

export function useSQLSelect<T>(
  servicename: string,
  sql: string,

  setran?: (ran: boolean) => void,
  setresult?: (result: Result<T>) => void,
  debug?: boolean
) {
  const [data, setdata] = useState<T>();
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState("");
  const [didRun, setdidRun] = useState(false);
  const magicbox = useContext(MagicboxContext);

  useEffect(() => {
    //debugger;
    const load = async () => {
      if (didRun) return;
      setisLoading(true);
      seterror("");
      const calledTimestamp = new Date();

      const result = await run<T>(servicename, ["select", sql], "", 600, "x");
      magicbox.logServiceCall({
        calledTimestamp,
        responedTimestamp: new Date(),
        request: {
          args: ["select", sql],
          body: "",
          channel: servicename,
          timeout: 600,
        },
        servicename,
        response: result,
        transactionId: "x",
      });
      setdidRun(true);
      setisLoading(false);
      if (setresult) {
        setresult(result);
      }
      if (result.hasError) {
        if (result.errorMessage === "503") {
          result.errorMessage = "Service unavailable";
        }
        seterror(result.errorMessage ?? "Unknown error");

        return;
      } else {
        setdata(result.data);
      }
    };
    if (servicename && sql) {
      load();
    }
  }, [servicename, sql]);

  return {
    data,
    error,
    isLoading,
  };
}
