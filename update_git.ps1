Write-Host "Staging files..." -ForegroundColor Cyan
git add .
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Update nominations categories, add nominee work image upload, and update hero section video"
Write-Host "Pushing changes to GitHub..." -ForegroundColor Cyan
git push
Write-Host "Successfully updated changes in GitHub!" -ForegroundColor Green
