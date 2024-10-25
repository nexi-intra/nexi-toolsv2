'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Globe, List, Search, Users, Shield, Star, Zap, HelpCircle } from 'lucide-react'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' })
    setIsDropdownOpen(false)
  }

  const features = [
    { id: 'multi-lingual', title: 'Multi-lingual and Multi-platform', description: 'The application will be multi-lingual, embedded in SharePoint pages and Teams, accessible from both desktop and mobile views, ensuring seamless visibility and access.', icon: Globe },
    { id: 'consolidated-list', title: 'Consolidated Tool List', description: 'There will be a consolidated list comprising all tools grouped along with their respective countries and business purposes, enhancing organization and access.', icon: List },
    { id: 'efficient-search', title: 'Efficient Search Functionality', description: 'A search box equipped with autocomplete will be integrated into the platform, which will expedite the tool searching process while making it more efficient.', icon: Search },
    { id: 'targeted-sets', title: 'Targeted Tool Sets', description: 'Every user will be presented with a targeted set of tools based on their country, role, and access rights.', icon: Users },
    { id: 'admin-control', title: 'Admin Control for Mandatory Tools', description: 'Admins will have the capability to designate mandatory tools for certain user groups and individuals as per requirements.', icon: Shield },
    { id: 'user-personalization', title: 'User Personalization', description: 'Users will have the autonomy to mark their preferred tools, allowing for a personalized and interactive user experience.', icon: Star },
    { id: 'tool-highlighting', title: 'Tool Highlighting', description: 'Both mandatory and preferred tools will be prominently highlighted to the users for easy identification and access.', icon: Zap },
    { id: 'exploratory-environment', title: 'Exploratory Environment', description: 'Users will have the freedom to browse and search for tools not within their set target, fostering an exploratory environment and user flexibility.', icon: HelpCircle },
  ]

  const TableOfContents = () => (
    <Card className="w-full md:w-64 lg:w-72">
      <CardHeader>
        <CardTitle>Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-1">
            {features.map((feature) => (
              <li key={feature.id}>
                <Button
                  variant={activeSection === feature.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => scrollToSection(feature.id)}
                >
                  {feature.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Nexi Tools (ALPHA VERSION)</h1>
          <p className="text-xl mb-8">Your all-in-one platform for efficient tool management</p>
          <Button size="lg">Get Started</Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Feature Sections */}
          <div className="flex-grow space-y-12 order-2 md:order-1">
            {features.map((feature) => (
              <section
                key={feature.id}
                id={feature.id}
                ref={(el) => { sectionRefs.current[feature.id] = el }}
                className="scroll-mt-20"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="mr-2 h-6 w-6" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>

          {/* Table of Contents */}
          <div className={`order-1 md:order-2 mb-8 md:mb-0 ${isMobile ? 'relative' : 'sticky top-4 self-start'}`}>
            {isMobile ? (
              <div className="relative">
                <Button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full justify-between"
                >
                  Table of Contents <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg mt-2 z-20">
                    {features.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => scrollToSection(feature.id)}
                      >
                        {feature.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <TableOfContents />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}