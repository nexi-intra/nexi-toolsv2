<#---
title: Read Countries
api: post
connection: sharepoint
tag: countries
output: countries.json
---
#>
param(
    
    [string]$siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-home"
)


$result = "$env:WORKDIR/countries.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List Countries   

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    $mappeditem = @{
        ID = $item.FieldValues.ID
        Title = $item.FieldValues.Title
        Region = $item.FieldValues.Region
        RegionItem = $item.FieldValues.Region_x0020_Item
        Rolluppage = $item.FieldValues.Rolluppage
       
    }
    $items += $mappeditem
   
}

$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
