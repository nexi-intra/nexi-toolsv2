<#---
title: Read Whitelisted Guest Domains
api: post
connection: sharepoint
tag: whilelisteddomains
output: whilelisteddomains.json
---
#>
param(
    
    [string]$siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-home"
)


$result = "$env:WORKDIR/whilelisteddomains.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List "Valid Guest Domains"   

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    $mappeditem = @{
        ID = $item.FieldValues.ID
        Title = $item.FieldValues.Title
    
    }
    $items += $mappeditem
   
}

$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
