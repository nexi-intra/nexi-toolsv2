"use client"
import { dateSchema } from '@/app/koksmat/src/v.next/schemas/date'
import { getSampleHolidays } from '@/app/tools/schemas/forms/holiday-schema'
import BankHolidaysCalendar from '@/components/bank-holidays-calendar'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { z } from 'zod'



export default function BankHolidayPage() {
  const [first, setfirst] = useState<Date>(new Date("2022-01-01"))
  return (
    <div>
      <Input
        id="date"
        type="date"
        value={first.toISOString().split('T')[0]}
        onChange={(e) => setfirst(new Date(e.target.value))}
        className="col-span-3"
      />
      <BankHolidaysCalendar initialHolidays={getSampleHolidays()} initialDate={first} externalManagedDate />
    </div>
  )
}

