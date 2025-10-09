# Moodboard Server Installations-Skript
# Führe dieses Skript aus um den Server einzurichten

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Moodboard Server Installation           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "→ Prüfe Node.js Installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js gefunden: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js nicht gefunden!" -ForegroundColor Red
    Write-Host "    Bitte installiere Node.js von https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n→ Installiere Dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dependencies installiert" -ForegroundColor Green
} else {
    Write-Host "  ✗ Installation fehlgeschlagen" -ForegroundColor Red
    exit 1
}

# Get server IP
Write-Host "`n→ Ermittle Server-IP..." -ForegroundColor Yellow
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*","Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object -First 1).IPAddress

if ($ip) {
    Write-Host "  ✓ Server-IP: $ip" -ForegroundColor Green
} else {
    Write-Host "  ! Konnte Server-IP nicht automatisch ermitteln" -ForegroundColor Yellow
    Write-Host "    Führe 'ipconfig' aus um deine IP zu finden" -ForegroundColor Yellow
}

# Check firewall
Write-Host "`n→ Prüfe Firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "Moodboard Server" -ErrorAction SilentlyContinue

if ($firewallRule) {
    Write-Host "  ✓ Firewall-Regel existiert bereits" -ForegroundColor Green
} else {
    Write-Host "  ! Firewall-Regel nicht gefunden" -ForegroundColor Yellow
    Write-Host "    Möchtest du die Regel jetzt erstellen? (Erfordert Admin-Rechte)" -ForegroundColor Yellow
    $response = Read-Host "    [J]a oder [N]ein"
    
    if ($response -eq "J" -or $response -eq "j") {
        try {
            Start-Process powershell -ArgumentList "New-NetFirewallRule -DisplayName 'Moodboard Server' -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow" -Verb RunAs -Wait
            Write-Host "  ✓ Firewall-Regel erstellt" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ Fehler beim Erstellen der Firewall-Regel" -ForegroundColor Red
            Write-Host "    Erstelle die Regel manuell (siehe README.md)" -ForegroundColor Yellow
        }
    }
}

# Summary
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Installation erfolgreich!               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Nächste Schritte:" -ForegroundColor Cyan
Write-Host "1. Server starten:" -ForegroundColor White
Write-Host "   npm start`n" -ForegroundColor Gray

Write-Host "2. Frontend konfigurieren (.env Datei):" -ForegroundColor White
if ($ip) {
    Write-Host "   VITE_API_URL=http://$ip`:3001`n" -ForegroundColor Gray
} else {
    Write-Host "   VITE_API_URL=http://localhost:3001`n" -ForegroundColor Gray
}

Write-Host "3. Öffne im Browser:" -ForegroundColor White
Write-Host "   http://localhost:3001/api/health`n" -ForegroundColor Gray

Write-Host "Siehe README.md für weitere Informationen!" -ForegroundColor Cyan

