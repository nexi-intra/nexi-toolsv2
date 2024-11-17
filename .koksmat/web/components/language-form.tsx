"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function LanguageForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.language.schema} tableName={databases.databaseToolsTables.table.language.tablename} databaseName={"tools"} />
  )
}

