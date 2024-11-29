'use client';

import React from 'react';
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { ComponentDoc } from './component-documentation-hub';

// Define the props for the component with Zod
const DocumentationSectionProps = z.object({
  title: z.string(),
  className: z.string().optional(),
  children: z.custom<React.ReactNode>(),
});

type DocumentationSectionProps = z.infer<typeof DocumentationSectionProps>;

/**
 * DocumentationSection Component
 * 
 * This component renders a section of documentation with a title and content.
 * It's designed to be used within the UseCaseDetails component or independently.
 * 
 * @param title - The title of the documentation section
 * @param className - Optional additional CSS classes
 * @param children - The content of the documentation section
 */
export const DocumentationSection = React.forwardRef<HTMLElement, DocumentationSectionProps>(
  ({ title, className = '', children }, ref) => {
    return (
      <>
        <ZeroTrust
          schema={DocumentationSectionProps}
          props={{ title, className, children }}
          actionLevel="error"
          componentName="DocumentationSection"
        />
        <section ref={ref} className={`mb-8 ${className}`}>
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <div className="prose max-w-none">{children}</div>
        </section>
      </>
    );
  }
);

DocumentationSection.displayName = 'DocumentationSection';

// Example usage documentation
export const examplesDocumentationSection: ComponentDoc[] = [
  {
    id: 'DocumentationSection',
    name: 'DocumentationSection',
    description: 'A component that renders a section of documentation with a title and content.',
    usage: `
import { DocumentationSection } from './documentation-section';

<DocumentationSection title="Implementation Details">
  <p>Here are the key steps for implementation:</p>
  <ul>
    <li>Set up the infrastructure</li>
    <li>Configure security settings</li>
    <li>Implement the API endpoints</li>
  </ul>
</DocumentationSection>
`,
    example: (
      <DocumentationSection title="Implementation Details">
        <p>Here are the key steps for implementation:</p>
        <ul>
          <li>Set up the infrastructure</li>
          <li>Configure security settings</li>
          <li>Implement the API endpoints</li>
        </ul>
      </DocumentationSection>
    ),
  }
];