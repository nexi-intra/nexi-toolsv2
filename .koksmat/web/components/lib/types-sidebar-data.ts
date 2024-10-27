import { ReactElement } from "react";

export type SupportedLanguage = "en" | "da";

export type TranslatedString = {
  [key in SupportedLanguage]: string;
};

export interface Team {
  name: TranslatedString;
  logo: ReactElement;
  plan: TranslatedString;
}

export interface NavItem {
  title: TranslatedString;
  url: string;
  icon: ReactElement;
  isActive?: boolean;
  items?: Array<{
    title: TranslatedString;
    url: string;
  }>;
}

export interface Project {
  name: TranslatedString;
  url: string;
  icon: ReactElement;
  moreIcon: ReactElement;
  actions: Array<{
    label: TranslatedString;
    icon: ReactElement;
  }>;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface UserMenuItem {
  label: TranslatedString;
  icon: ReactElement;
}

export interface SidebarData {
  language: SupportedLanguage;
  teams: Team[];
  navMain: NavItem[];
  projects: Project[];
  moreProjectsIcon: ReactElement;
  user: User;
  userMenuItems: UserMenuItem[];
}
