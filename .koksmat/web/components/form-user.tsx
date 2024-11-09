"use client"


import { databases } from '@/app/tools/api/database'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function UserTableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.user.schema} tableName={databases.tools.table.user.tablename} />
  )
}

