
write-host "Connecting to SharePoint" 
. "$PSScriptRoot/00-connectors/sharepoint/install.ps1"
. "$PSScriptRoot/00-connectors/sharepoint/connect.ps1"

write-host "Reading data from SharePoint" -ForegroundColor Green 

write-host " Countries" -NoNewline
. "$PSScriptRoot/20-read/10-readcountries.ps1"

write-host " Channels" -NoNewline
. "$PSScriptRoot/20-read/11-readchannels.ps1"

write-host " Categories" -NoNewline
. "$PSScriptRoot/20-read/12-readcategories.ps1"

write-host " Units" -NoNewline
. "$PSScriptRoot/20-read/13-readunits.ps1"

write-host " Guest Domains " -NoNewline
. "$PSScriptRoot/20-read/14-readguestdomains.ps1"

write-host " Compile News Channels "
. "$PSScriptRoot/30-compile/10-newschannels.ps1"
. "$PSScriptRoot/30-compile/20-wash.ps1" 

write-host "Publishing to blob storage" -ForegroundColor Green 

write-host " Publish Channels " -NoNewline
. "$PSScriptRoot/40-publish-channels/10-blobstorage.ps1"

write-host " Publish Domains " -NoNewline
. "$PSScriptRoot/41-publish-domains/10-blobstorage.ps1"
                 


write-host "Get SaaS URL's" -ForegroundColor Green 

. "$PSScriptRoot/40-publish-channels/20-getsasurl.ps1"
. "$PSScriptRoot/41-publish-domains/20-getsasurl.ps1"
