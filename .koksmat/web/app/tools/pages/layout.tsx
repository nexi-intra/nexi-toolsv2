"use client"
import { ShareComponent } from '@/components/share-component'
import React from 'react'
import { useIsInIframe } from "@/app/koksmat/src/v.next/components/use-isiniframe"

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props
  const isInIframe = useIsInIframe()
  return (
    <div className='w-full'>

      {children}
    </div>
  )
}
