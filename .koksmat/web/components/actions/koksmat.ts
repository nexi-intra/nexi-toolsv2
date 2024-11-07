/**
 * Koksmat: A TypeScript-based logging utility for Next.js applications
 *
 * This utility provides a robust logging system with the following features:
 * - Singleton pattern for consistent logging across the application
 * - Log levels: VERBOSE, INFO, WARNING, ERROR, FATAL
 * - Correlation ID support for tracking related log entries
 * - In development:
 *   - In-memory and file-based log storage using YAML
 *   - Automatic log cleanup based on retention time with verbose logging
 *   - Subscription mechanism for real-time log monitoring
 *   - Filtering capabilities for retrieving specific logs
 *   - Deferred state updates to reduce write frequency
 * - In production:
 *   - Logs are written to the default output (console) without persistence
 *
 * Usage:
 * const koksmat = createKoksmat({ retentionMinutes: 60 });
 * koksmat.info('correlationId', 'Log message', { additionalData: 'value' });
 *
 * Note: Advanced features like filtering and subscriptions are only available in development environments.
 */
import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import yaml from "js-yaml";
import {
  kErrorTracking,
  kInfoTracking,
  kVerbose,
  kVerboseTracking,
  kWarnTracking,
} from "@/lib/koksmat-logger-client";

// Define log levels
enum LogLevel {
  VERBOSE = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  FATAL = 4,
}

// Define log entry structure
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  messages: string[];
  correlationId?: string;
  errorDetails?: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface KoksmatProps {
  retentionMinutes: number;
}

export class Koksmat {
  private static instance: Koksmat;
  private _logs: LogEntry[] = [];
  private _retentionMinutes: number;
  private _eventEmitter: EventEmitter;
  private _stateDir: string;
  private _isDev: boolean;
  private _saveStateTimeout: NodeJS.Timeout | null = null;
  private _stateChanged: boolean = false;

  private constructor(props: KoksmatProps) {
    this._retentionMinutes = props.retentionMinutes;
    this._eventEmitter = new EventEmitter();
    this._isDev = process.env.NODE_ENV === "development";
    this._stateDir = path.join(process.cwd(), ".koksmat");

    if (this._isDev) {
      this._ensureStateDirectory();
      this._loadState();
      this._startCleanupInterval();
    }
  }

  public static getInstance(props: KoksmatProps): Koksmat {
    if (!Koksmat.instance) {
      Koksmat.instance = new Koksmat(props);
    }
    return Koksmat.instance;
  }

  private _ensureStateDirectory(): void {
    try {
      if (!fs.existsSync(this._stateDir)) {
        fs.mkdirSync(this._stateDir, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create state directory:", error);
      // Continue execution even if directory creation fails
    }
  }

  private _loadState(): void {
    if (this._isDev) {
      try {
        const stateFile = path.join(this._stateDir, "state.yaml");
        if (fs.existsSync(stateFile)) {
          const data = fs.readFileSync(stateFile, "utf-8");
          const parsedData = yaml.load(data) as { logs: LogEntry[] };
          this._logs = parsedData.logs.map((log) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
        } else {
          console.warn("State file not found. Starting with empty log.");
        }
      } catch (error) {
        console.error("Failed to load state:", error);
        // Continue with empty logs if state loading fails
        this._logs = [];
      }
    }
  }

  private _saveState(): void {
    if (this._isDev) {
      try {
        const stateFile = path.join(this._stateDir, "state.yaml");
        const data = yaml.dump({ logs: this._logs });
        fs.writeFileSync(stateFile, data, "utf-8");
        this._stateChanged = false;
      } catch (error) {
        console.error("Failed to save state:", error);
        // Continue execution even if state saving fails
      }
    }
  }

  private _deferredSaveState(): void {
    if (this._isDev) {
      if (this._saveStateTimeout) {
        clearTimeout(this._saveStateTimeout);
      }
      this._saveStateTimeout = setTimeout(() => {
        if (this._stateChanged) {
          this._saveState();
        }
        this._saveStateTimeout = null;
      }, 1000);
    }
  }

  private _startCleanupInterval(): void {
    if (this._isDev) {
      setInterval(() => {
        try {
          this._cleanup();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }, 60000); // Run cleanup every minute
    }
  }

  private _cleanup(): void {
    if (this._isDev) {
      const now = new Date();
      const initialLogCount = this._logs.length;
      const cleanupDetails: string[] = [];
      let itemsRemoved = 0;
      this._logs = this._logs.filter((log) => {
        const diff = (now.getTime() - log.timestamp.getTime()) / (1000 * 60);
        const keep = diff <= this._retentionMinutes;
        if (!keep) {
          // cleanupDetails.push(
          //   `Removed log: [${log.timestamp.toISOString()}] [${
          //     LogLevel[log.level]
          //   }] ${
          //     log.correlationId ? `[${log.correlationId}] ` : ""
          //   }${log.messages.join(" ")}`
          // );
        }
        return keep;
      });

      const removedCount = initialLogCount - this._logs.length;

      if (removedCount > 0) {
        this._stateChanged = true;
        this._deferredSaveState();
      }

      // Log verbose cleanup information
      this.verbose(
        undefined,
        `Cleanup completed. Removed ${removedCount} log entries.`
      );
      if (cleanupDetails.length > 0) {
        this.verbose(undefined, "Cleanup details:", ...cleanupDetails);
      }
    }
  }

  private _stringifyMessage(message: any): string {
    if (message instanceof Error) {
      return `Error: ${message.message}\nStack: ${message.stack}`;
    } else if (typeof message === "object") {
      try {
        return JSON.stringify(message, null, 2);
      } catch (error) {
        return `[Circular or Non-Serializable Object: ${Object.prototype.toString.call(
          message
        )}]`;
      }
    } else {
      return String(message);
    }
  }

  private _log(
    level: LogLevel,
    correlationId: string | undefined,
    ...messages: any[]
  ): void {
    const stringMessages = messages.map((msg) => this._stringifyMessage(msg));

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      messages: stringMessages,
      correlationId,
    };

    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      const errorObject = messages.find((msg) => msg instanceof Error);
      if (errorObject instanceof Error) {
        logEntry.errorDetails = {
          name: errorObject.name,
          message: errorObject.message,
          stack: errorObject.stack,
        };
      }
    }

    if (this._isDev) {
      this._logs.push(logEntry);
      this._eventEmitter.emit("log", logEntry);
      this._stateChanged = true;
      this._deferredSaveState();
    } else {
      // In non-dev environments, write to default output
      const logMessage = `[${logEntry.timestamp.toISOString()}] [${
        LogLevel[logEntry.level]
      }] ${
        logEntry.correlationId ? `[${logEntry.correlationId}] ` : ""
      }${logEntry.messages.join(" ")}`;
      console.log(logMessage);
      if (logEntry.errorDetails) {
        console.error(logEntry.errorDetails);
      }
    }
  }

  public verbose(correlationId: string | undefined, ...messages: any[]): void {
    kVerboseTracking(correlationId, ...messages);
  }

  public info(correlationId: string | undefined, ...messages: any[]): void {
    kInfoTracking(correlationId, ...messages);
  }

  public warning(correlationId: string | undefined, ...messages: any[]): void {
    kWarnTracking(correlationId, ...messages);
  }

  public error(correlationId: string | undefined, ...messages: any[]): void {
    kErrorTracking(correlationId, ...messages);
  }

  public fatal(correlationId: string | undefined, ...messages: any[]): void {
    kErrorTracking(correlationId, ...messages);
    throw messages.join(" ");
  }

  public filterLogs(minLevel: LogLevel, correlationId?: string): LogEntry[] {
    if (!this._isDev) {
      console.warn(
        "Log filtering is only available in development environment"
      );
      return [];
    }
    return this._logs.filter(
      (log) =>
        log.level >= minLevel &&
        (correlationId === undefined || log.correlationId === correlationId)
    );
  }

  public subscribeToLogs(
    callback: (log: LogEntry) => void,
    minLevel?: LogLevel,
    correlationId?: string
  ): () => void {
    if (!this._isDev) {
      console.warn(
        "Log subscription is only available in development environment"
      );
      return () => {};
    }
    const handler = (log: LogEntry) => {
      if (
        (minLevel === undefined || log.level >= minLevel) &&
        (correlationId === undefined || log.correlationId === correlationId)
      ) {
        callback(log);
      }
    };

    this._eventEmitter.on("log", handler);

    // Return an unsubscribe function
    return () => {
      this._eventEmitter.off("log", handler);
    };
  }

  public unsubscribeFromLogs(callback: (log: LogEntry) => void): void {
    if (this._isDev) {
      this._eventEmitter.off("log", callback);
    }
  }
}

// Export the Koksmat function
export default function createKoksmat(props: KoksmatProps): Koksmat {
  return Koksmat.getInstance(props);
}
