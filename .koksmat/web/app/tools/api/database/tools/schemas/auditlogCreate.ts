/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';


export const schema = z.object({
    tenant: z.string(),
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    action: z.string(),
    status: z.string(),
    entity: z.string(),
    entityid: z.string(),
    actor: z.string(),
    metadata: z.object({}).passthrough().optional()});

export const tablename = 'auditlog';
