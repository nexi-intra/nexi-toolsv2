"use server";

import { getKoksmat } from "./koksmat"; // Adjust the path as necessary

// Koksmat logger levels
type LogLevel = "verbose" | "info" | "warning" | "error" | "fatal";

interface LogInput {
  level: LogLevel;
  moduleType: string;
  args: string[];
  correlationId?: string;
}

export async function koksmatLogServer(input: LogInput): Promise<void> {
  const { level, args, correlationId = `koksmat-log-${Date.now()}` } = input;

  try {
    switch (level) {
      case "verbose":
        await getKoksmat().verbose(correlationId, args.join(" "));
        break;
      case "info":
        await getKoksmat().info(correlationId, args.join(" "));
        break;
      case "warning":
        await getKoksmat().warning(correlationId, args.join(" "));
        break;
      case "error":
        await getKoksmat().error(correlationId, args.join(" "), "");
        break;
      // case "fatal":
      //   await getKoksmat().fatal(correlationId, ...args);
      //   break;
      default:
        await getKoksmat().info(correlationId, args.join(" "));
    }
  } catch (error) {
    console.error(`[ERROR] ${correlationId}: Failed to log message:`, error);
    throw new Error("Failed to log message");
  }
}
