/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const PatchToolSchema = z.object({    tenant: z.string().optional(),
    searchindex: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    category_id: z.number().int().optional(),
    url: z.string().optional(),
    status: z.string().optional(),
    Documents: z.object({}).passthrough().optional(),
    metadata: z.object({}).passthrough().optional()});
export type PatchTool = z.infer<typeof PatchToolSchema>;
