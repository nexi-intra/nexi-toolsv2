import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client";
import * as XLSX from 'xlsx';
import { ComponentDoc } from '@/components/component-documentation-hub';

/**
 * ExcelUploader Component
 * 
 * This component allows users to upload and parse Excel files with worksheet selection and data validation.
 * It supports three modes: view, new, and edit.
 * 
 * Features:
 * - File upload and parsing using xlsx library
 * - Worksheet selection
 * - Data display in table format
 * - Data validation using provided Zod schema
 * - Error handling for file type, parsing errors, and validation errors
 * - Zero Trust pattern for prop validation
 * - Koksmat logger for event and error logging
 * 
 * Props:
 * - mode: 'view' | 'new' | 'edit'
 * - initialData: ParsedExcelData | null
 * - onDataChange: (data: ParsedExcelData, isValid: boolean, errors: z.ZodError | null) => void
 * - className: string (optional)
 * - dataSchema: z.ZodSchema (for validating parsed data)
 * 
 * The parsed data is stored in state and passed to the parent component via the onDataChange callback,
 * along with validation results.
 */

export interface ParsedExcelData {
  headers: string[];
  rows: (string | null)[][];
  selectedSheet: string;
}

const ExcelUploaderPropsSchema = z.object({
  mode: z.enum(['view', 'new', 'edit']),
  initialData: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string().nullable())),
    selectedSheet: z.string()
  }).nullable(),
  onDataChange: z.function().args(
    z.object({
      headers: z.array(z.string()),
      rows: z.array(z.array(z.string().nullable())),
      selectedSheet: z.string()
    }),
    z.boolean(),
    z.instanceof(z.ZodError).nullable()
  ).returns(z.void()),
  className: z.string().optional(),
  dataSchema: z.instanceof(z.ZodSchema)
});

type ExcelUploaderProps = z.infer<typeof ExcelUploaderPropsSchema>;

export const ExcelUploader: React.FC<ExcelUploaderProps> = (props) => {
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(props.initialData);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [validationError, setValidationError] = useState<z.ZodError | null>(null);

  useEffect(() => {
    if (props.initialData !== parsedData) {
      setParsedData(props.initialData);
      setSelectedSheet(props.initialData?.selectedSheet || '');
      validateData(props.initialData);
    }
  }, [props.initialData]);

  const validateData = useCallback((data: ParsedExcelData | null) => {
    if (data) {
      try {
        props.dataSchema.parse(data);
        setValidationError(null);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setValidationError(error);
          return false;
        }
      }
    }
    return false;
  }, [props.dataSchema]);

  const parseSheet = useCallback((wb: XLSX.WorkBook, sheetName: string) => {
    const worksheet = wb.Sheets[sheetName];
    const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as (string | null)[][];
    const headers = parsedData[0].map(h => h || '');
    const rows = parsedData.slice(1);
    const newData = { headers, rows, selectedSheet: sheetName };
    const isValid = validateData(newData);
    props.onDataChange(newData, isValid, validationError);
    return newData;
  }, [validateData, props]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      kError("component", 'Invalid file type uploaded');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setSheets(wb.SheetNames);
        setSelectedSheet(wb.SheetNames[0]);
        const newData = parseSheet(wb, wb.SheetNames[0]);
        setParsedData(newData);
        kInfo("component", 'Excel file successfully parsed', { fileName: file.name });
      } catch (error) {
        setError('Error parsing Excel file. Please try again.');
        kError("component", 'Error parsing Excel file', { error });
      }
    };
    reader.readAsArrayBuffer(file);
  }, [parseSheet]);

  const handleSheetChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);
    if (workbook) {
      const newData = parseSheet(workbook, sheetName);
      setParsedData(newData);
    }
  }, [workbook, parseSheet]);

  return (
    <>
      <ZeroTrust
        schema={ExcelUploaderPropsSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="ExcelUploader"
      />
      <div className={`excel-uploader ${props.className || ''}`}>
        {props.mode !== 'view' && (
          <div className="mb-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {fileName && <p className="mt-2 text-sm text-gray-600">Uploaded: {fileName}</p>}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
        {sheets.length > 0 && (
          <div className="mb-4">
            <label htmlFor="sheet-select" className="block text-sm font-medium text-gray-700">Select Worksheet:</label>
            <select
              id="sheet-select"
              value={selectedSheet}
              onChange={handleSheetChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {sheets.map((sheet) => (
                <option key={sheet} value={sheet}>{sheet}</option>
              ))}
            </select>
          </div>
        )}
        {parsedData && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {parsedData.headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {validationError && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
            <h3 className="text-lg font-semibold text-red-800">Validation Errors:</h3>
            <ul className="list-disc list-inside">
              {validationError.errors.map((err, index) => (
                <li key={index} className="text-red-700">{err.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

function Demo() {

}
// Example usage documentation
export const examplesExcelUploader: ComponentDoc[] = [
  {
    id: 'ExcelUploaderWithValidation',
    name: 'ExcelUploader with Data Validation',
    description: 'ExcelUploader component with worksheet selection and data validation using Zod schema.',
    usage: `
import { z } from 'zod';

// Define the exact headers as a tuple
const expectedHeaders = [
  "Area",
  "Test Steps",
  "Test Case",
  "Goal",
  "Question ",
  "Pre-requisites",
  "Test Description",
  "Expected Result",
  "Comments",
] as const;

// Create a Zod schema for the headers
const headersSchema = z.tuple([
  z.literal("Area"),
  z.literal("Test Steps"),
  z.literal("Test Case"),
  z.literal("Goal"),
  z.literal("Question "),
  z.literal("Pre-requisites"),
  z.literal("Test Description"),
  z.literal("Expected Result"),
  z.literal("Comments"),
]);

// Create a Zod schema for a row, matching the number of headers
const rowSchema = z.tuple(
  expectedHeaders.map(() => z.string().nullable())
);

// Create the main data schema
const dataSchema = z.object({
  headers: headersSchema,
  rows: z.array(rowSchema),
  selectedSheet: z.string(),
});

const [excelData, setExcelData] = useState(null);
const [isValid, setIsValid] = useState(false);
const [validationErrors, setValidationErrors] = useState(null);

const handleDataChange = (data, isValid, errors) => {
  setExcelData(data);
  setIsValid(isValid);
  setValidationErrors(errors);
  console.log('Parsed Excel Data:', JSON.stringify(data, null, 2));
  console.log('Is Valid:', isValid);
  console.log('Validation Errors:', errors);
};

return (
  <div>
    <ExcelUploader
      mode="new"
      initialData={null}
      onDataChange={handleDataChange}
      dataSchema={dataSchema}
    />
    {excelData && (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Parsed Data:</h3>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(excelData, null, 2)}
        </pre>
        <p className="mt-2">
          Data is {isValid ? 'valid' : 'invalid'}
        </p>
        {!isValid && validationErrors && (
          <div className="mt-2">
            <h4 className="font-semibold">Validation Errors:</h4>
            <pre className="p-4 bg-red-100 rounded overflow-auto">
              {JSON.stringify(validationErrors, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )}
  </div>
);
    `,
    example: (
      <div>
        <ExcelUploader
          mode="new"
          initialData={null}
          onDataChange={(data, isValid, errors) => {
            console.log('Parsed Excel Data:', JSON.stringify(data, null, 2));
            console.log('Is Valid:', isValid);
            console.log('Validation Errors:', errors);
          }}
          dataSchema={z.object({
            headers: z.tuple([
              z.literal("Area"),
              z.literal("Test Steps"),
              z.literal("Test Case"),
              z.literal("Goal"),
              z.literal("Question "),
              z.literal("Pre-requisites"),
              z.literal("Test Description"),
              z.literal("Expected Result"),
              z.literal("Comments"),
            ]),
            rows: z.array(z.tuple([
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
              z.string().nullable(),
            ])),
            selectedSheet: z.string(),
          })}
        />
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify({
            headers: ["Area", "Test Steps", "Test Case", "Goal", "Question ", "Pre-requisites", "Test Description", "Expected Result", "Comments"],
            rows: [
              ["Area 1", "Step 1", "TC001", "Goal 1", "Question 1", "Prereq 1", "Description 1", "Expected 1", "Comment 1"],
              ["Area 2", "Step 2", "TC002", "Goal 2", "Question 2", "Prereq 2", "Description 2", "Expected 2", "Comment 2"],
            ],
            selectedSheet: "Sheet1"
          }, null, 2)}
        </pre>
      </div>
    ),
  },
];