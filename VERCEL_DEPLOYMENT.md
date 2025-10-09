# 🚀 Vercel Deployment Guide

## Übersicht

**Frontend** (Moodboard App) → Vercel (kostenlos)  
**Backend** (API Server) → Dein Home Server (DuckDNS)

```
Frontend (Vercel):        https://moodboard.vercel.app
Backend (Dein Server):    http://www.mark-tietz.duckdns.org:3001
```

## Warum Vercel?

✅ **Kostenlos** - Hobby Plan ist gratis  
✅ **Schnell** - CDN weltweit  
✅ **Automatisch** - Git Push → Deploy  
✅ **HTTPS** - SSL Zertifikat inklusive  
✅ **Preview** - Jeder Branch bekommt Preview-URL  
✅ **Zero Config** - Erkennt Vite automatisch  

## 🎯 Schnellstart

### Option 1: Mit GitHub (empfohlen)

**Schritt 1: GitHub Repository erstellen**

```bash
# Falls noch nicht gemacht:
git init
git add .
git commit -m "Initial commit"

# GitHub Repo erstellen auf github.com
# Dann:
git remote add origin https://github.com/deinname/moodboard.git
git push -u origin main
```

**Schritt 2: Vercel verbinden**

1. Gehe zu https://vercel.com
2. "Sign Up" mit GitHub
3. "Import Project"
4. Wähle dein Repository
5. **Wichtig**: Environment Variable hinzufügen:
   ```
   VITE_API_URL = http://www.mark-tietz.duckdns.org:3001
   ```
6. "Deploy" klicken

**Fertig!** Nach 1-2 Minuten ist deine App live!

### Option 2: Mit Vercel CLI

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Fragen beantworten:
# → Set up and deploy: Yes
# → Project name: moodboard-app
# → Directory: ./
# → Override settings: No

# 4. Environment Variable hinzufügen (im Browser)
# Vercel Dashboard → Settings → Environment Variables
# VITE_API_URL = http://www.mark-tietz.duckdns.org:3001

# 5. Redeploy
vercel --prod
```

## ⚙️ Konfiguration

### vercel.json (bereits erstellt)

Die Datei `vercel.json` ist bereits konfiguriert:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment Variables

**In Vercel Dashboard:**

1. Projekt → Settings → Environment Variables
2. Füge hinzu:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `http://www.mark-tietz.duckdns.org:3001` |

**Für alle Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Wichtig**: Nach dem Hinzufügen → Redeploy auslösen!

### Build Settings

Sollten automatisch erkannt werden:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (automatisch)

## 🔄 Deployment Workflow

### Automatische Deploys

Wenn GitHub verbunden ist:

```bash
# Änderungen machen
git add .
git commit -m "Update feature"
git push

# → Vercel deployed automatisch!
# → Neue URL: https://moodboard-xxx.vercel.app
```

**Production vs Preview:**
- `main` Branch → Production (`https://moodboard.vercel.app`)
- Andere Branches → Preview (`https://moodboard-git-feature.vercel.app`)

### Manuelle Deploys

```bash
# Preview Deploy
vercel

# Production Deploy
vercel --prod
```

## 🧪 Testen

### Lokal testen (vor Deploy)

```bash
# Production Build
npm run build

# Preview lokal
npm run preview

# Öffne: http://localhost:4173
```

Teste:
- ✅ API-Verbindung funktioniert
- ✅ Boards laden
- ✅ Bilder hochladen
- ✅ Alles speichert

### Nach Vercel Deploy testen

1. Öffne deine Vercel URL
2. Browser Console öffnen (F12)
3. Schaue nach Fehlern
4. Teste API-Calls im Network Tab

## 🐛 Troubleshooting

### Build fehlgeschlagen

**Problem**: `Build failed`

**Lösung**:
1. Schaue Build Logs in Vercel Dashboard
2. Häufige Fehler:
   - TypeScript Errors → Lokal fixen
   - Missing dependencies → `package.json` prüfen
   - Environment Variables fehlen → In Vercel setzen

**Lokal testen:**
```bash
npm run build
```

### API-Calls funktionieren nicht

**Problem**: `Failed to fetch` oder CORS-Fehler

**Lösung**:
1. ✅ Prüfe `VITE_API_URL` in Vercel
2. ✅ Server läuft? Test: http://www.mark-tietz.duckdns.org:3001/api/health
3. ✅ CORS aktiviert? (Sollte sein, siehe `server/src/server.js`)
4. ✅ Browser Console zeigt konkrete Fehler

**Test API direkt:**
```bash
curl http://www.mark-tietz.duckdns.org:3001/api/health
```

### Environment Variable nicht gesetzt

**Problem**: App nutzt falsche API URL

**Lösung**:
1. Vercel Dashboard → Settings → Environment Variables
2. Prüfe ob `VITE_API_URL` gesetzt ist
3. **Wichtig**: Für alle Environments setzen
4. Redeploy auslösen: Deployments → ⋯ → Redeploy

### "This Deployment is currently unreachable"

**Problem**: Deploy war erfolgreich aber Seite lädt nicht

**Lösung**:
1. Warte 1-2 Minuten (Propagierung)
2. Leere Browser-Cache (Strg+Shift+R)
3. Vercel Status prüfen: https://www.vercel-status.com

### Build zu langsam

**Problem**: Build dauert sehr lange

**Lösung**:
1. Dependencies optimieren
2. Vercel Analytics deaktivieren (optional)
3. Build Command optimieren

## 📊 Vercel Dashboard

### Wichtige Bereiche

**Deployments**
- Alle Deploys sehen
- Logs anschauen
- Rollback zu älteren Versionen

**Analytics** (optional, bezahlt)
- Page Views
- Performance
- User Insights

**Settings**
- Environment Variables
- Domains
- Git Integration
- Build & Development Settings

## 🌐 Custom Domain (optional)

### Eigene Domain verbinden

1. Vercel Dashboard → Settings → Domains
2. Domain hinzufügen (z.B. `moodboard.mark-tietz.com`)
3. DNS Records setzen (bei deinem Domain-Provider):
   ```
   Type: CNAME
   Name: moodboard
   Value: cname.vercel-dns.com
   ```
4. Warten (kann 24h dauern)

### Subdomain nutzen

Wenn du `mark-tietz.com` besitzt:
- `app.mark-tietz.com` → Vercel (Frontend)
- `api.mark-tietz.com` → Dein Server (Backend)

## 🔒 Sicherheit

### HTTPS

✅ Automatisch von Vercel bereitgestellt!  
✅ Kostenlose SSL-Zertifikate  
✅ Automatische Renewal  

### Environment Variables

⚠️ **Wichtig**: Niemals Secrets in Code committen!

**Gut:**
```typescript
const API_URL = import.meta.env.VITE_API_URL; // ✅
```

**Schlecht:**
```typescript
const API_URL = 'http://www.mark-tietz.duckdns.org:3001'; // ❌
```

### API Key (empfohlen)

Wenn API öffentlich ist, nutze API Key:

1. In `VITE_API_KEY` setzen (Vercel)
2. In Backend prüfen
3. Siehe: `server/INTERNET_ZUGRIFF.md` → Sicherheit

## 📈 Performance

### Optimierung

**Automatisch von Vercel:**
- ✅ CDN weltweit
- ✅ Compression (gzip/brotli)
- ✅ Image Optimization (optional)
- ✅ Caching

**Manuell optimieren:**
```typescript
// Code Splitting
const LazyComponent = lazy(() => import('./Component'));

// Tree Shaking (automatisch mit Vite)
import { specific } from 'library';

// Bundle Size prüfen
npm run build -- --analyze
```

### Lighthouse Score

Test deine App:
1. Chrome DevTools → Lighthouse
2. "Generate Report"
3. Ziel: >90 in allen Kategorien

## 🚀 CI/CD Pipeline

Mit GitHub und Vercel hast du automatisch:

```
Developer
    ↓
  git push
    ↓
  GitHub
    ↓
 Webhook
    ↓
  Vercel
    ↓
Build & Test
    ↓
   Deploy
    ↓
    CDN
    ↓
  Live! 🎉
```

**Dauer**: ~1-2 Minuten vom Push bis Live

## 📱 Preview Deployments

Jeder Pull Request bekommt eigene URL:

```bash
# Feature Branch erstellen
git checkout -b feature/new-design
git push origin feature/new-design

# → Vercel erstellt Preview:
# https://moodboard-git-feature-new-design.vercel.app
```

**Nutzen:**
- Teste Features vor Merge
- Teile mit Kollegen/Kunden
- Kein Einfluss auf Production

## 🎯 Best Practices

### Deployment Checklist

Vor jedem Deploy:
- [ ] Lokal getestet (`npm run build && npm run preview`)
- [ ] Keine Console Errors
- [ ] API-Verbindung funktioniert
- [ ] Tests laufen durch (falls vorhanden)
- [ ] Linter-Fehler behoben

### Git Workflow

```bash
# 1. Feature Branch
git checkout -b feature/xyz

# 2. Entwickeln & Committen
git add .
git commit -m "feat: add xyz"

# 3. Push → Preview Deploy
git push origin feature/xyz

# 4. Testen auf Preview URL

# 5. Merge in main → Production Deploy
git checkout main
git merge feature/xyz
git push origin main
```

### Environment-spezifische Configs

```typescript
// config.ts
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  debug: isDevelopment,
  analytics: isProduction,
};
```

## 📝 Commands Übersicht

```bash
# Lokal
npm run dev              # Development Server
npm run build           # Production Build
npm run preview         # Preview Build lokal

# Vercel CLI
vercel login            # Einmalig: Login
vercel                  # Preview Deploy
vercel --prod          # Production Deploy
vercel env ls          # Environment Variables anzeigen
vercel env add         # Environment Variable hinzufügen
vercel logs            # Live Logs anschauen
vercel domains         # Domains verwalten
vercel rollback        # Zu vorherigem Deploy zurück

# Git
git push               # Deploy auslösen (auto)
git push origin main   # Production Deploy
git push origin feat   # Preview Deploy
```

## ✨ Vorteile dieser Setup

**Frontend auf Vercel:**
- ✅ Kostenlos
- ✅ Schnell (CDN)
- ✅ HTTPS inklusive
- ✅ Automatische Deploys
- ✅ Preview URLs
- ✅ Zero Downtime
- ✅ Rollback möglich

**Backend auf Home Server:**
- ✅ Volle Kontrolle
- ✅ Unbegrenzter Speicher
- ✅ Keine Kosten
- ✅ Private Daten
- ✅ Eigene Domain (DuckDNS)

## 🎉 Fertig!

Deine App ist jetzt live auf Vercel:

```
Frontend:  https://dein-projekt.vercel.app
Backend:   http://www.mark-tietz.duckdns.org:3001
```

**Nächste Schritte:**
1. Teste die Live-App
2. Teile die URL
3. Custom Domain hinzufügen (optional)
4. Analytics aktivieren (optional)

Bei Fragen: Vercel Docs → https://vercel.com/docs

Viel Erfolg! 🚀

