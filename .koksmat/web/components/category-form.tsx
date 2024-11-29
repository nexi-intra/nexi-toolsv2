"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function CategoryForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.category.schema} tableName={databases.databaseToolsTables.table.category.tablename} databaseName={"tools"} />
  )
}

