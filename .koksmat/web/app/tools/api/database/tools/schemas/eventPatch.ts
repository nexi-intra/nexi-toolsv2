/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const PatchEventSchema = z.object({    tenant: z.string().optional(),
    searchindex: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    user_id: z.number().int().optional(),
    tool_id: z.number().int().optional(),
    metadata: z.object({}).passthrough().optional()});
export type PatchEvent = z.infer<typeof PatchEventSchema>;
