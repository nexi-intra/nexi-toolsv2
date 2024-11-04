"use client"
import { useCases } from '@/app/tools/api/usecases'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 1)!}
    /></div>
  )
}
