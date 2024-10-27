import React from 'react'
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal, Folder, Forward, Trash2, MoreHorizontal, BadgeCheck, CreditCard, Bell, LogOut, Sparkles } from "lucide-react"
import type { SidebarData, SupportedLanguage } from "../components/lib/types-sidebar-data"

export const sidebarData: SidebarData = {
  language: "en" as SupportedLanguage,
  teams: [
    {
      name: { en: "Acme Inc", da: "Acme A/S" },
      logo: <GalleryVerticalEnd className="h-4 w-4" />,
      plan: { en: "Enterprise", da: "Virksomhed" },
    },
    {
      name: { en: "Acme Corp.", da: "Acme Corp." },
      logo: <AudioWaveform className="h-4 w-4" />,
      plan: { en: "Startup", da: "Opstart" },
    },
    {
      name: { en: "Evil Corp.", da: "Ond Corp." },
      logo: <Command className="h-4 w-4" />,
      plan: { en: "Free", da: "Gratis" },
    },
  ],
  navMain: [
    {
      title: { en: "Playground", da: "Legeplads" },
      url: "#",
      icon: <SquareTerminal className="h-4 w-4" />,
      isActive: true,
      items: [
        {
          title: { en: "History", da: "Historik" },
          url: "#",
        },
        {
          title: { en: "Starred", da: "Stjernemarkeret" },
          url: "#",
        },
        {
          title: { en: "Settings", da: "Indstillinger" },
          url: "#",
        },
      ],
    },
    {
      title: { en: "Models", da: "Modeller" },
      url: "#",
      icon: <Bot className="h-4 w-4" />,
      items: [
        {
          title: { en: "Genesis", da: "Genesis" },
          url: "#",
        },
        {
          title: { en: "Explorer", da: "Udforskeren" },
          url: "#",
        },
        {
          title: { en: "Quantum", da: "Kvantum" },
          url: "#",
        },
      ],
    },
    {
      title: { en: "Documentation", da: "Dokumentation" },
      url: "#",
      icon: <BookOpen className="h-4 w-4" />,
      items: [
        {
          title: { en: "Introduction", da: "Introduktion" },
          url: "#",
        },
        {
          title: { en: "Get Started", da: "Kom i gang" },
          url: "#",
        },
        {
          title: { en: "Tutorials", da: "Vejledninger" },
          url: "#",
        },
        {
          title: { en: "Changelog", da: "Ændringslog" },
          url: "#",
        },
      ],
    },
    {
      title: { en: "Settings", da: "Indstillinger" },
      url: "#",
      icon: <Settings2 className="h-4 w-4" />,
      items: [
        {
          title: { en: "General", da: "Generelt" },
          url: "#",
        },
        {
          title: { en: "Team", da: "Hold" },
          url: "#",
        },
        {
          title: { en: "Billing", da: "Fakturering" },
          url: "#",
        },
        {
          title: { en: "Limits", da: "Begrænsninger" },
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: { en: "Design Engineering", da: "Designteknik" },
      url: "#",
      icon: <Frame className="h-4 w-4" />,
      moreIcon: <MoreHorizontal className="h-4 w-4" />,
      actions: [
        { label: { en: "View Project", da: "Vis projekt" }, icon: <Folder className="h-4 w-4" /> },
        { label: { en: "Share Project", da: "Del projekt" }, icon: <Forward className="h-4 w-4" /> },
        { label: { en: "Delete Project", da: "Slet projekt" }, icon: <Trash2 className="h-4 w-4" /> },
      ],
    },
    {
      name: { en: "Sales & Marketing", da: "Salg & Marketing" },
      url: "#",
      icon: <PieChart className="h-4 w-4" />,
      moreIcon: <MoreHorizontal className="h-4 w-4" />,
      actions: [
        { label: { en: "View Project", da: "Vis projekt" }, icon: <Folder className="h-4 w-4" /> },
        { label: { en: "Share Project", da: "Del projekt" }, icon: <Forward className="h-4 w-4" /> },
        { label: { en: "Delete Project", da: "Slet projekt" }, icon: <Trash2 className="h-4 w-4" /> },
      ],
    },
    {
      name: { en: "Travel", da: "Rejser" },
      url: "#",
      icon: <Map className="h-4 w-4" />,
      moreIcon: <MoreHorizontal className="h-4 w-4" />,
      actions: [
        { label: { en: "View Project", da: "Vis projekt" }, icon: <Folder className="h-4 w-4" /> },
        { label: { en: "Share Project", da: "Del projekt" }, icon: <Forward className="h-4 w-4" /> },
        { label: { en: "Delete Project", da: "Slet projekt" }, icon: <Trash2 className="h-4 w-4" /> },
      ],
    },
  ],
  moreProjectsIcon: <MoreHorizontal className="h-4 w-4" />,
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  userMenuItems: [
    { label: { en: "Upgrade to Pro", da: "Opgrader til Pro" }, icon: <Sparkles className="h-4 w-4" /> },
    { label: { en: "Account", da: "Konto" }, icon: <BadgeCheck className="h-4 w-4" /> },
    { label: { en: "Billing", da: "Fakturering" }, icon: <CreditCard className="h-4 w-4" /> },
    { label: { en: "Notifications", da: "Notifikationer" }, icon: <Bell className="h-4 w-4" /> },
    { label: { en: "Log out", da: "Log ud" }, icon: <LogOut className="h-4 w-4" /> },
  ],
}