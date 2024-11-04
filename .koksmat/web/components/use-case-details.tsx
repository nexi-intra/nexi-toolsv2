'use client';

import React from 'react';
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { ComponentDoc } from './component-documentation-hub';
import { Icon, LucidIconName } from './icon';

// Define the shape of the UseCase with Zod
const UseCaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  githubIssueUrl: z.string().url(),
  details: z.custom<React.ReactElement>((v) => React.isValidElement(v)).optional(),
});

// Infer the TypeScript type from the Zod schema
type UseCase = z.infer<typeof UseCaseSchema>;

// Define the props for the component
const UseCaseDetailsProps = z.object({
  useCase: UseCaseSchema,
  className: z.string().optional(),
});

type UseCaseDetailsProps = z.infer<typeof UseCaseDetailsProps>;

/**
 * UseCaseDetails Component
 * 
 * This component displays the details of a single use case for the Magic Links platform.
 * It shows the title, description, icon, and a link to the related GitHub issue.
 * If additional details are provided, they are rendered as well.
 */
export function UseCaseDetails({ useCase, className = '' }: UseCaseDetailsProps) {
  return (
    <>
      <ZeroTrust
        schema={UseCaseDetailsProps}
        props={{ useCase, className }}
        actionLevel="error"
        componentName="UseCaseDetails"
      />
      <Card className={`w-full max-w-2xl ${className}`}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Icon iconName={useCase.icon as LucidIconName} />
            </div>
            <div>
              <CardTitle>{useCase.title}</CardTitle>
              <CardDescription>{useCase.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {useCase.details && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
              {useCase.details}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => window.open(useCase.githubIssueUrl, '_blank')}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            View GitHub Issue
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

// Example usage documentation
export const examplesUseCaseDetails: ComponentDoc[] = [
  {
    id: 'UseCaseDetails',
    name: 'UseCaseDetails',
    description: 'A component that displays the details of a single use case for the Magic Links platform.',
    usage: `
import { UseCaseDetails } from './use-case-details';
import { Globe } from 'lucide-react';

const exampleUseCase = {
  id: 1,
  title: "Global Accessibility",
  description: "Ensure Magic Links are accessible worldwide",
  icon: "Globe",
  githubIssueUrl: "https://github.com/example/repo/issues/1",
  details: <p>Magic Links should work across different regions and comply with international regulations.</p>
};

<UseCaseDetails useCase={exampleUseCase} />
`,
    example: (
      <UseCaseDetails
        useCase={{
          id: 1,
          title: "Global Accessibility",
          description: "Ensure Magic Links are accessible worldwide",
          icon: "Globe",
          githubIssueUrl: "https://github.com/example/repo/issues/1",
          details: <p>Magic Links should work across different regions and comply with international regulations.</p>
        }}
      />
    ),
  }
];