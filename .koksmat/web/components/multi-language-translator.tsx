'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Lock, Unlock, Globe, RefreshCw, Eye, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TranslatorClient, Language } from '@/app/tools/api/translate/translator-client'
import { ComponentDoc } from './component-documentation-hub'
import { TranslationResult } from '@/lib/translation-service'

// Function to get the authentication token (replace with your actual implementation)
const getToken = () => localStorage.getItem('authToken') || ''

// Create an instance of TranslatorClient
const translator = new TranslatorClient(getToken)

interface Translation {
  language: Language
  value: string
  isLocked: boolean
}



interface MultiLanguageTranslatorProps {
  supportedLanguages: Language[]
  masterValue: string
  masterLanguage: Language
  initialTranslations?: Translation[]
  initialMode?: 'view' | 'edit'
  className?: string
  onSave: (translations: Translation[]) => void
  onMasterLanguageChange: (language: Language) => void
}

export default function MultiLanguageTranslator({
  supportedLanguages,
  masterValue,
  masterLanguage,
  initialTranslations = [],
  initialMode = 'view',
  className = '',
  onSave,
  onMasterLanguageChange,
}: MultiLanguageTranslatorProps) {
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations)
  const [isTranslating, setIsTranslating] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)

  useEffect(() => {
    if (initialTranslations.length === 0) {
      setTranslations(
        supportedLanguages.map((lang) => ({
          language: lang,
          value: '',
          isLocked: false,
        }))
      )
    }
  }, [supportedLanguages, initialTranslations])

  const handleTranslateAll = useCallback(async () => {
    setIsTranslating(true)
    try {
      const languagesToTranslate = translations
        .filter((t) => !t.isLocked && t.language !== masterLanguage)
        .map((t) => t.language)

      if (languagesToTranslate.length === 0) {
        return
      }

      const result = await translator.translateText(masterValue, masterLanguage, languagesToTranslate)

      setTranslations((prevTranslations) =>
        prevTranslations.map((t) => {
          if (!t.isLocked && t.language !== masterLanguage) {
            return { ...t, value: (result as TranslationResult).translations[t.language] || t.value }
          }
          return t
        })
      )
    } catch (error) {
      console.error('Translation error:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsTranslating(false)
    }
  }, [translations, masterValue, masterLanguage])

  const handleTranslateSingle = useCallback(async (language: Language) => {
    setIsTranslating(true)
    try {
      const result = await translator.translateText(masterValue, masterLanguage, [language])

      setTranslations((prevTranslations) =>
        prevTranslations.map((t) => {
          if (t.language === language) {
            return { ...t, value: (result as TranslationResult).translations[language] || t.value }
          }
          return t
        })
      )
    } catch (error) {
      console.error('Translation error:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsTranslating(false)
    }
  }, [masterValue, masterLanguage])

  const handleToggleLock = useCallback((language: Language) => {
    setTranslations((prevTranslations) =>
      prevTranslations.map((t) => {
        if (t.language === language) {
          return { ...t, isLocked: !t.isLocked }
        }
        return t
      })
    )
  }, [])

  const handleInputChange = useCallback((language: Language, value: string) => {
    setTranslations((prevTranslations) =>
      prevTranslations.map((t) => {
        if (t.language === language) {
          return { ...t, value }
        }
        return t
      })
    )
  }, [])

  const handleSave = useCallback(() => {
    onSave(translations)
    setMode('view')
  }, [translations, onSave])

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'view' ? 'edit' : 'view'))
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Multi-Language Translator</h2>
        <div className="space-x-2">
          <Button onClick={toggleMode} variant="outline">
            {mode === 'view' ? (
              <>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> View
              </>
            )}
          </Button>
          {mode === 'edit' && (
            <Button onClick={handleTranslateAll} disabled={isTranslating}>
              {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
              Translate All
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {translations.map((translation) => (
          <div key={translation.language} className="flex items-center space-x-2">
            <Label htmlFor={`translation-${translation.language}`} className="w-24">
              {translation.language}:
            </Label>
            <div className="relative flex-grow">
              <Input
                id={`translation-${translation.language}`}
                value={translation.value}
                onChange={(e) => handleInputChange(translation.language, e.target.value)}
                disabled={mode === 'view' || isTranslating || translation.isLocked}
                className={isTranslating ? 'opacity-50' : ''}
              />
              {isTranslating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            {mode === 'edit' && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleToggleLock(translation.language)}
                  disabled={isTranslating}
                >
                  {translation.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleTranslateSingle(translation.language)}
                  disabled={isTranslating || translation.isLocked}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
      {mode === 'edit' && (
        <Button onClick={handleSave} disabled={isTranslating}>
          Save Translations
        </Button>
      )}
    </div>
  )
}

// Example usage with ComponentDoc
export const examplesMultiLanguageTranslator: ComponentDoc[] = [
  {
    id: 'MultiLanguageTranslator',
    name: 'MultiLanguageTranslator',
    description: 'A component for editing multiple translations at once with support for locking and individual translation. Includes view and edit modes, and allows changing the master language.',
    usage: `
import React, { useState } from 'react'
import MultiLanguageTranslator from './multi-language-translator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Language } from '@/app/api/translate/translator-client'

const TranslatorExample = () => {
  const supportedLanguages: Language[] = ['English', 'Spanish', 'French', 'German', 'Italian']
  const [masterValue, setMasterValue] = useState('Hello, world!')
  const [masterLanguage, setMasterLanguage] = useState<Language>('English')
  const [savedTranslations, setSavedTranslations] = useState<Translation[]>([])

  const handleSave = (translations: Translation[]) => {
    console.log('Saved translations:', translations)
    setSavedTranslations(translations)
  }

  const handleMasterLanguageChange = (language: Language) => {
    setMasterLanguage(language)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Translator Example</h1>
      <div className="mb-4 space-y-2">
        <Label htmlFor="master-text">Master Text:</Label>
        <Input
          id="master-text"
          value={masterValue}
          onChange={(e) => setMasterValue(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="master-language">Master Language:</Label>
        <Select value={masterLanguage} onValueChange={handleMasterLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select master language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <MultiLanguageTranslator
        supportedLanguages={supportedLanguages}
        masterValue={masterValue}
        masterLanguage={masterLanguage}
        initialMode="view"
        onSave={handleSave}
        onMasterLanguageChange={handleMasterLanguageChange}
      />
      {savedTranslations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Saved Translations:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(savedTranslations, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default TranslatorExample
    `,
    example: (
      <TranslatorExample />
    ),
  },
]

function TranslatorExample() {
  const supportedLanguages: Language[] = ['English', 'Spanish', 'French', 'German', 'Italian']
  const [masterValue, setMasterValue] = useState('Hello, world!')
  const [masterLanguage, setMasterLanguage] = useState<Language>('English')
  const [savedTranslations, setSavedTranslations] = useState<Translation[]>([])

  const handleSave = (translations: Translation[]) => {
    console.log('Saved translations:', translations)
    setSavedTranslations(translations)
  }

  const handleMasterLanguageChange = (language: Language) => {
    setMasterLanguage(language)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Translator Example</h1>
      <div className="mb-4 space-y-2">
        <Label htmlFor="master-text">Master Text:</Label>
        <Input
          id="master-text"
          value={masterValue}
          onChange={(e) => setMasterValue(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="master-language">Master Language:</Label>
        <Select value={masterLanguage} onValueChange={handleMasterLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select master language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <MultiLanguageTranslator
        supportedLanguages={supportedLanguages}
        masterValue={masterValue}
        masterLanguage={masterLanguage}
        initialMode="view"
        onSave={handleSave}
        onMasterLanguageChange={handleMasterLanguageChange}
      />
      {savedTranslations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Saved Translations:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(savedTranslations, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}