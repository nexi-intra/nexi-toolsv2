"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function CountryTableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.country.schema} tableName={databases.tools.table.country.tablename} databaseName={"tools"} />
  )
}

