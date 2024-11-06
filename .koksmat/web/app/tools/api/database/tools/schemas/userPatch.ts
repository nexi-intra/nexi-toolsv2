/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';


export const schema = z.object({
    tenant: z.string().optional(),
    searchindex: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    email: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    language_id: z.number().int().optional(),
    country_id: z.number().int().optional(),
    region_id: z.number().int().optional(),
    status: z.string().optional()});

export const tablename = 'user';
