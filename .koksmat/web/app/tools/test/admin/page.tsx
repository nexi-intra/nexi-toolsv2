"use client"
import { FormModeType, GenericTableEditor } from '@/app/koksmat/src/v.next/components'
import React, { useState } from 'react'
import { databaseTable } from '../../schemas/database/table'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [selectedId, setselectedId] = useState<number | null>(null)
  const [mode, setmode] = useState<FormModeType>("view")
  return <div>
    <GenericTableEditor schema={databaseTable.country.schema} tableName={databaseTable.country.tablename} databaseName={"tools"} id={2} defaultMode={mode}

      onUpdated={() => setselectedId(null)} />


    <Button variant="outline" onClick={() => setselectedId(null)}>Close</Button>
    <Button variant="outline" onClick={() => setmode("edit")}>Edit</Button>
  </div>
}
