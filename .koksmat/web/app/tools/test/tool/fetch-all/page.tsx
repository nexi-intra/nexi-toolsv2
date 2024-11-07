'use client'

import { useState, useEffect } from 'react'
import { DatabaseClient } from '@/app/tools/api/view/database-client'
import { Tool } from '@/app/tools/api/view/schemas'

export default function ToolList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const toolClient = new DatabaseClient('tool', () => 'YOUR_AUTH_TOKEN')

    const fetchTools = async () => {
      try {
        const data = await toolClient.getAll(page, pageSize)
        setTools(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [page, pageSize])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <ul>
        {tools.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div>
        Total: {totalCount} | Page: {page} of {Math.ceil(totalCount / pageSize)}
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(totalCount / pageSize)}>Next</button>
      </div>
    </div>
  )
}