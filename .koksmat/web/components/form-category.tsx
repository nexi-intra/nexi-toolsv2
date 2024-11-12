"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function CategoryTableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.category.schema} tableName={databases.tools.table.category.tablename} databaseName={"tools"} />
  )
}

