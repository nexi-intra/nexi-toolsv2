"use client"

import { useContext, useEffect, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, Edit2 } from 'lucide-react'
import { ZeroTrust } from '@/components/zero-trust'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Holiday, Holidays, HolidaysSchemaArray } from "@/app/tools/schemas/forms/holiday-schema"
import { HolidayEditDialog } from "./holiday-edit-dialog"
import { MagicboxContext } from "@/app/koksmat0/magicbox-context"
import { MSALTest } from "@/app/koksmat0/msal/test"
import { z } from "zod"
function isSameDate(date1: Date, date2: Date) {
  // Ensure both inputs are Date objects
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  // Compare year, month, and day
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameDateText(date1: Date, date2: Date) {
  // Ensure both inputs are Date objects
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  debugger
  // Compare year, month, and day
  return (
    (d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()) + " : " + d1 + " : " + d2
  );
}
const countryNames: Record<string, string> = {
  AT: "Austria", BE: "Belgium", BG: "Bulgaria", HR: "Croatia", CY: "Cyprus", CZ: "Czech Republic",
  DK: "Denmark", EE: "Estonia", FI: "Finland", FR: "France", DE: "Germany", GR: "Greece",
  HU: "Hungary", IE: "Ireland", IT: "Italy", LV: "Latvia", LT: "Lithuania", LU: "Luxembourg",
  MT: "Malta", NL: "Netherlands", PL: "Poland", PT: "Portugal", RO: "Romania", SK: "Slovakia",
  SI: "Slovenia", ES: "Spain", SE: "Sweden", GB: "United Kingdom", NO: "Norway", CH: "Switzerland",
  NX: "Nexi"
}

const translations = {
  en: { name: "English", title: "Bank Holidays", selectDate: "Select start date" },
  de: { name: "Deutsch", title: "Feiertage", selectDate: "Startdatum auswählen" },
  it: { name: "Italiano", title: "Giorni festivi", selectDate: "Seleziona data d'inizio" },
  pl: { name: "Polski", title: "Dni wolne od pracy", selectDate: "Wybierz datę początkową" },
  hr: { name: "Hrvatski", title: "Državni praznici", selectDate: "Odaberite početni datum" },
  da: { name: "Dansk", title: "Helligdage", selectDate: "Vælg startdato" },
  sv: { name: "Svenska", title: "Helgdagar", selectDate: "Välj startdatum" },
  no: { name: "Norsk", title: "Helligdager", selectDate: "Velg startdato" },
  fi: { name: "Suomi", title: "Pyhäpäivät", selectDate: "Valitse aloituspäivä" },
  nl: { name: "Nederlands", title: "Feestdagen", selectDate: "Selecteer startdatum" }
}



const BankHolidaysCalendarPropsSchema = z.object({
  initialHolidays: HolidaysSchemaArray,
  initialDate: z.date(),
  className: z.string().optional(),
  externalManagedDate: z.boolean().optional()

})

type BankHolidaysCalendarProps = z.infer<typeof BankHolidaysCalendarPropsSchema>

export default function BankHolidaysCalendar({ initialHolidays, className, initialDate, externalManagedDate }: BankHolidaysCalendarProps) {
  const [language, setLanguage] = useState<keyof typeof translations>("en")
  const [startDate, setStartDate] = useState<Date | undefined>(initialDate)
  const [holidays, setHolidays] = useState<Holidays>(initialHolidays)
  const [editMode, setEditMode] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const magicBox = useContext(MagicboxContext)
  useEffect(() => {
    const values = BankHolidaysCalendarPropsSchema.parse({ initialHolidays, initialDate, className })
    setStartDate(values.initialDate)


  }, [initialDate])

  function addDays(date: Date, days: number): Date {
    const result = new Date(date); // Create a copy of the original date
    result.setDate(result.getDate() + days); // Add the specified number of days
    return result;
  }
  const getHolidaysForWeek = (start: Date) => {
    //debugger
    return holidays
    return holidays.filter(holiday => {
      const d = new Date(holiday.date)


      return holiday.date >= start && holiday.date < addDays(start, 7)
    })
  }

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday)
  }

  const handleSaveHoliday = (updatedHoliday: Holiday) => {
    setHolidays(holidays.map(h => h.date === updatedHoliday.date ? updatedHoliday : h))
    setEditingHoliday(null)
  }

  return (
    <>
      <ZeroTrust
        schema={BankHolidaysCalendarPropsSchema}
        props={{ initialHolidays, initialDate, className }}
        actionLevel="warn"
        componentName="BankHolidaysCalendar"
      />

      {/* <MSALTest /> */}
      {/* {magicBox.user && <div>{magicBox.user.name}</div>} */}
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{translations[language].title}</CardTitle>
          <div className="flex items-center space-x-2">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {translations[language].name} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(translations).map(([lang, { name }]) => (
                  <DropdownMenuItem key={lang} onSelect={() => setLanguage(lang as keyof typeof translations)}>
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Button variant="outline" onClick={() => setEditMode(!editMode)}>
              {editMode ? "View Mode" : "Edit Mode"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>

          <div className="space-y-4">
            {!externalManagedDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{translations[language].selectDate}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      fromDate={new Date("2025-01-01")}
                      toDate={new Date("2025-12-31")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {startDate && (
              <div className="space-y-6">
                {Array.from({ length: 7 }, (_, i) => addDays(startDate, i)).map((date) => {
                  const thisWeek = getHolidaysForWeek(startDate)
                  const holidaysOnDate = thisWeek.filter(h => isSameDate(h.date, date))
                  return (
                    <div key={date.toISOString()} className="border-b pb-4 last:border-b-0">

                      <div className="text-lg font-semibold mb-2">{format(date, "EEEE, MMMM d")}</div>
                      {holidaysOnDate.length > 0 ? (
                        holidaysOnDate.map((holiday) => (
                          <div key={holiday.name} className="space-y-2">
                            <div className="flex">
                              <div className="text-md font-medium">{holiday.name}</div>
                              <div className="grow" />
                              {editMode && (
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-sm text-muted-foreground"
                                  onClick={() => handleEditHoliday(holiday)}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {holiday.countries.sort().map((country) => (
                                <Dialog key={country}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                                      <img
                                        src={country === "NX" ? "/placeholder.svg?height=24&width=32" : `https://flagcdn.com/32x24/${country.toLowerCase()}.png`}
                                        alt={`${countryNames[country]} flag`}
                                        className="rounded-sm hover:ring-2 hover:ring-primary transition-all"
                                        width={32}
                                        height={24}
                                      />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <img
                                          src={country === "NX" ? "/placeholder.svg?height=24&width=32" : `https://flagcdn.com/32x24/${country.toLowerCase()}.png`}
                                          alt={`${countryNames[country]} flag`}
                                          className="rounded-sm"
                                          width={32}
                                          height={24}
                                        />
                                        {countryNames[country]} - {holiday.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {format(date, "MMMM d, yyyy")}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <p>{countryNames[country]} celebrates {holiday.name} on {format(date, "MMMM d, yyyy")}.</p>
                                      <ul className="list-disc list-inside mt-2">
                                        <li>It&apos;s a public holiday with most businesses and services closed.</li>
                                        <li>Specific traditions and celebrations may vary by region and culture.</li>
                                        <li>Public transportation may operate on a reduced schedule.</li>
                                        <li>Check local announcements for any special events or restrictions.</li>
                                      </ul>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </div>

                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No bank holidays</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {editingHoliday && (
        <HolidayEditDialog
          holiday={editingHoliday}
          isOpen={!!editingHoliday}
          onClose={() => setEditingHoliday(null)}
          onSave={handleSaveHoliday}
          countryNames={countryNames}
        />
      )}
    </>
  )
}

