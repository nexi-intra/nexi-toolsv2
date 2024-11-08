"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 8)!} mode={'view'}>
      <><DocumentationSection title="Design">
        <p>
          This is implemented by having easy access to the tools and the ability to search for tools, cross link using
          country, category and purpose
        </p>
      </DocumentationSection>

        <DocumentationSection title="Data model">
          Supported by basically all data in the system
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
