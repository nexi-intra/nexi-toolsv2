'use client'

import { useState, useEffect } from 'react'
import { DatabaseClient } from '@/app/tools/api/entity/database-client'
import { User } from '@/app/tools/api/entity/schemas'

export default function UserDetail() {
  // TODO: Replace '2' with the actual ID you want to fetch
  const id = '2'
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userClient = new DatabaseClient('user', () => 'YOUR_AUTH_TOKEN')

    const fetchUser = async () => {
      try {
        const data = await userClient.getOne(id)
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <p>role: {user.role}</p>
      <p>countryId: {user.countryId}</p>
      <p>status: {user.status}</p>
    </div>
  )
}