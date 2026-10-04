# Run after npm run build and npm run preview -- --host 127.0.0.1 --port 4173 --strictPort.
# Tool lives in npm's external cache; no project dependency is added.
$ErrorActionPreference = 'Stop'
if ($env:NVM_SYMLINK) { $env:Path = "$env:NVM_SYMLINK;$env:Path" }
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
$reportDir = Join-Path $PSScriptRoot '../evidence'
foreach ($route in @('home', 'zeus')) {
    $url = if ($route -eq 'home') { 'http://127.0.0.1:4173/' } else { 'http://127.0.0.1:4173/loja/zeus' }
    foreach ($run in 1..3) {
        $reportPath = Join-Path $reportDir "lighthouse-$route-$run.json"
        & npx.cmd --yes lighthouse@13.5.0 $url --only-categories=performance `
            --chrome-flags='--headless --disable-gpu' --form-factor=mobile `
            --screenEmulation.width=390 --screenEmulation.height=844 `
            --screenEmulation.deviceScaleFactor=1 --screenEmulation.mobile=true `
            --throttling-method=simulate --output=json `
            --output-path="$reportPath" --quiet
        if ($LASTEXITCODE -ne 0) { throw "Lighthouse failed: $route run $run" }
    }
}
& node (Join-Path $PSScriptRoot 'summarize-lighthouse.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Failed to summarize Lighthouse reports' }
