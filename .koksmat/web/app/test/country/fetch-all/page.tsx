'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/app/api/entity/api-client'
import { Country } from '@/app/api/entity/schemas'

export default function CountryList() {
  const [countrys, setCountrys] = useState<Country[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const countryClient = new ApiClient('country', () => 'YOUR_AUTH_TOKEN')

    const fetchCountrys = async () => {
      try {
        const data = await countryClient.getAll(page, pageSize)
        setCountrys(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountrys()
  }, [page, pageSize])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <ul>
        {countrys.map(item => (
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