"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function TableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.accesspoint.schema} tableName={databases.tools.table.accesspoint.tablename} databaseName={"tools"} />
  )
}

