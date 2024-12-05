"use server";
import fs from "fs";
export async function getEnvironment() {
  if (process.env.NODE_ENV === "production")
    throw new Error("Not allowed in production");
  // get the current directory
  const root = process.cwd();

  return {
    root,
    __dirname,
    __filename,
  };
}
