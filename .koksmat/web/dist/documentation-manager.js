"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class DocumentationManager {
    constructor(appPath, verbose = false, force = false) {
        this._appPath = appPath;
        this._verbose = verbose;
        this._force = force;
        this._componentsPath = path_1.default.join(appPath, "components");
        this._appShortName = ""; // This will be set in the initialize method
        this._docsPath = ""; // This will be set in the initialize method
        this.initialize();
    }
    async initialize() {
        try {
            this._appShortName = await this.getAppName();
            this._docsPath = path_1.default.join(this._appPath, "app", this._appShortName, "docs", "components");
        }
        catch (error) {
            throw new Error(`Failed to initialize DocumentationManager: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async getAppName() {
        const globalFilePath = path_1.default.join(this._appPath, "app", "global.ts");
        try {
            const content = await promises_1.default.readFile(globalFilePath, "utf-8");
            const appname = this._extractValue(content, "APPNAME");
            if (appname) {
                return appname;
            }
            else {
                throw new Error("APPNAME constant not found in global.ts");
            }
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                throw new Error("global.ts file not found");
            }
            throw error;
        }
    }
    get componentsPath() {
        return this._componentsPath;
    }
    get docsPath() {
        return this._docsPath;
    }
    set componentsPath(value) {
        this._componentsPath = value;
    }
    _log(message) {
        if (this._verbose) {
            console.log(message);
        }
    }
    async listComponents() {
        const componentFiles = await promises_1.default.readdir(this._componentsPath);
        const componentInfos = await Promise.all(componentFiles
            .filter((file) => file.endsWith(".tsx"))
            .map(async (file) => {
            const fullPath = path_1.default.join(this._componentsPath, file);
            const content = await promises_1.default.readFile(fullPath, "utf-8");
            const metadata = this._extractComponentMetadata(content);
            const docPath = path_1.default.join(this._docsPath, file.replace(/\.tsx$/, ".page.tsx"));
            const hasDocumentation = await promises_1.default
                .stat(docPath)
                .then(() => true)
                .catch(() => false);
            return {
                fullPath,
                filename: file,
                metadata,
                hasDocumentation,
            };
        }));
        return componentInfos;
    }
    _extractComponentMetadata(content) {
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
    _extractValue(content, key) {
        const regex = new RegExp(`export const ${key} = ['"](.+)['"]`);
        const match = content.match(regex);
        return match ? match[1] : null;
    }
    _extractExampleFunctionName(content) {
        const match = content.match(/export const examples(\w+) =/);
        return match ? match[1] : null;
    }
    async _createDocumentationPage(component) {
        const docContent = `
'use client';

import React from 'react';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examples${component.exampleFunctionName} } from '@/components/${path_1.default.parse(component.suggestedFilename).name}';

export default function ${component.displayName.replace(/\s+/g, "")}Documentation() {
  const componentDocs: ComponentDoc[] = [
    ...examples${component.exampleFunctionName}
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
}
`;
        const docPath = path_1.default.join(this._docsPath, component.suggestedFilename);
        if (this._force || !(await promises_1.default.stat(docPath).catch(() => false))) {
            await promises_1.default.writeFile(docPath, docContent);
            this._log(`Documentation created for ${component.displayName}`);
        }
        else {
            this._log(`Documentation already exists for ${component.displayName}. Use --force to overwrite.`);
        }
    }
    async _updateMetadataFile(newComponents) {
        const metadataPath = path_1.default.join(this._appPath, "metadata.json");
        let metadata = {};
        try {
            const existingMetadata = await promises_1.default.readFile(metadataPath, "utf-8");
            metadata = JSON.parse(existingMetadata);
        }
        catch (error) {
            // If the file doesn't exist or can't be parsed, we'll create a new metadata object
        }
        for (const component of newComponents) {
            metadata[component.displayName] = {
                filename: component.suggestedFilename,
                exampleFunctionName: component.exampleFunctionName,
            };
        }
        await promises_1.default.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        this._log("Metadata file updated");
    }
    async generateDocumentation(componentName) {
        try {
            const components = await this.listComponents();
            let componentsToGenerate = components.filter((c) => c.metadata !== null);
            if (componentName) {
                componentsToGenerate = componentsToGenerate.filter((c) => { var _a; return ((_a = c.metadata) === null || _a === void 0 ? void 0 : _a.displayName) === componentName; });
                if (componentsToGenerate.length === 0) {
                    console.error(`Component "${componentName}" not found.`);
                    return;
                }
            }
            await Promise.all(componentsToGenerate.map((component) => this._createDocumentationPage(component.metadata)));
            await this._updateMetadataFile(componentsToGenerate.map((c) => c.metadata));
            console.log(`Documentation generated for ${componentsToGenerate.length} component(s).`);
        }
        catch (error) {
            console.error("Error generating documentation:", error);
        }
    }
    async checkIfDocumentationNeedsUpdate(componentName) {
        const componentPath = path_1.default.join(this._componentsPath, `${componentName}.tsx`);
        const docPath = path_1.default.join(this._docsPath, `${componentName}.page.tsx`);
        try {
            const [componentStat, docStat] = await Promise.all([
                promises_1.default.stat(componentPath),
                promises_1.default.stat(docPath),
            ]);
            // If the component file is newer than the doc file, an update is needed
            if (componentStat.mtime > docStat.mtime) {
                return true;
            }
            // Check if the content has changed
            const [componentContent, docContent] = await Promise.all([
                promises_1.default.readFile(componentPath, "utf-8"),
                promises_1.default.readFile(docPath, "utf-8"),
            ]);
            const componentMetadata = this._extractComponentMetadata(componentContent);
            if (!componentMetadata) {
                return false; // If we can't extract metadata, assume no update is needed
            }
            // Check if the extracted metadata matches the current documentation
            const docMetadataRegex = new RegExp(`examples${componentMetadata.exampleFunctionName}`);
            if (!docMetadataRegex.test(docContent)) {
                return true;
            }
            return false; // No update needed
        }
        catch (error) {
            // If the doc file doesn't exist, an update is needed
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                return true;
            }
            throw error;
        }
    }
}
exports.DocumentationManager = DocumentationManager;
