"use client";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { run } from "@/app/koksmat0/server";
import BreadcrumbNavigator from "./BreadcrumbNavigator";
import { useContext } from "react";
import { MagicDevContext } from "../contextdefinition";

export function VsCodeEdittoolbar(props: { filePath: string }) {
  const magicdev = useContext(MagicDevContext);
  const { filePath } = props;
  return (
    <div>
      <BreadcrumbNavigator filePath={filePath} />
      <div className="flex">
        <div className="grow"></div>
        <div>
          <Button
            variant="outline"
            onClick={async () => {
              await run("code", [magicdev.root], 10, "");
              await run("code", [magicdev.root + "/" + filePath], 10, "");
            }}
          >
            <EditIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
