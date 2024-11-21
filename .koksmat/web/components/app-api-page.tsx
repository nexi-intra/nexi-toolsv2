'use client'

import Link from 'next/link'
import { ArrowRight, Book, FileJson } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

import { APPNAME } from '@/app/global'
import { typeNames } from '@/app/tools/schemas/forms'

export function APILandingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Magic Links API</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Powerful, flexible, and easy to use. Build amazing applications with our API.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href={`/${APPNAME}/docs/api/swagger`}>
              <FileJson className="mr-2 h-4 w-4" />
              Open API Definition
            </Link>
          </Button>
          {/* <Button variant="outline" asChild>
            <Link href="/docs">
              <Book className="mr-2 h-4 w-4" />
              API Documentation
            </Link>
          </Button> */}
        </div>
      </section>

      {/* Entity Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">API Entities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(typeNames).map(([key, name]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>Manage {name.toLowerCase()} data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Perform CRUD operations on {name.toLowerCase()} entities.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href={`/${APPNAME}/docs/api/entity/${key}`}>
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}