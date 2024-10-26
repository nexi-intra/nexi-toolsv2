'use client'

import React, { useState } from 'react'
import { TranslatorClient } from '@/app/api/translate/translator-client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Italian' | 'Portuguese' | 'Russian' | 'Chinese' | 'Japanese' | 'Korean'

interface TranslationResult {
  original: string
  translations: Record<Language, string>
}

const availableLanguages: Language[] = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean']

// Function to get the authentication token (replace with your actual implementation)
const getToken = () => localStorage.getItem('authToken') || ''

// Create an instance of TranslatorClient
const translator = new TranslatorClient(getToken)

export function TranslationShowcase() {
  const [text, setText] = useState<string>('')
  const [sourceLanguage, setSourceLanguage] = useState<Language>('English')
  const [targetLanguages, setTargetLanguages] = useState<Language[]>(['Spanish', 'French'])
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const translationResult = await translator.translateText(text, sourceLanguage, targetLanguages)
      setResult(translationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Translation Showcase</CardTitle>
        <CardDescription>Translate text using TranslatorClient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sourceLanguage">Source Language</Label>
          <Select value={sourceLanguage} onValueChange={(value: Language) => setSourceLanguage(value)}>
            <SelectTrigger id="sourceLanguage">
              <SelectValue placeholder="Select source language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="targetLanguages">Target Languages</Label>
          <Select
            value={targetLanguages.join(',')}
            onValueChange={(value) => setTargetLanguages(value.split(',') as Language[])}
          >
            <SelectTrigger id="targetLanguages">
              <SelectValue placeholder="Select target languages" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="text">Text to Translate</Label>
          <Textarea
            id="text"
            placeholder="Enter text to translate"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleTranslate} disabled={isLoading || !text}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</> : 'Translate'}
        </Button>
      </CardFooter>
      {result && (
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Translation Results:</h3>
          <div className="space-y-2">
            {Object.entries(result.translations).map(([lang, translation]) => (
              <div key={lang} className="bg-gray-100 p-2 rounded">
                <strong>{lang}:</strong> {translation}
              </div>
            ))}
          </div>
        </CardContent>
      )}
      {error && (
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      )}
    </Card>
  )
}

import { ComponentDoc } from './component-documentation-hub'

export const examplesTranslationShowcase: ComponentDoc[] = [
  {
    id: 'TranslationShowcase',
    name: 'TranslationShowcase',
    description: 'A component that demonstrates the usage of TranslatorClient for text translation.',
    usage: `
import TranslationShowcase from '@/components/TranslationShowcase'

export default function TranslationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Translation Service</h1>
      <TranslationShowcase />
    </div>
  )
}
`,
    example: (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Translation Service</h1>
        <TranslationShowcase />
      </div>
    ),
  },
  {
    id: 'TranslatorClientUsage',
    name: 'TranslatorClient Usage',
    description: 'A sample of how to use the TranslatorClient directly.',
    usage: `
import { TranslatorClient } from '@/app/api/translate/translator-client'

// Function to get the authentication token (replace with your actual implementation)
const getToken = () => localStorage.getItem('authToken') || ''

// Create an instance of TranslatorClient
const translator = new TranslatorClient(getToken)

// Example usage
async function translateExample() {
  try {
    // Translate a single text
    const singleResult = await translator.translateText(
      'Hello, world!',
      'English',
      ['Spanish', 'French']
    )
    console.log('Single translation result:', singleResult)

    // Translate multiple texts
    const batchResult = await translator.translateBatch(
      ['Good morning', 'Good night'],
      'English',
      ['German', 'Italian']
    )
    console.log('Batch translation result:', batchResult)
  } catch (error) {
    console.error('Translation error:', error)
  }
}

translateExample()
`,
    example: (
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">TranslatorClient Usage Example</h3>
        <pre className="bg-white p-2 rounded overflow-x-auto">
          {`
const translator = new TranslatorClient(getToken)

// Translate a single text
const singleResult = await translator.translateText(
  'Hello, world!',
  'English',
  ['Spanish', 'French']
)

// Translate multiple texts
const batchResult = await translator.translateBatch(
  ['Good morning', 'Good night'],
  'English',
  ['German', 'Italian']
)
          `}
        </pre>
      </div>
    ),
  },
]