"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidebarData = void 0;
exports.sidebarData = {
    language: "en",
    teams: [
        {
            name: { en: "Acme Inc", da: "Acme A/S" },
            logo: "GalleryVerticalEnd",
            plan: { en: "Enterprise", da: "Virksomhed" },
        },
        {
            name: { en: "Acme Corp.", da: "Acme Corp." },
            logo: "AudioWaveform",
            plan: { en: "Startup", da: "Opstart" },
        },
        {
            name: { en: "Evil Corp.", da: "Ond Corp." },
            logo: "Command",
            plan: { en: "Free", da: "Gratis" },
        },
    ],
    navMain: [
        {
            title: { en: "Playground", da: "Legeplads" },
            url: "#",
            icon: "SquareTerminal",
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
            icon: "Bot",
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
            icon: "BookOpen",
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
            icon: "Settings2",
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
            icon: "Frame",
            moreIcon: "MoreHorizontal",
            actions: [
                { label: { en: "View Project", da: "Vis projekt" }, icon: "Folder" },
                { label: { en: "Share Project", da: "Del projekt" }, icon: "Forward" },
                { label: { en: "Delete Project", da: "Slet projekt" }, icon: "Trash2" },
            ],
        },
        {
            name: { en: "Sales & Marketing", da: "Salg & Marketing" },
            url: "#",
            icon: "PieChart",
            moreIcon: "MoreHorizontal",
            actions: [
                { label: { en: "View Project", da: "Vis projekt" }, icon: "Folder" },
                { label: { en: "Share Project", da: "Del projekt" }, icon: "Forward" },
                { label: { en: "Delete Project", da: "Slet projekt" }, icon: "Trash2" },
            ],
        },
        {
            name: { en: "Travel", da: "Rejser" },
            url: "#",
            icon: "Map",
            moreIcon: "MoreHorizontal",
            actions: [
                { label: { en: "View Project", da: "Vis projekt" }, icon: "Folder" },
                { label: { en: "Share Project", da: "Del projekt" }, icon: "Forward" },
                { label: { en: "Delete Project", da: "Slet projekt" }, icon: "Trash2" },
            ],
        },
    ],
    moreProjectsIcon: "MoreHorizontal",
    user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/john-doe.jpg",
    },
    userMenuItems: [
        {
            label: { en: "Upgrade to Pro", da: "Opgrader til Pro" },
            icon: "Sparkles",
        },
        { label: { en: "Account", da: "Konto" }, icon: "BadgeCheck" },
        { label: { en: "Billing", da: "Fakturering" }, icon: "CreditCard" },
        { label: { en: "Notifications", da: "Notifikationer" }, icon: "Bell" },
        { label: { en: "Log out", da: "Log ud" }, icon: "LogOut" },
    ],
};
