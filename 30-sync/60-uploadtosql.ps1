<#---
title: Upload to SQL
---
#>
if ($null -eq $env:WORKDIR ) {
    $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR
magicbox-site import (join-path $workdir "pages.json")