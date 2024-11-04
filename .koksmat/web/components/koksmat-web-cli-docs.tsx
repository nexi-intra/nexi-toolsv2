'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Clipboard, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTranslation } from 'next-i18next'
import { ComponentDoc } from './component-documentation-hub'

// Types
interface Command {
  name: string
  description: string
  snippet: string
  purpose: string
  flags?: Flag[]
}

interface CommandGroup {
  group: string
  commands: Command[]
}

interface Flag {
  name: string
  description: string
}

interface KoksmatWebCLIDocsProps {
  className?: string
  commands: CommandGroup[]
  globalFlags: Flag[]
}

// Components
const CommandSection: React.FC<{ group: CommandGroup }> = ({ group }) => {
  const { t } = useTranslation('common')

  return (
    <section id={group.group} className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 capitalize">{t(`${group.group}Commands`)}</h2>
      {group.commands.map((command) => (
        <CommandItem key={command.name} command={command} />
      ))}
    </section>
  )
}

const CommandItem: React.FC<{ command: Command }> = ({ command }) => {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(command.snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [command.snippet])

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{command.name}</h3>
      <p className="text-gray-600 mb-2">{t(command.description)}</p>
      <div className="bg-gray-100 p-4 rounded-md flex items-center justify-between mb-4">
        <code className="text-sm">{command.snippet}</code>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          aria-label={t('copyToClipboard')}
        >
          <Clipboard className="h-4 w-4" />
        </Button>
      </div>
      {copied && <p className="text-green-600 text-sm mb-2">{t('copied')}</p>}
      <p className="text-gray-700 mb-2">{t(command.purpose)}</p>
      {command.flags && <FlagList flags={command.flags} />}
    </div>
  )
}

const FlagList: React.FC<{ flags: Flag[] }> = ({ flags }) => {
  const { t } = useTranslation('common')

  return (
    <div className="mt-2">
      <h4 className="font-semibold mb-1">{t('flags')}:</h4>
      <ul className="list-disc pl-5">
        {flags.map((flag, index) => (
          <li key={index} className="mb-1">
            <code className="bg-gray-100 px-2 py-1 rounded">{flag.name}</code>: {t(flag.description)}
          </li>
        ))}
      </ul>
    </div>
  )
}

const TableOfContents: React.FC<{ commands: CommandGroup[], activeSection: string, isMobile: boolean, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }> = ({ commands, activeSection, isMobile, isOpen, setIsOpen }) => {
  const { t } = useTranslation('common')

  if (isMobile) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-toc"
        >
          {t('tableOfContents')}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isOpen && (
          <ScrollArea className="h-64 mt-2" id="mobile-toc">
            <nav>
              {commands.map((group) => (
                <TableOfContentsGroup key={group.group} group={group} activeSection={activeSection} setIsOpen={setIsOpen} />
              ))}
            </nav>
          </ScrollArea>
        )}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-2rem)] sticky top-4">
      <nav className="p-4">
        <h3 className="text-lg font-semibold mb-4">{t('tableOfContents')}</h3>
        {commands.map((group) => (
          <TableOfContentsGroup key={group.group} group={group} activeSection={activeSection} />
        ))}
      </nav>
    </ScrollArea>
  )
}

const TableOfContentsGroup: React.FC<{ group: CommandGroup, activeSection: string, setIsOpen?: (isOpen: boolean) => void }> = ({ group, activeSection, setIsOpen }) => {
  const { t } = useTranslation('common')

  return (
    <div className="mb-4">
      <a
        href={`#${group.group}`}
        className={`block py-2 text-sm font-semibold ${activeSection === group.group ? 'text-primary' : 'text-muted-foreground'}`}
        onClick={() => setIsOpen && setIsOpen(false)}
      >
        {t(`${group.group}Commands`)}
      </a>
      {group.commands.map((command) => (
        <a
          key={command.name}
          href={`#${group.group}`}
          className="block py-1 pl-4 text-sm text-muted-foreground"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          {command.name}
        </a>
      ))}
    </div>
  )
}

// Main component
export function KoksmatWebCliDocs({ className = '', commands, globalFlags }: KoksmatWebCLIDocsProps) {
  const [activeSection, setActiveSection] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    commands.forEach((group) => {
      const element = document.getElementById(group.group)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [commands])

  return (
    <div className={`relative flex flex-col md:flex-row max-w-6xl mx-auto p-4 md:p-8 ${className}`}>
      <div className="w-full md:w-3/4 pr-0 md:pr-8">
        <h1 className="text-3xl font-bold mb-6">{t('koksmatWebCLICommands')}</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{t('globalFlags')}</h2>
          <FlagList flags={globalFlags} />
        </section>

        {commands.map((group) => (
          <CommandSection key={group.group} group={group} />
        ))}
      </div>
      <div className={`w-full md:w-1/4 ${isMobile ? 'fixed bottom-0 left-0 right-0 bg-background shadow-lg z-10' : 'sticky top-4'}`}>
        <TableOfContents
          commands={commands}
          activeSection={activeSection}
          isMobile={isMobile}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  )
}

// Example usage documentation
export const examplesKoksmatWebCLIDocs: ComponentDoc[] = [
  {
    id: 'KoksmatWebCLIDocs',
    name: 'KoksmatWebCLIDocs',
    description: 'A component for displaying Koksmat Web CLI documentation with responsive design and interactive features.',
    usage: `
import KoksmatWebCLIDocs from './koksmat-web-cli-docs'
import { commands, globalFlags } from './cli-data'

export default function DocsPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Koksmat Web CLI Documentation</h1>
      <KoksmatWebCLIDocs
        className="bg-card rounded-lg shadow"
        commands={commands}
        globalFlags={globalFlags}
      />
    </div>
  )
}
`,
    example: (
      <KoksmatWebCliDocs
        className="bg-card rounded-lg shadow"
        commands={[
          {
            group: 'docs',
            commands: [
              {
                name: 'generate',
                description: 'Generate documentation for components',
                snippet: 'koksmat-web docs generate [--component <name>]',
                purpose: 'This command generates documentation for all components or a specific component if specified.',
                flags: [
                  { name: '-c, --component <name>', description: 'Generate documentation for a specific component' }
                ]
              }
            ]
          }
        ]}
        globalFlags={[
          { name: '-v, --verbose', description: 'Enable verbose output' }
        ]}
      />
    ),
  }
]