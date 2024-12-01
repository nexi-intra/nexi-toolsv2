import React from 'react'

export default function Page(props: { params: { table: string, id: string } }) {
  const { table, id } = props.params
  return (
    <div>{table}:{id}</div>
  )
}
