@echo off
echo ========================================
echo  Virtual Sim Game — Vercel Deployment
echo ========================================
echo.

echo Checking Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Vercel CLI not found!
    echo.
    echo Install it with: npm install -g vercel
    pause
    exit /b 1
)

echo.
echo Deploying to Vercel...
echo.

vercel

echo.
echo Deployment complete!
echo.
pause
