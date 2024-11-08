"use client";
import { Button } from "@/components/ui/button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export function ShowCodeFragment(props: { title: string; code: string }) {
  const { title, code } = props;
  return (
    <div>
      <div className="text-xl my-4 spy-l-2">{props.title}</div>
      <div className="flex">
        <div className="grow overflow-scroll">
          <SyntaxHighlighter language="typescript" style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="p-4">
          <Button
            variant={"outline"}
            onClick={() => {
              navigator.clipboard.writeText(code);
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
