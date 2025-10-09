# 🌍 Internet-Zugriff für Moodboard Server

## Deine Konfiguration

**DuckDNS Domain**: `www.mark-tietz.duckdns.org`  
**API URL**: `http://www.mark-tietz.duckdns.org:3001/api`

Der Server ist jetzt so konfiguriert dass er von **überall im Internet** erreichbar ist!

## ✅ Was bereits gemacht wurde

1. ✅ Server akzeptiert Verbindungen von überall (`0.0.0.0`)
2. ✅ CORS für alle Origins aktiviert
3. ✅ API-URL in Frontend konfiguriert
4. ✅ DuckDNS Domain eingebunden

## 🔧 Was du noch tun musst

### 1. Port-Forwarding im Router einrichten

Damit Anfragen aus dem Internet zu deinem Server kommen:

**Im Router-Interface (meist 192.168.1.1 oder 192.168.0.1):**

1. Logge dich ein (Router-Admin-Passwort)
2. Suche nach:
   - "Port-Forwarding"
   - "Virtuelle Server"
   - "NAT-Forwarding"
   - "Applications & Gaming"

3. Erstelle neue Regel:
   ```
   Name:           Moodboard Server
   Externer Port:  3001
   Interner Port:  3001
   Ziel-IP:        [Deine Server-IP, z.B. 192.168.1.100]
   Protokoll:      TCP
   ```

4. Speichern und Router ggf. neu starten

**Server-IP finden:**
```powershell
ipconfig
```
Suche nach IPv4-Adresse (z.B. `192.168.1.100`)

### 2. DuckDNS Update einrichten

Damit deine Domain immer auf deine aktuelle IP zeigt:

**Option A: Windows Task Scheduler**

1. Erstelle Datei `update-duckdns.bat`:
   ```batch
   @echo off
   curl "https://www.duckdns.org/update?domains=mark-tietz&token=DEIN_DUCKDNS_TOKEN&ip="
   ```
   (Ersetze `DEIN_DUCKDNS_TOKEN` mit deinem Token von DuckDNS)

2. Task Scheduler → "Aufgabe erstellen"
   - Trigger: "Alle 5 Minuten wiederholen"
   - Aktion: Diese Batch-Datei ausführen

**Option B: DuckDNS Client**

Download von: https://www.duckdns.org/install.jsp

### 3. Windows Firewall für Internet öffnen

**PowerShell als Administrator:**

```powershell
# Falls noch nicht gemacht:
New-NetFirewallRule -DisplayName "Moodboard Server Internet" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow -RemoteAddress Any
```

### 4. Server starten

```powershell
cd server
npm start
```

## 🧪 Testen

### Test 1: Lokal

```
http://localhost:3001/api/health
```

Sollte zeigen: `{"status":"ok","message":"Moodboard Server is running"}`

### Test 2: Von extern (Handy mit mobilem Internet, kein WLAN!)

```
http://www.mark-tietz.duckdns.org:3001/api/health
```

Sollte auch `{"status":"ok",...}` zeigen

✅ **Funktioniert?** → Super, alles läuft!  
❌ **Funktioniert nicht?** → Siehe Troubleshooting unten

## 📱 Vercel Deployment (Frontend)

### Was ist Vercel?

Vercel hostet dein **Frontend** (die App) kostenlos im Internet.  
Dein **Backend** läuft weiter auf deinem Home Server.

```
[Frontend auf Vercel] ←→ [Backend auf deinem Server]
   ↓ gehostet von Vercel      ↓ läuft bei dir zuhause
   ↓ im Internet              ↓ unter DuckDNS erreichbar
```

### Vercel Setup

**1. Vercel Account erstellen**

1. Gehe zu: https://vercel.com
2. "Sign Up" mit GitHub-Account
3. Kostenlos (Hobby Plan)

**2. GitHub Repository (optional aber empfohlen)**

1. Erstelle GitHub Repo für dein Projekt
2. Pushe deinen Code
3. Vercel verbindet sich mit GitHub

**3. Projekt auf Vercel deployen**

**Option A: Mit GitHub**
1. Vercel Dashboard → "Import Project"
2. Wähle dein GitHub Repo
3. Build Settings:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
4. Environment Variables:
   ```
   VITE_API_URL=http://www.mark-tietz.duckdns.org:3001
   ```
5. Deploy!

**Option B: Mit Vercel CLI**

```bash
# Vercel CLI installieren
npm i -g vercel

# In deinem Projekt-Ordner
vercel login
vercel

# Bei den Fragen:
# - Set up and deploy: Yes
# - Which scope: Dein Account
# - Link to existing: No
# - Project name: moodboard-app
# - Directory: ./
# - Override settings: No
```

**4. Environment Variables setzen**

In Vercel Dashboard:
1. Projekt → Settings → Environment Variables
2. Füge hinzu:
   ```
   Name:  VITE_API_URL
   Value: http://www.mark-tietz.duckdns.org:3001
   ```
3. Für alle Environments (Production, Preview, Development)
4. Redeploy auslösen

### Wichtig bei Vercel!

**CORS muss aktiviert sein** ✅ (bereits erledigt!)

Der Server erlaubt jetzt Anfragen von deiner Vercel-Domain.

**Automatische Deploys:**
- Jeder Git Push → Automatischer Deploy auf Vercel
- Preview-URLs für jeden Branch
- SSL/HTTPS automatisch

**Nach dem Deploy:**
- Frontend läuft auf: `https://dein-projekt.vercel.app`
- Backend läuft auf: `http://www.mark-tietz.duckdns.org:3001`

## 🔐 Sicherheit (WICHTIG!)

### ⚠️ Aktuelle Sicherheit: NIEDRIG

Aktuell hat die API **keine Authentifizierung**. Jeder der die URL kennt kann:
- Boards erstellen/löschen
- Bilder hochladen
- Daten ändern

**Für privaten Gebrauch okay**, wenn:
- Du die URL geheim hältst
- Nur wenige Leute sie kennen
- Es keine sensiblen Daten sind

### 🔒 Sicherheit verbessern (empfohlen)

**Option 1: API Key (einfach)**

Füge einen API Key hinzu den nur du kennst.

In `server/src/server.js`:
```javascript
// Middleware für API Key
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

`.env` auf Server:
```
API_KEY=dein-geheimer-schluessel-hier
```

Frontend `.env`:
```
VITE_API_KEY=dein-geheimer-schluessel-hier
```

**Option 2: HTTPS mit Let's Encrypt (besser)**

1. Installiere Certbot auf Windows Server
2. Erhalte kostenloses SSL-Zertifikat
3. Konfiguriere Server für HTTPS
4. URL wird: `https://www.mark-tietz.duckdns.org:3001`

**Option 3: Reverse Proxy (am besten)**

Nutze nginx/Caddy als Reverse Proxy mit:
- HTTPS
- Rate Limiting
- Authentication
- Load Balancing

### 🛡️ Minimale Sicherheit (jetzt umsetzen)

1. **Ändere Port** (optional, Security by Obscurity):
   ```javascript
   const PORT = 8443; // statt 3001
   ```

2. **Rate Limiting** (verhindert Spam):
   ```bash
   npm install express-rate-limit
   ```
   
   In `server.js`:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 Minuten
     max: 100 // Max 100 Requests pro IP
   });
   
   app.use('/api', limiter);
   ```

3. **Helmet.js** (Security Headers):
   ```bash
   npm install helmet
   ```
   
   In `server.js`:
   ```javascript
   import helmet from 'helmet';
   app.use(helmet());
   ```

## 🐛 Troubleshooting

### Server von außen nicht erreichbar

**Checklist:**
- [ ] Port-Forwarding im Router eingerichtet?
- [ ] Richtige interne IP im Port-Forwarding?
- [ ] Firewall-Regel für Internet erstellt?
- [ ] DuckDNS zeigt auf aktuelle IP? (Test: `ping www.mark-tietz.duckdns.org`)
- [ ] Server läuft? (Test lokal: `http://localhost:3001/api/health`)
- [ ] Router hat öffentliche IP? (Manche Provider nutzen Carrier-Grade NAT)

**Test ob Port offen:**
- Online-Tool: https://www.yougetsignal.com/tools/open-ports/
- Port: 3001
- IP: Deine öffentliche IP (google: "my ip")

### DuckDNS zeigt auf alte IP

1. Prüfe aktuelle IP: https://www.whatismyip.com
2. Prüfe DuckDNS IP: `ping www.mark-tietz.duckdns.org`
3. Update DuckDNS manuell:
   ```
   https://www.duckdns.org/update?domains=mark-tietz&token=DEIN_TOKEN&ip=
   ```

### CORS-Fehler in Browser Console

Sollte nicht passieren (CORS ist offen), aber falls doch:

In `server/src/server.js` ist CORS bereits für alle Origins erlaubt.

### Vercel Build fehlgeschlagen

**Häufige Fehler:**
- `.env` Variablen nicht gesetzt → In Vercel Dashboard setzen
- Node Version zu alt → Vercel nutzt automatisch passende Version
- Build-Command falsch → Sollte sein: `npm run build`
- Output Directory falsch → Sollte sein: `dist`

**Logs anschauen:**
Vercel Dashboard → Deployment → Build Logs

### Server stoppt nach Neustart

Richte automatischen Start ein (siehe `SETUP_ANLEITUNG.md` → Task Scheduler)

## 📊 Architektur

```
┌─────────────────────────────────────────┐
│  Nutzer (Browser/Handy)                 │
│  Überall im Internet                     │
└────────────────┬────────────────────────┘
                 │
                 │ HTTPS
                 ↓
┌─────────────────────────────────────────┐
│  Frontend auf Vercel                    │
│  https://dein-projekt.vercel.app        │
│  - Statische Dateien                    │
│  - React/Vite App                       │
│  - CDN: Schnell weltweit                │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP (API Calls)
                 ↓
┌─────────────────────────────────────────┐
│  Internet                                │
│  www.mark-tietz.duckdns.org:3001        │
└────────────────┬────────────────────────┘
                 │
                 │ Port-Forwarding
                 ↓
┌─────────────────────────────────────────┐
│  Dein Router                             │
│  Port 3001 → Server IP                  │
└────────────────┬────────────────────────┘
                 │
                 │ Lokales Netzwerk
                 ↓
┌─────────────────────────────────────────┐
│  Windows Home Server                    │
│  192.168.x.x:3001                       │
│  - Express.js API                       │
│  - SQLite Datenbank                     │
│  - Bilder-Speicher                      │
└─────────────────────────────────────────┘
```

## 🎯 Checkliste

**Server-Seite:**
- [ ] Server läuft
- [ ] Port 3001 in Router forwarded
- [ ] Firewall für Internet geöffnet
- [ ] DuckDNS Update-Client läuft
- [ ] Von extern erreichbar (Test mit Handy ohne WLAN)

**Frontend-Seite:**
- [ ] `.env` mit DuckDNS URL erstellt
- [ ] App gebaut (`npm run build`)
- [ ] Lokal getestet
- [ ] Vercel Account erstellt (optional)
- [ ] Auf Vercel deployed (optional)
- [ ] Environment Variables in Vercel gesetzt

**Sicherheit:**
- [ ] API Key implementiert (empfohlen)
- [ ] Rate Limiting aktiviert (empfohlen)
- [ ] HTTPS eingerichtet (sehr empfohlen)
- [ ] Backups regelmäßig erstellt

## 🚀 Vercel Deployment Commands

```bash
# Lokal testen
npm run build
npm run preview

# Auf Vercel deployen
vercel

# Production Deploy
vercel --prod

# Environment Variable setzen
vercel env add VITE_API_URL
# Dann: http://www.mark-tietz.duckdns.org:3001
```

## 📞 Hilfe

Bei Problemen:
1. Prüfe Server-Logs (PowerShell wo Server läuft)
2. Teste API direkt: `http://www.mark-tietz.duckdns.org:3001/api/health`
3. Prüfe Browser Console (F12) für Fehler
4. Schaue Vercel Build Logs an

## ✨ Fertig!

Wenn alles läuft:
- ✅ Server erreichbar von überall
- ✅ Frontend auf Vercel (optional)
- ✅ Automatische Deploys bei Git Push
- ✅ Alle Geräte synchronisiert
- ✅ Funktioniert weltweit!

Viel Erfolg! 🌍🚀

