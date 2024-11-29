<#---
title: Download Pages
connection: graph
input: pages.json
output: downloaded-pages.json
tag: download-pages
api: post
---#>



if ($null -eq $env:WORKDIR ) {
    $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR
$workdir = Resolve-Path $workdir

$siteInfo = Get-Content "$env:WORKDIR/pages.json" | ConvertFrom-Json


$sitedir = join-path $workdir "sites" $siteInfo.name
if (-not (Test-Path $sitedir )) {
    New-Item -Path $sitedir  -ItemType Directory | Out-Null
}
$siteId = $siteInfo.siteId
$downloadResults = @()
foreach ($page in $siteInfo.pages) {
    $pageId = $page.id
    $pageName = $page.name

    $page = GraphAPI $env:GRAPH_ACCESSTOKEN "GET" "https://graph.microsoft.com/beta/sites/$siteId/pages/$pageId/microsoft.graph.sitePage?expand=canvasLayout"
    $pagepath = join-path $siteDir "SitePages" $pageName
    if (-not (Test-Path $pagepath )) {
        New-Item -Path $pagepath  -ItemType Directory | Out-Null
    }
    $outpath = join-path $pagepath "page.json"
    $page | ConvertTo-Json -Depth 16 | Out-File -FilePath $outpath -Encoding utf8NoBOM
    $downloadResult = @{
        id   = $pageId
        name = $pageName
        path = $outpath
    }
    $downloadResults += $downloadResult
}
$outputData = @{
    siteId = $siteId
    name   = $siteInfo.name
    pages  = $downloadResults
}

$result = join-path $workdir "downloaded-pages.json"

$outputData | ConvertTo-Json -Depth 10 | Out-File -FilePath $result -Encoding utf8NoBOM


# https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com,97c479ab-06d4-4dfc-bb2c-270157f142d3,9c053798-4b71-4f57-9b70-10f2a03b424f
 
