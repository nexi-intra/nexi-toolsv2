/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const CreateLanguageSchema = z.object({    tenant: z.string(),
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    code: z.string(),
    sortOrder: z.string().optional()});
export type CreateLanguage = z.infer<typeof CreateLanguageSchema>;