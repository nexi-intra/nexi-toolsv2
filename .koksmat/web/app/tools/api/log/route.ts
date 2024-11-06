import { LogLevel } from "@/components/streaming-logviewer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LogMessage {
  timestamp: Date;
  level: LogLevel;
  message: string;
  correlationId?: string;
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Simulate log messages
      const generateLog = () => {
        const levels = [LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
        const messages = [
          "User logged in",
          "Database connection established",
          "Cache miss",
          "Rate limit reached",
          "Processing request",
        ];

        const log: LogMessage = {
          timestamp: new Date(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          correlationId: Math.random().toString(36).substring(7),
        };

        return log;
      };

      // Stream log messages every second
      const interval = setInterval(() => {
        const log = generateLog();
        controller.enqueue(encoder.encode(JSON.stringify(log) + "\n"));
      }, 1000);

      // Clean up interval when the stream is closed
      return () => clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
