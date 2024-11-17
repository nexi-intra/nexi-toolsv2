"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function ToolForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.tool.schema} tableName={databases.databaseToolsTables.table.tool.tablename} databaseName='tools' />
  )
}

