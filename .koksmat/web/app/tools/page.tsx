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
  name: "Tools",
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
  title: 'Tools',
  description: 'Magic Tools',
}

export default function DocumentationLandingPage() {

  return (

    <div className="max-w-5xl mx-auto">
      <LandingPage />



    </div>

  )
}