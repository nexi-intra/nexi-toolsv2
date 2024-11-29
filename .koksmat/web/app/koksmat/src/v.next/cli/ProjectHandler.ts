import { NodeImportExportType, TreeNode } from "./navigation-schemas";

export class ProjectHandler implements NodeImportExportType {
  async exportNodes(): Promise<TreeNode[]> {
    throw new Error("Project export not implemented");
  }

  async importNodes(nodes: TreeNode[]): Promise<void> {
    throw new Error("Project import not implemented");
  }
}
