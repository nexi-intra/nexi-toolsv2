"use client"
import IntegrationDesigner from '@/components/integration-designer'
import { z } from 'zod'


const clientDataSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  emailAddress: z.string().email(),
  isActiveUser: z.boolean(),
})

const initialMappings = {
  serverToClient: {
    fullName: "item.first_name + ' ' + item.last_name",
    age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
    emailAddress: "item.email",
    isActiveUser: "item.is_active"
  },
  clientToServerCreate: {
    first_name: "item.fullName.split(' ')[0]",
    last_name: "item.fullName.split(' ').slice(1).join(' ')",
    birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
    email: "item.emailAddress",
    is_active: "item.isActiveUser"
  },
  clientToServerUpdate: {
    id: "item.id",
    first_name: "item.fullName.split(' ')[0]",
    last_name: "item.fullName.split(' ').slice(1).join(' ')",
    birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
    email: "item.emailAddress",
    is_active: "item.isActiveUser"
  }
}

import React from 'react'
import { ToolSchema } from '@/app/api/entity/schemas/tool'
function handleSave({ mode, mappings, sqlQuery }: { mode: string, mappings: any, sqlQuery: string }) {
  console.log('Mode:', mode)
  console.log('Mappings saved:', mappings)
  console.log('SQL Query:', sqlQuery)
  // Handle the saved mappings and SQL query
}

export default function page() {

  return (

    <IntegrationDesigner
      clientDataSchema={ToolSchema}
      initialMapping={initialMappings}
      onSave={handleSave}
      className="my-custom-class"
      mode="edit"
      database="tools"
      sql="SELECT * FROM tool limit 10"
    />

  )
}


