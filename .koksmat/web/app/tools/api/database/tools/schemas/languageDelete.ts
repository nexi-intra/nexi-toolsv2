/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const DeleteLanguageSchema = z.object({    // Indicates a hard delete (true) or soft delete (false)
    hard: z.boolean().optional()});
export type DeleteLanguage = z.infer<typeof DeleteLanguageSchema>;
