/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/   

import { z } from 'zod';

export const DeletePurposeSchema = z.object({    // Indicates a hard delete (true) or soft delete (false)
    hard: z.boolean().optional()});
export type DeletePurpose = z.infer<typeof DeletePurposeSchema>;
