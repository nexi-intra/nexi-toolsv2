"use client"
import { useCases } from '@/app/tools/api/usecases'
import { DocumentationSection } from '@/components/documentation-section'
import { UseCaseDetails } from '@/components/use-case-details'

import React from 'react'

export default function page() {
  return (
    <div> <UseCaseDetails
      useCase={useCases.find(useCase => useCase.id === 4)!} mode={'view'}>
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
        </DocumentationSection>
        <DocumentationSection title="Data model">
          <ul>
            <li>User profile table https://magic.intra.nexigroup.com/studio/database/tools/table/user</li>
            <li>Country table https://magic.intra.nexigroup.com/studio/database/tools/table/country</li>

            https://github.com/orgs/nexi-intra/projects/15/views/1?pane=issue&itemId=85820515&issue=nexi-intra%7Cnexi-toolsv2%7C59

            <li>Role table NEW </li>
            <li>Access Points NEW</li>
          </ul>
        </DocumentationSection>

      </>


    </UseCaseDetails>


    </div>
  )
}
