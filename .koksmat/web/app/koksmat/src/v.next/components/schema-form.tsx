'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { z, ZodType, ZodOptional } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ComponentDoc } from '../../../../../components/component-documentation-hub'
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client"

// AI-friendly component description:
// SchemaForm is a generic, dynamic form component that generates input fields based on any provided Zod object schema.
// It supports view, new, and edit modes, handles complex nested objects, and allows for custom field rendering.
// The component is fully type-safe, accessible, and responsive, using state variables for real-time updates.
// It now supports dark/light mode for input fields and JSON display, as well as undo/redo functionality.
// The component now includes an optional 'omit' parameter to dynamically exclude fields from the schema.
// It now uses the .describe attribute for labels and additional descriptions.
// The component now handles cases where the schema might be undefined or invalid.
// Schema validation and error reporting are now handled in a useEffect hook.
// The onChange callback is called with isValid, itemData, and an array of error messages.

// Define the props schema using Zod
const SchemaFormPropsSchema = (schema: z.ZodObject<any, any>) => z.object({
  schema: z.instanceof(z.ZodObject),
  initialData: z.record(z.any()).optional(),
  mode: z.enum(['view', 'new', 'edit']),
  onChange: z.function().args(
    z.boolean(),
    z.record(z.any()),
    z.array(z.object({ field: z.string(), message: z.string() }))
  ).returns(z.void()),
  className: z.string().optional(),
  fieldMapper: z.function().args(z.any(), z.string(), z.any(), z.function().args(z.string(), z.any()).returns(z.void()), z.boolean()).returns(z.any()).optional(),
  omit: z.array(z.string())
    .refine(
      (keys: string[]) => {
        const schemaKeys = Object.keys(schema.shape);
        return keys.every(key => schemaKeys.includes(key));
      },
      {
        message: "All omitted keys must exist in the schema",
      }
    )
    .optional(),
})

// Infer the props type from the schema
type SchemaFormProps<T extends z.ZodObject<any, any>> = {
  schema: T;
  initialData?: z.infer<T>;
  mode: 'view' | 'new' | 'edit';
  onChange: (isValid: boolean, data: z.infer<T>, errors: Array<{ field: string; message: string }>) => void;
  className?: string;
  fieldMapper?: (fieldSchema: z.ZodTypeAny, key: string, value: any, onChange: (key: string, value: any) => void, isDisabled: boolean) => React.ReactNode;
  omit?: string[];
}

export function SchemaForm<T extends z.ZodObject<any, any>>({
  schema,
  initialData,
  mode,
  onChange,
  className = '',
  fieldMapper,
  omit = [],
}: SchemaFormProps<T>) {
  const [schemaKeys, setSchemaKeys] = useState<string[]>([]);
  const [invalidKeys, setInvalidKeys] = useState<string[]>([]);
  const [isSchemaValid, setIsSchemaValid] = useState(true);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!schema || typeof schema !== 'object' || !('shape' in schema)) {
      kError("component", 'Invalid schema provided to SchemaForm');
      setIsSchemaValid(false);
      return;
    }

    const keys = Object.keys(schema.shape);
    setSchemaKeys(keys);

    const invalid = omit.filter(key => !keys.includes(key));
    setInvalidKeys(invalid);

    if (invalid.length > 0) {
      kWarn("component", `The following keys in the 'omit' array do not exist in the schema: ${invalid.join(', ')}`);
    }

    setIsSchemaValid(true);
  }, [schema, omit]);

  const filteredSchema = useMemo(() => {
    if (!isSchemaValid) return schema;
    const validOmitKeys = omit.filter(key => schemaKeys.includes(key));
    if (validOmitKeys.length === 0) return schema;
    return schema.omit(validOmitKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  }, [schema, omit, schemaKeys, isSchemaValid]);

  const [formData, setFormData] = useState<z.infer<typeof filteredSchema>>(
    initialData ? (Object.keys(initialData).reduce((acc, key) => {
      if (!omit.includes(key)) {
        acc[key] = initialData[key];
      }
      return acc;
    }, {} as z.infer<typeof filteredSchema>)) : ({} as z.infer<typeof filteredSchema>)
  );
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([])
  const [history, setHistory] = useState<z.infer<typeof filteredSchema>[]>([formData])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    setFormData(initialData ? (Object.keys(initialData).reduce((acc, key) => {
      if (!omit.includes(key)) {
        acc[key] = initialData[key];
      }
      return acc;
    }, {} as z.infer<typeof filteredSchema>)) : ({} as z.infer<typeof filteredSchema>))
    setHistory([formData])
    setHistoryIndex(0)
    setTouchedFields(new Set())
  }, [initialData, omit, filteredSchema])

  const validateForm = useCallback((data: z.infer<typeof filteredSchema>) => {
    try {
      filteredSchema.parse(data);
      setErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  }, [filteredSchema]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setTouchedFields((prev) => new Set(prev).add(key));
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setHistory((prevHistory) => [...prevHistory.slice(0, historyIndex + 1), newData]);
        setHistoryIndex((prevIndex) => prevIndex + 1);
        const isValid = validateForm(newData);
        onChange(isValid, newData, errors);
      }
      return newData;
    });
  }, [historyIndex, onChange, validateForm, errors]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      const newData = history[historyIndex - 1];
      setFormData(newData);
      const isValid = validateForm(newData);
      onChange(isValid, newData, errors);
    }
  }, [history, historyIndex, onChange, validateForm, errors]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      const newData = history[historyIndex + 1];
      setFormData(newData);
      const isValid = validateForm(newData);
      onChange(isValid, newData, errors);
    }
  }, [history, historyIndex, onChange, validateForm, errors]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const defaultRenderInput = (fieldSchema: z.ZodTypeAny, key: string, value: any, onChange: (key: string, value: any) => void, isDisabled: boolean) => {
    const commonClasses = "bg-white dark:bg-gray-800 text-black dark:text-white";

    const handleChange = (newValue: any) => {
      onChange(key, newValue);
    };

    // Unwrap ZodOptional if present
    const unwrappedSchema = fieldSchema instanceof z.ZodOptional ? fieldSchema.unwrap() : fieldSchema;

    const fieldError = errors.find(err => err.field === key);

    switch (unwrappedSchema._def.typeName) {
      case 'ZodString':
        return (
          <>
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isDisabled}
              className={commonClasses}
            />
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      case 'ZodNumber':
      case 'ZodInt':
        return (
          <>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value))}
              disabled={isDisabled}
              className={commonClasses}
            />
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      case 'ZodBoolean':
        return (
          <>
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleChange(checked)}
              disabled={isDisabled}
            />
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      case 'ZodEnum':
        return (
          <>
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleChange(newValue)}
              disabled={isDisabled}
            >
              <SelectTrigger className={commonClasses}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {(unwrappedSchema as z.ZodEnum<any>).options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      case 'ZodDate':
        return (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={isDisabled} className={commonClasses}>
                  {value ? format(value, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date) => handleChange(date)}
                  disabled={isDisabled}
                  className={commonClasses}
                />
              </PopoverContent>
            </Popover>
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      case 'ZodObject':
      case 'ZodRecord':
      case 'ZodArray':
        return (
          <>
            <Textarea
              value={JSON.stringify(value || (unwrappedSchema._def.typeName === 'ZodArray' ? [] : {}), null, 2)}
              onChange={(e) => {
                try {
                  const parsedValue = JSON.parse(e.target.value);
                  handleChange(parsedValue);
                } catch (error) {
                  kError("component", 'Invalid JSON:', error);
                }
              }}
              disabled={isDisabled}
              className={commonClasses}
            />
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
      default:
        return (
          <>
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isDisabled}
              className={commonClasses}
            />
            {touchedFields.has(key) && fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
          </>
        );
    }
  };

  const renderInput = (fieldSchema: z.ZodTypeAny, key: string) => {
    const isDisabled = mode === 'view';
    const value = formData[key as keyof typeof formData];

    if (fieldMapper) {
      return fieldMapper(fieldSchema, key, value, handleInputChange, isDisabled);
    }

    return defaultRenderInput(fieldSchema, key, value, handleInputChange, isDisabled);
  };

  const renderLabelAndDescription = (fieldSchema: z.ZodTypeAny, key: string) => {
    let label = key;
    let description = '';

    if (fieldSchema.description) {
      const lines = fieldSchema.description.split('\n');
      label = lines[0];
      description = lines.slice(1).join('\n');
    }

    return (
      <>
        <Label htmlFor={key} className="text-black dark:text-white">{label}</Label>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">{description}</p>}
      </>
    );
  };

  if (!isSchemaValid) {
    return <div className="text-red-500">Invalid schema provided to SchemaForm</div>;
  }

  return (
    <>
      <ZeroTrust
        schema={SchemaFormPropsSchema(schema)}
        props={{ schema, initialData, mode, onChange, className, fieldMapper, omit }}
        actionLevel="error"
        componentName="SchemaForm"
      />
      <div className={`space-y-4 ${className}`}>
        {Object.entries(filteredSchema.shape).map(([key, fieldSchema]) => (
          <div key={key} className="flex flex-col space-y-2">
            {renderLabelAndDescription(fieldSchema as z.ZodTypeAny, key)}
            {renderInput(fieldSchema as z.ZodTypeAny, key)}
          </div>
        ))}
      </div>
    </>
  );
}

// Example usage and documentation
const exampleSchema = z.object({
  tenant: z.string().describe("Tenant Name\nEnter the name of the tenant"),
  searchindex: z.string().describe("Search Index"),
  name: z.string().describe("Entry Name\nProvide a name for this entry"),
  description: z.string().optional().describe("Description\nOptional: Add a description for this entry"),
  Translations: z.record(z.string()).optional().describe("Translations\nAdd translations for different languages"),
  category_id: z.number().int().describe("Category ID\nEnter the numeric ID for the category"),
  url: z.string().url().describe("URL\nEnter a valid URL"),
  status: z.enum(['active', 'inactive', 'pending']).optional().describe("Status\nSelect the current status"),
  Documents: z.array(z.object({ title: z.string(), content: z.string() })).optional().describe("Documents\nAdd related documents"),
  metadata: z.record(z.any()).optional().describe("Metadata\nAdd any additional metadata"),
  isPublished: z.boolean().describe("Is Published\nIndicate whether this entry is published"),
  publishDate: z.date().optional().describe("Publish Date\nSelect the date when this entry was or will be published"),
})

type ExampleSchemaType = z.infer<typeof exampleSchema>

// Example component with mode switching and JSON display
const SchemaFormExample = () => {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [data, setData] = useState<ExampleSchemaType>({
    tenant: 'Example Tenant',
    searchindex: 'main-index',
    name: 'Sample Entry',
    description: 'This is a sample description',
    Translations: { en: 'English', es: 'Spanish' },
    category_id: 1,
    url: 'https://example.com',
    status: 'active',
    Documents: [{ title: 'Doc 1', content: 'Content 1' }, { title: 'Doc 2', content: 'Content 2' }],
    metadata: { key1: 'value1', key2: 'value2' },
    isPublished: true,
    publishDate: new Date(),
  })

  const handleChange = (isValid: boolean, newData: ExampleSchemaType, errors: Array<{ field: string; message: string }>) => {
    setData(newData)
    kInfo("component", `Data updated in ${mode} mode:`, { isValid, data: newData, errors })
  }

  return (
    <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="space-x-2">
        <Button onClick={() => setMode('view')} variant={mode === 'view' ? 'default' : 'outline'}>View</Button>
        <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'default' : 'outline'}>Edit</Button>
        <Button onClick={() => setMode('new')} variant={mode === 'new' ? 'default' : 'outline'}>New</Button>
      </div>
      <SchemaForm
        schema={exampleSchema}
        initialData={data}
        mode={mode}
        onChange={handleChange}
        omit={['metadata', 'Documents']}
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">Resulting JSON:</h3>
        <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const examplesSchemaForm: ComponentDoc[] = [
  {
    id: 'SchemaForm-Comprehensive',
    name: 'SchemaForm - Comprehensive Example with Field Omission and Descriptions',
    description: 'SchemaForm component with mode switching, various input types, field omission, descriptions, and dark/light mode support',
    usage: `
const exampleSchema = z.object({
  tenant: z.string().describe("Tenant Name\\nEnter the name of the tenant"),
  searchindex: z.string().describe("Search Index"),
  name: z.string().describe("Entry Name\\nProvide a name for this entry"),
  description: z.string().optional().describe("Description\\nOptional: Add a description for this entry"),
  Translations: z.record(z.string()).optional().describe("Translations\\nAdd translations for different languages"),
  category_id: z.number().int().describe("Category ID\\nEnter the numeric ID for the category"),
  url: z.string().url().describe("URL\\nEnter a valid URL"),
  status: z.enum(['active', 'inactive', 'pending']).optional().describe("Status\\nSelect the current status"),
  Documents: z.array(z.object({ title: z.string(), content: z.string() })).optional().describe("Documents\\nAdd related documents"),
  metadata: z.record(z.any()).optional().describe("Metadata\\nAdd any additional metadata"),
  isPublished: z.boolean().describe("Is Published\\nIndicate whether this entry is published"),
  publishDate: z.date().optional().describe("Publish Date\\nSelect the date when this entry was or will be published"),
})

type ExampleSchemaType = z.infer<typeof exampleSchema>

const SchemaFormExample = () => {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [data, setData] = useState<ExampleSchemaType>({
    tenant: 'Example Tenant',
    searchindex: 'main-index',
    name: 'Sample Entry',
    description: 'This is a sample description',
    Translations: { en: 'English', es: 'Spanish' },
    category_id: 1,
    url: 'https://example.com',
    status: 'active',
    Documents: [{ title: 'Doc 1', content: 'Content 1' }, { title: 'Doc 2', content: 'Content 2' }],
    metadata: { key1: 'value1', key2: 'value2' },
    isPublished: true,
    publishDate: new Date(),
  })

  const handleChange = (isValid: boolean, newData: ExampleSchemaType, errors: Array<{ field: string; message: string }>) => {
    setData(newData)
    kInfo(\`Data updated in \${mode} mode:\`, { isValid, data: newData, errors })
  }

  return (
    <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="space-x-2">
        <Button onClick={() => setMode('view')} variant={mode === 'view' ? 'default' : 'outline'}>View</Button>
        <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'default' : 'outline'}>Edit</Button>
        <Button onClick={() => setMode('new')} variant={mode === 'new' ? 'default' : 'outline'}>New</Button>
      </div>
      <SchemaForm
        schema={exampleSchema}
        initialData={data}
        mode={mode}
        onChange={handleChange}
        omit={['metadata', 'Documents']}
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">Resulting JSON:</h3>
        <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}
    `,
    example: <SchemaFormExample />,
  },
]