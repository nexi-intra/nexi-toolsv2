"use server";

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";

export async function checkFileExists(filePath: string): Promise<boolean> {
  if (process.env.NODE_ENV === "production")
    throw new Error("Not allowed in production 11");
  try {
    await fs.access(path.join(process.cwd(), "app", filePath, "page.tsx"));
    return true;
  } catch {
    return false;
  }
}

export async function createFile(
  filePath: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  if (process.env.NODE_ENV === "production")
    throw new Error("Not allowed in production 12");
  try {
    const fullPath = path.join(process.cwd(), "app", filePath, "page.tsx");
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
    return { success: true, message: "File created successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Error creating file: ${(error as any).message}`,
    };
  }
}

export async function openFile(
  filePath: string
): Promise<{ success: boolean; message: string }> {
  if (process.env.NODE_ENV === "production")
    throw new Error("Not allowed in production 13");
  return new Promise((resolve) => {
    const fullPath = path.join(process.cwd(), "app", filePath, "page.tsx");
    exec(`code ${fullPath}`, (error) => {
      if (error) {
        resolve({
          success: false,
          message: `Error opening file: ${error.message}`,
        });
      } else {
        resolve({ success: true, message: "File opened successfully" });
      }
    });
  });
}
