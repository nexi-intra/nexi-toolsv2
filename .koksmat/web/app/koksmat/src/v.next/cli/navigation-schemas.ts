import { z } from "zod";

// Define the supported languages
const SupportedLanguage = z.enum(["en", "da"]);

// Define the TranslatedString schema
const TranslatedString = z.object({
  en: z.string(),
  da: z.string(),
});

// Define the NavItem schema
const NavItem = z.object({
  title: TranslatedString,
  url: z.string(),
  icon: z.any(), // We can't easily validate ReactElement with Zod, so we use any
  isActive: z.boolean().optional(),
  items: z
    .array(
      z.object({
        title: TranslatedString,
        url: z.string(),
      })
    )
    .optional(),
});

// Define the TreeNode schema
const TreeNode: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    text: z.string(),
    icon: z.enum(["folder", "file", "fileText", "fileCode"]),
    children: z.array(TreeNode).optional(),
    action: z.string().optional(), // Assuming ActionType is a string
  })
);

// Define the SidebarData schema
const SidebarData = z.object({
  language: SupportedLanguage,
  teams: z.array(
    z.object({
      name: TranslatedString,
      logo: z.any(), // ReactElement
      plan: TranslatedString,
    })
  ),
  navMain: z.array(NavItem),
  projects: z.array(
    z.object({
      name: TranslatedString,
      url: z.string(),
      icon: z.any(), // ReactElement
      moreIcon: z.any(), // ReactElement
      actions: z.array(
        z.object({
          label: TranslatedString,
          icon: z.any(), // ReactElement
        })
      ),
    })
  ),
  moreProjectsIcon: z.any(), // ReactElement
  user: z.object({
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
  }),
  userMenuItems: z.array(
    z.object({
      label: TranslatedString,
      icon: z.any(), // ReactElement
    })
  ),
});

// Export the schemas
export const schemas = {
  SupportedLanguage,
  TranslatedString,
  NavItem,
  TreeNode,
  SidebarData,
};

// Export types derived from the schemas
export type SupportedLanguage = z.infer<typeof SupportedLanguage>;
export type TranslatedString = z.infer<typeof TranslatedString>;
export type NavItem = z.infer<typeof NavItem>;
export type TreeNode = z.infer<typeof TreeNode>;
export type SidebarData = z.infer<typeof SidebarData>;

// Define the NodeImportExportType interface
export interface NodeImportExportType {
  exportNodes(): Promise<TreeNode[]>;
  importNodes(nodes: TreeNode[]): Promise<void>;
}
