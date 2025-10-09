# 🌍 Internet-Zugriff & Vercel Setup - Kurzanleitung

## 🎯 Ziel

**Backend** (API) → Dein Home Server mit DuckDNS → `http://www.mark-tietz.duckdns.org:3001`  
**Frontend** (App) → Vercel (kostenlos) → `https://dein-projekt.vercel.app`

## ✅ Was bereits konfiguriert ist

1. ✅ **Server CORS** - Erlaubt Zugriff von Vercel
2. ✅ **API URL** - Frontend nutzt DuckDNS URL
3. ✅ **vercel.json** - Vercel-Konfiguration erstellt
4. ✅ **Environment Vars** - Vorbereitet für DuckDNS

## 🚀 Setup in 3 Schritten

### Schritt 1: Backend im Internet erreichbar machen

**A) Port-Forwarding im Router**

Logge dich in deinen Router ein (meist 192.168.1.1):

```
Name:           Moodboard Server
Externer Port:  3001
Interner Port:  3001
Ziel-IP:        [Deine Server-IP]
Protokoll:      TCP
```

Server-IP finden:
```powershell
ipconfig
# Suche IPv4-Adresse (z.B. 192.168.1.100)
```

**B) Firewall öffnen**

PowerShell als Administrator:
```powershell
New-NetFirewallRule -DisplayName "Moodboard Server Internet" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

**C) Server starten**
```powershell
cd server
npm start
```

**D) Testen**

Von extern (Handy mit mobilem Internet):
```
http://www.mark-tietz.duckdns.org:3001/api/health
```

Sollte zeigen: `{"status":"ok","message":"Moodboard Server is running"}`

✅ **Funktioniert?** → Weiter zu Schritt 2  
❌ **Funktioniert nicht?** → Siehe `server/INTERNET_ZUGRIFF.md`

### Schritt 2: Frontend auf Vercel deployen

**Option A: Mit GitHub (empfohlen)**

```bash
# 1. GitHub Repo erstellen auf github.com

# 2. Code pushen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/deinname/moodboard.git
git push -u origin main

# 3. Auf Vercel:
# - Gehe zu vercel.com
# - "Sign Up" mit GitHub
# - "Import Project"
# - Wähle dein Repo
# - Environment Variable hinzufügen:
#   VITE_API_URL = http://www.mark-tietz.duckdns.org:3001
# - "Deploy"
```

**Option B: Mit Vercel CLI**

```bash
# 1. CLI installieren
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Environment Variable setzen (im Browser)
# Vercel Dashboard → Settings → Environment Variables
# VITE_API_URL = http://www.mark-tietz.duckdns.org:3001

# 5. Production Deploy
vercel --prod
```

### Schritt 3: Testen

1. Öffne deine Vercel URL (z.B. `https://moodboard-xyz.vercel.app`)
2. Erstelle ein Board
3. Öffne vom Handy (mobiles Internet)
4. Board sollte auch dort erscheinen

✅ **Alles synchronisiert!** 🎉

## 📁 Wichtige Dateien

**Für dich:**
- `VERCEL_DEPLOYMENT.md` - Ausführliche Vercel-Anleitung
- `server/INTERNET_ZUGRIFF.md` - Backend Internet-Setup Details
- `vercel.json` - Vercel-Konfiguration

**Konfiguration:**
- `src/modules/api/config.ts` - API URL (bereits auf DuckDNS eingestellt)
- `server/src/server.js` - CORS für Vercel aktiviert

## 🔧 Environment Variables

### Für Vercel (Frontend)

In Vercel Dashboard setzen:

| Variable | Wert | Environments |
|----------|------|--------------|
| `VITE_API_URL` | `http://www.mark-tietz.duckdns.org:3001` | Production, Preview, Development |

### Lokal testen

Erstelle `.env.local`:
```
VITE_API_URL=http://www.mark-tietz.duckdns.org:3001
```

Dann:
```bash
npm run dev
```

## 🐛 Troubleshooting

### Backend nicht erreichbar

**Von lokal funktioniert, von extern nicht:**

1. ✅ Port-Forwarding richtig eingerichtet?
2. ✅ Richtige interne Server-IP verwendet?
3. ✅ Firewall-Regel für Internet erstellt?
4. ✅ DuckDNS zeigt auf aktuelle IP?

**Test:**
```bash
# Prüfe DuckDNS IP
ping www.mark-tietz.duckdns.org

# Prüfe deine öffentliche IP
# Google: "my ip"
# Sollten übereinstimmen!
```

**Online Port-Check:**
- https://www.yougetsignal.com/tools/open-ports/
- Port: 3001
- Sollte "Open" zeigen

### CORS-Fehler

**Sollte nicht passieren**, aber falls doch:

Server ist bereits für alle Origins konfiguriert. Prüfe:
1. Browser Console (F12) → Network Tab
2. Schaue nach genaue Fehlermeldung
3. Prüfe ob Server läuft

### Vercel Build Failed

**Häufige Fehler:**

1. **TypeScript Errors**
   ```bash
   # Lokal prüfen:
   npm run build
   # Fehler beheben
   ```

2. **Environment Variable fehlt**
   - In Vercel Dashboard → Settings → Environment Variables
   - `VITE_API_URL` hinzufügen
   - Redeploy

3. **Dependencies fehlen**
   - `package.json` committen
   - Git push

**Build Logs anschauen:**
Vercel Dashboard → Deployment → View Build Logs

### Vercel zeigt alte Version

**Nach Deploy:**
1. Warte 1-2 Minuten
2. Hard Refresh: Strg+Shift+R
3. Browser-Cache leeren

## 🔒 Sicherheit

### ⚠️ Aktuell: Keine Authentifizierung

Die API ist jetzt **öffentlich**. Jeder mit der URL kann:
- Boards erstellen/löschen
- Bilder hochladen
- Daten ändern

**Für private Nutzung OK**, aber:

### 🔐 Empfohlene Sicherheitsmaßnahmen

**1. API Key (einfach)**

In `server/src/server.js` vor den Routes hinzufügen:
```javascript
// API Key Check
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY || 'dein-geheimer-key-hier';
  
  if (apiKey === validKey) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

Frontend `src/modules/api/client.ts`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': import.meta.env.VITE_API_KEY,
  ...options?.headers,
},
```

Vercel Environment Variable:
```
VITE_API_KEY = dein-geheimer-key-hier
```

**2. Rate Limiting**

```bash
cd server
npm install express-rate-limit
```

In `server/src/server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Max 100 Requests
});

app.use('/api', limiter);
```

**3. HTTPS (sehr empfohlen)**

- Frontend: ✅ Automatisch via Vercel
- Backend: ⚠️ Aktuell HTTP

Für HTTPS auf Backend:
- Let's Encrypt Zertifikat
- Oder Cloudflare Tunnel
- Siehe `server/INTERNET_ZUGRIFF.md` → HTTPS

## 📊 Architektur

```
┌─────────────────────────┐
│   Nutzer (Browser)      │
│   Überall im Internet   │
└───────────┬─────────────┘
            │
            │ HTTPS ✅
            ↓
┌─────────────────────────┐
│   Vercel (Frontend)     │
│   CDN weltweit          │
│   SSL inklusive         │
└───────────┬─────────────┘
            │
            │ HTTP API Calls
            │ (vom Browser aus)
            ↓
┌─────────────────────────┐
│   DuckDNS               │
│   mark-tietz.duckdns.org│
└───────────┬─────────────┘
            │
            │ Port 3001
            ↓
┌─────────────────────────┐
│   Dein Router           │
│   Port-Forwarding       │
└───────────┬─────────────┘
            │
            │ Lokales Netzwerk
            ↓
┌─────────────────────────┐
│   Windows Home Server   │
│   Express.js API        │
│   SQLite Datenbank      │
└─────────────────────────┘
```

## ✅ Checkliste

**Backend (Home Server):**
- [ ] Server läuft
- [ ] Port 3001 im Router forwarded
- [ ] Firewall für Internet geöffnet
- [ ] Von extern erreichbar (Test mit Handy ohne WLAN)
- [ ] DuckDNS Update-Client läuft (für dynamische IP)

**Frontend (Vercel):**
- [ ] Vercel Account erstellt
- [ ] Projekt deployed
- [ ] Environment Variable `VITE_API_URL` gesetzt
- [ ] Auf Vercel-URL getestet
- [ ] Von Handy getestet

**Optional:**
- [ ] API Key implementiert
- [ ] Rate Limiting aktiviert
- [ ] Custom Domain (z.B. moodboard.mark-tietz.com)
- [ ] HTTPS für Backend (Let's Encrypt)

## 🚀 Nach dem Setup

### Automatische Deploys

Jetzt bei jedem Git Push:
```bash
git add .
git commit -m "Update"
git push

# → Vercel deployed automatisch
# → Live in 1-2 Minuten
```

### Updates verteilen

1. Code ändern
2. Git Push
3. Vercel deployed automatisch
4. Alle Nutzer bekommen Update sofort (kein Cache)

### Monitoring

**Vercel Dashboard:**
- Deployment-Status
- Build-Logs
- Analytics (optional, bezahlt)

**Server:**
- Schaue in PowerShell wo Server läuft
- Oder richte Logging ein

## 📚 Weitere Dokumentation

- **`VERCEL_DEPLOYMENT.md`** - Ausführliche Vercel-Anleitung
- **`server/INTERNET_ZUGRIFF.md`** - Backend-Details für Internet
- **`SERVER_KOPIEREN_ANLEITUNG.md`** - Server-Setup auf Windows

## 💡 Tipps

### Entwicklung vs Production

**Lokal entwickeln:**
```bash
npm run dev
# Nutzt automatisch localhost
```

**Production testen:**
```bash
npm run build
npm run preview
# Testet Production-Build lokal
```

**Auf Vercel deployen:**
```bash
git push
# Oder: vercel --prod
```

### DuckDNS aktuell halten

Erstelle `update-duckdns.bat`:
```batch
@echo off
curl "https://www.duckdns.org/update?domains=mark-tietz&token=DEIN_TOKEN&ip="
```

Task Scheduler: Alle 5 Minuten ausführen

### Backup

**Datenbank:**
```powershell
copy server\data\moodboard.db backups\moodboard-backup.db
```

**Code:**
- Ist in Git
- GitHub ist dein Backup

## 🎉 Fertig!

Deine App ist jetzt weltweit erreichbar:

**Frontend**: `https://dein-projekt.vercel.app`  
**Backend**: `http://www.mark-tietz.duckdns.org:3001`

**Features:**
- ✅ Von überall im Internet nutzbar
- ✅ Automatische Deploys bei Git Push
- ✅ HTTPS für Frontend (via Vercel)
- ✅ Kostenlos
- ✅ Schnell (CDN)
- ✅ Alle Geräte synchronisiert

Bei Fragen: Siehe ausführliche Dokumentation!

Viel Erfolg! 🌍🚀

