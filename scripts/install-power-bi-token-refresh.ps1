[CmdletBinding()]
param(
    [ValidateRange(15, 240)]
    [int]$IntervalMinutes = 45,
    [string]$TaskName = 'NexS Power BI Token Refresh',
    [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'

if ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop
    Write-Host "Removed scheduled task '$TaskName'."
    exit 0
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$authScript = Join-Path $projectRoot 'src\utils\resources\power-bi\pbi_auth.py'
$python = (Get-Command python -ErrorAction Stop).Source

if (-not (Test-Path -LiteralPath $authScript -PathType Leaf)) {
    throw "Power BI auth helper was not found at $authScript"
}

# Prove that the current Windows session can renew silently before installing a
# persistent task. This never opens a browser.
& $python -u $authScript --non-interactive --force-refresh
if ($LASTEXITCODE -ne 0) {
    throw 'Power BI silent renewal failed; the scheduled task was not installed.'
}

$action = New-ScheduledTaskAction `
    -Execute $python `
    -Argument "-u `"$authScript`" --non-interactive --force-refresh" `
    -WorkingDirectory $projectRoot
$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At (Get-Date).AddMinutes(1) `
    -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) `
    -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
$principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -LogonType Interactive `
    -RunLevel Limited

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description 'Silently renews the delegated Power BI cache used by NexS Ascend.' `
    -Force | Out-Null

Write-Host "Installed '$TaskName' (every $IntervalMinutes minutes while this user is logged on)."
