import fs from "fs/promises";
import path from "path";
import { OutputFormatter, ChalkFormatter } from "./output-formatters";

interface ComponentMetadata {
  suggestedFilename: string;
  displayName: string;
  exampleFunctionName: string;
}

interface ComponentInfo {
  fullPath: string;
  filename: string;
  metadata: ComponentMetadata | null;
  hasDocumentation: boolean;
}

interface NavLink {
  href: string;
  label: string;
}

export class DocumentationManager {
  private _appPath: string;
  private _appShortName: string;
  private _componentsPath: string;
  private _docsPath: string;
  private _verbose: boolean;
  private _force: boolean;
  private _formatter: OutputFormatter;

  constructor(
    appPath: string,
    verbose: boolean = false,
    force: boolean = false,
    formatter: OutputFormatter = new ChalkFormatter()
  ) {
    this._appPath = appPath;
    this._verbose = verbose;
    this._force = force;
    this._componentsPath = path.join(appPath, "components");
    this._appShortName = ""; // This will be set in the initialize method
    this._docsPath = ""; // This will be set in the initialize method
    this._formatter = formatter;

    // Call initialize in the constructor
    this.initialize().catch((error) => {
      this._formatter.error(
        `Failed to initialize DocumentationManager: ${error}`
      );
    });
  }

  private async initialize(): Promise<void> {
    try {
      this._appShortName = await this.getAppName();
      this._docsPath = path.join(
        this._appPath,
        "app",
        this._appShortName,
        "docs",
        "components"
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to initialize DocumentationManager: ${error.message}`
        );
      } else {
        throw new Error(
          "Failed to initialize DocumentationManager: Unknown error"
        );
      }
    }
  }

  private async getAppName(): Promise<string> {
    const globalFilePath = path.join(this._appPath, "app", "global.ts");
    try {
      const content = await fs.readFile(globalFilePath, "utf-8");
      const match = content.match(/export const APPNAME = ["'](.+)["']/);
      if (match && match[1]) {
        return match[1];
      } else {
        throw new Error("APPNAME constant not found in global.ts");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        throw new Error("global.ts file not found");
      }
      throw error;
    }
  }

  get componentsPath(): string {
    return this._componentsPath;
  }

  get docsPath(): string {
    return this._docsPath;
  }

  set componentsPath(value: string) {
    this._componentsPath = value;
  }

  private _log(message: string): void {
    if (this._verbose) {
      this._formatter.log(message);
    }
  }

  public async listComponents(): Promise<ComponentInfo[]> {
    const componentFiles = await fs.readdir(this._componentsPath);
    const componentInfos: ComponentInfo[] = await Promise.all(
      componentFiles
        .filter((file) => file.endsWith(".tsx"))
        .map(async (file) => {
          const fullPath = path.join(this._componentsPath, file);
          const content = await fs.readFile(fullPath, "utf-8");
          const metadata = this._extractComponentMetadata(content);
          const docPath = this._getDocPath(metadata?.suggestedFilename);
          const hasDocumentation = await fs
            .stat(docPath)
            .then(() => true)
            .catch(() => false);

          return {
            fullPath,
            filename: file,
            metadata,
            hasDocumentation,
          };
        })
    );

    return componentInfos;
  }

  private _extractComponentMetadata(content: string): ComponentMetadata | null {
    const suggestedFilename = this._extractValue(content, "SUGGESTED_FILE");
    const displayName = this._extractValue(content, "SUGGESTED_DISPLAYNAME");
    const exampleFunctionName = this._extractExampleFunctionName(content);

    if (suggestedFilename && displayName && exampleFunctionName) {
      return {
        suggestedFilename,
        displayName,
        exampleFunctionName,
      };
    }

    return null;
  }

  private _extractValue(content: string, key: string): string | null {
    const regex = new RegExp(`export const ${key} = ['"](.+)['"]`);
    const match = content.match(regex);
    return match ? match[1] : null;
  }

  private _extractExampleFunctionName(content: string): string | null {
    const match = content.match(/export const (\w+):\s*ComponentDoc\[\]/);
    return match ? match[1] : null;
  }

  private _getDocPath(suggestedFilename: string | undefined): string {
    if (!suggestedFilename) return this._docsPath;

    const folderName = suggestedFilename
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .replace(
        /([A-Z])/g,
        (match, p1, offset) => (offset > 0 ? "-" : "") + p1.toLowerCase()
      ); // Convert camelCase to kebab-case

    return path.join(this._docsPath, folderName);
  }

  private async _createDocumentationPage(
    component: ComponentMetadata,
    sourceFilename: string
  ): Promise<void> {
    const componentName = path.parse(sourceFilename).name;
    const docContent = `
'use client';

import React from 'react';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { ${
      component.exampleFunctionName
    } } from '@/components/${componentName}';

export default function ${component.displayName.replace(
      /\s+/g,
      ""
    )}Documentation() {
  const componentDocs: ComponentDoc[] = [
    ...${component.exampleFunctionName}
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
}
`;

    const docPath = this._getDocPath(component.suggestedFilename);
    await fs.mkdir(docPath, { recursive: true });
    const filePath = path.join(docPath, "page.tsx");

    try {
      const fileExists = await fs
        .stat(filePath)
        .then(() => true)
        .catch(() => false);
      if (this._force || !fileExists) {
        await fs.writeFile(filePath, docContent);
        this._log(`Documentation created for ${component.displayName}`);
        await this._updateNavLinks(component);
      } else {
        this._log(
          `Documentation already exists for ${component.displayName}. Use --force to overwrite.`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to create documentation page: ${error.message}`
        );
      } else {
        throw new Error("Failed to create documentation page: Unknown error");
      }
    }
  }

  private async _updateNavLinks(component: ComponentMetadata): Promise<void> {
    const navLinksPath = path.join(this._docsPath, "navLinks.ts");
    try {
      let content = await fs.readFile(navLinksPath, "utf-8");
      const navLinks: NavLink[] = eval(
        content.replace("export const navLinks =", "")
      );

      const newLink: NavLink = {
        href: `/tools/docs/components/${component.suggestedFilename
          .toLowerCase()
          .replace(/\.[^/.]+$/, "")}`,
        label: component.displayName,
      };

      if (!navLinks.some((link) => link.href === newLink.href)) {
        navLinks.push(newLink);
        navLinks.sort((a, b) => a.label.localeCompare(b.label));

        const updatedContent = `export const navLinks = ${JSON.stringify(
          navLinks,
          null,
          2
        )};`;
        await fs.writeFile(navLinksPath, updatedContent);
        this._log(`Updated navLinks.ts with ${component.displayName}`);
      } else {
        this._log(`${component.displayName} already exists in navLinks.ts`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update navLinks.ts: ${error.message}`);
      } else {
        throw new Error("Failed to update navLinks.ts: Unknown error");
      }
    }
  }

  private async _updateMetadataFile(
    newComponents: ComponentMetadata[]
  ): Promise<void> {
    const metadataPath = path.join(this._appPath, "metadata.json");
    let metadata: Record<string, any> = {};

    try {
      const existingMetadata = await fs.readFile(metadataPath, "utf-8");
      metadata = JSON.parse(existingMetadata);
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code !== "ENOENT"
      ) {
        throw new Error(`Failed to read metadata file: ${error.message}`);
      }
      // If the file doesn't exist, we'll create a new metadata object
    }

    for (const component of newComponents) {
      metadata[component.displayName] = {
        filename: component.suggestedFilename,
        exampleFunctionName: component.exampleFunctionName,
      };
    }

    try {
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      this._log("Metadata file updated");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write metadata file: ${error.message}`);
      } else {
        throw new Error("Failed to write metadata file: Unknown error");
      }
    }
  }

  public async generateDocumentation(componentName?: string): Promise<void> {
    try {
      const components = await this.listComponents();
      let componentsToGenerate = components.filter((c) => c.metadata !== null);

      if (componentName) {
        componentsToGenerate = componentsToGenerate.filter(
          (c) => c.metadata?.displayName === componentName
        );
        if (componentsToGenerate.length === 0) {
          this._formatter.error(`Component "${componentName}" not found.`);
          return;
        }
      }

      await Promise.all(
        componentsToGenerate.map((component) =>
          this._createDocumentationPage(component.metadata!, component.filename)
        )
      );

      await this._updateMetadataFile(
        componentsToGenerate.map((c) => c.metadata!)
      );

      this._formatter.success(
        `Documentation generated for ${componentsToGenerate.length} component(s).`
      );
    } catch (error) {
      if (error instanceof Error) {
        this._formatter.error(
          `Error generating documentation: ${error.message}`
        );
      } else {
        this._formatter.error("Error generating documentation: Unknown error");
      }
    }
  }

  public async checkIfDocumentationNeedsUpdate(
    componentName: string
  ): Promise<boolean> {
    try {
      const componentPath = path.join(
        this._componentsPath,
        `${componentName}.tsx`
      );
      const content = await fs.readFile(componentPath, "utf-8");
      const metadata = this._extractComponentMetadata(content);
      if (!metadata) return false;

      const docPath = this._getDocPath(metadata.suggestedFilename);
      const filePath = path.join(docPath, "page.tsx");

      const [componentStat, docStat] = await Promise.all([
        fs.stat(componentPath),
        fs.stat(filePath),
      ]);

      // If the component file is newer than the doc file, an update is needed
      if (componentStat.mtime > docStat.mtime) {
        return true;
      }

      // Check if the content has changed
      const docContent = await fs.readFile(filePath, "utf-8");

      // Check if the extracted metadata matches the current documentation
      const docMetadataRegex = new RegExp(`${metadata.exampleFunctionName}`);
      if (!docMetadataRegex.test(docContent)) {
        return true;
      }

      return false; // No update needed
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return true; // If the doc file doesn't exist, an update is needed
      }
      if (error instanceof Error) {
        throw new Error(
          `Failed to check if documentation needs update: ${error.message}`
        );
      } else {
        throw new Error(
          "Failed to check if documentation needs update: Unknown error"
        );
      }
    }
  }
}
