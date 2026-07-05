# remove-redundant-font-family.ps1
# Removes redundant Trip Sans font-family declarations from all .scss files in src/
# since Trip Sans is already set globally on body in globals.scss.
# Urbanist font-family declarations are intentionally kept.

$srcDir = Join-Path $PSScriptRoot "..\src"
$scssFiles = Get-ChildItem -Path $srcDir -Recurse -Filter "*.scss"

# Patterns to remove (Trip Sans only, NOT Urbanist)
$patterns = @(
    "^\s*font-family:\s*var\(--font-trip-sans[^;]*\);\s*$",
    "^\s*font-family:\s*['""]Trip Sans['""][^;]*;\s*$"
)

$totalRemoved = 0
$filesChanged = 0

foreach ($file in $scssFiles) {
    # Skip globals.scss — the body font-family declaration there is intentional
    if ($file.Name -eq "globals.scss") {
        Write-Host "SKIPPED: $($file.FullName)" -ForegroundColor Yellow
        continue
    }

    $lines = Get-Content $file.FullName
    $newLines = @()
    $removedCount = 0

    foreach ($line in $lines) {
        $matched = $false
        foreach ($pattern in $patterns) {
            if ($line -match $pattern) {
                $matched = $true
                $removedCount++
                break
            }
        }
        if (-not $matched) {
            $newLines += $line
        }
    }

    if ($removedCount -gt 0) {
        Set-Content -Path $file.FullName -Value $newLines
        Write-Host "CLEANED ($removedCount lines removed): $($file.FullName)" -ForegroundColor Green
        $totalRemoved += $removedCount
        $filesChanged++
    }
}

Write-Host ""
Write-Host "Done. Removed $totalRemoved redundant font-family declarations across $filesChanged files." -ForegroundColor Cyan
