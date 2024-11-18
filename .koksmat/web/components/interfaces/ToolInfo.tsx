"use client";
export interface ToolInfo {
  id: string;
  name: string;
  icon: string;
  url: string;
  description: Record<string, string>;
  countries: string[];
  businessPurposes: string[];
  documents: { name: string; url: string; }[];
}

export const exampleToolInfo: ToolInfo = {
  id: 'nexi-intra-github',
  icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
  name: 'Nexi Intra GitHub repo',
  description: {
    en: 'Welcome to the Nexi Digital Workspace! As we embark on a transformative journey to streamline business operations, our small but mighty team is poised to revolutionize how we approach productivity and workflow management. Our core team consists of two dedicated developers and one adept colleague focusing on monitoring. Together, we are committed to developing a comprehensive portfolio of business productivity applications.'
  },
  countries: ['Italy', 'Denmark', 'Norway'],
  businessPurposes: ['Code Repository', 'Collaboration'],
  documents: [
    { name: 'README', url: 'https://github.com/nexi-intra/README.md' },
    { name: 'Contributing Guidelines', url: 'https://github.com/nexi-intra/CONTRIBUTING.md' }
  ],
  url: ""
};