"use client"

import React from 'react'


export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div className='w-full'>

      {children}
    </div>
  )
}
