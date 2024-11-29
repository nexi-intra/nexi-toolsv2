import { TreeNode, NodeImportExportType } from "./navigation-schemas";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { MenuHandler } from "./nav-menu";
import { ProjectHandler } from "./ProjectHandler";

export class NavigationManager {
  private appPath: string;
  private metadataPath: string;
  private handler: NodeImportExportType;

  constructor(appPath: string, type: string) {
    this.appPath = appPath;
    this.metadataPath = path.join(appPath, "metadata");
    this.handler = this.createHandler(type);
  }

  private createHandler(type: string): NodeImportExportType {
    switch (type) {
      case "menu":
        return new MenuHandler();
      case "project":
        return new ProjectHandler();
      default:
        throw new Error(`Unsupported navigation type: ${type}`);
    }
  }

  async exportData(targetFile: string = "navigation.yaml"): Promise<void> {
    try {
      const data = await this.handler.exportNodes();
      const yamlContent = yaml.dump(data);
      await fs.mkdir(this.metadataPath, { recursive: true });
      const targetPath = path.join(this.metadataPath, targetFile);
      await fs.writeFile(targetPath, yamlContent, "utf-8");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error exporting data to YAML: ${error.message}`);
      }
      throw new Error("Unknown error occurred while exporting data to YAML");
    }
  }

  async importData(sourceFile: string = "navigation.yaml"): Promise<void> {
    try {
      const sourcePath = path.join(this.metadataPath, sourceFile);
      const yamlContent = await fs.readFile(sourcePath, "utf-8");
      const nodes = yaml.load(yamlContent) as TreeNode[];
      await this.handler.importNodes(nodes);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error importing data from YAML: ${error.message}`);
      }
      throw new Error("Unknown error occurred while importing data from YAML");
    }
  }
}

export function createNavigationManager(
  type: string,
  appPath: string
): NavigationManager {
  return new NavigationManager(appPath, type);
}
