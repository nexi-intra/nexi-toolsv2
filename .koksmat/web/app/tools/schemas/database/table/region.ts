/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: true
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string(),
  searchindex: z.string(),
  name: z
    .string()
    .min(1, { message: "String must not be empty" })
    .describe("Name of the region"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the region"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  sortOrder: z.string().optional().describe("Sort order"),
});

export const tablename = "region";

export interface TableDescriptorInterface {
  schema: z.ZodObject<any>;
  tablename: string;
  dynamic: boolean;
}

export class TableDescriptor implements TableDescriptorInterface {
  private static instance: TableDescriptor | null = null;

  private _schema: z.ZodObject<any>;
  private _tablename: string;
  private _dynamic: boolean;

  private constructor(
    schema: z.ZodObject<any>,
    tablename: string,
    dynamic: boolean
  ) {
    this._schema = schema;
    this._tablename = tablename;
    this._dynamic = dynamic;
  }
  // Static method to get the single instance
  public static getInstance(
    schema: z.ZodObject<any>,
    tablename: string,
    dynamic: boolean
  ): TableDescriptor {
    if (!TableDescriptor.instance) {
      TableDescriptor.instance = new TableDescriptor(
        schema,
        tablename,
        dynamic
      );
    }
    return TableDescriptor.instance;
  }

  get schema() {
    return this._schema;
  }

  get tablename() {
    return this._tablename;
  }

  get dynamic() {
    return this._dynamic;
  }
}

function f1(y: TableDescriptorInterface) {
  console.log(y.schema);
}

function f2() {
  const table = TableDescriptor.getInstance(schema, tablename, false);
  f1(table);
}
