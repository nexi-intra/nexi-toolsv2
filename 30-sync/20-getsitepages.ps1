<#---
title: Get Site Pages
connection: graph
output: pages.json
tag: site-pages
api: post
---#>

param (
    #$siteUrl = "https://christianiabpos.sharepoint.com/sites/welcome-to-nexi"
    $siteUrl = "https://christianiabpos.sharepoint.com/sites/nexiintra-country-it"
)

if ($null -eq $env:WORKDIR ) {
    $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR

if (-not (Test-Path $workdir)) {
    New-Item -Path $workdir -ItemType Directory | Out-Null
}

$workdir = Resolve-Path $workdir

$siteId = FindSiteIdByUrl $env:GRAPH_ACCESSTOKEN $siteUrl

#$site | Set-Clipboard
#write-host $site

$pages = GraphAPIAll $env:GRAPH_ACCESSTOKEN "GET" "https://graph.microsoft.com/beta/sites/$siteId/pages"

$result = join-path $workdir "pages.json"
$sitename = split-path $siteUrl -Leaf 
$data = @{

    siteId  = $siteId
    siteUrl = $siteUrl
    name    = $sitename
    pages   = $pages

}
$data | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM


# https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com,97c479ab-06d4-4dfc-bb2c-270157f142d3,9c053798-4b71-4f57-9b70-10f2a03b424f
 
