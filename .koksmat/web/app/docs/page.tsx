import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, GitFork } from "lucide-react"
import LandingPage from '@/components/landing-page'

// This would typically come from an API call or environment variables
const repoInfo = {
  name: "Magic Links",
  description: "A tool for building and managing the Koksmat Magic Platform consisting of Magic Buttons, Rest APIs, Microservices and Batch jobs.",
  stars: 120,
  forks: 35,
  version: "1.0.0",
}

// This would typically come from fetching and parsing the README.md file
const readmeContent = `
# Magic Links

Magic Links is a powerful tool for building and managing the Koksmat Magic Platform. It provides a comprehensive set of features for creating Magic Buttons, Rest APIs, Microservices, and Batch jobs.

## Key Features

- Magic Button creation and management
- RESTful API development tools
- Microservice architecture support
- Batch job scheduling and monitoring
- Intuitive user interface for easy management

## Getting Started

To get started with Magic Links, please refer to our [documentation](/docs/getting-started).

## Contributing

We welcome contributions! Please see our [contributing guidelines](/docs/contributing) for more information.

## License

Magic Links is released under the MIT License. See the LICENSE file for more details.
`

export const metadata: Metadata = {
  title: 'Magic Links Documentation',
  description: 'Documentation for Magic Links - A tool for building and managing the Koksmat Magic Platform',
}

export default function DocumentationLandingPage() {

  return (

    <div className="max-w-5xl mx-auto">
      <LandingPage />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{repoInfo.name}</CardTitle>
          <CardDescription>{repoInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary">
              <Star className="w-4 h-4 mr-1" />
              {repoInfo.stars} stars
            </Badge>
            <Badge variant="secondary">
              <GitFork className="w-4 h-4 mr-1" />
              {repoInfo.forks} forks
            </Badge>
            <Badge variant="outline">v{repoInfo.version}</Badge>
          </div>
          <p className="text-muted-foreground">
            Magic Links is a comprehensive tool for managing the Koksmat Magic Platform.
            It provides an intuitive interface for creating and managing Magic Buttons,
            RESTful APIs, Microservices, and Batch jobs.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/docs/getting-started">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mb-4">From the README</h2>
        <div dangerouslySetInnerHTML={{ __html: readmeContent.replace(/\n/g, '<br />') }} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Explore Components</CardTitle>
            <CardDescription>Discover the building blocks of Magic Links</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/docs/components">View Components</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Use Cases</CardTitle>
            <CardDescription>Learn how to use Magic Links in real-world scenarios</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/docs/use-cases">Explore Use Cases</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

  )
}