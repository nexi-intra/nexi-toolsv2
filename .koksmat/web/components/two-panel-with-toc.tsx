'use client'

import React, { useState, useEffect, useRef, ReactNode, Suspense } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'

// Define Zod schema for props
const PanelSchema = z.object({
  key: z.string(),
  title: z.string(),
  children: z.custom<ReactNode>()
})

const TwoPanelWithTocSchema = z.object({
  children: z.array(z.custom<React.ReactElement<z.infer<typeof PanelSchema>>>()),
  className: z.string().optional()
})

// Infer TypeScript type from Zod schema
type TwoPanelWithTocProps = z.infer<typeof TwoPanelWithTocSchema>

function PanelSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

/**
 * TwoPanelWithToc - A responsive component that displays panels with a dynamic Table of Contents.
 * 
 * This component adapts its layout and ToC presentation based on screen size:
 * - Mobile: Dropdown ToC
 * - Tablet: Sidebar ToC
 * - Desktop: Horizontal ToC at the top
 * 
 * It uses intersection observers to highlight the active section in the ToC as the user scrolls.
 */
export function TwoPanelWithTocComponent({ children, className = '' }: TwoPanelWithTocProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showDesktopToc, setShowDesktopToc] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)

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

    Object.values(panelRefs.current).forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    const checkTocVisibility = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current
        setShowDesktopToc(scrollHeight > clientHeight)
      }
    }

    checkTocVisibility()
    window.addEventListener('resize', checkTocVisibility)

    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener('resize', checkTocVisibility)
    }
  }, [])

  const handleTocClick = (key: string) => {
    panelRefs.current[key]?.scrollIntoView({ behavior: 'smooth' })
    setIsDropdownOpen(false)
  }

  return (
    <>
      <ZeroTrust
        schema={TwoPanelWithTocSchema}
        props={{ children, className }}
        actionLevel="error"
        componentName="TwoPanelWithToc"
      />
      <div className={`w-full flex flex-col ${className}`} ref={containerRef}>
        {/* Mobile ToC Dropdown */}
        <div className="sm:hidden sticky top-0 z-10 bg-background p-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full p-2 bg-primary text-primary-foreground rounded"
            aria-expanded={isDropdownOpen}
            aria-controls="toc-dropdown"
          >
            <span>Table of Contents</span>
            {isDropdownOpen ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
          </button>
          {isDropdownOpen && (
            <div id="toc-dropdown" className="mt-2 bg-background border rounded shadow-lg">
              {React.Children.map(children, (child) => (
                <button
                  key={child.props.key}
                  onClick={() => handleTocClick(child.props.key)}
                  className={`block w-full text-left p-2 hover:bg-muted ${activeSection === child.props.key ? 'bg-muted' : ''}`}
                >
                  {child.props.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Horizontal ToC */}
        {showDesktopToc && (
          <div className="hidden lg:block sticky top-0 z-10 bg-background p-2 border-b">
            <nav aria-label="Table of Contents" className="flex justify-center space-x-4">
              {React.Children.map(children, (child) => (
                <button
                  key={child.props.key}
                  onClick={() => handleTocClick(child.props.key)}
                  className={`px-3 py-2 rounded hover:bg-muted ${activeSection === child.props.key ? 'bg-muted font-bold' : ''}`}
                >
                  {child.props.title}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="w-full sm:w-[calc(100%-200px)] lg:w-full p-4 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {React.Children.map(children, (child) => (
                <div
                  id={child.props.key}
                  key={child.props.key}
                  ref={(el) => {
                    panelRefs.current[child.props.key] = el;
                  }}
                  className="border p-4 rounded"
                >
                  <Suspense fallback={<PanelSkeleton />}>
                    {child}
                  </Suspense>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet ToC */}
          <div className="hidden sm:block lg:hidden w-[200px] sticky top-0 h-screen overflow-y-auto p-4 border-l">
            <nav aria-label="Table of Contents">
              <ul>
                {React.Children.map(children, (child) => (
                  <li key={child.props.key} className="mb-2">
                    <button
                      onClick={() => handleTocClick(child.props.key)}
                      className={`text-left hover:text-primary ${activeSection === child.props.key ? 'font-bold text-primary' : ''}`}
                    >
                      {child.props.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

// Example usage and documentation
import { ComponentDoc } from './component-documentation-hub'

const examplePanels = [
  { key: 'panel1', title: 'Panel 1', content: 'Content for Panel 1' },
  { key: 'panel2', title: 'Panel 2', content: 'Content for Panel 2' },
  { key: 'panel3', title: 'Panel 3', content: 'Content for Panel 3' },
  { key: 'panel4', title: 'Panel 4', content: 'Content for Panel 4' },
]

export const examplesTwoPanelWithToc: ComponentDoc[] = [
  {
    id: 'TwoPanelWithToc',
    name: 'TwoPanelWithToc',
    description: 'A responsive component that displays panels with a dynamic Table of Contents.',
    usage: `
<TwoPanelWithToc>
  {examplePanels.map(panel => (
    <div key={panel.key} title={panel.title}>
      <h2 className="text-xl font-bold mb-2">{panel.title}</h2>
      <p>{panel.content}</p>
    </div>
  ))}
</TwoPanelWithToc>
    `,
    example: (
      <TwoPanelWithTocComponent>
        {examplePanels.map(panel => (
          <div key={panel.key} title={panel.title}>
            <h2 className="text-xl font-bold mb-2">{panel.title}</h2>
            <p>{panel.content}</p>
          </div>
        ))}
      </TwoPanelWithTocComponent>
    ),
  },
]