import { APPNAME } from '@/app/global'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div>Components for Nexi International


      <div>

        <Link href={`/${APPNAME}/pages/international/bankholiday`}>Bank Holiday</Link>
      </div>
    </div>
  )
}
