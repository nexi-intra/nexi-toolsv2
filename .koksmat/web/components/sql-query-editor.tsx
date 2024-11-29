"use client"

import React, { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import MonacoEditor, { useMonaco } from "@monaco-editor/react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MagicboxContext } from "@/app/koksmat0/magicbox-context"
import { run } from "@/actions/server"
import { LogObject } from "./log-viewer"
import { useInterfaceFromJson } from "./hooks/useInterfaceFromJson"
import { z } from "zod"
import { ZeroTrust } from "@/components/zero-trust"
import { ComponentDoc } from "./component-documentation-hub"
import { generateSchemaCode } from "@/app/koksmat/src/v.next/lib/zod-from-json"

/**
 * SqlQueryEditor is a component for editing and executing SQL queries.
 * It supports view, new, and edit modes, and provides real-time interface generation based on query results.
 * 
 * @component
 * @param {SqlQueryEditorProps} props - The properties passed to the component
 * @returns {JSX.Element} The rendered SqlQueryEditor component
 */

// Define the Zod schema for props
const SqlQueryEditorSchema = z.object({
  database: z.string(),
  sql: z.string(),
  name: z.string(),
  onChange: z.function().args(z.string()),
  options: z.object({}).optional(),
  toolbar: z.any().optional(),
  mode: z.enum(["view", "new", "edit"]),
  className: z.string().optional(),
  onModeChange: z.function().args(z.enum(["view", "new", "edit"]), z.any()),
  onNewInterface: z.function().args(z.any(), z.string())
})

// Infer the type from the schema
type SqlQueryEditorProps = z.infer<typeof SqlQueryEditorSchema>

export function SqlQueryEditor(props: SqlQueryEditorProps) {
  const {
    database,
    toolbar,
    mode,
    className,
    onModeChange,
    onNewInterface
  } = props

  const [error, setError] = useState<string>("")
  const [sqlExpression, setSqlExpression] = useState<string>(props.sql)
  const [sqlResult, setSqlResult] = useState<string>("")
  const [name, setName] = useState<string>(props.name)
  const [log, setLog] = useState<LogObject[]>([])
  const [zodResult, setZodResult] = useState("")
  const interfaceGenerator = useInterfaceFromJson("")
  const magicbox = useContext(MagicboxContext)
  const monacoInstance = useMonaco()

  useEffect(() => {
    setSqlExpression(props.sql)
  }, [props.sql])

  useEffect(() => {
    if (monacoInstance) {
      // Monaco editor setup code here
      // (Keeping this comment as a placeholder for potential future Monaco-specific setup)
    }
  }, [monacoInstance])

  const handleRun = async () => {
    if (!sqlExpression) return

    setError("")
    const result = await run<any>(
      "magic-mix.app",
      ["query", database, sqlExpression],
      "",
      600,
      "x"
    )
    const logEntry: LogObject = {
      time: new Date(),
      title: "Running query",
      detail: sqlExpression,
      error: "",
      result: "",
    }

    if (result.hasError) {
      setError(result.errorMessage ?? "Unknown error")
      logEntry.error = result.errorMessage ?? "Unknown error"
      setLog((prevLog) => [...prevLog, logEntry])
      return
    }
    logEntry.result = JSON.stringify(result.data.Result, null, 2)
    interfaceGenerator.setjson(JSON.stringify(result.data.Result, null, 2))
    setLog((prevLog) => [...prevLog, logEntry])
    setSqlResult(logEntry.result)
    setZodResult(generateSchemaCode(result.data.Result))
    // Call onNewInterface with the current dataset and derived interface
    onNewInterface(result.data.Result, interfaceGenerator.interfaceDefintions)
  }

  const handleSqlChange = (newSql: string | undefined) => {
    if (newSql !== undefined) {
      setSqlExpression(newSql)
      props.onChange(newSql)
    }
  }

  const handleModeChange = (newMode: "view" | "new" | "edit") => {
    onModeChange(newMode, { sql: sqlExpression, name, result: sqlResult })
  }

  return (
    <div className={`sql-query-editor ${className || ""}`}>
      <ZeroTrust
        schema={SqlQueryEditorSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="SqlQueryEditor"
      />
      {toolbar}
      <ResizablePanelGroup direction="vertical" className="h-full w-full min-h-screen min-w-full overflow-scroll">
        <ResizablePanel defaultSize={50}>
          <div className="min-v-[20vw] min-h-[80vh]">
            <div className="p-2 flex bg-slate-100">
              <div className="flex">
                <Button onClick={handleRun} disabled={mode === "view"}>Run</Button>
                {error && <div className="pl-3 text-red-500" role="alert">{error}</div>}
              </div>
            </div>
            <div className="h-full min-h-[40vh]">
              <MonacoEditor
                value={sqlExpression}
                height="100vh"
                language="sql"
                onChange={handleSqlChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: true,
                  readOnly: mode === "view",
                }}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="h-full">
                <div className="p-2 bg-slate-100">Result</div>
                {!sqlResult && (
                  <div className="flex items-center justify-center h-full">
                    Run to get the result
                  </div>
                )}
                {sqlResult && (
                  <MonacoEditor
                    value={sqlResult}
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: true,
                      readOnly: true,
                    }}
                  />
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* <ResizablePanel defaultSize={50}>
              <div className="h-full">
                <div className="p-2 bg-slate-100">Interface</div>
                {!interfaceGenerator.interfaceDefintions && (
                  <div className="flex items-center justify-center h-full">
                    Run to get the interface definition
                  </div>
                )}
                {interfaceGenerator.interfaceDefintions && (
                  <MonacoEditor
                    value={interfaceGenerator.interfaceDefintions}
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: true,
                      readOnly: true,
                    }}
                  />
                )}
              </div>
            </ResizablePanel> */}
            <ResizablePanel defaultSize={50}>
              <div className="h-full">
                <div className="p-2 bg-slate-100">ZOD Schema</div>
                {!zodResult && (
                  <div className="flex items-center justify-center h-full">
                    Run to get the zod schema
                  </div>
                )}
                {zodResult && (
                  <MonacoEditor
                    value={zodResult}
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: true,
                      readOnly: true,
                    }}
                  />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

// Example usage documentation
export const examplesSqlQueryEditor: ComponentDoc[] = [
  {
    id: "SqlQueryEditor",
    name: "SqlQueryEditor",
    description: "A component for editing and executing SQL queries with real-time interface generation.",
    usage: `
import { SqlQueryEditor } from "./sql-query-editor"

// View mode
<SqlQueryEditor
  database="tool"
  sql="SELECT * FROM user"
  name="View Users"
  onChange={(newSql) => console.log(newSql)}
  mode="view"
  onModeChange={(mode, data) => console.log(mode, data)}
  onNewInterface={(dataset, interfaceDefinition) => {
    console.log("New dataset:", dataset);
    console.log("New interface definition:", interfaceDefinition);
  }}
/>
`,
    example: (
      <SqlQueryEditor
        database="tool"
        sql="SELECT * FROM tool LIMIT 10"
        name="Example Query"
        onChange={(newSql) => console.log(newSql)}
        mode="edit"
        onModeChange={(mode, data) => console.log(mode, data)}
        onNewInterface={(dataset, interfaceDefinition) => {
          console.log("New dataset:", dataset);
          console.log("New interface definition:", interfaceDefinition);
        }}
      />
    ),
  },
]