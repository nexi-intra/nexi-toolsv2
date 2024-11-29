"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 7)!} mode={'view'}>
      <><DocumentationSection title="Design">
        <p>
          This is implemented on all tools renderings - small, medium and large - with highligtning of
          if the tool is mandatory and the category of the tool
        </p>
      </DocumentationSection>

        <DocumentationSection title="Data model">
          Supported by the following tables:
          <ul>

            <li>Tool table</li>
            <li>Category table https://magic.intra.nexigroup.com/studio/database/tools/table/category/item</li>

          </ul>
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
