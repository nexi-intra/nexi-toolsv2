'use client';

import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { Button } from '@/components/ui/button';
import { Github, ChevronDown } from 'lucide-react';
import { ComponentDoc } from './component-documentation-hub';
import { Icon, LucidIconName } from './icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { DocumentationSection } from './documentation-section';

// Define the shape of the UseCase with Zod
const UseCaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  githubIssueUrl: z.string().url(),
});

// Infer the TypeScript type from the Zod schema
type UseCase = z.infer<typeof UseCaseSchema>;

// Define the props for the component
const UseCaseDetailsProps = z.object({
  useCase: UseCaseSchema,
  className: z.string().optional(),
  children: z.custom<React.ReactNode>(),
});

type UseCaseDetailsProps = z.infer<typeof UseCaseDetailsProps>;

/**
 * UseCaseDetails Component
 * 
 * This component displays the details of a single use case for the Magic Links platform.
 * It includes an action panel, a table of contents (ToC), and the main content.
 * The ToC is sticky and scroll-spied on desktop, and appears as a sticky combobox on mobile.
 * The action panel appears as a burger menu on mobile.
 */
export function UseCaseDetails({ useCase, className = '', children }: UseCaseDetailsProps) {
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const sections = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => React.isValidElement(child) && child.type === DocumentationSection)
    .map(child => ({ title: child.props.title }));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ title }) => {
      const element = contentRefs.current[title];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <ZeroTrust
        schema={UseCaseDetailsProps}
        props={{ useCase, className, children }}
        actionLevel="error"
        componentName="UseCaseDetails"
      />
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 pr-0 md:pr-8">
            <header className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Icon iconName={useCase.icon as LucidIconName} className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{useCase.title}</h1>
                  <p className="text-lg text-gray-600">{useCase.description}</p>
                </div>
              </div>
              {isMobile && (
                <div className="flex justify-between items-center">
                  <ActionPanel useCase={useCase} />
                  <TocCombobox sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />
                </div>
              )}
            </header>
            <main>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === DocumentationSection) {
                  const ClonedElement = React.forwardRef<HTMLDivElement, any>((props, ref) =>
                    React.cloneElement(child, { ...props, ref })
                  );
                  return (
                    <ClonedElement
                      ref={(el: HTMLDivElement | null) => {
                        if (el) contentRefs.current[child.props.title] = el;
                      }}
                      id={child.props.title}
                    />
                  );
                }
                return child;
              })}
            </main>
          </div>
          {!isMobile && (
            <aside className="w-full md:w-1/4 mt-8 md:mt-0">
              <div className="sticky top-4 space-y-4">
                <ActionPanel useCase={useCase} />
                <TableOfContents sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

function ActionPanel({ useCase }: { useCase: UseCase }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Actions</h3>
      <Button
        variant="outline"
        onClick={() => window.open(useCase.githubIssueUrl, '_blank')}
        className="w-full mb-2"
      >
        <Github className="mr-2 h-4 w-4" />
        View GitHub Issue
      </Button>
    </div>
  );
}

function TableOfContents({ sections, activeSection, setActiveSection }: {
  sections: { title: string }[],
  activeSection: string,
  setActiveSection: (section: string) => void
}) {
  return (
    <nav className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Table of Contents</h3>
      <ul className="space-y-2">
        {sections.map(({ title }, index) => (
          <li key={index}>
            <a
              href={`#${title}`}
              className={`block p-2 rounded transition-colors ${activeSection === title ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-200'
                }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(title);
                document.getElementById(title)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TocCombobox({ sections, activeSection, setActiveSection }: {
  sections: { title: string }[],
  activeSection: string,
  setActiveSection: (section: string) => void
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {activeSection || "Select section..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sections..." />
          <CommandEmpty>No section found.</CommandEmpty>
          <CommandGroup>
            {sections.map(({ title }, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setActiveSection(title);
                  setOpen(false);
                  document.getElementById(title)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Example usage documentation
export const examplesUseCaseDetails: ComponentDoc[] = [
  {
    id: 'UseCaseDetails',
    name: 'UseCaseDetails',
    description: 'A component that displays the details of a single use case for the Magic Links platform, including an action panel and table of contents.',
    usage: `
import { UseCaseDetails } from './use-case-details';
import { DocumentationSection } from './documentation-section';

const exampleUseCase = {
  id: 1,
  title: "Global Accessibility",
  description: "Ensure Magic Links are accessible worldwide",
  icon: "Globe",
  githubIssueUrl: "https://github.com/example/repo/issues/1",
};

<UseCaseDetails useCase={exampleUseCase}>
  <DocumentationSection title="Overview">
    <p>Magic Links should work across different regions and comply with international regulations.</p>
  </DocumentationSection>
  <DocumentationSection title="Implementation">
    <p>Use a globally distributed infrastructure to minimize latency and ensure high availability.</p>
  </DocumentationSection>
  <DocumentationSection title="Challenges">
    <p>Address varying legal requirements and cultural norms across different countries.</p>
  </DocumentationSection>
  <div className="mt-8 p-4 bg-gray-100 rounded-lg">
    <h2 className="text-xl font-semibold mb-2">Additional Resources</h2>
    <ul className="list-disc pl-5">
      <li>Global Accessibility Guidelines</li>
      <li>International Compliance Checklist</li>
    </ul>
  </div>
</UseCaseDetails>
`,
    example: (
      <UseCaseDetails
        useCase={{
          id: 1,
          title: "Global Accessibility",
          description: "Ensure Magic Links are accessible worldwide",
          icon: "Globe",
          githubIssueUrl: "https://github.com/example/repo/issues/1",
        }}
      >
        <DocumentationSection title="Overview">
          <p>Magic Links should work across different regions and comply with international regulations.</p>
        </DocumentationSection>
        <DocumentationSection title="Implementation">
          <p>Use a globally distributed infrastructure to minimize latency and ensure high availability.</p>
        </DocumentationSection>
        <DocumentationSection title="Challenges">
          <p>Address varying legal requirements and cultural norms across different countries.</p>
        </DocumentationSection>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Additional Resources</h2>
          <ul className="list-disc pl-5">
            <li>Global Accessibility Guidelines</li>
            <li>International Compliance Checklist</li>
          </ul>
        </div>
      </UseCaseDetails>
    ),
  }
];