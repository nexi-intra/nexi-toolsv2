"use client";
import { ReactElement } from "react";

/**
 * UseCases
 *
 * A component that displays the use cases for the Magic Links platform
 * in an interactive card-based layout. Each use case includes a link to a GitHub issue.
 */
export interface UseCase {
  id: number;
  title: string;
  description: string;
  icon: string;
  githubIssueUrl: string;
  detailsLink: string;
}

export const useCases: UseCase[] = [
  {
    id: 1,
    title: "Multi-lingual and Multi-platform",
    description:
      "The application will be multi-lingual, embedded in SharePoint pages and Teams, accessible from both desktop and mobile views, ensuring seamless visibility and access.",
    icon: "Globe",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071023&issue=nexi-intra%7Cnexi-toolsv2%7C3",
    detailsLink: "/tools/docs/use-cases/multi-lingual-and-multi-platform",
  },
  {
    id: 2,
    title: "Consolidated Tool List",
    description:
      "There will be a consolidated list comprising all tools grouped along with their respective countries and business purposes, enhancing organization and access.",
    icon: "List",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071024&issue=nexi-intra%7Cnexi-toolsv2%7C5",
    detailsLink: "/tools/docs/use-cases/consolidated-tool-list",
  },
  {
    id: 3,
    title: "Efficient Search Functionality",
    description:
      "A search box equipped with autocomplete will be integrated into the platform, which will expedite the tool searching process while making it more efficient.",
    icon: "Search",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071031&issue=nexi-intra%7Cnexi-toolsv2%7C6",
    detailsLink: "/tools/docs/use-cases/efficient-search-functionality",
  },
  {
    id: 4,
    title: "Targeted Tool Sets",
    description:
      "Every user will be presented with a targeted set of tools based on their country, role, and access rights.",
    icon: "Users",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071030&issue=nexi-intra%7Cnexi-toolsv2%7C7",
    detailsLink: "/tools/docs/use-cases/targeted-tool-sets",
  },
  {
    id: 5,
    title: "Admin Control for Mandatory Tools",
    description:
      "Admins will have the capability to designate mandatory tools for certain user groups and individuals as per requirements.",
    icon: "Shield",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071029&issue=nexi-intra%7Cnexi-toolsv2%7C8",
    detailsLink: "/tools/docs/use-cases/admin-control-for-mandatory-tools",
  },
  {
    id: 6,
    title: "User Personalization",
    description:
      "Users will have the autonomy to mark their preferred tools, allowing for a personalized and interactive user experience.",
    icon: "Star",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071028&issue=nexi-intra%7Cnexi-toolsv2%7C9",
    detailsLink: "/tools/docs/use-cases/user-personalization",
  },
  {
    id: 7,
    title: "Tool Highlighting",
    description:
      "Both mandatory and preferred tools will be prominently highlighted to the users for easy identification and access.",
    icon: "Zap",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071027&issue=nexi-intra%7Cnexi-toolsv2%7C10",
    detailsLink: "/tools/docs/use-cases/tool-highlighting",
  },
  {
    id: 8,
    title: "Exploratory Environment",
    description:
      "Users will have the freedom to browse and search for tools not within their set target, fostering an exploratory environment and user flexibility.",
    icon: "Compass",
    githubIssueUrl:
      "https://github.com/orgs/nexi-intra/projects/15?pane=issue&itemId=83071025&issue=nexi-intra%7Cnexi-toolsv2%7C11",
    detailsLink: "/tools/docs/use-cases/exploratory-environment",
  },
];
