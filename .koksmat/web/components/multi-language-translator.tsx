'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Lock, Unlock, Globe, RefreshCw, Eye, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TranslatorClient, Language } from '@/app/tools/api/translate/translator-client'
import { ComponentDoc } from './component-documentation-hub'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'

/**
 * MultiLanguageTranslator is a versatile React component for managing and editing translations across multiple languages.
 * It integrates with a TranslatorClient for performing translations, supports view and edit modes, individual language locking,
 * and provides a user-friendly interface for managing multilingual content.
 * The component is designed to be responsive, accessible, and type-safe, adhering to best practices in React development.
 * This refactored version uses classic useState hooks and separates each translation into a subcomponent.
 */

// Function to get the authentication token (replace with your actual implementation)
const getToken = () => localStorage.getItem('authToken') || ''

// Create an instance of TranslatorClient
const translator = new TranslatorClient(getToken)

const TranslationSchema = z.object({
  language: z.enum([
    "Afrikaans", "Arabic", "Bulgarian", "Bengali", "Bosnian", "Catalan", "Czech", "Welsh", "Danish", "German",
    "Greek", "English", "Spanish", "Estonian", "Persian", "Finnish", "Filipino", "Fijian", "French", "Irish",
    "Hebrew", "Hindi", "Croatian", "Haitian Creole", "Hungarian", "Indonesian", "Icelandic", "Italian", "Japanese",
    "Korean", "Lithuanian", "Latvian", "Malagasy", "Malay", "Maltese", "Hmong Daw", "Norwegian", "Dutch",
    "Querétaro Otomi", "Polish", "Portuguese", "Romanian", "Russian", "Slovak", "Slovenian", "Samoan",
    "Serbian (Cyrillic)", "Serbian (Latin)", "Swedish", "Swahili", "Tamil", "Telugu", "Thai", "Klingon (Latin)",
    "Tongan", "Turkish", "Tahitian", "Ukrainian", "Urdu", "Vietnamese", "Yucatec Maya", "Cantonese (Traditional)",
    "Chinese Simplified", "Chinese Traditional"
  ]),
  value: z.string(),
  isLocked: z.boolean()
})

const MultiLanguageTranslatorSchema = z.object({
  supportedLanguages: z.array(TranslationSchema.shape.language),
  masterValue: z.string(),
  masterLanguage: TranslationSchema.shape.language,
  initialTranslations: z.array(TranslationSchema).optional(),
  initialMode: z.enum(['view', 'edit']).optional(),
  className: z.string().optional(),
  onSave: z.function(z.tuple([z.array(TranslationSchema)]), z.void()),
  onMasterLanguageChange: z.function(z.tuple([TranslationSchema.shape.language]), z.void())
})

type MultiLanguageTranslatorProps = z.infer<typeof MultiLanguageTranslatorSchema>

// Subcomponent for individual translation
type TranslationItemProps = {
  translation: z.infer<typeof TranslationSchema>;
  mode: 'view' | 'edit';
  isTranslating: boolean;
  onInputChange: (language: Language, value: string) => void;
  onToggleLock: (language: Language) => void;
  onTranslateSingle: (language: Language) => void;
};

const TranslationItem = React.memo(function TranslationItem({
  translation,
  mode,
  isTranslating,
  onInputChange,
  onToggleLock,
  onTranslateSingle,
}: TranslationItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`translation-${translation.language}`} className="w-24">
        {translation.language}:
      </Label>
      <div className="relative flex-grow">
        <Input
          id={`translation-${translation.language}`}
          value={translation.value}
          onChange={(e) => onInputChange(translation.language, e.target.value)}
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
            onClick={() => onToggleLock(translation.language)}
            disabled={isTranslating}
          >
            {translation.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onTranslateSingle(translation.language)}
            disabled={isTranslating || translation.isLocked}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
});


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
  const [translations, setTranslations] = useState<z.infer<typeof TranslationSchema>[]>(initialTranslations)
  const [isTranslating, setIsTranslating] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)
  const [error, setError] = useState<string | null>(null)
  const [translationsMap, setTranslationsMap] = useState(new Map<Language, string>())

  useEffect(() => {
    if (initialTranslations.length === 0) {
      const newTranslations = supportedLanguages.map((lang) => ({
        language: lang,
        value: '',
        isLocked: false,
      }))
      const currentTranslationsJSON = JSON.stringify(translations)
      const newTranslationsJSON = JSON.stringify(translations)
      if (newTranslationsJSON !== currentTranslationsJSON) {
        setTranslations(newTranslations)
      }
    }
  }, [supportedLanguages, initialTranslations])

  const handleTranslateAll = useCallback(async () => {
    setIsTranslating(true)
    setError(null)
    try {
      const languagesToTranslate = translations
        .filter((t) => !t.isLocked && t.language !== masterLanguage)
        .map((t) => t.language)

      if (languagesToTranslate.length === 0) {
        return
      }

      const result = await translator.translateText(masterValue, masterLanguage, languagesToTranslate)

      setTranslations(prevTranslations => prevTranslations.map((t) => {
        if (!t.isLocked && t.language !== masterLanguage) {
          const newValue = result.translations[t.language] || t.value
          setTranslationsMap(prevMap => new Map(prevMap).set(t.language, newValue))
          return { ...t, value: newValue }
        }
        return t
      }))
    } catch (error) {
      console.error('Translation error:', error)
      setError('An error occurred while translating. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }, [translations, masterValue, masterLanguage])

  const handleTranslateSingle = useCallback(async (language: Language) => {
    setIsTranslating(true)
    setError(null)
    try {
      const result = await translator.translateText(masterValue, masterLanguage, [language])

      setTranslations(prevTranslations => prevTranslations.map((t) => {
        if (t.language === language) {
          const newValue = result.translations[language] || t.value
          setTranslationsMap(prevMap => new Map(prevMap).set(language, newValue))
          return { ...t, value: newValue }
        }
        return t
      }))
    } catch (error) {
      console.error('Translation error:', error)
      setError(`An error occurred while translating to ${language}. Please try again.`)
    } finally {
      setIsTranslating(false)
    }
  }, [masterValue, masterLanguage])

  const handleToggleLock = useCallback((language: Language) => {
    setTranslations(prevTranslations => prevTranslations.map((t) => {
      if (t.language === language) {
        return { ...t, isLocked: !t.isLocked }
      }
      return t
    }))
  }, [])

  const handleInputChange = useCallback((language: Language, value: string) => {
    setTranslations(prevTranslations => prevTranslations.map((t) => {
      if (t.language === language) {
        setTranslationsMap(prevMap => new Map(prevMap).set(language, value))
        return { ...t, value }
      }
      return t
    }))
  }, [])

  const handleSave = useCallback(() => {
    onSave(translations)
    setMode('view')
  }, [translations, onSave])

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'view' ? 'edit' : 'view'))
  }, [])

  return (
    <>
      <ZeroTrust
        schema={MultiLanguageTranslatorSchema}
        props={{
          supportedLanguages,
          masterValue,
          masterLanguage,
          initialTranslations,
          initialMode,
          className,
          onSave,
          onMasterLanguageChange,
        }}
        actionLevel="error"
        componentName="MultiLanguageTranslator"
      />
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="space-y-4">
          {translations.map((translation) => (
            <TranslationItem
              key={translation.language}
              translation={translation}
              mode={mode}
              isTranslating={isTranslating}
              onInputChange={handleInputChange}
              onToggleLock={handleToggleLock}
              onTranslateSingle={handleTranslateSingle}
            />
          ))}
        </div>
        {mode === 'edit' && (
          <Button onClick={handleSave} disabled={isTranslating}>
            Save Translations
          </Button>
        )}
      </div>
    </>
  )
}

// Example usage and ComponentDoc
const TranslatorExample = () => {
  const supportedLanguages: Language[] = ['English', 'Spanish', 'French', 'German', 'Italian']
  const [masterValue, setMasterValue] = useState('Hello, world!')
  const [masterLanguage, setMasterLanguage] = useState<Language>('English')
  const [savedTranslations, setSavedTranslations] = useState<z.infer<typeof TranslationSchema>[]>([])

  const handleSave = (translations: z.infer<typeof TranslationSchema>[]) => {
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

export const examplesMultiLanguageTranslator: ComponentDoc[] = [
  {
    id: 'MultiLanguageTranslator',
    name: 'MultiLanguageTranslator',
    description: 'A component for editing multiple translations at once with support for locking and individual translation. Includes view and edit modes, and allows changing the master language.',
    usage: `
import React, { useState } from 'react'
import MultiLanguageTranslator from './multi-language-translator'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const TranslatorExample = () => {
  const supportedLanguages: Language[] = ['English', 'Spanish', 'French', 'German', 'Italian']
  const [masterValue, setMasterValue] = useState('Hello, world!')
  const [masterLanguage, setMasterLanguage] = useState<Language>('English')
  const [savedTranslations, setSavedTranslations] = useState<z.infer<typeof TranslationSchema>[]>([])

  const handleSave = (translations: z.infer<typeof TranslationSchema>[]) => {
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
      <div>
        <TranslatorExample />
      </div>
    ),
  },
]