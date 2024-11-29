"use client";

import { useContext, useEffect, useMemo, useState } from "react";

import { run } from "@/app/koksmat0/magicservices";
import { Result } from "./httphelper";
import { MagicboxContext } from "./magicbox-context";

export const version = 1;

export function useSQLSelect2<T>(servicename: string, sql: string) {
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState("");
  const [didRun, setdidRun] = useState(false);
  const magicbox = useContext(MagicboxContext);
  const [items, setItems] = useState<T[]>([]);
  const dataset = useMemo<T[]>(() => {
    return items;
  }, [items]);

  useEffect(() => {
    //debugger;
    const load = async () => {
      //debugger;
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
      if (result.hasError) {
        if (result.errorMessage === "503") {
          result.errorMessage = "Service unavailable";
        }
        seterror(result.errorMessage ?? "Unknown error");

        return;
      } else {
        if (result.data) {
          const d: any = result.data;
          setItems(d.Result);
        }
      }
    };
    if (servicename && sql) {
      load();
    }
  }, [servicename, sql]);

  return {
    error,
    isLoading,
    dataset,
  };
}
