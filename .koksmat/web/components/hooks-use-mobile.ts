'use client'

import { useState, useEffect } from 'react'

export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkMobile()

    // Add event listener
    window.addEventListener('resize', checkMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}