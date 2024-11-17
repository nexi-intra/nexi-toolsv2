"use client"


import { databases } from '@/app/tools/schemas/databases'
import React, { useState } from 'react'
import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function UserProfileForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.userprofile.schema} tableName={databases.databaseToolsTables.table.userprofile.tablename} databaseName={"tools"} />
  )
}

