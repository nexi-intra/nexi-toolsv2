"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 6)!} mode={'view'}>
      <><DocumentationSection title="Design">
        <p>
          This is implemented as a single page (INSERT LINK) which can be embedded in SharePoint or Teams, or accessed directly in a browser.
        </p>
      </DocumentationSection>
        <DocumentationSection title="User Identification">
          <p>
            Users are identified with their Microsoft 365 account, the account can be
            a ordinary account of a guest account.

          </p>
          <p>
            Users can only change their own settings

          </p>

        </DocumentationSection>
        <DocumentationSection title="Data model">
          Supported by the following tables:
          <ul>

            <li>Tool table</li>
            <li>User profile table</li>
            <li>User profile group table</li>
          </ul>
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
