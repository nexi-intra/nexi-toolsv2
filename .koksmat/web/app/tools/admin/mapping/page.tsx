"use client"
import { FrontendDataMapper } from '@/components/frontend-data-mapper'
import React from 'react'
import { useSidebar } from '@/components/ui/sidebar'
import { schemasMap } from '../../schemas/forms'


export default function Page() {
  const { state } = useSidebar()

  return (
    <div className={`w-full max-w-[calc(100vw-2rem)] mx-auto ${state === 'expanded' ? 'lg:max-w-[calc(100vw-18rem)]' : 'lg:max-w-[calc(100vw-5rem)]'}`}>
      <FrontendDataMapper
        initialSchemaKey="ToolSchema"
        database="tools"
        sql="SELECT * FROM tools"
        schemasMap={schemasMap}
        className="w-full"
      />
    </div>
  )
}