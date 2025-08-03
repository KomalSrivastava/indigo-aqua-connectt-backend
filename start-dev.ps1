# Customer Support Dashboard - Development Startup Script
# This script starts both the ASP.NET Core backend and React frontend

Write-Host "🚀 Starting Customer Support Dashboard Development Environment" -ForegroundColor Green
Write-Host ""

# Check if .NET is installed
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK found: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET SDK not found. Please install .NET 8.0 SDK" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing .NET dependencies..." -ForegroundColor Cyan
Set-Location "backend"
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to restore .NET dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
Set-Location ".."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Start backend in background
Write-Host "🔧 Starting ASP.NET Core backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "🎨 Starting React frontend..." -ForegroundColor Yellow
npm run dev

Write-Host ""
Write-Host "🎉 Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend API: https://localhost:7001" -ForegroundColor Cyan
Write-Host "📚 Swagger UI: https://localhost:7001/swagger" -ForegroundColor Cyan
Write-Host "🔌 SignalR Hub: https://localhost:7001/callHub" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Test the system by:" -ForegroundColor Yellow
Write-Host "   1. Opening http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "   2. Using the 'Simulate Call' buttons to test incoming calls" -ForegroundColor White
Write-Host "   3. Checking the Swagger UI for API documentation" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the frontend development server" -ForegroundColor Gray 