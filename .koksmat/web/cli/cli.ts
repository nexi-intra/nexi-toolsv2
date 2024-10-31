#!/usr/bin/env node

import { Command } from "commander";
import { DocumentationManager } from "./documentation-manager";
import path from "path";
import chokidar from "chokidar";
import chalk from "chalk";

const program = new Command();

program
  .name("koksmat-web")
  .description("CLI for Koksmat Web documentation management")
  .version("1.0.0")
  .option("-v, --verbose", "Enable verbose output")
  .option("-f, --force", "Force overwrite existing documentation");

const docs = program
  .command("docs")
  .description("Documentation management commands");

const components = docs
  .command("components")
  .description("Component management commands");

components
  .command("list")
  .description("List components in scope with colorized output")
  .action(async () => {
    const manager = createDocumentationManager();
    const components = await manager.listComponents();
    console.log("Components in scope:");
    console.log("Docs path", manager.docsPath);
    components.forEach((component) => {
      const status = component.metadata
        ? component.hasDocumentation
          ? chalk.green
          : chalk.yellow
        : chalk.gray;
      console.log(status(`${component.filename}`));
      // if (component.metadata) {
      //   console.log(`  Display Name: ${component.metadata.displayName}`);
      //   console.log(
      //     `  Suggested Filename: ${component.metadata.suggestedFilename}`
      //   );
      //   console.log(
      //     `  Example Function: examples${component.metadata.exampleFunctionName}`
      //   );
      // }
      // console.log(`  Has Documentation: ${component.hasDocumentation}`);
      // console.log("");
    });
  });

docs
  .command("generate")
  .description("Generate all non-existing documentation")
  .action(async () => {
    const manager = createDocumentationManager();
    await manager.generateDocumentation();
  });

docs
  .command("generate-component <name>")
  .description("Generate documentation for a specific component")
  .action(async (name) => {
    const manager = createDocumentationManager();
    await manager.generateDocumentation(name);
  });

components
  .command("monitor")
  .description(
    "Monitor components for changes and report on needed documentation updates"
  )
  .option("--report-only", "Only report changes without updating documentation")
  .action(async (options) => {
    const manager = createDocumentationManager();
    console.log("Monitoring components for changes...");

    const watcher = chokidar.watch(manager.componentsPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    watcher
      .on("add", (path) => handleComponentChange(path, "added", manager))
      .on("change", (path) => handleComponentChange(path, "modified", manager))
      .on("unlink", (path) => handleComponentChange(path, "removed", manager));
  });

function createDocumentationManager(): DocumentationManager {
  const appPath = process.cwd();
  const appShortName = path.basename(appPath);
  return new DocumentationManager(
    appPath,

    program.opts().verbose,
    program.opts().force
  );
}

async function handleComponentChange(
  filePath: string,
  changeType: "added" | "modified" | "removed",
  manager: DocumentationManager
) {
  if (path.extname(filePath) === ".tsx" || path.extname(filePath) === ".ts") {
    const componentName = path.basename(filePath, path.extname(filePath));
    console.log(`Component ${componentName} was ${changeType}`);

    if (changeType !== "removed") {
      const needsUpdate = await manager.checkIfDocumentationNeedsUpdate(
        componentName
      );
      if (needsUpdate) {
        console.log(`Documentation for ${componentName} needs to be updated.`);
      } else {
        console.log(`Documentation for ${componentName} is up to date.`);
      }
    } else {
      console.log(`Documentation for ${componentName} should be removed.`);
    }
  }
}

program.parse(process.argv);
