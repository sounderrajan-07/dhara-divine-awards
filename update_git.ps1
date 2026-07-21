Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Updating Dhara Foundations GitHub Repos" -ForegroundColor Cyan
Write-Host " Target Repo: sounderrajan-07/dhara-divine-awards.git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Staging and Committing Changes
Write-Host "`n[1/3] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[2/3] Creating commit..." -ForegroundColor Yellow
git commit -m "Expose Vercel env vars RAZORPAY_KEY_ID & VITE_RAZORPAY_KEY_ID in vite.config.js for client-side Razorpay modal"

# 2. Pushing to Default Origin Remote
Write-Host "`n[3/3] Pushing to default remote (origin)..." -ForegroundColor Yellow
git push

# 3. Pushing directly to target repo: sounderrajan-07/dhara-divine-awards.git
Write-Host "Pushing changes to https://github.com/sounderrajan-07/dhara-divine-awards.git..." -ForegroundColor Yellow
git push https://github.com/sounderrajan-07/dhara-divine-awards.git

# 4. If df-admin has its own git repo
if (Test-Path "df-admin\.git") {
    Write-Host "`nStaging and committing df-admin repository..." -ForegroundColor Yellow
    Push-Location "df-admin"
    git add .
    git commit -m "Expose Vercel env vars for admin app"
    git push
    Pop-Location
}

Write-Host "`nSuccessfully pushed changes to GitHub!" -ForegroundColor Green
