'use client'

import { useState, useEffect } from 'react'
import { DatabaseClient } from '@/app/tools/api/view/database-client'
import { User } from '@/app/tools/api/view/schemas'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userClient = new DatabaseClient('user', () => 'YOUR_AUTH_TOKEN')

    const fetchUsers = async () => {
      try {
        const data = await userClient.getAll(page, pageSize)
        setUsers(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [page, pageSize])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <ul>
        {users.map(item => (
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