"use client"
import { ShareComponent } from '@/components/share-component'
import React from 'react'
import { useIsInIframe } from "@/app/koksmat/src/v.next/components/use-isiniframe"

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props
  const isInIframe = useIsInIframe()
  return (
    <div className='w-full'>
      {!isInIframe && (
        <div className='flex p-3'>
          <div className='grow' >This is ...</div>

          <ShareComponent url={'dfdf'} subscriberCount={0} onShare={function (args_0: string, ...args: unknown[]): void {
            throw new Error('Function not implemented.')
          }} onCreatePost={function (...args: unknown[]): void {
            throw new Error('Function not implemented.')
          }} /></div>)}
      {children}
    </div>
  )
}
