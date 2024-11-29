"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Globe, FileText, X } from 'lucide-react'
import { exampleToolInfo, ToolInfo } from '@/components/interfaces/ToolInfo'
import { ComponentDoc } from './component-documentation-hub'

interface Country {
  id: string
  name: string
}

interface BusinessPurpose {
  id: string
  name: string
}

interface ToolInfoManagerProps {
  defaultInfo: ToolInfo
  onSave: (updatedInfo: ToolInfo) => void
  availableCountries: Country[]
  availableBusinessPurposes: BusinessPurpose[]
  availableLanguages: string[]
}
const sampleAvailableCountries: Country[] = [
  { id: "DK", name: "Denmark" },
  { id: "SE", name: "Sweden" },
  { id: "NO", name: "Norway" },
  { id: "FI", name: "Finland" },
  { id: "IS", name: "Iceland" }
]

const sampleAvailableBusinessPurposes: BusinessPurpose[] = [
  { id: "DATA_ANALYSIS", name: "Data Analysis" },
  { id: "REPORTING", name: "Reporting" },
  { id: "VISUALIZATION", name: "Visualization" },
  { id: "FORECASTING", name: "Forecasting" },
  { id: "MACHINE_LEARNING", name: "Machine Learning" }
]

export const examplesToolAdmin: ComponentDoc[] = [{
  id: 'ToolAdmin',
  name: 'ToolAdmin',
  description: 'A component editing .',
  usage: `
  

const sampleAvailableCountries: Country[] = [
  { id: "DK", name: "Denmark" },
  { id: "SE", name: "Sweden" },
  { id: "NO", name: "Norway" },
  { id: "FI", name: "Finland" },
  { id: "IS", name: "Iceland" }
]

const sampleAvailableBusinessPurposes: BusinessPurpose[] = [
  { id: "DATA_ANALYSIS", name: "Data Analysis" },
  { id: "REPORTING", name: "Reporting" },
  { id: "VISUALIZATION", name: "Visualization" },
  { id: "FORECASTING", name: "Forecasting" },
  { id: "MACHINE_LEARNING", name: "Machine Learning" }
]


// use intellisense to get the import statement right
    <ToolAdmin defaultInfo={exampleToolInfo} onSave={function (updatedInfo: ToolInfo): void {
      throw new Error('Function not implemented.')
    }} availableCountries={[]} availableBusinessPurposes={[]} availableLanguages={[]} />



`,
  example: (
    <ToolAdmin defaultInfo={exampleToolInfo} onSave={function (updatedInfo: ToolInfo): void {
      throw new Error('Function not implemented.')
    }} availableCountries={sampleAvailableCountries} availableBusinessPurposes={sampleAvailableBusinessPurposes} availableLanguages={[]} />
  ),
}
]

export default function ToolAdmin({
  defaultInfo,
  onSave,
  availableCountries,
  availableBusinessPurposes,
  availableLanguages
}: ToolInfoManagerProps) {
  const [info, setInfo] = useState<ToolInfo>(defaultInfo)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCountry, setNewCountry] = useState('')
  const [newBusinessPurpose, setNewBusinessPurpose] = useState('')

  useEffect(() => {
    setInfo(defaultInfo)
  }, [defaultInfo])

  const handleInputChange = (field: keyof ToolInfo, value: any) => {
    setInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleDescriptionChange = (lang: string, value: string) => {
    setInfo(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value }
    }))
  }

  const handleAddCountry = () => {
    if (newCountry && !info.countries.includes(newCountry)) {
      setInfo(prev => ({
        ...prev,
        countries: [...prev.countries, newCountry]
      }))
      setNewCountry('')
    }
  }

  const handleAddBusinessPurpose = () => {
    if (newBusinessPurpose && !info.businessPurposes.includes(newBusinessPurpose)) {
      setInfo(prev => ({
        ...prev,
        businessPurposes: [...prev.businessPurposes, newBusinessPurpose]
      }))
      setNewBusinessPurpose('')
    }
  }

  const handleSave = () => {
    onSave(info)
    setIsDialogOpen(false)
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="bg-teal-200 text-teal-800 px-2 py-1 rounded text-sm inline-block mb-2">Group</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">{info.name}</h2>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{info.description[availableLanguages[0]] || 'No description available.'}</p>
        <div className="grid grid-cols-2 gap-4">
          {info.documents.map((doc, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{doc.name}</span>
            </div>
          ))}
          {info.countries.map((country, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{country}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full">Edit</Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tool Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={info.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            {availableLanguages.map(lang => (
              <div key={lang}>
                <Label htmlFor={`description-${lang}`}>Description ({lang})</Label>
                <Textarea
                  id={`description-${lang}`}
                  value={info.description[lang] || ''}
                  onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                />
              </div>
            ))}
            <div>
              <Label htmlFor="countries">Countries</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!info.countries.includes(value)) {
                    handleInputChange('countries', [...info.countries, value])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select countries" />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries.map(country => (
                    <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex mt-2">
                <Input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="Add new country"
                />
                <Button onClick={handleAddCountry}>Add</Button>
              </div>
            </div>
            <div>
              <Label htmlFor="businessPurposes">Business Purposes</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!info.businessPurposes.includes(value)) {
                    handleInputChange('businessPurposes', [...info.businessPurposes, value])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business purposes" />
                </SelectTrigger>
                <SelectContent>
                  {availableBusinessPurposes.map(purpose => (
                    <SelectItem key={purpose.id} value={purpose.id}>{purpose.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex mt-2">
                <Input
                  value={newBusinessPurpose}
                  onChange={(e) => setNewBusinessPurpose(e.target.value)}
                  placeholder="Add new business purpose"
                />
                <Button onClick={handleAddBusinessPurpose}>Add</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}