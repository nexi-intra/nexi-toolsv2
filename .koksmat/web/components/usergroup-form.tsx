"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function UserGroupForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.usergroup.schema} tableName={databases.databaseToolsTables.table.usergroup.tablename} databaseName={"tools"} />
  )
}

