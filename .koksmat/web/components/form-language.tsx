"use client"


import { databases } from '@/app/tools/api/database'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function LanguageTableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.language.schema} tableName={databases.tools.table.language.tablename} />
  )
}

