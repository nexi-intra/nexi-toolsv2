"use client"



import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'
import { databases } from '@/app/tools/schemas/databases'

export default function AccessPointForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.accesspoint.schema} tableName={databases.databaseToolsTables.table.accesspoint.tablename} databaseName={"tools"} />
  )
}

