/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const PatchCountrySchema = z.object({    tenant: z.string().optional(),
    searchindex: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    Translations: z.object({}).passthrough().optional(),
    region_id: z.number().int().optional(),
    sortOrder: z.string().optional()});
export type PatchCountry = z.infer<typeof PatchCountrySchema>;