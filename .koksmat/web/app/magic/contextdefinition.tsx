"use client";
import { createContext } from "react";

export type MagicDevContextType = {
  root: string;
  setRoot: (root: string) => void;
};
export const MagicDevContext = createContext<MagicDevContextType>({
  root: "",
  setRoot: function (root: string): void {
    throw new Error("Function not implemented.");
  },
});
