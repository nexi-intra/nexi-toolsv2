'use client'

import { useState, useEffect } from 'react'
import { DatabaseClient } from '@/app/tools/api/entity/database-client'
import { Country } from '@/app/tools/api/entity/schemas'

export default function CountryDetail() {
  // TODO: Replace '2' with the actual ID you want to fetch
  const id = '2'
  const [country, setCountry] = useState<Country | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const countryClient = new DatabaseClient('country', () => 'YOUR_AUTH_TOKEN')

    const fetchCountry = async () => {
      try {
        const data = await countryClient.getOne(id)
        setCountry(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountry()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: <pre>{error}</pre></div>
  if (!country) return <div>Country not found</div>

  return (
    <div>
      <h1>{country.name}</h1>
      <p>name: {country.name}</p>
      <p>code: {country.code}</p>
      <p>continent: {country.continent}</p>
      <p>currency: {country.currency}</p>
      <p>phoneCode: {country.phoneCode}</p>
    </div>
  )
}