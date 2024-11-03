'use client'

import { useState, useEffect } from 'react'
import { DatabaseClient } from '@/app/tools/api/entity/database-client'
import { ToolGroup } from '@/app/tools/api/entity/schemas'

export default function ToolGroupDetail() {
  // TODO: Replace '2' with the actual ID you want to fetch
  const id = '2'
  const [toolgroup, setToolGroup] = useState<ToolGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const toolgroupClient = new DatabaseClient('toolgroup', () => 'YOUR_AUTH_TOKEN')

    const fetchToolGroup = async () => {
      try {
        const data = await toolgroupClient.getOne(id)
        setToolGroup(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchToolGroup()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!toolgroup) return <div>ToolGroup not found</div>

  return (
    <div>
      <h1>{toolgroup.name}</h1>
      <p>name: {toolgroup.name}</p>
      <p>description: {toolgroup.description}</p>
    </div>
  )
}