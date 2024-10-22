"use client"
import { ApiClient } from '@/app/api/entity/api-client'

import React, { useMemo } from 'react'

export default function Page() {
  const countries = useMemo(async () => {
    const countryTable = new ApiClient("country", async () => "token")
    const response: any = await countryTable.getAll()
    // debugger
    return response.data.items
  }, [])


  return (
    <div>
      <pre>
        {JSON.stringify(countries, null, 2)}
      </pre>
      {/* {countries.map((country, index) => {
        return (
          <div key={index}>{country.name}</div>)
      }) */}



    </div>
  )
}
