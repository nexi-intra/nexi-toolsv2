import React from 'react'
import { Metadata } from 'next'

import LandingPage from '@/components/landing-page'



export const metadata: Metadata = {
  title: 'Magic Links Documentation',
  description: 'Documentation for Magic Links - A tool for building and managing the Koksmat Magic Platform',
}

export default function DocumentationLandingPage() {

  return (

    <div className="max-w-5xl mx-auto">
      <LandingPage />


    </div>

  )
}