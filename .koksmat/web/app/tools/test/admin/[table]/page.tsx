import React from 'react'

export default function Page(props: { params: { table: string } }) {
  const { table } = props.params
  return (
    <div>{table}</div>
  )
}


