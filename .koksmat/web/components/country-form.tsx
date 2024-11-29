"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function CountryForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.country.schema} tableName={databases.databaseToolsTables.table.country.tablename} databaseName={"tools"} />
  )
}

