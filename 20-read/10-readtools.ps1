<#---
title: Read Tool Collections
api: post
connection: sharepoint
tag: tool-collections
output: tool-collections.json
---
#>
param(
    
    [string]$listUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-country-it/Lists/Applications/AllItems.aspx",
    $format = "x"
    
)

$url = $listUrl.ToLower()

$siteUrl = $url.Split("/lists/")[0]
$siteName = $url.Split("/sites/")[1].Split("/")[0]
$listName = $url.Split("/lists/")[1].Split("/")[0]

$resultPath = "$env:WORKDIR/sites/$siteName"
if (-not (Test-Path $resultPath )) {
    New-Item -Path $resultPath  -ItemType Directory | Out-Null
}

$result = "$resultPath/tools.json"
Connect-PnPOnline -Url $siteUrl  -ClientId $PNPAPPID -Tenant $PNPTENANTID -CertificatePath "$PNPCERTIFICATEPATH"

$listItems = Get-PnpListItem -List $listName

write-host "Items in list: $($listItems.Count)"
$items = @()
foreach ($item in $listItems) {
    
    $icon = ""
    write-host $item.FieldValues.Title -NoNewline
    
    try {
        $iconJSON = $item.FieldValues.Icon | ConvertFrom-Json    
        $filename = $iconJSON.filename

        $attachments = Get-PnPProperty -ClientObject $item -Property AttachmentFiles

        if ($attachments.Count -gt 0) {
            write-host " download image " -NoNewline
            # Find the attachment that matches the filename
            $attachment = $attachments | Where-Object { $_.FileName -eq $fileName }
            # Use Get-PnPFile with -AsByteArray to get the file content directly
            $memoryStream = Get-PnPFile -Url $attachment.ServerRelativeUrl -AsMemoryStream -ErrorAction Stop

            if ($memoryStream -ne $null) {
                
                # Convert MemoryStream to byte array
                $bytes = $memoryStream.ToArray()

                # Convert the byte array to Base64 string
                $base64String = [System.Convert]::ToBase64String($bytes)

                # Determine the MIME type based on file extension
                switch -Wildcard ($fileName) {
                    "*.png" { $mimeType = "image/png" }
                    "*.jpg" { $mimeType = "image/jpeg" }
                    "*.jpeg" { $mimeType = "image/jpeg" }
                    "*.gif" { $mimeType = "image/gif" }
                    "*.bmp" { $mimeType = "image/bmp" }
                    "*.svg" { $mimeType = "image/svg+xml" }
                    default { $mimeType = "application/octet-stream" }
                }

                # Create Data URI
                $dataUri = "data:$mimeType;base64,$base64String"


                $icon = "data:$mimeType;base64,$base64String"
            }
            # Optionally, you can prepend the data URI scheme for embedding in HTML/CSS
            # $base64String = "data:image/png;base64,$base64String"



        }
    }
    catch {
        <#Do this if a terminating exception happens#>
        write-host "Error: $_" -ForegroundColor Red -NoNewline
    }
    write-host "."

    $mappeditem = @{
        ID                      = $item.FieldValues.ID
        Created                 = $item.FieldValues.Created.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        Modified                = $item.FieldValues.Modified.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        CreatedBy               = $item.FieldValues.Author.Email
        ModifiedBy              = $item.FieldValues.Editor.Email
        Etag                    = $item.FieldValues.__metadata.etag
        Site                    = $siteName
        List                    = $listName
        Title                   = $item.FieldValues.Title
        Area                    = $item.FieldValues.Area.LookupValue
        Link                    = $item.FieldValues.Link.Url
        Icon                    = $icon
        Description             = $item.FieldValues.Description
        DocumentLink            = $item.FieldValues.Document_x0020_Link.Url
        DocumentLinkDescription = $item.FieldValues.Document_x0020_Link.Description # | convertto-json 
       
    }
    $items += $mappeditem
   
}
write-host "Output to $result"
$items | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM
