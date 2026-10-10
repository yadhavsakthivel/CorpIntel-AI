# CorpIntel AI — Unified Application Launcher for ForgeHacks 2026
# Starts both FastAPI Backend and React+Vite Frontend concurrently

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   CorpIntel AI — Multi-Agent Corporate Intelligence       " -ForegroundColor Yellow
Write-Host "   ForgeHacks Online 2026 • AI + Business Track            " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path $SCRIPT_DIR "backend"
$FRONTEND_DIR = Join-Path $SCRIPT_DIR "frontend"
$PYTHON_EXE = "c:\Users\VICTUS\Downloads\AI Pow - Retail Shelf\backend\venv\Scripts\python.exe"

if (-not (Test-Path $PYTHON_EXE)) {
    $PYTHON_EXE = "python"
}

Write-Host "[1/2] Launching Backend Server on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$BACKEND_DIR`"; & `"$PYTHON_EXE`" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "[2/2] Launching Frontend Development Server on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$FRONTEND_DIR`"; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Both servers are launching in separate terminal windows:" -ForegroundColor White
Write-Host "  -> Backend Swagger API: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  -> Frontend Dashboard:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Press any key to exit this launcher window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
