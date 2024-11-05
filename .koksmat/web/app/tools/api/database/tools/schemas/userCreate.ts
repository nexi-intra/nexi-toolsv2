/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const CreateUserSchema = z.object({    tenant: z.string(),
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    language_id: z.number().int(),
    country_id: z.number().int(),
    region_id: z.number().int(),
    status: z.string()});
export type CreateUser = z.infer<typeof CreateUserSchema>;
