'use client'

import { useState } from 'react'
import { ApiClient } from '@/app/api/entity/api-client'
import { Country } from '@/app/api/entity/schemas'

export default function QueryCountry() {
  const [sql, setSql] = useState<string>('')
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const countryClient = new ApiClient('country', () => 'YOUR_AUTH_TOKEN')

    try {
      const data = await countryClient.query(sql, 1, 100, (row) => row)
      setResults(data.items)
    } catch (err) {
      setError('Error executing query: ' + (err instanceof Error ? err.message : 'An error occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Enter your SQL query here"
          rows={4}
          cols={50}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Executing...' : 'Execute Query'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(results[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value: any, i) => (
                  <td key={i}>{JSON.stringify(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}