"use client";

import { useContext, useEffect, useState } from "react";

import { MagicDevContextType, MagicDevContext } from "./contextdefinition";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { getEnvironment } from "./server";

type Props = {
  children?: React.ReactNode;
};

export const MagicDevProvider = ({ children }: Props) => {
  const [root, setroot] = useState("");

  const magicdev: MagicDevContextType = {
    root,
    setRoot: function (root: string): void {
      setroot(root);
    },
  };

  useEffect(() => {
    const load = async () => {
      const devEnvironment = await getEnvironment();

      setroot(devEnvironment.root);
    };
    load();
  }, []);

  return (
    <MagicDevContext.Provider value={magicdev}>
      <div>{children}</div>
    </MagicDevContext.Provider>
  );
};
