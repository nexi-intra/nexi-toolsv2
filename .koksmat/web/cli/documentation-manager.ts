import fs from "fs/promises";
import path from "path";

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

export class DocumentationManager {
  private _appPath: string;
  private _appShortName: string;
  private _componentsPath: string;
  private _docsPath: string;
  private _verbose: boolean;
  private _force: boolean;

  constructor(
    appPath: string,
    verbose: boolean = false,
    force: boolean = false
  ) {
    this._appPath = appPath;
    this._verbose = verbose;
    this._force = force;
    this._componentsPath = path.join(appPath, "components");
    this._appShortName = ""; // This will be set in the initialize method
    this._docsPath = ""; // This will be set in the initialize method
    this.initialize();
  }

  async initialize(): Promise<void> {
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
      throw new Error(
        `Failed to initialize DocumentationManager: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async getAppName(): Promise<string> {
    const globalFilePath = path.join(this._appPath, "app", "global.ts");
    try {
      const content = await fs.readFile(globalFilePath, "utf-8");
      const appname = this._extractValue(content, "APPNAME");

      if (appname) {
        return appname;
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
      console.log(message);
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
          const docPath = path.join(
            this._docsPath,
            file.replace(/\.tsx$/, ".page.tsx")
          );
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

    if (suggestedFilename && displayName) {
      return {
        suggestedFilename,
        displayName,
        exampleFunctionName: exampleFunctionName || "",
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
    const match = content.match(/export const examples(\w+) =/);
    return match ? match[1] : null;
  }

  private async _createDocumentationPage(
    component: ComponentMetadata
  ): Promise<void> {
    const docContent = `
'use client';

import React from 'react';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examples${component.exampleFunctionName} } from '@/components/${
      path.parse(component.suggestedFilename).name
    }';

export default function ${component.displayName.replace(
      /\s+/g,
      ""
    )}Documentation() {
  const componentDocs: ComponentDoc[] = [
    ...examples${component.exampleFunctionName}
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
}
`;

    const docPath = path.join(this._docsPath, component.suggestedFilename);

    if (this._force || !(await fs.stat(docPath).catch(() => false))) {
      await fs.writeFile(docPath, docContent);
      this._log(`Documentation created for ${component.displayName}`);
    } else {
      this._log(
        `Documentation already exists for ${component.displayName}. Use --force to overwrite.`
      );
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
      // If the file doesn't exist or can't be parsed, we'll create a new metadata object
    }

    for (const component of newComponents) {
      metadata[component.displayName] = {
        filename: component.suggestedFilename,
        exampleFunctionName: component.exampleFunctionName,
      };
    }

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    this._log("Metadata file updated");
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
          console.error(`Component "${componentName}" not found.`);
          return;
        }
      }

      await Promise.all(
        componentsToGenerate.map((component) =>
          this._createDocumentationPage(component.metadata!)
        )
      );

      await this._updateMetadataFile(
        componentsToGenerate.map((c) => c.metadata!)
      );

      console.log(
        `Documentation generated for ${componentsToGenerate.length} component(s).`
      );
    } catch (error) {
      console.error("Error generating documentation:", error);
    }
  }

  public async checkIfDocumentationNeedsUpdate(
    componentName: string
  ): Promise<boolean> {
    const componentPath = path.join(
      this._componentsPath,
      `${componentName}.tsx`
    );
    const docPath = path.join(this._docsPath, `${componentName}.page.tsx`);

    try {
      const [componentStat, docStat] = await Promise.all([
        fs.stat(componentPath),
        fs.stat(docPath),
      ]);

      // If the component file is newer than the doc file, an update is needed
      if (componentStat.mtime > docStat.mtime) {
        return true;
      }

      // Check if the content has changed
      const [componentContent, docContent] = await Promise.all([
        fs.readFile(componentPath, "utf-8"),
        fs.readFile(docPath, "utf-8"),
      ]);

      const componentMetadata =
        this._extractComponentMetadata(componentContent);
      if (!componentMetadata) {
        return false; // If we can't extract metadata, assume no update is needed
      }

      // Check if the extracted metadata matches the current documentation
      const docMetadataRegex = new RegExp(
        `examples${componentMetadata.exampleFunctionName}`
      );
      if (!docMetadataRegex.test(docContent)) {
        return true;
      }

      return false; // No update needed
    } catch (error) {
      // If the doc file doesn't exist, an update is needed
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return true;
      }
      throw error;
    }
  }
}
