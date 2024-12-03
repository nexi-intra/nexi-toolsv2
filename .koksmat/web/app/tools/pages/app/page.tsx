"use client"
import { MagicboxContext } from '@/app/koksmat0/magicbox-context'
import AppLauncher from '@/components/app-launcher'
import { m } from 'framer-motion'
import React, { useContext, useEffect } from 'react'

export default function AppLauncherPage() {
  const magicbox = useContext(MagicboxContext)
  useEffect(() => {
    if (magicbox) {
      magicbox.setAppMode("app")
    }


  }, [magicbox])

  return (
    <main className="min-h-screen bg-background">
      <AppLauncher />
    </main>
  )
}
