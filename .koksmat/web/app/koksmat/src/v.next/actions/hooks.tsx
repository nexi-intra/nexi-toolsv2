"use client";
import React, { useEffect, useState } from "react";

import { generateMethods } from "@/actions/client";
import { run } from "./server";

const servicename = "magic-mix.app";

async function sqlSelect<T>(databasename: string, sql: string) {
  const result = await run<T>(
    servicename,
    ["query", databasename, sql],
    "",
    600,
    "x"
  );
  return result;
}

export function useItem<T>(database: string, table: string, recordId: string) {
  const [record, setrecord] = useState<T>();
  const [error, seterror] = useState("");
  useEffect(() => {
    const load = async () => {
      const record = await sqlSelect<T>(
        database,
        `select * from ${table} where id = ${recordId} and deleted_at is null`
      );

      if (record.errorMessage) {
        seterror(record.errorMessage);
      } else {
        setrecord(record.data);
      }
    };
    if (!recordId) return;
    load();
  }, [recordId]);

  return { record, error };
}

export function useItems<T>(database: string, table: string) {
  const [record, setrecord] = useState<T[]>();
  const [error, seterror] = useState("");
  useEffect(() => {
    const load = async () => {
      const record = await sqlSelect<T[]>(
        database,
        `select * from ${table} deleted_at is null order by name`
      );

      if (record.errorMessage) {
        seterror(record.errorMessage);
      } else {
        setrecord(record.data);
      }
    };

    load();
  }, []);

  return { record, error };
}
