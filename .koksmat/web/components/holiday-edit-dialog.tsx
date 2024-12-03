import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Holiday, CountryCode, HolidaySchema } from '@/app/tools/schemas/forms/holiday-schema'
import { ZeroTrust } from './zero-trust'


interface HolidayEditDialogProps {
  holiday: Holiday
  isOpen: boolean
  onClose: () => void
  onSave: (updatedHoliday: Holiday) => void
  countryNames: Record<string, string>
}

export function HolidayEditDialog({ holiday, isOpen, onClose, onSave, countryNames }: HolidayEditDialogProps) {
  const [editedHoliday, setEditedHoliday] = useState<Holiday>(holiday)

  const handleSave = () => {
    onSave(editedHoliday)
    onClose()
  }

  return (
    <>
      <ZeroTrust
        schema={HolidaySchema}
        props={{ holiday }}
        actionLevel="error"
        componentName="HolidayEditDialog"
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Holiday</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedHoliday.name}
                onChange={(e) => setEditedHoliday({ ...editedHoliday, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={editedHoliday.date}
                onChange={(e) => setEditedHoliday({ ...editedHoliday, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Countries</Label>
              <ScrollArea className="h-[200px] col-span-3">
                {Object.entries(countryNames).map(([code, name]) => (
                  <div key={code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${code}`}
                      checked={editedHoliday.countries.includes(code)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditedHoliday({
                            ...editedHoliday,
                            countries: [...editedHoliday.countries, code]
                          })
                        } else {
                          setEditedHoliday({
                            ...editedHoliday,
                            countries: editedHoliday.countries.filter(c => c !== code)
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`country-${code}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {name}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            This is a test, so data will not be saved to a database but memory <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
