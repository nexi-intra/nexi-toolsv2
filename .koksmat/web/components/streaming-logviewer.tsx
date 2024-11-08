'use client'

import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { ComponentDoc } from './component-documentation-hub'
import { APPNAME } from '@/app/global'

// Define the log levels enum
export enum LogLevel {
  VERBOSE = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  FATAL = 4,
}

// Define the log entry interface
interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  correlationId?: string
  errorDetails?: {
    name: string
    message: string
    stack?: string
  }
}

// Define the props schema
const LogViewerPropsSchema = z.object({
  maxEntries: z.number().min(1).default(100),
  minLogLevel: z.nativeEnum(LogLevel).default(LogLevel.INFO),
  className: z.string().optional(),
  streamUrl: z.string().default('/api/logs'),
})

// Infer the props type from the schema
type LogViewerProps = z.infer<typeof LogViewerPropsSchema>

/**
 * LogViewer Component
 * 
 * This component displays a real-time log viewer that streams data from the server.
 * It supports both Koksmat logging system and direct streaming from a server endpoint.
 * 
 * Features:
 * - Real-time log streaming using Web Streams API
 * - Configurable maximum number of entries to display
 * - Minimum log level filter
 * - Auto-scrolling with the option to pause
 * - Color-coded log levels for easy identification
 * 
 * Usage:
 * <LogViewer maxEntries={100} minLogLevel={LogLevel.INFO} streamUrl="/api/logs" />
 */
export default function LogViewer({
  maxEntries = 100,
  minLogLevel = LogLevel.INFO,
  className = '',
  streamUrl = '/api/logs'
}: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [autoScroll, setAutoScroll] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const logContainerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('LogViewer is only available in development mode')
      return
    }

    let abortController = new AbortController()

    const startStreaming = async () => {
      try {
        setIsStreaming(true)
        const response = await fetch(streamUrl, {
          signal: abortController.signal
        })

        if (!response.body) {
          throw new Error('No response body')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          const newLogs = lines
            .filter(line => line.trim())
            .map(line => {
              try {
                const data = JSON.parse(line)
                return {
                  ...data,
                  timestamp: new Date(data.timestamp)
                }
              } catch (e) {
                console.error('Failed to parse log line:', e)
                return null
              }
            })
            .filter(log => log && log.level >= minLogLevel)

          if (newLogs.length > 0) {
            setLogs(prevLogs => [...prevLogs, ...newLogs].slice(-maxEntries))
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Streaming error:', error)
          // Retry connection after a delay
          setTimeout(startStreaming, 5000)
        }
      } finally {
        setIsStreaming(false)
      }
    }

    startStreaming()

    return () => {
      abortController.abort()
    }
  }, [maxEntries, minLogLevel, streamUrl])

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const getLogLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.VERBOSE:
        return 'text-gray-500'
      case LogLevel.INFO:
        return 'text-blue-500'
      case LogLevel.WARNING:
        return 'text-yellow-500'
      case LogLevel.ERROR:
        return 'text-red-500'
      case LogLevel.FATAL:
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      <ZeroTrust
        schema={LogViewerPropsSchema}
        props={{ maxEntries, minLogLevel, className, streamUrl }}
        actionLevel="error"
        componentName="LogViewer"
      />
      <div className={`bg-white border rounded-lg shadow-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Log Viewer</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {isStreaming ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Auto-scroll</span>
            </label>
          </div>
        </div>
        <div
          ref={logContainerRef}
          className="h-64 overflow-y-auto border rounded p-2 font-mono text-sm"
        >
          {logs.map((log, index) => (
            <div key={index} className={`mb-1 ${getLogLevelColor(log.level)}`}>
              <span className="text-xs">
                {log.timestamp.toISOString()}
              </span>
              <span className="ml-2 font-semibold">
                [{LogLevel[log.level]}]
              </span>
              {log.correlationId && (
                <span className="ml-2">[{log.correlationId}]</span>
              )}
              <span className="ml-2">{log.message}</span>
              {log.errorDetails && (
                <pre className="text-xs mt-1 ml-4 text-red-600">
                  {JSON.stringify(log.errorDetails, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const examplesLogViewer: ComponentDoc[] = [
  {
    id: 'LogViewer',
    name: 'LogViewer',
    description: 'A real-time log viewer component that streams data from the server.',
    usage: `
import LogViewer from '@/components/log-viewer'
import { LogLevel } from '@/components/log-viewer'
import { APPNAME } from '@/app/global'
// Basic usage
<LogViewer maxEntries={100} minLogLevel={LogLevel.INFO} streamUrl={"/" + APPNAME + "/api/logs"} />

// Custom stream URL
<LogViewer 
  maxEntries={100} 
  minLogLevel={LogLevel.INFO}
  streamUrl="/" + APPNAME + "/api/logs"
/>
`,
    example: (
      <LogViewer maxEntries={100} minLogLevel={LogLevel.INFO} streamUrl={"/" + APPNAME + "/api/logs"} />
    ),
  }
]