"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function UserProfileTableEditor() {
  return (
    <GenericTableEditor schema={databases.tools.table.userprofile.schema} tableName={databases.tools.table.userprofile.tablename} databaseName={"tools"} />
  )
}

