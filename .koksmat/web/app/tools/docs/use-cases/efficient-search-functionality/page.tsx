"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 3)!} mode={'view'}>
      <><DocumentationSection title="Design">
        <p>
          This is implemented by having data stored in database with the relations to countries and roles
        </p>
      </DocumentationSection>
        <DocumentationSection title="Data model">
          Supported by the following tables:
          <ul>

            <li>Tool table https://magic.intra.nexigroup.com/studio/database/tools/table/tool/item</li>
          </ul>
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
