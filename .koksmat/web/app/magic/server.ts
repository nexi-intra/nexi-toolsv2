"use server";
import fs from "fs";
export async function getEnvironment() {
  // get the current directory
  const root = process.cwd();

  return {
    root,
    __dirname,
    __filename,
  };
}
