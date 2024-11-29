import { ToolExplorerFiltered } from '@/components/tool-list'
import React from 'react'

export default function Page(props: { params: { id: string } }) {
  const { id } = props.params
  return (
    <div>
      <ToolExplorerFiltered searchFor={""} viewName="tools_for_region" parameters={[id]} pageSize={100} />
    </div>
  )
}
