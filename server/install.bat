@echo off
REM Moodboard Server Installation
REM Doppelklick auf diese Datei um Dependencies zu installieren

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║   Moodboard Server Installation            ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [FEHLER] Node.js ist nicht installiert!
    echo.
    echo Bitte installiere Node.js von: https://nodejs.org
    echo Waehle die LTS Version und starte danach den Computer neu.
    echo.
    pause
    exit /b 1
)

REM Show Node.js version
echo [OK] Node.js gefunden:
node --version
echo.

REM Install dependencies
echo → Installiere Dependencies...
echo    (Dies kann 1-2 Minuten dauern)
echo.
npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════╗
    echo ║   Installation erfolgreich!                ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo Naechste Schritte:
    echo   1. Doppelklick auf start.bat
    echo   2. Im Browser oeffnen: http://localhost:3001/api/health
    echo.
) else (
    echo.
    echo [FEHLER] Installation fehlgeschlagen!
    echo.
    echo Moegliche Loesungen:
    echo   - Stelle sicher dass du Internet hast
    echo   - Starte Computer neu
    echo   - Fuehre diese Datei als Administrator aus
    echo.
)

pause

