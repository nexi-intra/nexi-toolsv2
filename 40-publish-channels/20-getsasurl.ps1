<#---
title: Generate SAS URL
connection: sharepoint
api: post
tag: sasurl
out: profiledataurl.json
---#>

$expiry = (Get-Date).AddMonths(30).ToString("yyyy-MM-ddTHH:mm:ssZ")

$sasurl = az storage blob generate-sas  `
--account-name $env:AZURE_STORAGE_ACCOUNT `
--account-key $env:AZURE_STORAGE_KEY `
--container-name $env:AZURE_STORAGE_CONTAINER `
--name profiledata.json `
--full-uri `
--permissions r `
--expiry  $expiry

write-host "SASURL > " $sasurl "<"
$sasurl | Out-File -FilePath (join-path $env:WORKDIR "profiledataurl.json") -Encoding utf8NoBOM