<#---
title: Compile Lookup values
connection: sharepoint
api: post
tag: lookupvalues
multiinput: 
    categories.json
    countries.json
    channels.json
    units.json
output: profiledata.json
---
#>
$result = "$env:WORKDIR/profiledata.json"

$categories = Get-Content "$env:WORKDIR/categories.json" | ConvertFrom-Json
$countries = Get-Content "$env:WORKDIR/countries.json" | ConvertFrom-Json
$channels = Get-Content "$env:WORKDIR/channels.json" | ConvertFrom-Json
$units = Get-Content "$env:WORKDIR/units.json" | ConvertFrom-Json

$lookupvalues = @{
    categories = $categories
    countries = $countries
    channels = $channels
    units = $units
}

$lookupvalues | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
