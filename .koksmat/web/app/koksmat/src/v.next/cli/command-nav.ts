import { Command } from "commander";
import path from "path";
import {
  createNavigationManager,
  NavigationManager,
} from "./navigation-manager";
import {
  ChalkFormatter,
  JsonFormatter,
  OutputFormatter,
} from "./output-formatters";

export function setupNavCommand(program: Command) {
  const nav = program.command("nav").description("Navigation related commands");

  nav
    .command("export <type>")
    .description("Export navigation to YAML file")
    .option("-f, --file <file>", "Name of the YAML file", "navigation.yaml")
    .action(async (type: string, options: { file: string }) => {
      const appPath = path.resolve(program.opts().path);
      const verbose = program.opts().verbose;
      const outputFormat = program.opts().output.toLowerCase();

      const formatter: OutputFormatter =
        outputFormat === "json" ? new JsonFormatter() : new ChalkFormatter();

      try {
        const manager = createNavigationManager(
          type as keyof NavigationManager,
          appPath
        );

        if (verbose) {
          formatter.info(`Exporting ${type} navigation...`);
          formatter.info(`App path: ${appPath}`);
          formatter.info(`Output file: ${options.file}`);
        }

        await manager.exportData(options.file);

        if (verbose) {
          formatter.info(`Export completed successfully.`);
        }

        formatter.success(
          `${type} navigation exported to metadata/${options.file}`
        );

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        handleError(error, formatter, outputFormat, verbose);
      }
    });

  nav
    .command("import <type>")
    .description("Import navigation from YAML file")
    .option("-f, --file <file>", "Name of the YAML file", "navigation.yaml")
    .action(async (type: string, options: { file: string }) => {
      const appPath = path.resolve(program.opts().path);
      const verbose = program.opts().verbose;
      const outputFormat = program.opts().output.toLowerCase();

      const formatter: OutputFormatter =
        outputFormat === "json" ? new JsonFormatter() : new ChalkFormatter();

      try {
        const manager = createNavigationManager(
          type as keyof NavigationManager,
          appPath
        );

        if (verbose) {
          formatter.info(`Importing ${type} navigation...`);
          formatter.info(`App path: ${appPath}`);
          formatter.info(`Input file: ${options.file}`);
        }

        await manager.importData(options.file);

        if (verbose) {
          formatter.info(`Import completed successfully.`);
        }

        formatter.success(
          `${type} navigation imported from metadata/${options.file}`
        );

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        handleError(error, formatter, outputFormat, verbose);
      }
    });
}

function handleError(
  error: unknown,
  formatter: OutputFormatter,
  outputFormat: string,
  verbose: boolean
) {
  if (error instanceof Error) {
    formatter.error(`Error: ${error.message}`);
    if (verbose) {
      formatter.info(`Error stack: ${error.stack}`);
    }
  } else {
    formatter.error("An unknown error occurred");
  }

  if (outputFormat === "json") {
    console.log(formatter.formatOutput());
  }
  process.exit(1);
}
