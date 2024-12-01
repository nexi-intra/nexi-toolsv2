import React from 'react'
import { redirect } from 'next/navigation';
import { APPNAME } from '@/app/global';
export default function Page() {
  redirect("/" + APPNAME);
  return (
    <div>placeholder ...</div>
  )
}
