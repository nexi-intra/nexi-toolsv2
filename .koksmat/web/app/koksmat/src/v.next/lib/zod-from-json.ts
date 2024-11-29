import { z } from "zod";

// Type for Transform Rules
type TransformRule = (key: string, values: any[]) => string | null;

// Default Transform Rules
const defaultTransformRules: TransformRule[] = [
  // Rule for date fields
  (key, values) => {
    if (
      key === "created_at" ||
      key === "updated_at" ||
      key === "deleted_at" ||
      key.toLowerCase().includes("date")
    ) {
      return "z.coerce.date()";
    }
    return null;
  },
  // Add more rules here as needed
];

// Function to infer the Zod type as a string from values
function inferType(
  values: any[],
  key: string,
  indent: number = 2,
  transformRules: TransformRule[] = defaultTransformRules
): string {
  // Apply transform rules
  for (const rule of transformRules) {
    const result = rule(key, values);
    if (result) {
      return result;
    }
  }

  // Filter out null and undefined values for type inference
  const nonNullValues = values.filter(
    (value) => value !== null && value !== undefined
  );

  const types = nonNullValues.map((value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "z.array(z.any())";
      } else {
        // Infer type from array elements
        const arrayType = inferType(value, key, indent + 2, transformRules);
        return `z.array(${arrayType})`;
      }
    } else if (typeof value === "object") {
      if (Object.keys(value).length === 0) {
        return "z.record(z.any())";
      } else {
        const objectSchema = generateSchemaCode(
          [value],
          indent + 2,
          transformRules
        );
        return objectSchema.trim();
      }
    } else if (typeof value === "string") {
      return "z.string()";
    } else if (typeof value === "number") {
      return "z.number()";
    } else if (typeof value === "boolean") {
      return "z.boolean()";
    } else {
      return "z.any()";
    }
  });

  // If all values are null or undefined, default to z.string()
  if (types.length === 0) {
    return "z.string()";
  }

  // Deduplicate types
  const uniqueTypes = Array.from(new Set(types));

  if (uniqueTypes.length === 1) {
    return uniqueTypes[0];
  } else {
    return `z.union([${uniqueTypes.join(", ")}])`;
  }
}

// Function to generate Zod schema code from an array of objects
export function generateSchemaCode(
  data: any[],
  indent: number = 2,
  transformRules: TransformRule[] = defaultTransformRules
): string {
  const indentSpace = " ".repeat(indent);
  let schemaCode = "z.object({\n";

  // Collect all keys from the objects
  const keys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

  if (keys.length === 0) {
    return "z.record(z.any())";
  }

  for (const key of keys) {
    // Collect all values for the current key
    const values = data.map((item) => item[key]);

    // Infer the Zod type for the current key
    let fieldType = inferType(values, key, indent + 2, transformRules);

    // Check if the field is optional (undefined or null in some objects)
    const isOptional = values.some(
      (value) => value === undefined || value === null
    );

    if (isOptional) {
      fieldType += ".optional()";
    }

    schemaCode += `${indentSpace}${JSON.stringify(key)}: ${fieldType},\n`;
  }

  schemaCode += `${" ".repeat(indent - 2)}})`;

  return schemaCode;
}
