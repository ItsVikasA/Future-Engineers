@echo off
setlocal

echo 🚀 Setting up Future Engineers development environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or later.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ npm is installed
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo Version: %NPM_VERSION%

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo ⚠️  Environment file not found. Creating .env.local from template...
    if exist ".env.local.example" (
        copy ".env.local.example" ".env.local" >nul
        echo ✅ Created .env.local from template
        echo.
        echo 🔧 Please edit .env.local and add your actual configuration values:
        echo    - Firebase configuration
        echo    - Cloudinary credentials
        echo    - Admin email addresses
    ) else (
        echo ❌ .env.local.example not found
        pause
        exit /b 1
    )
) else (
    echo ✅ .env.local already exists
)

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 🔥 Firebase CLI not found. Installing globally...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Firebase CLI
        pause
        exit /b 1
    )
    echo ✅ Firebase CLI installed
) else (
    echo ✅ Firebase CLI is installed
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your configuration
echo 2. Set up Firebase project: firebase login ^&^& firebase init
echo 3. Start development server: npm run dev
echo.
echo 📚 For more information, see README.md
echo 🐛 For issues, visit: https://github.com/yourusername/future_engineers/issues
echo.
pause
