import { Command } from "commander";
import path from "path";
import { ComponentManager } from "./component-manager";
import { ChalkFormatter, JsonFormatter } from "./output-formatters";

export function setupComponentCommand(program: Command) {
  const component = program
    .command("component")
    .description("Component management commands");

  component
    .command("list")
    .description("List all components")
    .action(async () => {
      const appPath = path.resolve(program.opts().path);
      const outputFormat = program.opts().output.toLowerCase();

      let formatter;
      if (outputFormat === "json") {
        formatter = new JsonFormatter();
      } else {
        formatter = new ChalkFormatter();
      }

      const componentManager = new ComponentManager(appPath);

      try {
        const components = await componentManager.listComponents();
        components.forEach((component) => formatter.log(component));

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        if (error instanceof Error) {
          formatter.error(`Error: ${error.message}`);
        } else {
          formatter.error("An unknown error occurred");
        }

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
        process.exit(1);
      }
    });

  component
    .command("create <name>")
    .description("Create a new component")
    .action(async (name) => {
      const appPath = path.resolve(program.opts().path);
      const outputFormat = program.opts().output.toLowerCase();

      let formatter;
      if (outputFormat === "json") {
        formatter = new JsonFormatter();
      } else {
        formatter = new ChalkFormatter();
      }

      const componentManager = new ComponentManager(appPath);

      try {
        await componentManager.createComponent(name);
        formatter.success(`Component ${name} created successfully`);

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        if (error instanceof Error) {
          formatter.error(`Error: ${error.message}`);
        } else {
          formatter.error("An unknown error occurred");
        }

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
        process.exit(1);
      }
    });

  component
    .command("select")
    .description("Select components")
    .action(async () => {
      const appPath = path.resolve(program.opts().path);
      const outputFormat = program.opts().output.toLowerCase();

      let formatter;
      if (outputFormat === "json") {
        formatter = new JsonFormatter();
      } else {
        formatter = new ChalkFormatter();
      }

      const componentManager = new ComponentManager(appPath);

      try {
        const selectedComponents = await componentManager.selectComponents();
        formatter.log("Selected components:");
        selectedComponents.forEach((component) => formatter.log(component));

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        if (error instanceof Error) {
          formatter.error(`Error: ${error.message}`);
        } else {
          formatter.error("An unknown error occurred");
        }

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
        process.exit(1);
      }
    });

  component
    .command("export <name>")
    .description("Export a component")
    .action(async (name) => {
      const appPath = path.resolve(program.opts().path);
      const outputFormat = program.opts().output.toLowerCase();

      let formatter;
      if (outputFormat === "json") {
        formatter = new JsonFormatter();
      } else {
        formatter = new ChalkFormatter();
      }

      const componentManager = new ComponentManager(appPath);

      try {
        await componentManager.exportComponent(name);
        formatter.success(`Component ${name} exported successfully`);

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        if (error instanceof Error) {
          formatter.error(`Error: ${error.message}`);
        } else {
          formatter.error("An unknown error occurred");
        }

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
        process.exit(1);
      }
    });

  component
    .command("import <sourceFile>")
    .description("Import a component")
    .action(async (sourceFile) => {
      const appPath = path.resolve(program.opts().path);
      const outputFormat = program.opts().output.toLowerCase();

      let formatter;
      if (outputFormat === "json") {
        formatter = new JsonFormatter();
      } else {
        formatter = new ChalkFormatter();
      }

      const componentManager = new ComponentManager(appPath);

      try {
        await componentManager.importComponent(sourceFile);
        formatter.success(`Component imported successfully from ${sourceFile}`);

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
      } catch (error) {
        if (error instanceof Error) {
          formatter.error(`Error: ${error.message}`);
        } else {
          formatter.error("An unknown error occurred");
        }

        if (outputFormat === "json") {
          console.log(formatter.formatOutput());
        }
        process.exit(1);
      }
    });
}
