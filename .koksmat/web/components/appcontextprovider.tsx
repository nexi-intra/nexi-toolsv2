"use client";

import { useContext, useEffect, useState } from "react";

import { AppContextType, AppContext } from "./appcontextdefinition";

type Props = {
  children?: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
  const [something, setsomething] = useState("");

  const app: AppContextType = {
    something: "",
    setSomething: function (something: string): void {
      throw new Error("Function not implemented.");
    },
  };

  useEffect(() => {
    const load = async () => {
      setsomething("something");
    };
    load();
  }, []);

  return (
    <AppContext.Provider value={app}>
      <div className="w-full">{children}</div>
    </AppContext.Provider>
  );
};
