"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 1)!} mode={'view'}>
      <><DocumentationSection title="Design">
        <p>
          Multi lingual support is implemented by using for end user orientated componennts and for end user orientated data.
        </p>
      </DocumentationSection>
        <DocumentationSection title="Multi language in components">
          <p>
            English and Italian is suppported

          </p>

        </DocumentationSection>
        <DocumentationSection title="Multi language in data ">
          Supported by have a JSON structure represent texts that can be translated
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
