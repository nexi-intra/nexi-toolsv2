import path from "path";
import { cwd } from "process";
import fs from "fs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { VsCodeEdittoolbar } from "../components/VsCodeEdittoolbar";
import { AppMap, LeafTree, Leaf } from "../components/appnavigator";
import BreadcrumbNavigator from "../components/BreadcrumbNavigator";

const loadFiles = (folderPath: string) => {
  const leafs: Leaf[] = [];
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      leafs.push({
        name: file.name,
        type: "folder",
        path: path.join(folderPath, file.name),
        children: loadFiles(path.join(folderPath, file.name)),
      });
    } else {
      return;
      switch (file.name) {
        case "page.tsx":
          leafs.push({
            name: file.name,
            type: "page",
            path: path.join(folderPath, file.name),
            children: [],
          });
          break;
        case "layout.tsx":
          leafs.push({
            name: file.name,
            type: "layout",
            path: path.join(folderPath, file.name),
            children: [],
          });
          break;
        default:
          break;
      }
    }
  });
  return leafs;
};
export default function Layout(props: { children: any }) {
  const { children } = props;
  const folderPath = path.join(cwd(), "app");
  if (process.env.NODE_ENV === "production")
    return (
      <div className="text-orange-400">Only works in development mode</div>
    );

  const appPath = path.join(cwd(), "app");

  const pagemap: AppMap = {
    name: "infocast",
    leafs: loadFiles(appPath),
  };

  return (
    <div>
      <div className="p-10">
        <h1 className="text-2xl">Web App</h1>
        {/* <div>{folderPath}</div> */}
        <div className="flex">
          <div className="hidden lg:block lg:w-1/4">
            <LeafTree leafs={pagemap.leafs} appName="magic-master" />
          </div>
          <div className="lg:hidden ">
            <Sheet>
              <SheetTrigger>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="left">
                <LeafTree leafs={pagemap.leafs} appName="magic-master" />
              </SheetContent>
            </Sheet>
          </div>
          <div className=" grow"></div>
          <div className="bg-slate-400 container p-1 border rounded-2xl lg:w-3/4">
            <div className="bg-white p-10 dark:bg-black border rounded-2xl  ">
              <BreadcrumbNavigator filePath={"/sdf/sdf"} />
              {children}
            </div>
          </div>
          <div className=" grow"></div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
}
