"use client";

import React, { use, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { set } from "date-fns";
import { Search } from "lucide-react";

import { useProcess } from "@/app/koksmat0/useprocess";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//import { KoksmatContext } from "../context"
import { PopUp } from "./popup2";

export interface IView {
  id?: string;
  name: string;
  description?: string;
  isHTML?: boolean;
  isCurrent?: boolean;
  url?: string;
  link?: string;
  data?: any;
}

function genericConverter<T extends IView>(data: string): T[] {
  if (!data) return [];
  return JSON.parse(data) as T[];
}

export default function ViewCards<T extends IView>(props: {
  items?: T[];
  cmd: string;
  args: string[];
  converter?: (data: string) => T[];
  onClick?: (item: T) => void;
  onAddNew?: () => void;
  debug?: boolean;
}) {
  const { onAddNew, cmd, args, debug } = props;
  const { isLoading, error, data } = useProcess(
    cmd,
    args,
    20,
    "echo",
    undefined,
    false,
    undefined,
    undefined,
    debug
  );
  const [selected, setselected] = useState<T>();
  const [items, setitems] = useState<T[]>([]);
  const [errorMessage, seterrorMessage] = useState("");
  const [showDetails, setshowDetails] = useState(false);
  const [filter, setfilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (props.converter) {
          setitems(props.converter(data));
          return;
        }

        setitems(genericConverter<T>(data));
      } catch (error) {
        seterrorMessage(error ? JSON.stringify(error) : "Unknown error");
      }
    };
    if (debug) debugger;
    if (error) seterrorMessage(error);
    if (!data) return;

    load();
  }, [data, error]);

  useEffect(() => {
    if (!props.items) return;
    setitems(props.items);
  }, [props.items]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}

      {error && <pre className="text-red-700">{error}</pre>}
      <div className="flex space-x-2 p-8">
        <form className="grow">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              onChange={(e) => {
                setfilter(e.target.value);
              }}
              value={filter}
            />
          </div>
        </form>
        {onAddNew && <Button variant="default">Add New</Button>}
      </div>
      <div className=" items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3 ">
        {items
          .filter(
            (item) =>
              item.name.toLowerCase().includes(filter.toLowerCase()) ||
              (item.description ?? "")
                .toLowerCase()
                .includes(filter.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item: T, ix) => (
            <Card key={ix} className={item.isCurrent ? "bg-green-400" : ""}>
              <CardHeader>
                <CardTitle className="text-2xl">{item.name}</CardTitle>
                {item.description && (
                  <CardDescription> {item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p></p>
              </CardContent>
              <CardFooter>
                <div className="space-x-3">
                  {props.onClick && (
                    <Button
                      onClick={() => {
                        if (props.onClick) props.onClick(item);
                      }}
                    >
                      Select
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setselected(item);
                      setshowDetails(true);
                    }}
                  >
                    Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
      <PopUp
        show={showDetails}
        onClose={() => setshowDetails(false)}
        title={selected?.name ?? "Details"}
        description={""}
      >
        <pre>{JSON.stringify(selected, null, 2)}</pre>
        {selected?.link && (
          <Link href={selected.link}>
            <Button variant="secondary">Link</Button>
          </Link>
        )}

        {selected?.url && (
          <Link target="_blank" href={selected.url}>
            <Button variant={"link"}>Browse</Button>
          </Link>
        )}
      </PopUp>
    </div>
  );
}
