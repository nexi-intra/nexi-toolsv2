"use client";
import { createContext } from "react";

export type AppContextType = {
  something: string;
  setSomething: (something: string) => void;
};
export const AppContext = createContext<AppContextType>({
  something: "",
  setSomething: function (something: string): void {
    throw new Error("Function not implemented.");
  },
});
