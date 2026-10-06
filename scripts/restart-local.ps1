param([switch]$NoBrowser, [switch]$NoDialog)

$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path -Parent $PSScriptRoot
$astroPath = Join-Path $siteRoot 'node_modules\astro\astro.js'
$stateRoot = Join-Path $siteRoot '.local-server'
$siteUrl = 'http://127.0.0.1:5177/ru/'
$restartLock = $null

try {
    New-Item -ItemType Directory -Path $stateRoot -Force | Out-Null
    try {
        $restartLock = [System.IO.File]::Open((Join-Path $stateRoot 'restart.lock'), 'OpenOrCreate', 'ReadWrite', 'None')
    } catch [System.IO.IOException] {
        exit 0 # Another click is already starting/restarting this server.
    }
    $nodePath = (Get-Command node.exe -ErrorAction Stop).Source
    if (-not (Test-Path -LiteralPath $astroPath)) {
        throw 'Dependencies are missing. Run npm ci in the V2 project, then launch again.'
    }

    # Identify only this project's Astro dev server, including its Node workers.
    $nodeProcesses = @(Get-CimInstance Win32_Process -Filter "name='node.exe'")
    $ownedIds = @($nodeProcesses | Where-Object {
        $_.CommandLine -match [regex]::Escape($astroPath) -and
        $_.CommandLine -match '\sdev(?:\s|$)' -and
        $_.CommandLine -match '--port\s+5177(?:\s|$)'
    } | ForEach-Object { [int]$_.ProcessId })
    do {
        $children = @($nodeProcesses | Where-Object {
            $ownedIds -contains [int]$_.ParentProcessId -and $ownedIds -notcontains [int]$_.ProcessId
        } | ForEach-Object { [int]$_.ProcessId })
        $ownedIds += $children
    } while ($children.Count -gt 0)
    $listeners = @(Get-NetTCPConnection -LocalPort 5177 -State Listen -ErrorAction SilentlyContinue)
    foreach ($listener in $listeners) {
        if ($ownedIds -notcontains [int]$listener.OwningProcess) {
            throw "Port 5177 belongs to another process (PID $($listener.OwningProcess)). It was not stopped."
        }
    }
    foreach ($processId in $ownedIds) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
    $deadline = [DateTime]::UtcNow.AddSeconds(10)
    while (Get-NetTCPConnection -LocalPort 5177 -State Listen -ErrorAction SilentlyContinue) {
        if ([DateTime]::UtcNow -gt $deadline) { throw 'Port 5177 did not become available.' }
        Start-Sleep -Milliseconds 200
    }

    $server = Start-Process -FilePath $nodePath -ArgumentList @(
        ('"{0}"' -f $astroPath), 'dev', '--host', '127.0.0.1', '--port', '5177'
    ) -WorkingDirectory $siteRoot -WindowStyle Hidden -PassThru `
      -RedirectStandardOutput (Join-Path $stateRoot 'server.log') `
      -RedirectStandardError (Join-Path $stateRoot 'server-error.log')
    $deadline = [DateTime]::UtcNow.AddSeconds(30)
    do {
        $server.Refresh()
        if ($server.HasExited) { throw 'Astro stopped during startup. See .local-server/server-error.log.' }
        try {
            $response = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { break }
        } catch { }
        if ([DateTime]::UtcNow -gt $deadline) { throw 'Server startup timed out. See .local-server/server.log.' }
        Start-Sleep -Milliseconds 250
    } while ($true)
    if (-not $NoBrowser) { Start-Process $siteUrl }
    Write-Output "ODA.dream V2 is running at $siteUrl (PID $($server.Id))."
} catch {
    if (-not $NoDialog) {
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'ODA.dream V2 launcher') | Out-Null
    }
    Write-Error $_
    exit 1
} finally {
    if ($restartLock) { $restartLock.Dispose() }
}
