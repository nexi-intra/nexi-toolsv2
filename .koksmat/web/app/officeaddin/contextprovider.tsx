"use client";

import { useContext, useEffect, useState } from "react";

import { useProcess } from "@/app/koksmat0/useprocess";

import { Context, ContextProps, Options } from "./context";
import { IView } from "./components/viewcards";
import Script from "next/script";
import { OfficeX } from "./office";

type Props = {
  children?: React.ReactNode;
  rootPath: string;

  isLocalEnv: boolean;
};

export const ContextProvider = ({ children, rootPath, isLocalEnv }: Props) => {
  const [options, setoptions] = useState<Options>({
    showContext: true,
    showNavigation: false,
  });

  const [isloaded, setisloaded] = useState(false);
  const [workspaces, setworkspaces] = useState<IView[]>([]);
  const [loadedOffice, setloadedOffice] = useState(false);
  const [hosttype, sethosttype] = useState<Office.HostType>();
  const [platformtype, setplatformtype] = useState<Office.PlatformType>();
  useEffect(() => {
    const load = async () => {
      setisloaded(true);
    };
    load();
  }, []);

  const koksmat: ContextProps = {
    hosttype,
    platformtype,
    isloaded,
    workspaces,
    options,
    setOptions: function (changes: Options): void {
      setoptions({ ...options, ...changes });
    },
    rootPath,
  };

  return (
    <Context.Provider value={koksmat}>
      <Script
        id="beforeloadOffice"
        dangerouslySetInnerHTML={{
          __html:
            "window._replaceState = window.replaceState;window._history = window.history;",
        }}
      />

      <Script
        type="text/javascript"
        src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"
        crossOrigin="anonymous"
        defer={false}
        onLoad={() => {
          Office.onReady((callback) => {
            sethosttype(callback.host);
            setplatformtype(callback.platform);
            console.log(callback.host);
            console.log(callback.platform);
            setisloaded(true);
            setloadedOffice(true);
          });
        }}
      />
      {loadedOffice && (
        <Script
          id="afterloadOffice"
          dangerouslySetInnerHTML={{
            __html:
              "window.replaceState = window._replaceState;window.history = window._history;",
          }}
        />
      )}

      <OfficeX loaded={loadedOffice} />
      {children}
    </Context.Provider>
  );
};
