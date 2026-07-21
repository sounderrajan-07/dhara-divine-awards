Write-Host "=========================================" -ForegroundColor Gold
Write-Host " Updating Dhara Foundations GitHub Repos" -ForegroundColor Gold
Write-Host " Target: sounderrajan-07/dhara-divine-awards.git" -ForegroundColor Gold
Write-Host "=========================================" -ForegroundColor Gold

# 1. Staging and Committing Changes
Write-Host "`nStaging files..." -ForegroundColor Cyan
git add .

Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Make all subdomain & main page contents dynamic from admin; Integrate Razorpay payments for Donate and Event Registration pages"

# 2. Pushing to Default Origin
Write-Host "`nPushing to default remote (origin)..." -ForegroundColor Cyan
git push

# 3. Pushing directly to target repo: sounderrajan-07/dhara-divine-awards.git
Write-Host "Pushing changes to https://github.com/sounderrajan-07/dhara-divine-awards.git..." -ForegroundColor Cyan
git push https://github.com/sounderrajan-07/dhara-divine-awards.git HEAD:main

# 4. If df-admin has its own git repo
if (Test-Path "df-admin\.git") {
    Write-Host "`nStaging and committing df-admin repository..." -ForegroundColor Cyan
    Push-Location "df-admin"
    git add .
    git commit -m "Add Razorpay endpoints (/api/razorpay/create-order, verify-payment), expand site config API, and add Subdomains Control panel to Settings workspace"
    git push
    Pop-Location
}

Write-Host "`nSuccessfully pushed all changes to https://github.com/sounderrajan-07/dhara-divine-awards.git!" -ForegroundColor Green
