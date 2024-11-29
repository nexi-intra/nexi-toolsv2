<#---
title: Analyse Pages
tag : analyse-pages
input: downloaded-pages.json
output: analysed-pages.json
connection: graph, sharepoint
api: post
---
#>



if ($null -eq $env:WORKDIR ) {
    $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR

if (-not (Test-Path $workdir)) {
    New-Item -Path $workdir -ItemType Directory | Out-Null
}

$workdir = Resolve-Path $workdir

$inputFile = Join-Path $workdir  "downloaded-pages.json"
$siteInfo = Get-Content $inputFile | ConvertFrom-Json
$contents = @()
foreach ($page in $siteInfo.pages) {
    $page.name
    $pageData = Get-Content $page.path | ConvertFrom-Json
    
    if ($null -ne $pageData.titleArea) {
        foreach ($src in $pageData.titleArea.serverProcessedContent.imageSources) {
            $contents += @{
                href   = $src.value
                key    = $src.key
                source = "titlearea"
                path   = $page.name
            }
        }

    }

    if ($null -ne $pageData.canvasLayout.horizontalSections) {
        foreach ($section in $pageData.canvasLayout.horizontalSections) {
            foreach ($column in $section.columns) {
                foreach ($webpart in $column.webparts) {
                    if ($null -ne $webPart.data.serverProcessedContent) {
                        foreach ($src in $webPart.data.serverProcessedContent.imageSources) {
                            $contents += @{
                                href   = $src.value
                                key    = $src.key
                                source = "webpart"
                                path   = $page.name
                            }
                        }
                    }
                }
            }
        }
    }

    # $pageData.titleArea

}

$outputFile = Join-Path $workdir "analysed-pages.json"
$contents | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding utf8NoBOM