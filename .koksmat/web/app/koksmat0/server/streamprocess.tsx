"use server";

import { createStreamableUI } from "ai/rsc";

import { SpawnOptionsWithoutStdio, spawn } from "child_process";
import { is } from "date-fns/locale";

type StreamEventHandler = (data: string) => Promise<React.ReactNode>;
export interface ProcessOptions {
  cwd?: string;
}

export async function streamProcess(
  command: string,
  args: string[],
  timeout: number,
  options?: ProcessOptions
) {
  const { cwd } = options || {};
  const processUI = createStreamableUI();
  let isOpen: boolean = true;
  const runProcess = () => {
    {
      let stdoutput = "";
      let stderror = "";

      const timer = setTimeout(() => {
        processHandler.kill();

        processUI.done(<div>Timeout</div>);
      }, timeout * 1000);

      const options: SpawnOptionsWithoutStdio = { env: process.env, cwd };

      console.log("runProcess", command, args);
      const processHandler = spawn(command, args, options);

      processHandler.stdout.on("data", async (data) => {
        const text = data.toString();
        stdoutput += text;

        processUI.append(<div>{text}</div>);
      });

      processHandler.stderr.on("data", async (data) => {
        const text = data.toString();

        processUI.append(<div className="text-red-500">{text}</div>);

        stderror += text;
      });

      processHandler.on("error", async (error) => {
        processUI.append(<div className="text-red-500">{error.message}</div>);

        stderror += error.message;
      });
      // Listen for exit event
      processHandler.on("exit", (code, signal) => {
        if (code !== null) {
          processUI.append(
            <div className="text-red-500">{`Child process exited with code ${code}`}</div>
          );
        } else if (signal !== null) {
          processUI.append(
            <div className="text-red-500">{`Child process was killed with signal ${signal}`}</div>
          );
        } else {
          processUI.append(
            <div className="text-red-500">{"Child process exited"}</div>
          );
        }
      });
      processHandler.on("close", async (code) => {
        console.log("close", code, command, args);
        if (isOpen) {
          try {
            processUI.done();
          } catch (e) {
            console.log("error in processUI.done", e);
          }
          isOpen = false;
        }
      });
    }
  };

  runProcess();

  return processUI.value;
}
