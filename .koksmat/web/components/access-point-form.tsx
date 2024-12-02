"use client"



import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'
import { databases } from '@/app/tools/schemas/databases'

export default function AccessPointForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.databaseTable.accesspoint.schema} tableName={databases.databaseToolsTables.databaseTable.accesspoint.tablename} databaseName={"tools"} id={0} defaultMode={'view'} />
  )
}

