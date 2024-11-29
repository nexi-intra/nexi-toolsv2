'use client'

import { useState } from 'react'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { Save, Play, Clipboard, Check, Code } from 'lucide-react'
import { createFile, executeFile, openInCode } from './actions/session-manager'
import { ComponentDoc } from './component-documentation-hub'
import { motion } from 'framer-motion'
import { KoksmatSessionProvider, useKoksmat } from './koksmat-provider'

// AI-friendly component description:
// KoksmatAction is a React component that provides discrete, icon-based actions for interacting with files within a Koksmat session.
// It uses the KoksmatSessionProvider to access and manage the session state.
// The component shows action icons with a light background, allowing users to copy to clipboard, save file, execute file, and open file in code editor.
// Actions are disabled with informative tooltips when no sessionId is found.
// After successful actions, icons animate to show a check mark and a Toast notification is shown.

const KoksmatActionSchema = z.object({
  className: z.string().optional(),
  fileName: z.string(),
  fileContent: z.string(),
  executeCommand: z.string(),
  showClipboard: z.boolean(),
  showSaveFile: z.boolean(),
  showExecuteFile: z.boolean(),
  showOpenInCode: z.boolean(),
})

type KoksmatActionProps = z.infer<typeof KoksmatActionSchema>

export default function KoksmatAction({
  className = '',
  fileName,
  fileContent,
  executeCommand,
  showClipboard,
  showSaveFile,
  showExecuteFile,
  showOpenInCode,
}: KoksmatActionProps) {
  const { sessionId } = useKoksmat()
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [activeIcon, setActiveIcon] = useState<'clipboard' | 'save' | 'execute' | 'openInCode' | null>(null)
  const { toast } = useToast()

  const handleSaveFile = async () => {
    if (!sessionId) return
    setError(null)
    setOutput('')
    setActiveIcon('save')

    try {
      const filePath = await createFile({
        sessionId,
        fileName,
        content: fileContent,
        correlationId: ''
      })

      setOutput(`File created successfully at ${filePath}\n`)
      setIsSaved(true)
      toast({
        title: "File Saved",
        description: `${fileName} has been saved successfully.`,
      })
    } catch (err) {
      setError('Failed to save file')
    } finally {
      setTimeout(() => setActiveIcon(null), 2000)
    }
  }

  const handleExecuteFile = async () => {
    if (!sessionId) return
    setError(null)
    setOutput('')
    setActiveIcon('execute')

    try {
      if (!isSaved) {
        await createFile({
          sessionId,
          fileName,
          content: fileContent,
          correlationId: ''
        })
        setIsSaved(true)
      }

      await executeFile(
        {
          sessionId,
          fileName: executeCommand,
          correlationId: ''
        },
        (data) => setOutput((prev) => prev + data)
      )

      toast({
        title: "File Executed",
        description: `${executeCommand} has been executed successfully.`,
      })
    } catch (err) {
      setError('Failed to execute file')
    } finally {
      setTimeout(() => setActiveIcon(null), 2000)
    }
  }

  const handleCopyToClipboard = () => {
    setActiveIcon('clipboard')
    navigator.clipboard.writeText(fileContent).then(
      () => {
        setOutput('Content copied to clipboard')
        toast({
          title: "Copied to Clipboard",
          description: "File content has been copied to clipboard.",
        })
      },
      () => setError('Failed to copy content to clipboard')
    ).finally(() => {
      setTimeout(() => setActiveIcon(null), 2000)
    })
  }

  const handleOpenInCode = async () => {
    if (!sessionId) return
    setActiveIcon('openInCode')

    try {
      await openInCode({
        sessionId,
        fileName,
        correlationId: ''
      })
      toast({
        title: "File Opened",
        description: `${fileName} has been opened in the code editor.`,
      })
    } catch (err) {
      setError('Failed to open file in code editor')
    } finally {
      setTimeout(() => setActiveIcon(null), 2000)
    }
  }

  const noSessionTooltip = "No active session. Please start a session to enable this action."

  const IconWrapper = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
    <motion.div
      initial={false}
      animate={{ scale: isActive ? 1.2 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {isActive ? <Check className="h-4 w-4 text-green-500" /> : children}
    </motion.div>
  )

  return (
    <>
      <ZeroTrust
        schema={KoksmatActionSchema}
        props={{
          className,
          fileName,
          fileContent,
          executeCommand,
          showClipboard,
          showSaveFile,
          showExecuteFile,
          showOpenInCode,
        }}
        actionLevel="error"
        componentName="KoksmatAction"
      />
      <div className={`w-full max-w-md bg-gray-50 rounded-md p-2 ${className}`}>
        <TooltipProvider>
          <div className="flex justify-center space-x-4">
            {showClipboard && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyToClipboard}
                    disabled={!fileContent}
                    aria-label="Copy to Clipboard"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200"
                  >
                    <IconWrapper isActive={activeIcon === 'clipboard'}>
                      <Clipboard className="h-4 w-4" />
                    </IconWrapper>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to Clipboard</p>
                </TooltipContent>
              </Tooltip>
            )}
            {showSaveFile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSaveFile}
                    disabled={!sessionId || !fileName || !fileContent}
                    aria-label="Save File"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200"
                  >
                    <IconWrapper isActive={activeIcon === 'save'}>
                      <Save className="h-4 w-4" />
                    </IconWrapper>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sessionId ? "Save File" : noSessionTooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {showExecuteFile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleExecuteFile}
                    disabled={!sessionId || !executeCommand}
                    aria-label="Execute File"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200"
                  >
                    <IconWrapper isActive={activeIcon === 'execute'}>
                      <Play className="h-4 w-4" />
                    </IconWrapper>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sessionId ? "Execute File" : noSessionTooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {showOpenInCode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleOpenInCode}
                    disabled={!sessionId || !fileName}
                    aria-label="Open in Code Editor"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200"
                  >
                    <IconWrapper isActive={activeIcon === 'openInCode'}>
                      <Code className="h-4 w-4" />
                    </IconWrapper>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sessionId ? "Open in Code Editor" : noSessionTooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
        {error && <p className="text-red-500 mt-4 text-center text-sm" role="alert">{error}</p>}
        {output && (
          <div className="mt-4">
            <h3 className="font-bold text-center text-sm">Output:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md mt-2 text-xs" role="log">{output}</pre>
          </div>
        )}
      </div>
    </>
  )
}

export const examplesKoksmatAction: ComponentDoc[] = [
  {
    id: 'KoksmatAction',
    name: 'KoksmatAction',
    description: 'A discrete component for interacting with files within a Koksmat session, showing action icons with a light background. Actions include copying to clipboard, saving file, executing file, and opening in code editor. Actions are disabled when no session is active. Successful actions show an animated check mark and a Toast notification.',
    usage: `
      <KoksmatSessionProvider>
        <KoksmatAction
          fileName="example.js"
          fileContent="console.log('Hello, Koksmat!');"
          executeCommand="node example.js"
          showClipboard={true}
          showSaveFile={true}
          showExecuteFile={true}
          showOpenInCode={true}
        />
      </KoksmatSessionProvider>
    `,
    example: (
      <KoksmatSessionProvider>
        <KoksmatAction
          fileName="example.js"
          fileContent="console.log('Hello, Koksmat!');"
          executeCommand="node example.js"
          showClipboard={true}
          showSaveFile={true}
          showExecuteFile={true}
          showOpenInCode={true}
        />
      </KoksmatSessionProvider>
    ),
  },
]