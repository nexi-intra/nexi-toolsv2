param(
  [switch]$DryRun 
)

# Locate the first folder above the script containing a package.json file
function Find-PackageJsonFolder {
  $currentPath = $PSScriptRoot
  while ($currentPath -ne [System.IO.Path]::GetPathRoot($currentPath)) {
    if (Test-Path -Path (Join-Path $currentPath "package.json")) {
      return $currentPath
    }
    $currentPath = [System.IO.Directory]::GetParent($currentPath).FullName
  }
  throw "No package.json file found in the current directory or its parent directories."
}

# Load and parse the JSON file from the script's directory
$jsonFilePath = Join-Path $PSScriptRoot "dependencies.json"

if (-not (Test-Path $jsonFilePath)) {
  throw "JSON file 'dependencies.json' not found in $PSScriptRoot."
}

$jsonContent = Get-Content $jsonFilePath | ConvertFrom-Json

# Function to execute or simulate pnpm commands based on the dependencies
function Add-PnpmDependencies {
  param (
    [string]$dependencyType,
    [array]$dependencies
  )

  if ($dependencies.Count -gt 0) {
    # Build the pnpm command
    $command = if ($dependencyType -eq "npm-dev") {
      "pnpm add -D"
    }
    else {
      "pnpm add"
    }
    $command += " " + ($dependencies -join " ")

    if ($DryRun) {
      Write-Output "Dry Run: $command"
    }
    else {
      Write-Output "Executing: $command"
      Invoke-Expression $command
    }
  }
}

# Find the package.json folder
$packageJsonFolder = Find-PackageJsonFolder
Write-Output "Using package.json folder: $packageJsonFolder"

# Change to the package.json folder
Push-Location $packageJsonFolder

try {
  # Process dependencies for each project in the JSON file
  foreach ($project in $jsonContent.PSObject.Properties.Name) {
    $projectDependencies = $jsonContent.$project

    # Install regular dependencies
    if ($projectDependencies."npm") {
      Add-PnpmDependencies -dependencyType "npm" -dependencies $projectDependencies."npm"
    }

    # Install dev dependencies
    if ($projectDependencies."npm-dev") {
      Add-PnpmDependencies -dependencyType "npm-dev" -dependencies $projectDependencies."npm-dev"
    }
  }
}
catch {
  Write-Error "An error occurred: $_"
}
finally {
  # Restore the original directory
  Pop-Location
}
