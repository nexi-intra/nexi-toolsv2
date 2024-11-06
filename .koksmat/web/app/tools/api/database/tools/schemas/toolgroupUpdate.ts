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
    status: z.string().optional(),
    metadata: z.object({}).passthrough().optional()});

export const tablename = 'toolgroup';
