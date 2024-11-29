"use client"


import { databases } from '@/app/tools/schemas/databases'

import { GenericTableEditor } from '@/app/koksmat/src/v.next/components'

export default function RegionForm() {
  return (
    <GenericTableEditor schema={databases.databaseToolsTables.table.region.schema} tableName={databases.databaseToolsTables.table.region.tablename} databaseName={"tools"} />
  )
}

