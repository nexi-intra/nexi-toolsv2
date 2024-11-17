"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function UserRoleForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.userrole.schema} tableName={databases.databaseToolsTables.table.userrole.tablename} databaseName={"tools"} />
  )
}

