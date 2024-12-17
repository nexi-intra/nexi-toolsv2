$root = join-path $PSScriptRoot .. ..

$root = [System.IO.Path]::GetFullPath($root) 
$koksmatPwsh = join-path $root ".koksmat" "pwsh"

write-host "Connecting to SharePoint" 
. "$koksmatPwsh/connectors/sharepoint/connect.ps1"

write-host "Reading data from SharePoint" -ForegroundColor Green 

write-host " Tool Collections" -NoNewline
. "$root/20-read/10-readtoolcollections.ps1"

