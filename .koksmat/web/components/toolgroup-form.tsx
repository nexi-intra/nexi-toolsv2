"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function ToolGroupForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.toolgroup.schema} tableName={databases.databaseToolsTables.table.toolgroup.tablename} databaseName={"tools"} />
  )
}

