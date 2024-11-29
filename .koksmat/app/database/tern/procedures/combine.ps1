# Define the folder containing the .sql files and the output file path using $PSScriptRoot
$folderPath = "$PSScriptRoot"       # Folder containing .sql files
$outputFilePath = "$PSScriptRoot\CombinedOutput.txt"  # Output file path in the same folder

# Combine all .sql files in the specified folder into a single text file
Get-ChildItem -Path $folderPath -Filter "*.sql" | 
Sort-Object Name |  # Sort files alphabetically (optional)
ForEach-Object { Get-Content $_.FullName } | 
Out-File -FilePath $outputFilePath -Encoding UTF8

# Display a message indicating the process is complete
Write-Output "All .sql files have been combined into $outputFilePath"
