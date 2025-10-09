# Moodboard Server Starter (PowerShell)
# Rechtsklick → "Mit PowerShell ausführen"

Clear-Host

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Moodboard Server Starter                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if node is installed
Write-Host "→ Prüfe Node.js Installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js gefunden: $nodeVersion`n" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js nicht gefunden!" -ForegroundColor Red
    Write-Host "    Bitte installiere Node.js von https://nodejs.org`n" -ForegroundColor Red
    Read-Host "Drücke Enter zum Beenden"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "→ Dependencies werden installiert..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Get server IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*","Wi-Fi*" -ErrorAction SilentlyContinue | 
       Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | 
       Select-Object -First 1).IPAddress

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Server wird gestartet...                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Nach dem Start erreichbar unter:" -ForegroundColor Cyan
Write-Host "  • Lokal:    http://localhost:3001/api/health" -ForegroundColor White
if ($ip) {
    Write-Host "  • Netzwerk: http://$ip`:3001/api/health" -ForegroundColor White
}
Write-Host "`nZum Beenden: Strg+C`n" -ForegroundColor Yellow

# Start server
npm start

