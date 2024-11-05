/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const CreateEventSchema = z.object({    tenant: z.string(),
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    user_id: z.number().int(),
    tool_id: z.number().int(),
    metadata: z.object({}).passthrough().optional()});
export type CreateEvent = z.infer<typeof CreateEventSchema>;
