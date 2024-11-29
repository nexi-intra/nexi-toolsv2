"use client";

import { useState } from "react";

import { useProcess } from "@/app/koksmat0/useprocess";
import { Button, ButtonProps } from "@/components/ui/button";
import { Popup } from "@/app/officeaddin/components/popup";

function Run(props: {
  cmd: string;
  args: string[];
  channelname?: string;
  timeout?: number;
}) {
  const { cmd, args, channelname, timeout } = props;
  const { isLoading, error, data } = useProcess(
    props.cmd,
    props.args,
    props.timeout ?? 30,
    props.channelname ?? "echo"
  );
  return (
    <div>
      {isLoading && <div>Loading...</div>}

      {error && <pre className="text-red-700">{error}</pre>}
      {/* <div className="p-8" dangerouslySetInnerHTML={{ __html: data }}></div> */}
      <pre className="p-20">{data}</pre>
    </div>
  );
}

export interface ButtonRunProps extends ButtonProps {
  children: React.ReactNode;
  title: string;
  cmd: string;
  args: string[];
  channelname?: string;
  timeout?: number;
  showOutput?: boolean;
}
export function ButtonRunServerCmd(props: ButtonRunProps) {
  const { cmd, args, title, children, channelname, showOutput, timeout } =
    props;
  const [isOpen, setisOpen] = useState(false);
  return (
    <div>
      <Button {...props} onClick={() => setisOpen(true)}>
        {children}
      </Button>
      {isOpen && (
        <Popup
          isOpen={isOpen}
          toogleOpen={() => {
            setisOpen(!isOpen);
          }}
          title={title}
        >
          <div>
            <Run
              cmd={cmd}
              args={args}
              timeout={timeout}
              channelname={channelname}
            />
          </div>
        </Popup>
      )}
    </div>
  );
}
