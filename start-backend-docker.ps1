# Start ASP.NET Core Backend in Docker
Write-Host "🐳 Starting ASP.NET Core Backend in Docker..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "backend"

# Build and run the backend container
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t customer-support-api .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend container..." -ForegroundColor Yellow
docker run -d --name customer-support-backend -p 7001:80 -p 7002:443 customer-support-api

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start backend container" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Backend API: http://localhost:7001" -ForegroundColor Cyan
Write-Host "📚 Swagger UI: http://localhost:7001/swagger" -ForegroundColor Cyan
Write-Host "🔌 SignalR Hub: http://localhost:7001/callHub" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Now you can start the frontend with: npm run dev" -ForegroundColor Yellow
Write-Host "💡 To stop the backend: docker stop customer-support-backend" -ForegroundColor Yellow 