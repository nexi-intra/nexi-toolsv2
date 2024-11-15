"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function PurposeEditor() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.purpose.schema} tableName={databases.databaseToolsTables.table.purpose.tablename} databaseName={"tools"} />
  )
}

