# Moodboard Server

Dein eigener Backend-Server für die Moodboard-App.

## Features

✅ Synchronisiert alle Daten zwischen allen Geräten
✅ Läuft auf deinem Windows Home Server
✅ SQLite Datenbank (keine komplizierte Installation)
✅ Speichert Bilder als Base64 direkt in der DB
✅ REST API für Frontend

## Installation auf Windows Server

### 1. Node.js installieren

1. Lade Node.js herunter: https://nodejs.org (LTS Version)
2. Installiere Node.js auf deinem Windows Server
3. Öffne PowerShell und prüfe die Installation:
   ```powershell
   node --version
   npm --version
   ```

### 2. Server-Dateien kopieren

1. Kopiere den kompletten `server` Ordner auf deinen Windows Server
2. Öffne PowerShell im `server` Ordner

### 3. Dependencies installieren

```powershell
npm install
```

### 4. Server starten

```powershell
npm start
```

Der Server läuft jetzt auf Port 3001!

```
╔════════════════════════════════════════════╗
║   Moodboard Server gestartet!              ║
╟────────────────────────────────────────────╢
║   Port: 3001                               ║
║   Lokale URL: http://localhost:3001        ║
║   Netzwerk: http://<deine-server-ip>:3001  ║
╚════════════════════════════════════════════╝
```

### 5. Server IP-Adresse finden

```powershell
ipconfig
```

Suche nach "IPv4-Adresse" - das ist deine Server-IP (z.B. 192.168.1.100)

## Server als Windows Dienst einrichten (Optional)

Um den Server automatisch beim Start zu starten:

### Mit NSSM (Non-Sucking Service Manager)

1. Lade NSSM herunter: https://nssm.cc/download
2. Entpacke und öffne PowerShell als Administrator
3. Installiere den Dienst:

```powershell
cd C:\path\to\nssm\win64
.\nssm.exe install MoodboardServer "C:\Program Files\nodejs\node.exe" "C:\path\to\server\src\server.js"
.\nssm.exe start MoodboardServer
```

### Mit Task Scheduler

1. Öffne "Aufgabenplanung" (Task Scheduler)
2. Erstelle neue Aufgabe:
   - Name: "Moodboard Server"
   - Trigger: "Beim Systemstart"
   - Aktion: `node C:\path\to\server\src\server.js`
   - Bedingungen: "Nur bei Netzwerkverbindung starten"

## Frontend konfigurieren

### Auf deinem Desktop (wo der Server läuft)

1. Erstelle `.env` Datei im Hauptordner:
```
VITE_API_URL=http://localhost:3001
```

### Auf anderen Geräten (Handy, andere Computer)

1. Finde die IP deines Servers (siehe oben)
2. Erstelle `.env` Datei:
```
VITE_API_URL=http://192.168.1.100:3001
```
(Ersetze 192.168.1.100 mit deiner Server-IP)

3. Baue die App neu:
```
npm run build
```

## Firewall-Regel erstellen

Damit andere Geräte auf den Server zugreifen können:

1. Öffne "Windows Defender Firewall mit erweiterter Sicherheit"
2. Klicke auf "Eingehende Regeln" → "Neue Regel..."
3. Regeltyp: "Port"
4. TCP Port: 3001
5. Aktion: "Verbindung zulassen"
6. Profile: Alle aktivieren
7. Name: "Moodboard Server"

Oder per PowerShell (als Administrator):

```powershell
New-NetFirewallRule -DisplayName "Moodboard Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

## Zugriff von außerhalb (Internet)

Falls du von außerhalb deines Heimnetzwerks zugreifen möchtest:

1. **Port-Forwarding im Router einrichten**
   - Port: 3001
   - Ziel-IP: Deine Server-IP
   
2. **Dynamisches DNS einrichten** (optional)
   - Services: DynDNS, No-IP, etc.
   - Gibt dir eine feste URL statt IP

3. **HTTPS mit Let's Encrypt** (empfohlen für Internet-Zugriff)
   - Für sichere Verbindung über Internet

## Datenbank-Speicherort

Die Datenbank wird hier gespeichert:
```
server/data/moodboard.db
```

### Backup erstellen

Einfach die `moodboard.db` Datei kopieren!

```powershell
copy server\data\moodboard.db backup\moodboard-backup-2024-10-09.db
```

## Troubleshooting

### Server startet nicht

1. Prüfe ob Port 3001 frei ist:
   ```powershell
   netstat -ano | findstr :3001
   ```

2. Ändere den Port in `server/src/server.js`:
   ```javascript
   const PORT = 3002; // Anderer Port
   ```

### Verbindung vom Handy funktioniert nicht

1. Prüfe ob Server läuft (öffne im Browser: `http://server-ip:3001/api/health`)
2. Prüfe Firewall-Regel (siehe oben)
3. Stelle sicher dass beide Geräte im gleichen WLAN sind
4. Prüfe ob die IP-Adresse korrekt ist

### API URL ändern

Frontend `.env`:
```
VITE_API_URL=http://neue-ip:3001
```

Dann App neu bauen:
```
npm run build
```

## Logs anzeigen

Der Server gibt alle Logs direkt in der Konsole aus. Um Logs zu speichern:

```powershell
npm start > logs.txt 2>&1
```

## Support

Bei Problemen schaue in die Logs oder melde dich!

