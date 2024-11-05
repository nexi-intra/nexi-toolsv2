/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const CreateToolSchema = z.object({    tenant: z.string(),
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    category_id: z.number().int(),
    url: z.string(),
    status: z.string().optional(),
    Documents: z.object({}).passthrough().optional(),
    metadata: z.object({}).passthrough().optional()});
export type CreateTool = z.infer<typeof CreateToolSchema>;
