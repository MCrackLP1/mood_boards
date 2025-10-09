# 🖥️ Windows Server Setup - Schritt für Schritt

Diese Anleitung zeigt dir, wie du den Moodboard-Server auf deinem Windows Home Server einrichtest.

## Warum ein eigener Server?

Mit deinem eigenen Server:
- ✅ Siehst du alle deine Moodboards auf allen Geräten (Desktop, Handy, Tablet)
- ✅ Sind deine Daten immer synchron
- ✅ Bleiben deine Daten privat auf deinem Server
- ✅ Keine monatlichen Kosten
- ✅ Keine Datenlimits

## Voraussetzungen

- Windows Server (oder Windows 10/11 PC der immer läuft)
- Node.js Version 18 oder höher
- Internetzugang für Installation

## 📋 Setup-Schritte

### Schritt 1: Node.js installieren

1. Gehe zu https://nodejs.org
2. Lade die **LTS Version** herunter (z.B. Node 20.x)
3. Führe den Installer aus (Standard-Einstellungen sind ok)
4. Öffne **PowerShell** und teste:

```powershell
node --version
# Sollte zeigen: v20.x.x
```

### Schritt 2: Server-Dependencies installieren

1. Öffne PowerShell im `server` Ordner deines Projekts
2. Installiere die Pakete:

```powershell
cd C:\Users\markb\Documents\mood_boards\server
npm install
```

Das installiert:
- Express (Web-Server)
- SQLite (Datenbank)
- CORS (für Cross-Origin Requests)
- Und mehr...

### Schritt 3: Server starten

```powershell
npm start
```

Du solltest sehen:

```
╔════════════════════════════════════════════╗
║   Moodboard Server gestartet!              ║
╟────────────────────────────────────────────╢
║   Port: 3001                               ║
║   Lokale URL: http://localhost:3001        ║
║   Netzwerk: http://<deine-server-ip>:3001  ║
╚════════════════════════════════════════════╝
✓ Datenbank initialisiert: ...
```

🎉 **Der Server läuft!** Lass das PowerShell-Fenster offen.

### Schritt 4: Server-IP finden

1. Öffne eine neue PowerShell (die alte läuft noch)
2. Finde deine Server-IP:

```powershell
ipconfig
```

3. Suche nach **"IPv4-Adresse"** im Abschnitt deiner Netzwerkverbindung
4. Die IP sieht etwa so aus: `192.168.1.100` oder `192.168.0.50`
5. **Notiere dir diese IP!**

### Schritt 5: Firewall konfigurieren

Damit andere Geräte (z.B. dein Handy) auf den Server zugreifen können:

```powershell
# PowerShell als Administrator öffnen!
New-NetFirewallRule -DisplayName "Moodboard Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

Oder manuell:
1. Öffne **Windows Defender Firewall**
2. Klicke auf "Erweiterte Einstellungen"
3. "Eingehende Regeln" → "Neue Regel"
4. Typ: **Port**
5. TCP Port **3001**
6. **Verbindung zulassen**
7. Alle Profile aktivieren
8. Name: "Moodboard Server"

### Schritt 6: Frontend konfigurieren

#### Auf dem Desktop (wo der Server läuft)

1. Im Hauptordner (`C:\Users\markb\Documents\mood_boards`)
2. Öffne oder erstelle die Datei `.env`
3. Füge ein:

```
VITE_API_URL=http://localhost:3001
```

#### Auf anderen Geräten (Handy, etc.)

1. Erstelle `.env` mit:

```
VITE_API_URL=http://192.168.1.100:3001
```
*Ersetze 192.168.1.100 mit der IP aus Schritt 4!*

2. Baue die App neu:

```powershell
npm run build
```

3. Die fertige App ist im `dist` Ordner
4. Öffne `dist/index.html` im Browser

### Schritt 7: Testen

#### Test auf dem Server selbst

1. Öffne Browser
2. Gehe zu `http://localhost:3001/api/health`
3. Du solltest sehen: `{"status":"ok","message":"Moodboard Server is running"}`

#### Test vom Handy

1. Stelle sicher dass Handy im **gleichen WLAN** ist
2. Öffne Browser auf dem Handy
3. Gehe zu `http://192.168.1.100:3001/api/health` (mit deiner IP)
4. Sollte auch `{"status":"ok",...}` zeigen

#### Test mit der App

1. Öffne die Moodboard-App
2. Erstelle ein neues Board
3. Öffne die App auf einem anderen Gerät
4. Du solltest das gleiche Board sehen! 🎉

## 🔄 Server automatisch starten

### Option A: Mit Task Scheduler

1. Öffne **Aufgabenplanung** (Task Scheduler)
2. "Aktion" → "Aufgabe erstellen"
3. **Allgemein**:
   - Name: "Moodboard Server"
   - "Mit höchsten Privilegien ausführen"
4. **Trigger**:
   - "Neu" → "Beim Systemstart"
5. **Aktionen**:
   - "Neu" → "Programm starten"
   - Programm: `C:\Program Files\nodejs\node.exe`
   - Argumente: `C:\Users\markb\Documents\mood_boards\server\src\server.js`
   - Starten in: `C:\Users\markb\Documents\mood_boards\server`
6. **Bedingungen**:
   - "Nur starten, falls die folgende Netzwerkverbindung verfügbar ist"
7. Speichern und testen: Rechtsklick → "Ausführen"

### Option B: Mit NSSM (Empfohlen)

NSSM erstellt einen echten Windows-Dienst:

1. Lade NSSM herunter: https://nssm.cc/download
2. Entpacke nach `C:\tools\nssm`
3. PowerShell als **Administrator**:

```powershell
cd C:\tools\nssm\win64
.\nssm.exe install MoodboardServer "C:\Program Files\nodejs\node.exe" "C:\Users\markb\Documents\mood_boards\server\src\server.js"
.\nssm.exe set MoodboardServer AppDirectory "C:\Users\markb\Documents\mood_boards\server"
.\nssm.exe set MoodboardServer Description "Moodboard Backend Server für Geräte-Synchronisation"
.\nssm.exe start MoodboardServer
```

Dienst verwalten:
```powershell
# Status prüfen
.\nssm.exe status MoodboardServer

# Stoppen
.\nssm.exe stop MoodboardServer

# Starten
.\nssm.exe start MoodboardServer

# Entfernen
.\nssm.exe remove MoodboardServer confirm
```

## 📱 Mobile Setup (Handy)

### Android

1. Verbinde dich mit dem gleichen WLAN wie der Server
2. Öffne Chrome
3. Gehe zu `http://192.168.1.100:3001/dist/index.html` (mit deiner Server-IP)
4. Chrome Menü → "Zum Startbildschirm hinzufügen"
5. Die App funktioniert jetzt wie eine native App!

### iOS (iPhone/iPad)

1. Verbinde dich mit dem gleichen WLAN wie der Server
2. Öffne Safari
3. Gehe zu `http://192.168.1.100:3001/dist/index.html`
4. Tippe auf "Teilen" → "Zum Home-Bildschirm"
5. Fertig!

## 🔒 Zugriff von außen (Optional)

Wenn du von außerhalb zugreifen willst (z.B. im Urlaub):

### 1. Port-Forwarding im Router

1. Öffne Router-Konfiguration (meist `192.168.1.1` oder `192.168.0.1`)
2. Suche nach "Port-Forwarding" oder "Virtuelle Server"
3. Erstelle neue Regel:
   - **Name**: Moodboard
   - **Externer Port**: 3001
   - **Interner Port**: 3001
   - **Ziel-IP**: Deine Server-IP (192.168.1.100)
   - **Protokoll**: TCP

### 2. Dynamisches DNS (DynDNS)

1. Registriere dich bei einem Anbieter:
   - No-IP: https://www.noip.com (kostenlos)
   - DuckDNS: https://www.duckdns.org (kostenlos)
   - DynDNS: https://dyn.com (bezahlt)

2. Erstelle einen Hostname (z.B. `meinmoodboard.ddns.net`)

3. Konfiguriere Router oder installiere Update-Client

4. Verwende in `.env`:
```
VITE_API_URL=http://meinmoodboard.ddns.net:3001
```

⚠️ **Sicherheitshinweis**: Für Internet-Zugriff solltest du HTTPS einrichten (Let's Encrypt)

## 💾 Backup & Wartung

### Backup erstellen

Die Datenbank ist eine einzelne Datei:

```powershell
# Manuelles Backup
$date = Get-Date -Format "yyyy-MM-dd"
copy server\data\moodboard.db "backups\moodboard-$date.db"
```

### Automatisches Backup (täglich)

Erstelle `backup.ps1`:

```powershell
$date = Get-Date -Format "yyyy-MM-dd"
$source = "C:\Users\markb\Documents\mood_boards\server\data\moodboard.db"
$dest = "C:\Backups\Moodboard\moodboard-$date.db"
Copy-Item $source $dest -Force

# Alte Backups löschen (älter als 30 Tage)
Get-ChildItem "C:\Backups\Moodboard" -Filter "moodboard-*.db" | 
  Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | 
  Remove-Item
```

Task Scheduler: Täglich um 3 Uhr ausführen

### Datenbank-Größe prüfen

```powershell
Get-ChildItem server\data\moodboard.db | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

## 🐛 Troubleshooting

### Server startet nicht

**Problem**: Port 3001 bereits belegt

```powershell
# Prüfe welches Programm Port 3001 nutzt
netstat -ano | findstr :3001
```

**Lösung**: Ändere Port in `server/src/server.js`:
```javascript
const PORT = 3002;
```

### Verbindung vom Handy funktioniert nicht

1. ✅ Ist der Server gestartet?
2. ✅ Ist die Firewall-Regel aktiv?
3. ✅ Sind beide im gleichen WLAN?
4. ✅ Ist die IP-Adresse korrekt?
5. ✅ Teste `http://server-ip:3001/api/health` im Handy-Browser

### Daten synchronisieren nicht

1. Öffne Browser Console (F12)
2. Schau nach Fehlern
3. Prüfe ob API-URL in `.env` korrekt ist
4. Teste API direkt: `http://server-ip:3001/api/boards`

### "Failed to fetch" Fehler

- **Falsche IP**: Prüfe Server-IP mit `ipconfig`
- **Firewall**: Deaktiviere temporär Windows Firewall zum Test
- **CORS**: Sollte automatisch funktionieren, prüfe Server-Logs

## 📊 Server-Informationen

### Verzeichnisstruktur

```
server/
├── src/
│   ├── server.js           # Haupt-Server
│   ├── database.js         # Datenbank-Setup
│   └── routes/             # API Endpoints
│       ├── boards.js       # Boards API
│       ├── items.js        # Items API
│       ├── assets.js       # Assets API
│       └── folders.js      # Folders API
├── data/
│   └── moodboard.db        # SQLite Datenbank
├── package.json
└── README.md
```

### API Endpoints

- `GET /api/health` - Server-Status
- `GET /api/boards` - Alle Boards
- `POST /api/boards` - Board erstellen
- `GET /api/items/board/:id` - Items eines Boards
- `GET /api/assets` - Alle Assets
- `GET /api/folders` - Alle Ordner

### Performance

- SQLite unterstützt tausende Boards
- Base64-Bilder werden direkt in DB gespeichert
- Für große Bild-Bibliotheken (>1000 Bilder) ggf. zu File-Storage wechseln

## 🎉 Fertig!

Dein Moodboard-Server läuft jetzt auf deinem Windows Home Server!

**Nächste Schritte:**
1. Teste von verschiedenen Geräten
2. Richte automatischen Start ein
3. Erstelle regelmäßige Backups
4. Optional: DynDNS für externen Zugriff

Bei Fragen oder Problemen: Schau in die Logs oder melde dich!

