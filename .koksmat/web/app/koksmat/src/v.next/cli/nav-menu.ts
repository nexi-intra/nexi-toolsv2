import { NavItem, SidebarData } from "@/components/lib/types-sidebar-data";
import { NodeImportExportType, TreeNode } from "./navigation-schemas";
import { sidebarData } from "@/app/sidebar-data";
// Define the ActionType (you might want to adjust this based on your actual ActionType)
type ActionType = string;

// Function to convert a NavItem to a TreeNode
function navItemToTreeNode(navItem: NavItem): TreeNode {
  const treeNode: TreeNode = {
    id: navItem.url,
    text: navItem.title.en, // Using English title as the primary text
    translations: {
      en: navItem.title.en, // Store English translation as well
    },
    icon: navItem.icon,
  };

  // Add translations for all available languages
  Object.entries(navItem.title).forEach(([lang, text]) => {
    treeNode.translations[lang] = text;
  });

  if (navItem.items && navItem.items.length > 0) {
    treeNode.children = navItem.items.map((item) => ({
      id: item.url,
      text: item.title.en,
      translations: {
        en: item.title.en,
        ...Object.fromEntries(Object.entries(item.title)),
      },
      icon: "file" as const,
    }));
  }

  return treeNode;
}

// Function to convert sidebarData to TreeNode structure
export function sidebarDataToTreeNodes(data: SidebarData): TreeNode[] {
  try {
    return data.navMain.map(navItemToTreeNode);
  } catch (error) {
    console.error(
      "Error converting sidebar data to TreeNodes:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

// Function to export sidebar data
export function exportSidebar(): string {
  try {
    const treeNodes = sidebarDataToTreeNodes(sidebarData);
    return JSON.stringify(treeNodes, null, 2);
  } catch (error) {
    console.error(
      "Error exporting sidebar:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Failed to export sidebar data");
  }
}

export class MenuHandler implements NodeImportExportType {
  async exportNodes(): Promise<TreeNode[]> {
    return sidebarDataToTreeNodes(sidebarData);
  }

  async importNodes(nodes: TreeNode[]): Promise<void> {
    throw new Error("Menu import not implemented");
  }
}
