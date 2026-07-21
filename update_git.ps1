Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Updating Dhara Foundations GitHub Repos" -ForegroundColor Cyan
Write-Host " Repositories:" -ForegroundColor Cyan
Write-Host " 1. https://github.com/sounderrajan-07/dhara-divine-awards.git" -ForegroundColor Cyan
Write-Host " 2. https://github.com/projectsatriowings/dharadivineawards.git" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Staging and Committing Changes
Write-Host "`n[1/4] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[2/4] Creating commit..." -ForegroundColor Yellow
git commit -m "Make all subdomain & main page contents dynamic from admin; Integrate Razorpay payments for Donate and Event Registration pages"

# 2. Pushing to Default Origin Remote
Write-Host "`n[3/4] Pushing to default remote (origin)..." -ForegroundColor Yellow
git push

# 3. Pushing to target repo 1: sounderrajan-07/dhara-divine-awards.git
Write-Host "[4/4] Pushing to https://github.com/sounderrajan-07/dhara-divine-awards.git..." -ForegroundColor Yellow
git push https://github.com/sounderrajan-07/dhara-divine-awards.git HEAD:main

# 4. Pushing to target repo 2: projectsatriowings/dharadivineawards.git
Write-Host "Pushing to https://github.com/projectsatriowings/dharadivineawards.git..." -ForegroundColor Yellow
git push https://github.com/projectsatriowings/dharadivineawards.git HEAD:main

# 5. If df-admin has its own git repo
if (Test-Path "df-admin\.git") {
    Write-Host "`nStaging and committing df-admin repository..." -ForegroundColor Yellow
    Push-Location "df-admin"
    git add .
    git commit -m "Add Razorpay endpoints and admin settings"
    git push
    Pop-Location
}

Write-Host "`nSuccessfully pushed changes to all GitHub repositories!" -ForegroundColor Green
