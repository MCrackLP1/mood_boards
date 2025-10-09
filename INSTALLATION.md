# 🚀 Installation & Schnellstart

## Was wurde implementiert?

Du hast jetzt ein **vollständiges Backend-System** für deine Moodboard-App!

### ✅ Fertig implementiert

1. **Backend Server** (`server/`)
   - Express.js Web-Server
   - SQLite Datenbank (keine Installation nötig)
   - REST API für alle Operationen
   - Läuft auf Port 3001

2. **API Client** (`src/modules/api/`)
   - Kommuniziert mit Backend
   - Error Handling
   - Konfigurierbar über .env

3. **Frontend Stores** (aktualisiert)
   - Boards, Items, Assets, Folders
   - Nutzen jetzt API statt IndexedDB
   - Automatische Synchronisation

4. **Dokumentation**
   - SYNC_SETUP_GUIDE.md - Übersicht
   - docs/SERVER_SETUP.md - Detaillierte Anleitung
   - server/README.md - Backend-Doku

5. **Helper-Skripte**
   - start-server.bat - Server starten (Doppelklick)
   - start-server.ps1 - Server starten (PowerShell)
   - server/install.ps1 - Automatische Installation

## ⚡ Schnellstart (3 Schritte)

### Schritt 1: Server installieren

```powershell
cd server
npm install
```

### Schritt 2: Server starten

**Option A**: Doppelklick auf `start-server.bat` im Hauptordner

**Option B**: In PowerShell:
```powershell
npm start
```

Du siehst:
```
╔════════════════════════════════════════════╗
║   Moodboard Server gestartet!              ║
╟────────────────────────────────────────────╢
║   Port: 3001                               ║
║   Lokale URL: http://localhost:3001        ║
║   Netzwerk: http://<deine-ip>:3001         ║
╚════════════════════════════════════════════╝
```

### Schritt 3: Frontend bauen

Öffne eine **neue** PowerShell im Hauptordner:

```powershell
npm run build
```

Öffne dann: `dist/index.html`

## 🎯 So funktioniert es

### Auf deinem Desktop (wo Server läuft)

1. Stelle sicher dass `.env` existiert mit:
   ```
   VITE_API_URL=http://localhost:3001
   ```

2. Baue die App:
   ```powershell
   npm run build
   ```

3. Öffne `dist/index.html` im Browser

### Auf anderen Geräten (Handy, Tablet)

1. Finde deine Server-IP:
   ```powershell
   ipconfig
   ```
   Notiere die IPv4-Adresse (z.B. `192.168.1.100`)

2. Erstelle `.env` mit deiner Server-IP:
   ```
   VITE_API_URL=http://192.168.1.100:3001
   ```

3. Baue die App:
   ```powershell
   npm run build
   ```

4. Kopiere den `dist` Ordner auf dein Gerät ODER
   öffne im Browser: `http://192.168.1.100:3001/dist/index.html`

## 🔥 Firewall öffnen

**Wichtig**: Damit andere Geräte zugreifen können!

PowerShell als **Administrator**:

```powershell
New-NetFirewallRule -DisplayName "Moodboard Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

## 🧪 Testen

### Test 1: Server läuft?

Öffne im Browser: http://localhost:3001/api/health

Sollte zeigen: `{"status":"ok","message":"Moodboard Server is running"}`

### Test 2: Von Handy erreichbar?

1. Verbinde Handy mit gleichem WLAN
2. Öffne im Browser: `http://192.168.1.100:3001/api/health` (mit deiner IP)
3. Sollte auch `{"status":"ok",...}` zeigen

### Test 3: App funktioniert?

1. Öffne App am Desktop
2. Erstelle ein neues Board
3. Öffne App auf Handy (im gleichen WLAN)
4. Board sollte dort auch erscheinen! 🎉

## 📱 Mobile Installation

### Android

1. Öffne Chrome auf Handy
2. Gehe zu `http://192.168.1.100:3001/dist/index.html`
3. Chrome Menü (⋮) → "Zum Startbildschirm hinzufügen"
4. App öffnet sich jetzt wie native App!

### iOS

1. Öffne Safari auf iPhone
2. Gehe zu `http://192.168.1.100:3001/dist/index.html`
3. Teilen-Button → "Zum Home-Bildschirm"
4. Fertig!

## 🤖 Automatischer Server-Start

### Einfach: Task Scheduler

1. Öffne "Aufgabenplanung"
2. "Aufgabe erstellen"
3. **Trigger**: "Beim Systemstart"
4. **Aktion**: 
   - Programm: `C:\Program Files\nodejs\node.exe`
   - Argumente: `C:\Users\markb\Documents\mood_boards\server\src\server.js`
   - Starten in: `C:\Users\markb\Documents\mood_boards\server`

### Erweitert: NSSM (Windows Dienst)

Siehe: `docs/SERVER_SETUP.md` → Abschnitt "Als Windows Dienst"

## 📁 Wichtige Dateien

### Konfiguration
- `.env` - Frontend: Server-URL
- `server/.env` - Backend: Port (optional)

### Server
- `server/src/server.js` - Haupt-Server
- `server/src/database.js` - Datenbank
- `server/src/routes/` - API Endpoints
- `server/data/moodboard.db` - SQLite Datenbank

### Frontend
- `src/modules/api/client.ts` - API Client
- `src/modules/api/config.ts` - Server-Konfiguration
- `src/modules/boards/store.ts` - Board Store (nutzt API)
- `src/modules/library/store.ts` - Asset Store (nutzt API)

### Dokumentation
- `SYNC_SETUP_GUIDE.md` - Diese Anleitung
- `docs/SERVER_SETUP.md` - Detaillierte Setup-Anleitung
- `server/README.md` - Backend-Dokumentation

### Scripts
- `start-server.bat` - Server starten (Windows)
- `start-server.ps1` - Server starten (PowerShell)
- `server/install.ps1` - Server-Installation

## 💾 Backup

Die Datenbank ist **eine einzige Datei**:

```powershell
copy server\data\moodboard.db backups\moodboard-backup.db
```

Fertig! So einfach ist das Backup. 😊

## 🆘 Probleme?

### Server startet nicht

**Port belegt?**
```powershell
netstat -ano | findstr :3001
```

**Lösung**: Ändere Port in `server/src/server.js`:
```javascript
const PORT = 3002;
```

### Handy kann nicht verbinden

**Checklist**:
- [ ] Server läuft (PowerShell-Fenster offen?)
- [ ] Firewall-Regel erstellt?
- [ ] Gleiches WLAN?
- [ ] Richtige IP in `.env`?
- [ ] Test: `http://server-ip:3001/api/health` im Handy-Browser

### "Failed to fetch" Fehler

1. Öffne Browser Console (F12)
2. Schaue im Network-Tab nach Fehlern
3. Prüfe Server-Logs (PowerShell wo Server läuft)
4. Teste API direkt: http://localhost:3001/api/boards

## 📚 Weitere Hilfe

- **Übersicht**: [SYNC_SETUP_GUIDE.md](./SYNC_SETUP_GUIDE.md)
- **Detailliert**: [docs/SERVER_SETUP.md](./docs/SERVER_SETUP.md)
- **Backend**: [server/README.md](./server/README.md)
- **Internet-Zugriff**: SERVER_SETUP.md → "Zugriff von außen"
- **Automatischer Start**: SERVER_SETUP.md → "Als Windows Dienst"

## ✨ Das wars!

Du hast jetzt:
- ✅ Eigenen Backend-Server auf Windows
- ✅ Geräte-übergreifende Synchronisation
- ✅ 100% Privatsphäre (deine Daten, dein Server)
- ✅ Keine Cloud-Kosten
- ✅ Unbegrenzter Speicher

**Viel Spaß mit deiner synchronisierten Moodboard-App!** 🎉

