# Set the paths
$currentPath = $PSScriptRoot
$schemasPath = Join-Path $currentPath "schemas"
$indexPath = Join-Path $currentPath "index.ts"

# Get all .ts files in the schemas folder
$tsFiles = Get-ChildItem -Path $schemasPath -Filter "*.ts" | Where-Object { $_.Name -ne "index.ts" }

# Create the content for the index.ts file
$indexContent = @"
// This file is auto-generated. Do not edit manually.

import { z } from 'zod';

"@

# Add imports and type exports
foreach ($file in $tsFiles) {
  $baseName = $file.BaseName
  $typeName = (Get-Culture).TextInfo.ToTitleCase($baseName)
  $indexContent += @"
import * as $baseName from './schemas/$baseName'
export type $typeName = z.infer<typeof $baseName.schema>;

"@
}

$indexContent += @"
export const table = {
"@

# Add schema exports
foreach ($file in $tsFiles) {
  $baseName = $file.BaseName
  $indexContent += "    $baseName,`n"
}

$indexContent += @"
};

// Usage example:
// import { schemas, CountryPatch } from './tools';
// const accessPointDeleteSchema = schemas.accesspointDelete;
// const countryPatchData: CountryPatch = { /* ... */ };
"@

# Write the content to the index.ts file
Set-Content -Path $indexPath -Value $indexContent

Write-Host "index.ts file has been generated successfully at $indexPath"