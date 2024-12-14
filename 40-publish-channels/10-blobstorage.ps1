<#---
title: Publish Blob Storage
connection: sharepoint
api: post
tag: uploadblob
input: washedprofiledata.json
---#>


az storage blob upload  `
--account-name $env:AZURE_STORAGE_ACCOUNT `
--account-key $env:AZURE_STORAGE_KEY `
--container-name $env:AZURE_STORAGE_CONTAINER `
--overwrite $true  `
--file "$env:WORKDIR/washedprofiledata.json" `
--name profiledata.json
