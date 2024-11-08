import { koksmatLogServer } from "@/components/actions/koksmat-logger-server";

function stringifyArg(arg: any): string {
  if (typeof arg === "string") {
    return arg;
  } else if (arg instanceof Error) {
    return `Error: ${arg.message}\nStack: ${arg.stack}`;
  } else if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch (error) {
      return `[Circular or Non-Serializable Object: ${Object.prototype.toString.call(
        arg
      )}]`;
    }
  } else {
    return String(arg);
  }
}

async function kLog(
  level: "verbose" | "info" | "warning" | "error" | "fatal",
  correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  const stringArgs = args.map(stringifyArg);
  await koksmatLogServer({ level, args: stringArgs, correlationId });
}

export async function kVerbose(
  //correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("verbose", "", ...args);
}

export async function kInfo(
  //correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("info", "", ...args);
}

export async function kWarn(
  //correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("warning", "", ...args);
}

export async function kError(
  //correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("error", "", ...args);
}

export async function kVerboseTracking(
  correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("verbose", correlationId, ...args);
}

export async function kInfoTracking(
  correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("info", correlationId, ...args);
}

export async function kWarnTracking(
  correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("warning", correlationId, ...args);
}

export async function kErrorTracking(
  correlationId: string | undefined,
  ...args: any[]
): Promise<void> {
  await kLog("error", correlationId, ...args);
}
