"use server";

import createKoksmat from "./koksmat";

// Initialize Koksmat
const koksmat = createKoksmat({ retentionMinutes: 120 });

// Koksmat logger levels
type LogLevel = "verbose" | "info" | "warning" | "error" | "fatal";

interface LogInput {
  level: LogLevel;
  args: string[];
  correlationId?: string;
}

export async function koksmatLogServer(input: LogInput): Promise<void> {
  const { level, args, correlationId = `koksmat-log-${Date.now()}` } = input;

  try {
    switch (level) {
      case "verbose":
        await koksmat.verbose(correlationId, ...args);
        break;
      case "info":
        await koksmat.info(correlationId, ...args);
        break;
      case "warning":
        await koksmat.warning(correlationId, ...args);
        break;
      case "error":
        await koksmat.error(correlationId, ...args);
        break;
      case "fatal":
        await koksmat.fatal(correlationId, ...args);
        break;
      default:
        await koksmat.info(correlationId, ...args);
    }
  } catch (error) {
    console.error(`[ERROR] ${correlationId}: Failed to log message:`, error);
    throw new Error("Failed to log message");
  }
}
