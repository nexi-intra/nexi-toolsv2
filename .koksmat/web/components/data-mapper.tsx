'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import SimplifiedMonacoInputField from './simplified-monaco-input-field'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { saveMappingsToYaml } from '@/lib/mapping-persistence'
import { ZeroTrust } from '@/components/zero-trust'
import { ComponentDoc } from './component-documentation-hub'

interface Mapping {
  [key: string]: string
}

const ZodObjectWithShape = z.custom<z.ZodObject<any, any>>((val) => {
  return val instanceof z.ZodObject && Object.keys(val.shape).length > 0;
}, {
  message: "Must be a ZodObject with a defined shape"
});

const EntityDataMappingSchema = z.object({
  targetSchema: ZodObjectWithShape,

  sampleItem: z.record(z.string(), z.any()),
  initialMapping: z.record(z.string(), z.string()).optional(),
  onChange: z.function().args(z.object({ mapping: z.record(z.string(), z.string()) })).returns(z.void()),
  className: z.string().optional()

})

type EntityDataMappingProps = z.infer<typeof EntityDataMappingSchema>

const defaultMapping: Mapping = {}

export function EntityDataMapping(props: EntityDataMappingProps) {

  const [mapping, setMapping] = useState<Mapping>(props.initialMapping || defaultMapping)

  useEffect(() => {
    if (props.initialMapping) {
      setMapping(props.initialMapping)
    }
  }, [props.initialMapping])

  useEffect(() => {
    if (props.onChange) {
      props.onChange({ mapping })
    }
  }, [mapping])

  const handleMappingChange = (field: string, value: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const renderMappingFields = () => {
    return Object.keys(props.targetSchema.shape).map(field => (
      <div key={field} className="mb-4">
        <SimplifiedMonacoInputField
          value={mapping[field] || ''}
          onChange={(value) => handleMappingChange(field, value)}
          sourceItem={props.sampleItem}
          label={`${field} Mapping`}
        />
      </div>
    ))
  }

  return (
    <>
      <ZeroTrust
        schema={EntityDataMappingSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="EntityDataMapping"
      />
      <Card className={`w-full max-w-4xl mx-auto ${props.className || ''}`}>
        <CardHeader>
          <CardTitle>Entity Data Mapping</CardTitle>
          <CardDescription>Define mappings from source to target data structure</CardDescription>
        </CardHeader>
        <CardContent>
          {renderMappingFields()}
        </CardContent>

      </Card>
    </>
  )
}

export const examplesEntityDataMapping: ComponentDoc[] = [

  {
    id: 'EntityDataMappingEdit',
    name: 'EntityDataMapping',
    description: 'A component for editing entity data mappings from source to target structure.',
    usage: `
import { EntityDataMapping } from './EntityDataMapping'
import { z } from 'zod'

const targetSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  emailAddress: z.string().email(),
  isActiveUser: z.boolean()
})


const sampleItem = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  birth_date: "1990-01-01",
  email: "john.doe@example.com",
  is_active: true
}

const initialMapping = {
  fullName: "item.first_name + ' ' + item.last_name",
  age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
  emailAddress: "item.email",
  isActiveUser: "item.is_active"
}

function handleChange({  mapping }) {
  
  console.log('Mapping changed to:', mapping)
  
}

<EntityDataMapping
  targetSchema={targetSchema}
  
  sampleItem={sampleItem}
  initialMapping={initialMapping}
  onChange={handleChange}
  className="my-custom-class"
/>
`,
    example: (
      <EntityDataMapping
        targetSchema={z.object({
          fullName: z.string(),
          age: z.number(),
          emailAddress: z.string().email(),
          isActiveUser: z.boolean()
        })}
        sampleItem={{
          id: 1,
          first_name: "John",
          last_name: "Doe",
          birth_date: "1990-01-01",
          email: "john.doe@example.com",
          is_active: true
        }}
        initialMapping={{
          fullName: "item.first_name + ' ' + item.last_name",
          age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
          emailAddress: "item.email",
          isActiveUser: "item.is_active"
        }}
        onChange={({ mapping }) => console.log('Mapping saved:', mapping)}

      />
    ),
  }
]