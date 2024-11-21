import { z } from "zod";
import { SharedAttributes } from "../../schemas/_shared";
import {
  Country,
  Purpose,
  Tag,
  ToolGroup,
  User,
} from "@/components/app-api-entity-route";
import { ToolView, schemaMapObjects } from "../../schemas/forms";

// Define a union type for all entity types
type EntityType = ToolView | Country | Purpose | Tag | ToolGroup | User;

/**
 * MockBackendService
 *
 * This file contains a mock implementation of the backend service
 * for the Magic Links project. It simulates database operations
 * using in-memory storage with pre-populated data.
 */

type EntityInput<T extends z.ZodObject<any>> = z.input<
  typeof SharedAttributes
> &
  z.input<T>;
type EntityOutput<T extends z.ZodObject<any>> = z.output<
  typeof SharedAttributes
> &
  z.output<T>;
let id = 0;
export function createEntity<T extends z.ZodObject<any>>(
  schema: T,
  userId: string,
  data: Partial<EntityInput<T>>
): EntityOutput<T> {
  const now = new Date();
  id++;
  const sharedData = {
    id: id,
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
    deletedAt: null,
    deletedBy: null,
  };

  const mergedData = {
    ...sharedData,
    ...data,
  };

  const validatedData = SharedAttributes.merge(schema).parse(mergedData);
  return validatedData as EntityOutput<T>;
}

export function createMock() {
  //TODO: Move the examples into the schema files
  // Pre-populated mock database
  const db: Record<string, any[]> = {
    tool: [
      // Microsoft 365 Tools
      // {
      //   name: "Microsoft Teams",
      //   description: "Team collaboration and communication platform",
      //   url: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",
      //   groupId: "group1",
      //   purposes: [
      //     { id: "purpose1", value: "Collaboration", order: "1" },
      //     { id: "purpose2", value: "Communication", order: "2" },
      //   ],
      //   tags: [
      //     { id: "tag1", value: "Productivity", order: "1" },
      //     { id: "tag2", value: "Teamwork", order: "2" },
      //   ],
      //   version: "1.5.00.8070",
      //   status: "active",
      //   icon: "https://example.com/teams-icon.png",
      //   documentationUrl: "https://docs.microsoft.com/en-us/microsoftteams/",
      //   supportContact: [
      //     { id: "email", value: "support@microsoft.com", order: "1" },
      //   ],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Windows", "macOS", "iOS", "Android", "Web"],
      //   systemRequirements: "Windows 10 or later, macOS 10.14 or later",
      //   // New optional fields with placeholder data
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: "https://github.com/microsoft/teams",
      //   collaborationType: [{ id: "type1", value: "Proprietary", order: "1" }],
      //   documents: [
      //     { name: "User Guide", url: "https://example.com/teams-user-guide.pdf" },
      //   ],
      //   teamSize: 500,
      //   primaryFocus: [{ id: "focus1", value: "Communication", order: "1" }],
      // },
      // {
      //   name: "Microsoft Word",
      //   description: "Word processing software",
      //   url: "https://www.microsoft.com/en-us/microsoft-365/word",
      //   groupId: "group1",
      //   purposes: [{ id: "purpose3", value: "Document Creation", order: "1" }],
      //   tags: [{ id: "tag1", value: "Productivity", order: "1" }],
      //   version: "16.0.13929.20296",
      //   status: "active",
      //   icon: "https://example.com/word-icon.png",
      //   documentationUrl: "https://support.microsoft.com/en-us/word",
      //   supportContact: [
      //     { id: "email", value: "support@microsoft.com", order: "1" },
      //   ],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Windows", "macOS", "iOS", "Android", "Web"],
      //   systemRequirements: "Windows 10 or later, macOS 10.14 or later",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Proprietary", order: "1" }],
      //   documents: [
      //     { name: "Getting Started", url: "https://example.com/word-guide.pdf" },
      //   ],
      //   teamSize: 800,
      //   primaryFocus: [{ id: "focus1", value: "Productivity", order: "1" }],
      // },
      // // Google Workspace Tools
      // {
      //   name: "Google Docs",
      //   description: "Online document editor",
      //   url: "https://docs.google.com",
      //   groupId: "group2",
      //   purposes: [{ id: "purpose3", value: "Document Creation", order: "1" }],
      //   tags: [{ id: "tag2", value: "Collaboration", order: "1" }],
      //   version: "N/A",
      //   status: "active",
      //   icon: "https://example.com/google-docs-icon.png",
      //   documentationUrl: "https://support.google.com/docs",
      //   supportContact: [
      //     { id: "email", value: "support@google.com", order: "1" },
      //   ],
      //   license: [{ id: "freemium", value: "Freemium", order: "1" }],
      //   compatiblePlatforms: ["Web", "iOS", "Android"],
      //   systemRequirements: "Modern web browser",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     { name: "FAQ", url: "https://example.com/google-docs-faq.pdf" },
      //   ],
      //   teamSize: 300,
      //   primaryFocus: [{ id: "focus1", value: "Productivity", order: "1" }],
      // },
      // {
      //   name: "Google Sheets",
      //   description: "Online spreadsheet editor",
      //   url: "https://sheets.google.com",
      //   groupId: "group2",
      //   purposes: [
      //     { id: "purpose3", value: "Data Analysis", order: "1" },
      //     { id: "purpose4", value: "Spreadsheet Management", order: "2" },
      //   ],
      //   tags: [{ id: "tag2", value: "Collaboration", order: "1" }],
      //   version: "N/A",
      //   status: "active",
      //   icon: "https://example.com/google-sheets-icon.png",
      //   documentationUrl: "https://support.google.com/sheets",
      //   supportContact: [
      //     { id: "email", value: "support@google.com", order: "1" },
      //   ],
      //   license: [{ id: "freemium", value: "Freemium", order: "1" }],
      //   compatiblePlatforms: ["Web", "iOS", "Android"],
      //   systemRequirements: "Modern web browser",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     {
      //       name: "User Manual",
      //       url: "https://example.com/google-sheets-manual.pdf",
      //     },
      //   ],
      //   teamSize: 250,
      //   primaryFocus: [{ id: "focus1", value: "Productivity", order: "1" }],
      // },
      // // Adobe Creative Cloud Tools
      // {
      //   name: "Adobe Photoshop",
      //   description: "Image editing software",
      //   url: "https://www.adobe.com/products/photoshop.html",
      //   groupId: "group3",
      //   purposes: [{ id: "purpose5", value: "Graphic Design", order: "1" }],
      //   tags: [{ id: "tag3", value: "Design", order: "1" }],
      //   version: "2021 (22.4.2)",
      //   status: "active",
      //   icon: "https://example.com/photoshop-icon.png",
      //   documentationUrl: "https://helpx.adobe.com/photoshop",
      //   supportContact: [{ id: "email", value: "support@adobe.com", order: "1" }],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Windows", "macOS"],
      //   systemRequirements: "Windows 10 or later, macOS 10.15 or later",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Proprietary", order: "1" }],
      //   documents: [
      //     {
      //       name: "Tutorials",
      //       url: "https://example.com/photoshop-tutorials.pdf",
      //     },
      //   ],
      //   teamSize: 1000,
      //   primaryFocus: [{ id: "focus1", value: "Design", order: "1" }],
      // },
      // {
      //   name: "Adobe Illustrator",
      //   description: "Vector graphics editor",
      //   url: "https://www.adobe.com/products/illustrator.html",
      //   groupId: "group3",
      //   purposes: [{ id: "purpose5", value: "Graphic Design", order: "1" }],
      //   tags: [{ id: "tag3", value: "Design", order: "1" }],
      //   version: "2021 (25.3.1)",
      //   status: "active",
      //   icon: "https://example.com/illustrator-icon.png",
      //   documentationUrl: "https://helpx.adobe.com/illustrator",
      //   supportContact: [{ id: "email", value: "support@adobe.com", order: "1" }],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Windows", "macOS"],
      //   systemRequirements: "Windows 10 or later, macOS 10.15 or later",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Proprietary", order: "1" }],
      //   documents: [
      //     {
      //       name: "Getting Started",
      //       url: "https://example.com/illustrator-guide.pdf",
      //     },
      //   ],
      //   teamSize: 800,
      //   primaryFocus: [{ id: "focus1", value: "Design", order: "1" }],
      // },
      // // Slack Tools
      // {
      //   name: "Slack",
      //   description: "Team communication platform",
      //   url: "https://slack.com",
      //   groupId: "group4",
      //   purposes: [{ id: "purpose1", value: "Communication", order: "1" }],
      //   tags: [{ id: "tag4", value: "Messaging", order: "1" }],
      //   version: "4.19.2",
      //   status: "active",
      //   icon: "https://example.com/slack-icon.png",
      //   documentationUrl: "https://slack.com/help",
      //   supportContact: [
      //     { id: "email", value: "feedback@slack.com", order: "1" },
      //   ],
      //   license: [{ id: "freemium", value: "Freemium", order: "1" }],
      //   compatiblePlatforms: [
      //     "Windows",
      //     "macOS",
      //     "Linux",
      //     "iOS",
      //     "Android",
      //     "Web",
      //   ],
      //   systemRequirements: "Windows 7 or later, macOS 10.10 or later",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     { name: "User Guide", url: "https://example.com/slack-user-guide.pdf" },
      //   ],
      //   teamSize: 2000,
      //   primaryFocus: [{ id: "focus1", value: "Communication", order: "1" }],
      // },
      // // Atlassian Suite Tools
      // {
      //   name: "Jira Software",
      //   description: "Project tracking software",
      //   url: "https://www.atlassian.com/software/jira",
      //   groupId: "group5",
      //   purposes: [{ id: "purpose2", value: "Project Management", order: "1" }],
      //   tags: [{ id: "tag5", value: "Tracking", order: "1" }],
      //   version: "8.17.1",
      //   status: "active",
      //   icon: "https://example.com/jira-icon.png",
      //   documentationUrl: "https://confluence.atlassian.com/jira",
      //   supportContact: [
      //     { id: "email", value: "support@atlassian.com", order: "1" },
      //   ],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Web"],
      //   systemRequirements: "Modern web browser",
      //   countries: [{ id: "country1", value: "Australia", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     {
      //       name: "Admin Guide",
      //       url: "https://example.com/jira-admin-guide.pdf",
      //     },
      //   ],
      //   teamSize: 1500,
      //   primaryFocus: [{ id: "focus1", value: "Project Management", order: "1" }],
      // },
      // {
      //   name: "Confluence",
      //   description: "Team collaboration software",
      //   url: "https://www.atlassian.com/software/confluence",
      //   groupId: "group5",
      //   purposes: [
      //     { id: "purpose1", value: "Collaboration", order: "1" },
      //     { id: "purpose3", value: "Documentation", order: "2" },
      //   ],
      //   tags: [{ id: "tag5", value: "Knowledge Base", order: "1" }],
      //   version: "7.12.2",
      //   status: "active",
      //   icon: "https://example.com/confluence-icon.png",
      //   documentationUrl: "https://confluence.atlassian.com/confluence",
      //   supportContact: [
      //     { id: "email", value: "support@atlassian.com", order: "1" },
      //   ],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Web"],
      //   systemRequirements: "Modern web browser",
      //   countries: [{ id: "country1", value: "Australia", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     {
      //       name: "User Guide",
      //       url: "https://example.com/confluence-user-guide.pdf",
      //     },
      //   ],
      //   teamSize: 1200,
      //   primaryFocus: [{ id: "focus1", value: "Collaboration", order: "1" }],
      // },
      // // Additional Tools
      // {
      //   name: "Salesforce CRM",
      //   description: "Customer relationship management platform",
      //   url: "https://www.salesforce.com/crm/",
      //   groupId: "group6",
      //   purposes: [{ id: "purpose3", value: "Sales Management", order: "1" }],
      //   tags: [{ id: "tag6", value: "CRM", order: "1" }],
      //   version: "Summer '21",
      //   status: "active",
      //   icon: "https://example.com/salesforce-icon.png",
      //   documentationUrl: "https://help.salesforce.com",
      //   supportContact: [
      //     { id: "email", value: "support@salesforce.com", order: "1" },
      //   ],
      //   license: [{ id: "commercial", value: "Commercial", order: "1" }],
      //   compatiblePlatforms: ["Web", "iOS", "Android"],
      //   systemRequirements: "Modern web browser",
      //   countries: [{ id: "country1", value: "USA", order: "1" }],
      //   repositoryUrl: null,
      //   collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
      //   documents: [
      //     {
      //       name: "Admin Guide",
      //       url: "https://example.com/salesforce-admin-guide.pdf",
      //     },
      //   ],
      //   teamSize: 3000,
      //   primaryFocus: [{ id: "focus1", value: "Sales", order: "1" }],
      // },
      // Continue adjusting the rest of your tools similarly...
    ],
    country: [
      // European countries
      createEntity(schemaMapObjects.country, "system", {
        name: "Albania",
        code: "AL",
        continent: "Europe",
        currency: "ALL",
        phoneCode: "+355",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Austria",
        code: "AT",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+43",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Belgium",
        code: "BE",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+32",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Croatia",
        code: "HR",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+385",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Denmark",
        code: "DK",
        continent: "Europe",
        currency: "DKK",
        phoneCode: "+45",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Estonia",
        code: "EE",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+372",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Finland",
        code: "FI",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+358",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "France",
        code: "FR",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+33",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Germany",
        code: "DE",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+49",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Greece",
        code: "GR",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+30",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Hungary",
        code: "HU",
        continent: "Europe",
        currency: "HUF",
        phoneCode: "+36",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Iceland",
        code: "IS",
        continent: "Europe",
        currency: "ISK",
        phoneCode: "+354",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Italy",
        code: "IT",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+39",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Latvia",
        code: "LV",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+371",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Netherlands",
        code: "NL",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+31",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Norway",
        code: "NO",
        continent: "Europe",
        currency: "NOK",
        phoneCode: "+47",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Poland",
        code: "PL",
        continent: "Europe",
        currency: "PLN",
        phoneCode: "+48",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Portugal",
        code: "PT",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+351",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Spain",
        code: "ES",
        continent: "Europe",
        currency: "EUR",
        phoneCode: "+34",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "Sweden",
        code: "SE",
        continent: "Europe",
        currency: "SEK",
        phoneCode: "+46",
      }),
      createEntity(schemaMapObjects.country, "system", {
        name: "United Kingdom",
        code: "GB",
        continent: "Europe",
        currency: "GBP",
        phoneCode: "+44",
      }),
    ],
    purpose: [
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Collaboration",
        description: "Tools for team collaboration and communication",
        category: "Productivity",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Project Management",
        description: "Tools for planning, executing, and tracking projects",
        category: "Productivity",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Customer Relationship Management",
        description: "Tools for managing company interactions with customers",
        category: "Sales",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Marketing Automation",
        description: "Tools for automating marketing activities and campaigns",
        category: "Marketing",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Data Analysis",
        description: "Tools for analyzing and interpreting data",
        category: "Analytics",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Content Creation",
        description: "Tools for creating and editing content",
        category: "Creative",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Email Management",
        description: "Tools for managing email communications",
        category: "Communication",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "File Storage",
        description: "Tools for storing and sharing files",
        category: "Storage",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Video Conferencing",
        description: "Tools for conducting video meetings",
        category: "Communication",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Networking",
        description: "Tools for managing network infrastructure",
        category: "IT",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Security",
        description: "Tools for securing systems and data",
        category: "IT",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Development",
        description: "Tools for software development and version control",
        category: "Engineering",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Accounting",
        description: "Tools for managing financial transactions",
        category: "Finance",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Human Resources",
        description: "Tools for managing employee information and recruitment",
        category: "HR",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Customer Support",
        description: "Tools for providing customer service and support",
        category: "Support",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Scheduling",
        description: "Tools for scheduling meetings and appointments",
        category: "Productivity",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Learning Management",
        description: "Tools for managing training and educational content",
        category: "Education",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "E-commerce",
        description: "Tools for managing online sales and storefronts",
        category: "Sales",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Design",
        description: "Tools for graphic and UI/UX design",
        category: "Creative",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Cloud Computing",
        description: "Tools for cloud infrastructure and services",
        category: "IT",
      }),
      createEntity(schemaMapObjects.purpose, "system", {
        name: "Social Media Management",
        description: "Tools for managing social media accounts and content",
        category: "Marketing",
      }),
    ],
    tag: [
      createEntity(schemaMapObjects.tag, "system", {
        name: "Microsoft 365",
        color: "#0078D4",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Google Workspace",
        color: "#4285F4",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Adobe Creative Cloud",
        color: "#FF0000",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Slack",
        color: "#4A154B",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Atlassian",
        color: "#0052CC",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Salesforce",
        color: "#1798C1",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Zoom",
        color: "#2D8CFF",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Dropbox",
        color: "#0061FF",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Amazon Web Services",
        color: "#FF9900",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "GitHub",
        color: "#181717",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Jira",
        color: "#2684FF",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Trello",
        color: "#0079BF",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Notion",
        color: "#000000",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Asana",
        color: "#273347",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "SAP",
        color: "#0FAAFF",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Oracle",
        color: "#F80000",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "IBM Cloud",
        color: "#054ADA",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Apple",
        color: "#A2AAAD",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Cisco",
        color: "#1BA0D7",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "HubSpot",
        color: "#FF7A59",
      }),
      createEntity(schemaMapObjects.tag, "system", {
        name: "Zendesk",
        color: "#03363D",
      }),
    ],
    toolGroup: [
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Microsoft 365",
        description: "Tools provided by Microsoft 365 suite",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Google Workspace",
        description: "Collaboration and productivity tools by Google",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Adobe Creative Cloud",
        description: "Suite of creative applications by Adobe",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Slack Tools",
        description: "Communication and collaboration tools by Slack",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Atlassian Suite",
        description: "Development and collaboration tools by Atlassian",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Salesforce",
        description: "Customer relationship management tools by Salesforce",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Zoom",
        description: "Video conferencing tools by Zoom",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Dropbox",
        description: "File storage and sharing services by Dropbox",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Amazon Web Services",
        description: "Cloud computing services by AWS",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "GitHub",
        description: "Code hosting and collaboration platform by GitHub",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Jira",
        description: "Project tracking software by Atlassian",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Trello",
        description: "Project management and collaboration tool by Trello",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Notion",
        description: "All-in-one workspace for notes and tasks by Notion",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Asana",
        description: "Project management software by Asana",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "SAP",
        description: "Enterprise software applications by SAP",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Oracle",
        description: "Database and cloud services by Oracle",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "IBM Cloud",
        description: "Cloud computing services by IBM",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Apple Developer Tools",
        description: "Development tools provided by Apple",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Cisco Tools",
        description: "Networking and communication solutions by Cisco",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "HubSpot",
        description: "Marketing and sales software by HubSpot",
      }),
      createEntity(schemaMapObjects.toolgroup, "system", {
        name: "Zendesk",
        description: "Customer service software by Zendesk",
      }),
    ],
    user: [
      createEntity(schemaMapObjects.user, "system", {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        countryId: "GB",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "user",
        countryId: "US",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        role: "user",
        countryId: "CA",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Bob Williams",
        email: "bob.williams@example.com",
        role: "editor",
        countryId: "AU",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Carol Martinez",
        email: "carol.martinez@example.com",
        role: "user",
        countryId: "ES",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "David Brown",
        email: "david.brown@example.com",
        role: "admin",
        countryId: "DE",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Eva Davis",
        email: "eva.davis@example.com",
        role: "user",
        countryId: "FR",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Frank Miller",
        email: "frank.miller@example.com",
        role: "editor",
        countryId: "IT",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Grace Wilson",
        email: "grace.wilson@example.com",
        role: "user",
        countryId: "NL",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Henry Taylor",
        email: "henry.taylor@example.com",
        role: "admin",
        countryId: "SE",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Ivy Anderson",
        email: "ivy.anderson@example.com",
        role: "user",
        countryId: "NO",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Jack Thomas",
        email: "jack.thomas@example.com",
        role: "editor",
        countryId: "FI",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Kathy Jackson",
        email: "kathy.jackson@example.com",
        role: "user",
        countryId: "DK",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Leo White",
        email: "leo.white@example.com",
        role: "user",
        countryId: "IE",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Mia Harris",
        email: "mia.harris@example.com",
        role: "admin",
        countryId: "NZ",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Nick Martin",
        email: "nick.martin@example.com",
        role: "user",
        countryId: "CH",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Olivia Lee",
        email: "olivia.lee@example.com",
        role: "editor",
        countryId: "BE",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Paul Walker",
        email: "paul.walker@example.com",
        role: "user",
        countryId: "AT",
        status: "inactive",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Queen Young",
        email: "queen.young@example.com",
        role: "user",
        countryId: "PT",
        status: "active",
      }),
      createEntity(schemaMapObjects.user, "system", {
        name: "Ryan King",
        email: "ryan.king@example.com",
        role: "admin",
        countryId: "GR",
        status: "active",
      }),
    ],
  };

  // Mock backend service
  const mockBackendService = {
    getAll: async (entityType: string, page: number, pageSize: number) => {
      const entities = db[entityType] || [];
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = entities.slice(startIndex, endIndex);
      const totalCount = entities.length;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages,
      };
    },

    getById: async (entityType: string, id: string) => {
      const entity = (db[entityType] || []).find((item) => item.id === id);
      if (!entity) {
        throw new Error("Entity not found");
      }
      return entity;
    },
  };

  // Factory function to create the mock backend service
  return mockBackendService;
}
