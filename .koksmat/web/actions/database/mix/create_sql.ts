import { z, ZodObject } from "zod";
import { execute } from "@/actions/client";

/*
  The schema for the CreateSql procedure
*/

const _schema = z
  .object({
    tenant: z.string().optional(),
    searchindex: z
      .string()
      .describe(
        "Search Index is used for concatenating all searchable fields in a single field making in easier to search\n"
      )
      .optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    query: z.string().optional(),
    schema: z.record(z.any()).optional(),
  })
  .describe("Create operation");

/*
  TypeScript type based on the schema
*/

export type CreateSqlProps = z.infer<typeof _schema>;

// Exclude 'tenant' and 'searchindex' from the type
export type InputType = Omit<CreateSqlProps, "tenant" | "searchindex">;

/**
// Example usage of the  function CreateSql
try {
  const  result =  CreateSql(authtoken,
 name, //replace name with your own variable
    description, //replace description with your own variable
    query, //replace query with your own variable
    schema, //replace schema with your own variable);
  
  
} catch (error) {
  console.error('Validation failed:', error.message);
}
  */

export default function CreateSql(
  authtoken: string,
  name: string,
  description: string,
  query: string,
  schema: object
) {
  const input = { name, description, query, schema };

  /* 
    
    
    The tenant name and search index are applied upstream, so they are omitted from the schema

    */

  const __schema = _schema.omit({ tenant: true, searchindex: true });

  /*
    
    Input data is validated against the schema, and might be transform during that process

    */
  const item = __schema.safeParse(input);

  if (!item.success) {
    throw new Error(item.error.errors.map((err) => err.message).join(", "));
  }
  return execute(
    authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
    "mix", // <-- this is a reference to a record in the connections table in the mix database
    "magic-mix.app", // <-- this is the service name processing the request
    "create_sql", // <-- this is the name of the procedure in the database pointed to by the connection
    item.data // <-- this is the data to be sent to the procedure
  );
}
