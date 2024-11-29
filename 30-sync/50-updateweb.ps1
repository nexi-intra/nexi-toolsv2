<#---
title: Update Web
tag : update-web
api: post
---
#>
param (
    $siteName = "welcome-to-nexi"
)
function CopyFiles($source, $destination) {
  
    $exists = (Test-Path $destination )
    if (-not $exists) {
        # write-host "Creating directory $destinationFolder"
        $x = New-Item -Path $destination -ItemType Directory  -ErrorAction SilentlyContinue
    }
    # write-host "Copying files to $destination"
    $files = Get-ChildItem -Path $source -Force
    for ($i = 0; $i -lt $files.Count; $i++) {
        $file = $files[$i]
        if ($file.PSIsContainer) {

            $destinationFolder = Join-Path $destination  $file.Name
		
            CopyFiles $file.FullName $destinationFolder $exclude
            continue
        }
        $destinationFile = Join-Path $destination  $file.Name
        if (-not (Test-Path $destinationFile)) {
            write-host "Copying $destinationFile" -ForegroundColor Green
            $x = Copy-Item -Path $file.FullName -Destination $destinationFile -ErrorAction Continue -Force:$false
        }
        else {
            # write-host "File $destinationFile already exists" -ForegroundColor Gray
		
        }
        if ($file.PSIsContainer) {

            $destinationFolder = Join-Path $destination  $file.Name
		
            CopyFiles $file.FullName $destinationFolder $exclude
			
        }
        else {
			
		
            $destinationFile = Join-Path  $destination  $file.Name
	
            if (-not (Test-Path $destinationFile)) {
                write-host "Copying $destinationFile" -ForegroundColor Cyan
                $x = Copy-Item -Path $file.FullName -Destination $destinationFile 
            }
            else {
                #	write-host "Skipping $destinationFile" -ForegroundColor Gray
		
            }
        }
    }
}
if ($null -eq $env:WORKDIR ) {
    $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR

if (-not (Test-Path $workdir)) {
    New-Item -Path $workdir -ItemType Directory | Out-Null
}


if ((Split-Path -Leaf (Split-Path  -Parent -Path $PSScriptRoot)) -eq "sessions") {
    $path = join-path $PSScriptRoot ".." ".."
}
else {
    $path = join-path $PSScriptRoot ".." ".koksmat/"

}

$koksmatDir = Resolve-Path $path

$pages = join-path $workdir "sites"  $siteName "SitePages"
$pagesDestPath = join-path $koksmatDir "web" "app" "sites" "[...slug]" $siteName "SitePages"

$images = join-path $workdir "sites"  $siteName "SiteAssets"
$imagesDestPath = join-path $koksmatDir "web" "public" "sites" $siteName "SiteAssets"

CopyFiles $pages $pagesDestPath
CopyFiles $images $imagesDestPath