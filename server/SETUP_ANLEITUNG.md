# 🚀 Moodboard Server Setup auf Windows

## Was ist das?

Dies ist der Backend-Server für die Moodboard-App. Er synchronisiert alle Daten zwischen deinen Geräten (Desktop, Handy, Tablet).

## Voraussetzungen

- Windows Server (oder Windows 10/11)
- Internet-Verbindung für die Installation

## ⚡ Schnellstart (3 Schritte)

### Schritt 1: Node.js installieren

1. Öffne Browser und gehe zu: **https://nodejs.org**
2. Lade die **LTS Version** herunter (grüner Button)
3. Installiere Node.js (alle Standard-Einstellungen OK)
4. **Neustart** des Computers (wichtig!)

### Schritt 2: Server installieren

1. Öffne **PowerShell** in diesem Ordner:
   - Rechtsklick auf den `server` Ordner
   - "In Terminal öffnen" oder "PowerShell hier öffnen"

2. Tippe ein und drücke Enter:
   ```powershell
   npm install
   ```

3. Warte bis "packages installed" erscheint (dauert 1-2 Minuten)

### Schritt 3: Server starten

Immer noch in PowerShell, tippe ein:

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
║   Netzwerk: http://<deine-ip>:3001         ║
╚════════════════════════════════════════════╝
✓ Datenbank initialisiert
```

🎉 **Server läuft!** Lass das PowerShell-Fenster offen.

## 🧪 Test ob es funktioniert

### Test 1: Lokal testen

1. Öffne einen Browser (Chrome, Edge, Firefox)
2. Gehe zu: http://localhost:3001/api/health
3. Du solltest sehen: `{"status":"ok","message":"Moodboard Server is running"}`

✅ Wenn das erscheint: **Server funktioniert!**

### Test 2: Netzwerk-IP finden

1. Öffne eine **neue** PowerShell (die alte läuft noch)
2. Tippe ein:
   ```powershell
   ipconfig
   ```
3. Suche nach "IPv4-Adresse" (z.B. `192.168.1.100`)
4. **Notiere diese IP!** (brauchst du später)

### Test 3: Von anderem Gerät testen

1. Nimm dein Handy
2. Verbinde es mit dem **gleichen WLAN**
3. Öffne Browser auf dem Handy
4. Gehe zu: `http://192.168.1.100:3001/api/health` (mit deiner IP aus Test 2)
5. Sollte auch `{"status":"ok",...}` zeigen

❌ **Funktioniert nicht?** → Siehe Abschnitt "Firewall öffnen" unten

## 🔥 Firewall öffnen (wichtig für Handy-Zugriff!)

Damit dein Handy auf den Server zugreifen kann:

### Option 1: Automatisch (PowerShell als Administrator)

1. Rechtsklick auf PowerShell → "Als Administrator ausführen"
2. Tippe ein:
   ```powershell
   New-NetFirewallRule -DisplayName "Moodboard Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
   ```
3. Drücke Enter

### Option 2: Manuell (Windows Firewall)

1. Windows-Taste drücken, tippe: "Firewall"
2. Öffne "Windows Defender Firewall mit erweiterter Sicherheit"
3. Klicke links auf "Eingehende Regeln"
4. Rechts auf "Neue Regel..."
5. Wähle **"Port"** → Weiter
6. **TCP** und Port **3001** → Weiter
7. **"Verbindung zulassen"** → Weiter
8. Alle Profile aktiviert lassen → Weiter
9. Name: **"Moodboard Server"** → Fertigstellen

Jetzt Test 3 wiederholen - sollte funktionieren! ✅

## 🤖 Server automatisch beim Start starten

### Mit Task Scheduler (Aufgabenplanung)

1. Windows-Taste, tippe: "Aufgabenplanung"
2. Öffne "Aufgabenplanung"
3. Rechts: "Aufgabe erstellen..."

**Allgemein:**
- Name: `Moodboard Server`
- "Mit höchsten Privilegien ausführen" aktivieren

**Trigger:**
- Klicke "Neu..."
- "Aufgabe starten:" → "Beim Systemstart"
- OK

**Aktionen:**
- Klicke "Neu..."
- Aktion: "Programm starten"
- Programm/Skript: `C:\Program Files\nodejs\node.exe`
- Argumente hinzufügen: `src\server.js`
- Starten in: `[Pfad zu diesem server Ordner]`
  Beispiel: `C:\Users\deinName\Desktop\server`
- OK

**Bedingungen:**
- "Aufgabe nur starten, falls die folgende Netzwerkverbindung verfügbar ist" aktivieren
- "Beliebige Verbindung" auswählen

**Einstellungen:**
- "Ausführung der Aufgabe bei Bedarf zulassen" aktivieren

Klicke "OK" zum Speichern.

**Testen:**
1. Rechtsklick auf die neue Aufgabe
2. "Ausführen"
3. Prüfe ob Server startet

## 📁 Ordner-Struktur

```
server/
├── src/
│   ├── server.js         # Haupt-Server (startet hier)
│   ├── database.js       # Datenbank-Setup
│   └── routes/           # API Endpoints
│       ├── boards.js
│       ├── items.js
│       ├── assets.js
│       └── folders.js
├── data/                 # Wird automatisch erstellt
│   └── moodboard.db      # SQLite Datenbank
├── package.json          # Dependencies
├── SETUP_ANLEITUNG.md   # Diese Datei
└── AI_SETUP_PROMPT.txt  # Prompt für AI-Assistenten
```

## 💾 Backup erstellen

Die Datenbank ist eine einzelne Datei. Zum Sichern:

```powershell
copy data\moodboard.db ..\moodboard-backup.db
```

Oder einfach `data\moodboard.db` per Rechtsklick → Kopieren.

Um Backup wiederherzustellen:
```powershell
copy ..\moodboard-backup.db data\moodboard.db
```

## 🔄 Server neu starten

1. Im PowerShell-Fenster wo Server läuft: **Strg+C** drücken
2. Dann wieder:
   ```powershell
   npm start
   ```

## 📊 API Endpoints (für Entwickler)

| Endpoint | Beschreibung |
|----------|--------------|
| `GET /api/health` | Server-Status prüfen |
| `GET /api/boards` | Alle Boards abrufen |
| `POST /api/boards` | Neues Board erstellen |
| `GET /api/items/board/:id` | Items eines Boards |
| `POST /api/items` | Neues Item erstellen |
| `GET /api/assets` | Alle Assets |
| `POST /api/assets` | Asset hochladen |
| `GET /api/folders` | Alle Ordner |

## 🐛 Probleme lösen

### "npm: Die Benennung wurde nicht als Name eines Cmdlet erkannt"

❌ **Problem:** Node.js ist nicht installiert oder neu starten vergessen

✅ **Lösung:**
1. Installiere Node.js von https://nodejs.org
2. **Starte Computer neu**
3. Öffne neue PowerShell
4. Teste: `node --version`

### "Port 3001 already in use"

❌ **Problem:** Ein anderes Programm nutzt Port 3001

✅ **Lösung:**
1. Ändere den Port in `src/server.js`:
   ```javascript
   const PORT = 3002; // Zeile 10
   ```
2. Server neu starten

### "EACCES: permission denied"

❌ **Problem:** Keine Schreibrechte in diesem Ordner

✅ **Lösung:**
1. Rechtsklick auf `server` Ordner → Eigenschaften
2. Tab "Sicherheit" → "Bearbeiten"
3. Gebe deinem Benutzer "Vollzugriff"

### Handy kann nicht verbinden

❌ **Problem:** Firewall blockiert oder falsches Netzwerk

✅ **Lösung:**
1. ✅ Server läuft? (PowerShell-Fenster offen?)
2. ✅ Firewall-Regel erstellt? (siehe oben)
3. ✅ Beide im gleichen WLAN?
4. ✅ Richtige IP? (teste mit `ipconfig`)
5. Teste URL im Handy-Browser: `http://deine-ip:3001/api/health`

### Server stoppt nach Browser schließen

❌ **Problem:** Server läuft nur solange PowerShell offen ist

✅ **Lösung:** 
- Entweder: PowerShell-Fenster offen lassen
- Oder: Automatischen Start einrichten (siehe oben)

## 🔒 Sicherheit

### Lokales Netzwerk (Standard)
- ✅ Server nur in deinem WLAN erreichbar
- ✅ Keine Authentifizierung nötig (alle im WLAN haben Zugriff)
- ✅ Gut für Zuhause/Büro

### Internet-Zugriff (Optional, nicht empfohlen)
Wenn du von außen zugreifen willst:
- ⚠️ Port-Forwarding im Router nötig
- ⚠️ Authentifizierung implementieren!
- ⚠️ HTTPS einrichten (Let's Encrypt)
- ⚠️ Firewall-Regeln verschärfen

**Für Internet-Zugriff kontaktiere einen IT-Experten!**

## 📞 Hilfe bekommen

### Wenn du nicht weiterkommst:

1. **Prüfe Logs**: Schaue in das PowerShell-Fenster wo der Server läuft
2. **Test Health**: Öffne http://localhost:3001/api/health
3. **Kopiere Fehlermeldung**: Markiere im PowerShell, Rechtsklick → Kopieren
4. **Frage AI**: Nutze `AI_SETUP_PROMPT.txt` und füge die Fehlermeldung hinzu

### System-Infos (für Support):

```powershell
# Node.js Version
node --version

# NPM Version  
npm --version

# Windows Version
systeminfo | findstr /B /C:"Betriebssystemname" /C:"Betriebssystemversion"

# Netzwerk-IP
ipconfig | findstr IPv4

# Port-Status
netstat -ano | findstr :3001
```

## ✅ Checkliste

Nach erfolgreicher Installation:

- [ ] Node.js installiert
- [ ] `npm install` durchgeführt
- [ ] Server startet mit `npm start`
- [ ] http://localhost:3001/api/health funktioniert
- [ ] Server-IP mit `ipconfig` gefunden
- [ ] Firewall-Regel erstellt
- [ ] Vom Handy erreichbar
- [ ] Automatischer Start eingerichtet (optional)
- [ ] Backup-Strategie überlegt

## 🎉 Geschafft!

Dein Server läuft jetzt! 

**Nächste Schritte:**
1. Lass das PowerShell-Fenster offen (oder richte automatischen Start ein)
2. Notiere deine Server-IP für die Frontend-Konfiguration
3. Konfiguriere die Moodboard-App um diese Server-IP zu nutzen

**Die Server-IP brauchst du für:**
- Frontend `.env` Datei: `VITE_API_URL=http://deine-ip:3001`
- Mobile Geräte: Browser → `http://deine-ip:3001/`

Viel Erfolg! 🚀

