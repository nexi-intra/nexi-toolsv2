"use client"


import { databases } from '@/app/tools/api/database'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function ToolGroupEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.toolgroup.schema} tableName={databases.tools.table.toolgroup.tablename} />
  )
}

