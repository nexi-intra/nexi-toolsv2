import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import yaml from "js-yaml";

export class ComponentManager {
  private appPath: string;
  private componentsPath: string;

  constructor(appPath: string) {
    this.appPath = appPath;
    this.componentsPath = path.join(appPath, "components");
  }

  async listComponents(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.componentsPath);
      return files.filter((file) => file.endsWith(".tsx"));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error listing components: ${error.message}`);
      }
      throw new Error("Unknown error occurred while listing components");
    }
  }

  async createComponent(name: string): Promise<void> {
    const componentPath = path.join(this.componentsPath, `${name}.tsx`);
    const componentContent = `
import React from 'react';

export const ${name}: React.FC = () => {
  return (
    <div>
      <h1>${name} Component</h1>
    </div>
  );
};
`;

    try {
      await fs.writeFile(componentPath, componentContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating component: ${error.message}`);
      }
      throw new Error("Unknown error occurred while creating component");
    }
  }

  async selectComponents(): Promise<string[]> {
    const components = await this.listComponents();
    const { selectedComponents } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedComponents",
        message: "Select components:",
        choices: components,
      },
    ]);
    return selectedComponents;
  }

  async exportComponent(name: string): Promise<void> {
    const componentPath = path.join(this.componentsPath, `${name}.tsx`);
    const exportPath = path.join(this.appPath, "exports", `${name}.yaml`);

    try {
      const content = await fs.readFile(componentPath, "utf-8");
      const yamlContent = yaml.dump({ name, content });
      await fs.mkdir(path.dirname(exportPath), { recursive: true });
      await fs.writeFile(exportPath, yamlContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error exporting component: ${error.message}`);
      }
      throw new Error("Unknown error occurred while exporting component");
    }
  }

  async importComponent(sourceFile: string): Promise<void> {
    try {
      const yamlContent = await fs.readFile(sourceFile, "utf-8");
      const { name, content } = yaml.load(yamlContent) as {
        name: string;
        content: string;
      };
      const componentPath = path.join(this.componentsPath, `${name}.tsx`);
      await fs.writeFile(componentPath, content);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error importing component: ${error.message}`);
      }
      throw new Error("Unknown error occurred while importing component");
    }
  }
}
