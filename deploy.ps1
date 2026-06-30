Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  FreshMart Enterprise Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking if Vercel CLI is installed globally..."
$vercelVersion = try { npx vercel --version 2>&1 } catch { $null }

if ($null -eq $vercelVersion) {
    Write-Host "Vercel CLI not found. We will use npx to run it." -ForegroundColor Yellow
} else {
    Write-Host "Vercel CLI detected: $vercelVersion" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 1: Logging into Vercel..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please authenticate your account."
npx vercel login

Write-Host ""
Write-Host "Step 2: Deploying to Production..." -ForegroundColor Yellow
Write-Host "Please follow the prompts. Accept the defaults (press Enter) for most questions."
Write-Host "When asked 'Want to override the settings?', type 'N'."
npx vercel --prod

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deployment Initiated!" -ForegroundColor Green
Write-Host "IMPORTANT: Before your app works in production, you MUST add your environment variables." -ForegroundColor Yellow
Write-Host "1. Go to your Vercel Dashboard."
Write-Host "2. Add DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, and GOOGLE credentials."
Write-Host "3. Run 'npx vercel --prod' one more time to rebuild with the new variables."
Write-Host "==========================================" -ForegroundColor Cyan
