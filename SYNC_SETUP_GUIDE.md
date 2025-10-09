# 🔄 Geräte-Synchronisation Setup

**Problem gelöst**: Jetzt siehst du alle deine Moodboards, Bilder und Ordner auf **allen deinen Geräten**! 🎉

## Was wurde implementiert?

### Backend Server
- ✅ **Node.js Express Server** - Läuft auf deinem Windows Home Server
- ✅ **SQLite Datenbank** - Speichert alle Boards, Items, Assets und Ordner
- ✅ **REST API** - Für die Kommunikation zwischen Frontend und Backend
- ✅ **Automatische Synchronisation** - Alle Änderungen werden sofort auf den Server gespeichert

### Frontend Updates
- ✅ **API Client** - Kommuniziert mit dem Backend
- ✅ **Stores umgebaut** - Nutzen jetzt die API statt IndexedDB
- ✅ **Konfigurierbar** - Server-URL über `.env` einstellbar
- ✅ **Error Handling** - Zeigt Fehler wenn Server nicht erreichbar ist

## 🚀 Quick Start

### 1. Server installieren (auf Windows Home Server)

```powershell
# Im server Ordner
cd server
npm install
npm start
```

Der Server läuft jetzt auf `http://localhost:3001`

### 2. Server-IP finden

```powershell
ipconfig
```

Notiere deine IPv4-Adresse (z.B. `192.168.1.100`)

### 3. Firewall öffnen

```powershell
# Als Administrator
New-NetFirewallRule -DisplayName "Moodboard Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

### 4. Frontend konfigurieren

**Auf dem Desktop (wo der Server läuft):**

Erstelle `.env` im Hauptordner:
```
VITE_API_URL=http://localhost:3001
```

**Auf anderen Geräten (Handy, etc.):**

Erstelle `.env` im Hauptordner:
```
VITE_API_URL=http://192.168.1.100:3001
```
*(Ersetze mit deiner Server-IP)*

### 5. App neu bauen

```powershell
npm run build
```

### 6. Testen

1. Öffne `dist/index.html` auf Desktop
2. Erstelle ein neues Board
3. Öffne `dist/index.html` auf Handy (im gleichen WLAN)
4. Das Board sollte auch dort erscheinen! ✨

## 📱 Mobile Zugriff

### Android
1. Öffne Chrome auf dem Handy
2. Gehe zu `http://192.168.1.100:3001/` *(mit deiner IP)*
3. Öffne `dist/index.html`
4. Chrome Menü → "Zum Startbildschirm hinzufügen"

### iOS
1. Öffne Safari auf iPhone/iPad
2. Gehe zu `http://192.168.1.100:3001/`
3. Öffne `dist/index.html`
4. Teilen → "Zum Home-Bildschirm"

## 📁 Projekt-Struktur (NEU)

```
mood_boards/
├── server/                    # ← NEU: Backend Server
│   ├── src/
│   │   ├── server.js         # Haupt-Server
│   │   ├── database.js       # SQLite Setup
│   │   └── routes/           # API Endpoints
│   ├── data/
│   │   └── moodboard.db      # Datenbank
│   ├── package.json
│   └── README.md
│
├── src/
│   ├── modules/
│   │   ├── api/              # ← NEU: API Client
│   │   │   ├── config.ts    # Server-Konfiguration
│   │   │   └── client.ts    # API Requests
│   │   ├── boards/
│   │   │   └── store.ts     # ← GEÄNDERT: Nutzt API
│   │   └── library/
│   │       ├── store.ts     # ← GEÄNDERT: Nutzt API
│   │       └── folderStore.ts # ← GEÄNDERT: Nutzt API
│   └── ...
│
├── .env                      # ← NEU: Frontend-Konfiguration
└── dist/                     # Fertige App
```

## 🔧 Wichtige Dateien

### Backend

- **`server/src/server.js`** - Haupt-Server mit Express
- **`server/src/database.js`** - SQLite Datenbank-Setup
- **`server/src/routes/boards.js`** - API für Boards
- **`server/src/routes/items.js`** - API für Board-Items
- **`server/src/routes/assets.js`** - API für Library-Assets
- **`server/src/routes/folders.js`** - API für Ordner

### Frontend

- **`src/modules/api/config.ts`** - Server-URL Konfiguration
- **`src/modules/api/client.ts`** - API Client für Backend-Kommunikation
- **`src/modules/boards/store.ts`** - Board Store (nutzt API)
- **`src/modules/library/store.ts`** - Asset Store (nutzt API)
- **`src/modules/library/folderStore.ts`** - Folder Store (nutzt API)

## 🎯 API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/api/health` | Server-Status |
| GET | `/api/boards` | Alle Boards abrufen |
| POST | `/api/boards` | Board erstellen |
| PUT | `/api/boards/:id` | Board aktualisieren |
| DELETE | `/api/boards/:id` | Board löschen |
| POST | `/api/boards/:id/duplicate` | Board duplizieren |
| GET | `/api/items/board/:boardId` | Items eines Boards |
| POST | `/api/items` | Item erstellen |
| PUT | `/api/items/:id` | Item aktualisieren |
| DELETE | `/api/items/:id` | Item löschen |
| GET | `/api/assets` | Alle Assets (optional: ?folderId=x) |
| POST | `/api/assets` | Asset hochladen |
| PUT | `/api/assets/:id/move` | Asset verschieben |
| DELETE | `/api/assets/:id` | Asset löschen |
| GET | `/api/folders` | Alle Ordner |
| POST | `/api/folders` | Ordner erstellen |
| PUT | `/api/folders/:id` | Ordner aktualisieren |
| DELETE | `/api/folders/:id` | Ordner löschen |

## 🔒 Sicherheit

### Lokales Netzwerk
- Server läuft nur in deinem WLAN
- Keine Authentifizierung nötig (alle im Netzwerk haben Zugriff)

### Internet-Zugriff (Optional)
Falls du von außen zugreifen willst:
1. Port-Forwarding im Router (Port 3001)
2. DynDNS einrichten (z.B. No-IP, DuckDNS)
3. **WICHTIG**: Authentifizierung hinzufügen!
4. **WICHTIG**: HTTPS mit Let's Encrypt einrichten!

## 💾 Backup

### Datenbank sichern

Die Datenbank ist eine einzelne Datei:

```powershell
copy server\data\moodboard.db backups\moodboard-backup.db
```

### Automatisches Backup

Siehe `docs/SERVER_SETUP.md` für automatische Backup-Skripte.

## 🐛 Troubleshooting

### "Failed to fetch" Fehler

**Ursachen:**
1. Server läuft nicht → Starte mit `npm start`
2. Falsche IP in `.env` → Prüfe mit `ipconfig`
3. Firewall blockiert → Öffne Port 3001
4. Nicht im gleichen WLAN → Verbinde beide Geräte

**Test:**
```powershell
# Im Browser öffnen:
http://localhost:3001/api/health      # Auf Server
http://192.168.1.100:3001/api/health  # Von anderem Gerät
```

### Server startet nicht

**Port bereits belegt:**
```powershell
netstat -ano | findstr :3001
```

Ändere Port in `server/src/server.js`:
```javascript
const PORT = 3002;
```

### Daten werden nicht synchronisiert

1. Öffne Browser Console (F12)
2. Schaue nach Fehlern im Network-Tab
3. Prüfe Server-Logs
4. Teste API direkt: `http://server-ip:3001/api/boards`

## 📚 Weitere Dokumentation

- **`server/README.md`** - Server-Dokumentation
- **`docs/SERVER_SETUP.md`** - Detaillierte Setup-Anleitung
- **Automatischer Start** - Siehe SERVER_SETUP.md (Task Scheduler / NSSM)
- **Firewall-Setup** - Siehe SERVER_SETUP.md
- **DynDNS & Internet** - Siehe SERVER_SETUP.md

## ✨ Features

### Was jetzt möglich ist:

- ✅ **Alle Geräte synchron** - Desktop, Handy, Tablet sehen die gleichen Daten
- ✅ **Echtzeit-Updates** - Änderungen werden sofort gespeichert
- ✅ **Zentrales Backup** - Nur eine Datenbank sichern
- ✅ **Unbegrenzter Speicher** - Nur durch deinen Server begrenzt
- ✅ **Offline-fähig** - Browser cached die App (PWA-ready)
- ✅ **Privat** - Alles auf deinem Server, keine Cloud

### Migration von alten Daten

Alte Daten sind noch in IndexedDB:
1. Exportiere sie (wenn Export-Feature gewünscht)
2. Oder lege sie einfach neu an
3. IndexedDB wird nicht mehr verwendet

## 🎉 Fertig!

Du hast jetzt eine vollständig synchronisierte Moodboard-App!

**Teste es:**
1. Erstelle ein Board am Desktop
2. Öffne App auf dem Handy
3. Siehe das Board dort erscheinen
4. Füge ein Bild vom Handy hinzu
5. Siehe es am Desktop

**Bei Problemen:** Schaue in `docs/SERVER_SETUP.md` oder melde dich!

