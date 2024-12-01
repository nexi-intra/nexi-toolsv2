"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Layout(props: { children: React.ReactNode }) {
  const pathName = usePathname()
  const { children } = props

  function TableLink({ tableName, label }: { tableName: string, label: string }) {
    return (
      <Link href={`${pathName}/${tableName}`}>{label}</Link>
    )
  }
  return (
    <div className='flex w-full h-full bg-slate- 100'>
      <div className='w-[200px] bg-slate-200 p-4' >

        <div>
          <TableLink tableName='country' label="Country" />
        </div>
      </div>
      <div className='grow  p-4'>{children}</div>
    </div>

  )
}
