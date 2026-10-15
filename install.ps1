# ArtSCII installer for Windows.
#
# Usage (PowerShell):
#   irm https://raw.githubusercontent.com/4ster-light/artscii/main/install.ps1 | iex
#
# Environment variables:
#   $env:ARtscii_VERSION      Release tag to install, e.g. v2.0.0 (default: latest)
#   $env:ARtscii_INSTALL_DIR  Directory to install into
#                             (default: $env:LOCALAPPDATA\Programs\artscii)
$ErrorActionPreference = "Stop"

$Repo = "4ster-light/artscii"
$Bin = "artscii"
$Asset = "artscii-windows-x86_64.exe"
$Version = $env:ARtscii_VERSION
$InstallDir = if ($env:ARtscii_INSTALL_DIR) {
    $env:ARtscii_INSTALL_DIR
} else {
    Join-Path $env:LOCALAPPDATA "Programs\artscii"
}

$Base = if ($Version) {
    "https://github.com/$Repo/releases/download/$Version"
} else {
    "https://github.com/$Repo/releases/latest/download"
}
$Url = "$Base/$Asset"

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
$Dest = Join-Path $InstallDir "$Bin.exe"

Write-Host "Downloading $Url"
Invoke-WebRequest -Uri $Url -OutFile $Dest

# Verify the checksum when the release publishes one.
try {
    $Sums = (Invoke-WebRequest -Uri "$Base/$Asset.sha256").Content
    $Expected = ($Sums -split "\s+")[0].Trim().ToLower()
    if ($Expected) {
        $Actual = (Get-FileHash -Algorithm SHA256 -Path $Dest).Hash.ToLower()
        if ($Actual -ne $Expected) {
            Remove-Item -Force $Dest
            throw "checksum verification failed"
        }
    }
} catch [System.Net.WebException] {
    Write-Warning "No checksum available for $Asset, skipping verification."
}

Write-Host "Installed $Bin to $Dest"

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$InstallDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$UserPath;$InstallDir", "User")
    Write-Host "Added $InstallDir to your user PATH. Restart your terminal to use $Bin."
}
