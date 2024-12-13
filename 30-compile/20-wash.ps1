<#---
title: Wash Profile Data
connection: sharepoint
api: post
tag: wash

input: profiledata.json
output: washedprofiledata.json
---
Here we call the `nexiintra-profile` cli with the argumenet to wash the profile data. 


You find the source for this in .koksmat/app/execution/wash.go

#>
# Set your input and output file paths
$InputFilename = "$env:WORKDIR/profiledata.json"
$OutputFilename = "$env:WORKDIR/washedprofiledata.json"

# # Read the entire file content as a single string
# $content = Get-Content $inputFile -Raw

# # Replace all \uXXXX sequences with their actual Unicode characters
# $content = [regex]::Replace($content, '\\u([0-9A-Fa-f]{4})', {
#     param($match)
#     # Extract the hex code
#     $hexVal = $match.Groups[1].Value
#     # Convert hex to integer and then to the corresponding Unicode character
#     [char][int]"0x$hexVal"
#   })

# # Write the transformed content to the output file
# Set-Content $outputFile $content

# Read the JSON input
$jsonString = Get-Content -Path $InputFilename -Raw
$profileData = $jsonString | ConvertFrom-Json

# The $profileData variable now contains an object structured like:
# {
#   "categories": [...],
#   "channels": [...],
#   "countries": [...],
#   "units": [...]
# }

# Create a new PSCustomObject for the washed data
$washedData = [pscustomobject]@{
  _id        = [pscustomobject]@{
    oid = "" # If you have an OID in your actual data, populate it here.
  }
  date       = [pscustomobject]@{
    date = (Get-Date).ToUniversalTime().ToString("o") # or however you prefer storing date
  }
  key        = $profileData.key
  countries  = @()
  categories = @()
  units      = @()
  channels   = @()
}

# Transform Countries
foreach ($country in $profileData.countries) {
  # In Go: CountryName: country.Title, CountryCode: country.Title
  $washedData.countries += [pscustomobject]@{
    countryName = $country.Title
    countryCode = $country.Title
  }
}

# Transform Categories
foreach ($category in $profileData.categories) {
  # In Go: CategoryName: category.Title, CategoryID: category.ID, SortOrder: category.SortOrder
  $washedData.categories += [pscustomobject]@{
    categoryName = $category.Title
    categoryId   = $category.ID
    sortOrder    = $category.SortOrder
  }
}

# Transform Units
foreach ($unit in $profileData.units) {
  # In Go: UnitName: unit.Title, UnitCode: unit.Title, UnitType: unit.UnitType, SortOrder: unit.SortOrder
  $washedData.units += [pscustomobject]@{
    unitName  = $unit.Title
    unitCode  = $unit.Title
    unitType  = $unit.UnitType
    sortOrder = $unit.SortOrder
  }
}

# Transform Channels
foreach ($channel in $profileData.channels) {
  # In Go:
  # ID: fmt.Sprintf("%d", channel.ID)
  # SortOrder: channel.Title
  # ChannelName: channel.Title
  # ChannelType: channel.Title
  # ChannelCode: channel.Title
  # Mandatory: channel.Mandatory
  # NewsCategoryID: channel.NewsCategoryID
  # RelevantCountires: channel.RelevantCountires
  # RelevantUnits: channel.RelevantUnits
  #
  # GroupId and RegionId appear not to be assigned directly in the Go code sample (commented out),
  # If you have them, assign them as needed.
  $washedChannel = [pscustomobject]@{
    id                = "$($channel.ID)"
    sortOrder         = $channel.Title
    channelName       = $channel.Title
    channelType       = $channel.Title
    channelCode       = $channel.Title
    GroupId           = $channel.GroupId
    RelevantUnits     = @($channel.RelevantUnits)
    Mandatory         = $channel.Mandatory
    RelevantCountires = @($channel.RelevantCountires)
    RegionId          = 0 # Or however you want to handle it. The Go code left this out.
    NewsCategoryId    = $channel.NewsCategoryID
  }

  $washedData.channels += $washedChannel
}

# Convert to JSON and write out
$washedJson = $washedData | ConvertTo-Json -Depth 10 
Set-Content -Path $OutputFilename -Value $washedJson

