#!/usr/bin/env node
require("module-alias/register");
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { setupDocsCommand } from "./command-docs";
import { setupNavCommand } from "./command-nav";
import { setupComponentCommand } from "./command-component";
const program = new Command();
import packageJson from "@/package.json";

const displayAsciiArt = () => {
  console.log(
    chalk.yellow(figlet.textSync("KOKSMAT WEB", { horizontalLayout: "full" }))
  );
};

const displayVersionInfo = () => {
  console.log(chalk.cyan(`Version: ${packageJson.version}`));
  //console.log(chalk.cyan(`Description: ${packageJson.description}`));
};

program
  .name("koksmat-web")
  .description("CLI for Koksmat web operations")
  .version("1.0.0")
  .option("-p, --path <path>", "Path to the app", ".")
  .option("-v, --verbose", "Enable verbose output", false)
  .option("-f, --force", "Force overwrite existing documentation", false)
  .option("-o, --output <format>", "Output format (chalk or json)", "chalk");

setupDocsCommand(program);
setupNavCommand(program);
setupComponentCommand(program);
// If no command is provided, show ASCII art and help
if (!process.argv.slice(2).length) {
  displayAsciiArt();
  displayVersionInfo();
  console.log("\n");
  program.outputHelp();
} else {
  program.parse(process.argv);
}
