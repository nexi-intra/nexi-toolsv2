"use client";
import { cn } from "@/app/koksmat0/utils";

import { usePathname } from "next/navigation";
export interface AppMap {
  name: string;

  leafs: Leaf[];
}
export interface Leaf {
  name: string;
  path: string;
  children: Leaf[];
  type: "page" | "layout" | "folder";
}
export function LeafTree(props: { leafs: Leaf[]; appName: string }) {
  const { leafs } = props;
  const pathname = usePathname();
  return (
    <div className="mr-4">
      {leafs
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .map((leaf) => {
          return (
            <div key={leaf.name}>
              <div className="my-2">{leaf.name}</div>
              <ul className="ml-2">
                {leaf.children
                  .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                  })
                  .map((leaf) => {
                    if (leaf.type === "folder") {
                      return (
                        <li key={leaf.name}>
                          <a
                            className={cn(
                              "hover:underline",
                              pathname === leaf.path ? "font-bold" : ""
                            )}
                            href={leaf.path}
                          >
                            {leaf.name}
                          </a>
                          <div className="ml-2">
                            <LeafTree
                              leafs={leaf.children}
                              appName={props.appName}
                            />
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={leaf.name}>
                        <a
                          className={cn(
                            "hover:underline",
                            pathname === leaf.path ? "font-bold" : ""
                          )}
                          href={leaf.path}
                        >
                          {leaf.name}
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
