"use server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import createKoksmat from "./koksmat";

// Initialize Koksmat
const koksmat = createKoksmat({ retentionMinutes: 120 });

// Define the base path for sessions
const SESSION_BASE_PATH = path.join(process.cwd(), ".session");

// Zod schemas for input validation
const CreateSessionSchema = z.object({
  prefix: z.string().min(1),
  correlationId: z.string().optional(),
});

const DeleteSessionSchema = z.object({
  sessionId: z.string().min(1),
  correlationId: z.string().optional(),
});

const CreateFileSchema = z.object({
  sessionId: z.string().min(1),
  fileName: z.string().min(1),
  content: z.string(),
  correlationId: z.string().optional(),
});

const ExecuteFileSchema = z.object({
  sessionId: z.string().min(1),
  fileName: z.string().min(1),
  correlationId: z.string().optional(),
});

const OpenInCodeSchema = z.object({
  sessionId: z.string().min(1),
  fileName: z.string().min(1),
  correlationId: z.string().optional(),
});

// Types inferred from Zod schemas
type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
type DeleteSessionInput = z.infer<typeof DeleteSessionSchema>;
type CreateFileInput = z.infer<typeof CreateFileSchema>;
type ExecuteFileInput = z.infer<typeof ExecuteFileSchema>;
type OpenInCodeInput = z.infer<typeof OpenInCodeSchema>;

/**
 * List all session folders
 * @param correlationId Unique identifier for tracing this operation
 * @returns Array of session folder names
 */
export async function listSessions(correlationId?: string): Promise<string[]> {
  try {
    koksmat.info(correlationId, "Listing all sessions");
    const sessions = await fs.readdir(SESSION_BASE_PATH);
    koksmat.info(correlationId, `Listed ${sessions.length} sessions`);
    return sessions;
  } catch (error) {
    koksmat.error(correlationId, "Error listing sessions:", error);
    throw new Error("Failed to list sessions");
  }
}

/**
 * Create a new session folder
 * @param input Object containing the session prefix and correlationId
 * @returns Name of the created session folder
 */
export async function createSession(
  input: CreateSessionInput
): Promise<string> {
  const { prefix, correlationId } = CreateSessionSchema.parse(input);
  try {
    koksmat.info(correlationId, `Creating new session with prefix: ${prefix}`);
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0];
    const sessionId = `${prefix}_${timestamp}`;
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);

    await fs.mkdir(sessionPath, { recursive: true });
    koksmat.info(correlationId, `Created new session: ${sessionId}`);
    return sessionId;
  } catch (error) {
    koksmat.error(correlationId, "Error creating session:", error);
    throw new Error("Failed to create session");
  }
}

/**
 * Delete a session folder and its contents
 * @param input Object containing the session ID to delete and correlationId
 */
export async function deleteSession(input: DeleteSessionInput): Promise<void> {
  const { sessionId, correlationId } = DeleteSessionSchema.parse(input);
  try {
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);
    koksmat.info(correlationId, `Deleting session: ${sessionId}`);
    await fs.rm(sessionPath, { recursive: true, force: true });
    koksmat.info(correlationId, `Deleted session: ${sessionId}`);
  } catch (error) {
    koksmat.error(correlationId, "Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}

/**
 * Create a file within a session folder
 * @param input Object containing the session ID, file name, content, and correlationId
 * @returns Path of the created file
 */
export async function createFile(input: CreateFileInput): Promise<string> {
  const { sessionId, fileName, content, correlationId } =
    CreateFileSchema.parse(input);
  try {
    const filePath = path.join(SESSION_BASE_PATH, sessionId, fileName);
    koksmat.info(correlationId, `Creating file: ${filePath}`);
    await fs.writeFile(filePath, content);
    koksmat.info(correlationId, `Created file: ${filePath}`);
    return filePath;
  } catch (error) {
    koksmat.error(correlationId, "Error creating file:", error);
    throw new Error("Failed to create file");
  }
}

/**
 * Execute a file within a session folder and stream the output
 * @param input Object containing the session ID, file name, and correlationId
 * @param onOutput Callback function to handle the output stream
 */
export async function executeFile(
  input: ExecuteFileInput,
  onOutput: (data: string) => void
): Promise<void> {
  const { sessionId, fileName, correlationId } = ExecuteFileSchema.parse(input);
  try {
    const filePath = path.join(SESSION_BASE_PATH, sessionId, fileName);
    koksmat.info(correlationId, `Executing file: ${filePath}`);

    return new Promise((resolve, reject) => {
      const child = exec(`node ${filePath}`);

      child.stdout?.on("data", (data) => {
        const output = data.toString();
        koksmat.verbose(correlationId, `File execution output: ${output}`);
        onOutput(output);
      });

      child.stderr?.on("data", (data) => {
        const errorOutput = `Error: ${data.toString()}`;
        koksmat.error(correlationId, `File execution error: ${errorOutput}`);
        onOutput(errorOutput);
      });

      child.on("close", (code) => {
        if (code === 0) {
          koksmat.info(
            correlationId,
            `File execution completed successfully: ${filePath}`
          );
          resolve();
        } else {
          const errorMessage = `Process exited with code ${code}`;
          koksmat.error(
            correlationId,
            `File execution failed: ${errorMessage}`
          );
          reject(new Error(errorMessage));
        }
      });
    });
  } catch (error) {
    koksmat.error(correlationId, "Error executing file:", error);
    throw new Error("Failed to execute file");
  }
}

/**
 * Open a file in VS Code within the current session path
 * @param input Object containing the session ID, file name, and correlationId
 * @returns A promise that resolves when the file is opened in VS Code
 */
export async function openInCode(input: OpenInCodeInput): Promise<void> {
  const { sessionId, fileName, correlationId } = OpenInCodeSchema.parse(input);
  try {
    const filePath = path.join(SESSION_BASE_PATH, sessionId, fileName);
    koksmat.info(correlationId, `Opening file in VS Code: ${filePath}`);

    return new Promise((resolve, reject) => {
      exec(`code ${filePath}`, (error, stdout, stderr) => {
        if (error) {
          koksmat.error(
            correlationId,
            `Error opening file in VS Code: ${error.message}`
          );
          reject(new Error(`Failed to open file in VS Code: ${error.message}`));
          return;
        }
        if (stderr) {
          koksmat.warning(correlationId, `VS Code stderr: ${stderr}`);
        }
        koksmat.info(
          correlationId,
          `File opened successfully in VS Code: ${filePath}`
        );
        resolve();
      });
    });
  } catch (error) {
    koksmat.error(correlationId, "Error opening file in VS Code:", error);
    throw new Error("Failed to open file in VS Code");
  }
}
