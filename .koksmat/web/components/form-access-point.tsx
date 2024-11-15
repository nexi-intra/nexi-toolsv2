"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function TableEditor() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.accesspoint.schema} tableName={databases.databaseToolsTables.table.accesspoint.tablename} databaseName={"tools"} />
  )
}

