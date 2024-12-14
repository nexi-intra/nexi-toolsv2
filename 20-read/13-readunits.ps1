<#---
title: Read Units
api: post
connection: sharepoint
tag: units
output: units.json
---
#>
param(
    
    [string]$siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-home"
)


$result = "$env:WORKDIR/units.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List Units   

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    $mappeditem = @{
        ID = $item.FieldValues.ID
        Title = $item.FieldValues.Title
        UnitType = $item.FieldValues.UnitType
        SortOrder = [int]::Parse( $item.FieldValues.SortOrder)
        Rolluppage = $item.FieldValues.Rolluppage
        Site = $item.FieldValues.Site
        LookupValue = $item.FieldValues.LookupValue
    }
    $items += $mappeditem
   
}

$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
