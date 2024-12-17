<#---
title: Read Categories
api: post
connection: sharepoint
tag: categories
output: categories.json
---
#>
param(
    
    [string]$siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-home"
)


$result = "$env:WORKDIR/categories.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List "News Categories"   

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    $mappeditem = @{
        ID = $item.FieldValues.ID
        Title = $item.FieldValues.Title
        SortOrder = [int]::Parse( $item.FieldValues.SortOrder)
    }
    $items += $mappeditem
   
}

$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
