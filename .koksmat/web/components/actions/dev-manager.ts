"use server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { getKoksmat } from "./koksmat"; // Adjust the path as necessary
import { findPageFileForUrl } from "@/lib/findPage";
// Define the base path for sessions
const DEV_BASE_PATH = process.cwd();

/**
 * Open a file in VS Code within the current session path
 * @param input Object containing the session ID, file name, and correlationId
 * @returns A promise that resolves when the file is opened in VS Code
 */
export async function openInCode(relativeFilePath: string): Promise<void> {
  try {
    const fullFilePath = path.join(DEV_BASE_PATH, relativeFilePath);
    getKoksmat().verbose("", `Opening file in VS Code: ${fullFilePath}`);

    return new Promise((resolve, reject) => {
      exec(`code ${fullFilePath}`, (error, stdout, stderr) => {
        if (error) {
          getKoksmat().error(
            "",
            `Error opening file in VS Code: ${error.message}`,
            error
          );
          reject(new Error(`Failed to open file in VS Code: ${error.message}`));
          return;
        }
        if (stderr) {
          getKoksmat().warning("", `VS Code stderr: ${stderr}`);
        }
        getKoksmat().info(
          "",
          `File opened successfully in VS Code: ${fullFilePath}`
        );
        resolve();
      });
    });
  } catch (error) {
    getKoksmat().error("", "Error opening file in VS Code:", error);
    throw new Error("Failed to open file in VS Code");
  }
}

export async function findFilePathForUrl(
  url: string,
  appPath: string
): Promise<string> {
  return findPageFileForUrl(url, appPath);
}
