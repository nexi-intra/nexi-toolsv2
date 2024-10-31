#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const documentation_manager_1 = require("./documentation-manager");
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
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
                ? chalk_1.default.green
                : chalk_1.default.yellow
            : chalk_1.default.gray;
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
    .description("Monitor components for changes and report on needed documentation updates")
    .option("--report-only", "Only report changes without updating documentation")
    .action(async (options) => {
    const manager = createDocumentationManager();
    console.log("Monitoring components for changes...");
    const watcher = chokidar_1.default.watch(manager.componentsPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
    });
    watcher
        .on("add", (path) => handleComponentChange(path, "added", manager))
        .on("change", (path) => handleComponentChange(path, "modified", manager))
        .on("unlink", (path) => handleComponentChange(path, "removed", manager));
});
function createDocumentationManager() {
    const appPath = process.cwd();
    const appShortName = path_1.default.basename(appPath);
    return new documentation_manager_1.DocumentationManager(appPath, program.opts().verbose, program.opts().force);
}
async function handleComponentChange(filePath, changeType, manager) {
    if (path_1.default.extname(filePath) === ".tsx" || path_1.default.extname(filePath) === ".ts") {
        const componentName = path_1.default.basename(filePath, path_1.default.extname(filePath));
        console.log(`Component ${componentName} was ${changeType}`);
        if (changeType !== "removed") {
            const needsUpdate = await manager.checkIfDocumentationNeedsUpdate(componentName);
            if (needsUpdate) {
                console.log(`Documentation for ${componentName} needs to be updated.`);
            }
            else {
                console.log(`Documentation for ${componentName} is up to date.`);
            }
        }
        else {
            console.log(`Documentation for ${componentName} should be removed.`);
        }
    }
}
program.parse(process.argv);
