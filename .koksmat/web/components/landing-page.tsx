'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Globe, List, Search, Users, Shield, Star, Zap, HelpCircle } from 'lucide-react'
import UseCases from './use-cases'
import { APPDISPLAYNAME } from '@/app/global'
import { BRANCH } from '@/branch'

function appName() {
  const branch = BRANCH
  if ((branch === "master") || (branch === "main")) {
    return APPDISPLAYNAME
  }
  else {
    return APPDISPLAYNAME + " (" + branch.toUpperCase() + " VERSION)"
  }

}
export default function LandingPage() {


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to {appName()}</h1>
          <p className="text-xl mb-8">Your all-in-one platform for efficient tool management</p>
          {/* <Button size="lg">Get Started</Button> */}
        </div>
      </section>




      <UseCases />
    </div>
  )
}