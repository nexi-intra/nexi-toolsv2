<#---
title: Read Tool Collections
api: post
connection: sharepoint
tag: tool-collections
output: tool-collections.json
---
#>
param(
    
    [string]$siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-home"
)


$result = "$env:WORKDIR/tool-collections.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List "Tool Collections"

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    $mappeditem = @{
        ID         = $item.FieldValues.ID
        Title      = $item.FieldValues.Title
        Domain     = $item.FieldValues.Domain
        ListUrl    = $item.FieldValues.ListURL
        ListFormat = $item.FieldValues.ListFormat
       
    }
    $items += $mappeditem
   
}
write-host "Output to $result"
$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
