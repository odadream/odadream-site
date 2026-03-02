# Deployment Health Check Script
# ODA.dream Deployment Health Check

Write-Host "=== ODA.dream Deployment Health Check ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Git Status
Write-Host "[1/5] Checking Git Status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "WARNING: Uncommitted changes detected:" -ForegroundColor Yellow
    git status --short
} else {
    Write-Host "OK: Git status clean" -ForegroundColor Green
}
Write-Host ""

# 2. Check Last Commit
Write-Host "[2/5] Last Commit Info..." -ForegroundColor Yellow
$lastCommit = git log -1 --pretty=format:"%h - %s (%cr by %an)"
Write-Host "Commit: $lastCommit" -ForegroundColor White
Write-Host ""

# 3. Test Local Build
Write-Host "[3/5] Testing Local Build..." -ForegroundColor Yellow
Write-Host "Running: npm run build" -ForegroundColor Gray

$buildOutput = npm run build 2>&1
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -eq 0) {
    Write-Host "OK: Local build successful" -ForegroundColor Green
} else {
    Write-Host "ERROR: Local build failed!" -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Check TypeScript
Write-Host "[4/5] Checking TypeScript..." -ForegroundColor Yellow
$tscOutput = npx tsc --noEmit 2>&1
$tscExitCode = $LASTEXITCODE

if ($tscExitCode -eq 0) {
    Write-Host "OK: TypeScript check passed" -ForegroundColor Green
} else {
    Write-Host "ERROR: TypeScript errors found!" -ForegroundColor Red
    Write-Host $tscOutput -ForegroundColor Red
}
Write-Host ""

# 5. Check Site Accessibility
Write-Host "[5/5] Checking Live Site..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://odadream.art" -Method Head -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "OK: Site is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Site returned HTTP $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Site is not accessible!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Repository: odadream/odadream-site"
Write-Host "Branch: $(git branch --show-current)"
Write-Host "Last commit: $lastCommit"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check GitHub Actions: https://github.com/odadream/odadream-site/actions" -ForegroundColor White
Write-Host "2. View latest workflow run for detailed logs" -ForegroundColor White
Write-Host "3. If build failed locally, fix errors before pushing" -ForegroundColor White
Write-Host ""
