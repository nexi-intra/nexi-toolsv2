"use client";
import React, { useContext, useEffect, useState } from "react";

import { generateMethods } from "@/actions/client";
import { getRecord, getRecords } from "./server";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";

const servicename = "magic-mix.app";

// async function sqlSelect<T>(databasename: string, sql: string, accessToken:string) {
//   const result = await runServerAction<T>(
//     servicename,
//     ["query", databasename, sql],
//     "",
//     600,
//     accessToken 
//   );
//   return result;
// }

export function useItem<T>(database: string, table: string, recordId: string) {
  const magicbox = useContext(MagicboxContext);
  const [record, setrecord] = useState<T>();
  const [error, seterror] = useState("");
  useEffect(() => {
    const load = async () => {
      const record = await getRecord<T>(
        table,
        recordId,
        magicbox.authtoken
      );

      if (record?.errorMessage) {
        seterror(record.errorMessage);
      } else {
        setrecord(record?.data);
      }
    };
    if (!recordId) return;
    load();
  }, [recordId]);

  return { record, error };
}

export function useItems<T>(database: string, table: string) {
  const magicbox = useContext(MagicboxContext);
  const [record, setrecord] = useState<T[]>();
  const [error, seterror] = useState("");
  useEffect(() => {
    const load = async () => {

      const record = await getRecords<T[]>(
        table,

        magicbox.authtoken
      );


      if (record?.errorMessage) {
        seterror(record.errorMessage);
      } else {
        if (record !== null && record !== undefined) setrecord(record.data);
      }
    };

    load();
  }, []);

  return { record, error };
}
