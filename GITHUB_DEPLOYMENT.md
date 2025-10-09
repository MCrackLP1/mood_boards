# 🚀 GitHub Deployment Guide

## Schritt-für-Schritt: Code auf GitHub hochladen

### 1. GitHub Repository erstellen

**A) Auf GitHub.com:**

1. Gehe zu https://github.com
2. Logge dich ein (oder erstelle Account)
3. Klicke auf **"New"** (grüner Button oben links)
4. Repository-Einstellungen:
   ```
   Repository name:  moodboard-app
   Description:      Moodboard Webapp mit eigener Server-Synchronisation
   Visibility:       Private (empfohlen) oder Public
   
   ⚠️ NICHT auswählen:
   - Add a README file
   - Add .gitignore
   - Choose a license
   ```
5. Klicke **"Create repository"**

### 2. Git lokal einrichten

**A) Git initialisieren (falls noch nicht gemacht):**

```powershell
# Im Projekt-Ordner
git init
```

**B) Dateien hinzufügen:**

```powershell
# Alle Dateien zum Commit hinzufügen
git add .

# Status prüfen (optional)
git status
```

**C) Ersten Commit erstellen:**

```powershell
git commit -m "Initial commit: Moodboard App mit Server-Synchronisation"
```

### 3. Mit GitHub verbinden

**A) Remote Repository hinzufügen:**

Ersetze `DEIN_USERNAME` mit deinem GitHub-Nutzernamen:

```powershell
git remote add origin https://github.com/DEIN_USERNAME/moodboard-app.git
```

**Beispiel:**
```powershell
git remote add origin https://github.com/marktietz/moodboard-app.git
```

**B) Prüfen ob korrekt:**

```powershell
git remote -v
# Sollte zeigen:
# origin  https://github.com/DEIN_USERNAME/moodboard-app.git (fetch)
# origin  https://github.com/DEIN_USERNAME/moodboard-app.git (push)
```

### 4. Auf GitHub pushen

```powershell
# Main Branch erstellen und pushen
git branch -M main
git push -u origin main
```

**Falls Authentifizierung benötigt:**
- GitHub fragt nach Username und Password
- **WICHTIG**: Statt Passwort brauchst du ein **Personal Access Token**

**Personal Access Token erstellen:**
1. GitHub → Settings (dein Profil) → Developer settings
2. Personal access tokens → Tokens (classic)
3. "Generate new token" → "Generate new token (classic)"
4. Name: `Moodboard App`
5. Scopes auswählen: `repo` (alle Häkchen)
6. "Generate token"
7. **Kopiere das Token sofort** (wird nur einmal angezeigt!)
8. Nutze dieses Token statt Passwort beim Push

### 5. Prüfen ob erfolgreich

1. Gehe zu deinem GitHub Repository
2. Du solltest alle Dateien sehen
3. README.md wird automatisch angezeigt

✅ **Fertig!** Dein Code ist auf GitHub!

## 🔄 Zukünftige Updates

Nach Änderungen:

```powershell
# 1. Änderungen hinzufügen
git add .

# 2. Commit mit Beschreibung
git commit -m "Beschreibung der Änderung"

# 3. Auf GitHub pushen
git push
```

**Beispiele für Commit-Messages:**
```powershell
git commit -m "feat: Add new image filter"
git commit -m "fix: Repair upload button"
git commit -m "docs: Update README"
git commit -m "style: Improve mobile layout"
```

## 🌐 Vercel mit GitHub verbinden

Nach GitHub-Upload kannst du jetzt auf Vercel deployen:

### Schritt 1: Vercel Dashboard

1. Gehe zu https://vercel.com
2. "Sign Up" mit GitHub-Account
3. Erlaube Vercel Zugriff auf deine Repositories

### Schritt 2: Projekt importieren

1. Vercel Dashboard → **"Add New..."** → "Project"
2. "Import Git Repository"
3. Wähle dein `moodboard-app` Repository
4. **"Import"**

### Schritt 3: Konfiguration

Vercel erkennt automatisch dass es ein Vite-Projekt ist.

**Build & Development Settings:**
- Framework Preset: **Vite** (automatisch erkannt)
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅
- Install Command: `npm install` ✅

**Environment Variables:**

Klicke auf **"Environment Variables"** und füge hinzu:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `http://www.mark-tietz.duckdns.org:3001` |

**Für welche Environments?**
- ✅ Production
- ✅ Preview
- ✅ Development

### Schritt 4: Deploy!

1. Klicke **"Deploy"**
2. Warte 1-2 Minuten
3. 🎉 **Deine App ist live!**

Du bekommst eine URL wie: `https://moodboard-app-xyz.vercel.app`

## 🔄 Automatische Deploys

**Ab jetzt:**

Jeder `git push` → Automatischer Deploy auf Vercel! 🚀

```powershell
# Code ändern
git add .
git commit -m "Update feature"
git push

# → Vercel deployed automatisch
# → Neue Version live in 1-2 Minuten
```

**Preview Deployments:**

Wenn du einen neuen Branch erstellst:

```powershell
git checkout -b feature/new-design
git push origin feature/new-design

# → Vercel erstellt Preview-URL
# → Test ohne Production zu beeinflussen
```

## 📁 Was wird NICHT hochgeladen?

Dank `.gitignore` werden folgende Dateien **nicht** auf GitHub hochgeladen:

- ❌ `node_modules/` - Dependencies (zu groß)
- ❌ `.env` - Deine lokalen Einstellungen (privat!)
- ❌ `server/data/` - Datenbank (bleibt lokal)
- ❌ `dist/` - Build-Output (wird auf Vercel neu gebaut)
- ❌ `.vercel/` - Vercel-Konfiguration (lokal)

✅ `.env.example` **WIRD** hochgeladen (als Vorlage)

## 🔐 Sicherheit

### ⚠️ NIEMALS committen:

- ❌ `.env` Datei mit echten API Keys
- ❌ Passwörter oder Tokens
- ❌ Datenbank mit Nutzerdaten
- ❌ Private Keys

### ✅ Immer committen:

- ✅ Quellcode (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Konfigurationsdateien (`package.json`, `vite.config.ts`)
- ✅ `.env.example` (ohne echte Werte!)
- ✅ Dokumentation (`.md` Dateien)

### Wenn du aus Versehen Secrets committed hast:

```powershell
# SOFORT alle betroffenen Secrets ändern!
# API Keys regenerieren
# Passwörter ändern

# Dann aus Git History entfernen (kompliziert)
# Besser: Neues Repository erstellen
```

## 📊 Repository-Struktur auf GitHub

```
moodboard-app/
├── src/                  # Frontend-Code
├── server/              # Backend-Code
├── public/              # Statische Dateien
├── docs/                # Dokumentation
├── .github/             # GitHub Actions (optional)
├── .gitignore           # Ignorierte Dateien
├── package.json         # Dependencies
├── vercel.json          # Vercel-Konfiguration
├── README.md            # Projekt-Beschreibung
└── ...
```

## 🚀 GitHub Actions (Optional)

Automatische Tests bei jedem Push:

Erstelle `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      - run: npm test
```

## 📝 Gute README.md erstellen

Deine `README.md` ist bereits gut, aber du könntest hinzufügen:

```markdown
## 🌐 Live Demo

**Frontend:** https://moodboard-app-xyz.vercel.app
**API:** http://www.mark-tietz.duckdns.org:3001/api

## 🚀 Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/DEIN_USERNAME/moodboard-app.git

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 📸 Screenshots

[Füge Screenshots hinzu]
```

## 🐛 Troubleshooting

### "fatal: remote origin already exists"

```powershell
# Remote entfernen und neu hinzufügen
git remote remove origin
git remote add origin https://github.com/DEIN_USERNAME/moodboard-app.git
```

### "Permission denied"

- Nutze Personal Access Token statt Passwort
- Oder richte SSH Key ein (siehe GitHub Docs)

### "Failed to push some refs"

```powershell
# Erst pullen, dann pushen
git pull origin main --rebase
git push origin main
```

### "Large files detected"

Datei ist zu groß (>100MB):

```powershell
# Aus Git entfernen
git rm --cached pfad/zur/datei

# Zu .gitignore hinzufügen
echo "pfad/zur/datei" >> .gitignore

# Neu committen
git add .gitignore
git commit -m "Remove large file"
git push
```

### Falsches Repo verbunden

```powershell
# Aktuelles Remote prüfen
git remote -v

# Ändern
git remote set-url origin https://github.com/NEUER_USERNAME/neues-repo.git
```

## 📚 Git Basics

### Wichtigste Commands

```powershell
# Status anzeigen
git status

# Änderungen anzeigen
git diff

# Commit-Historie
git log

# Branch wechseln
git checkout branch-name

# Neuen Branch erstellen
git checkout -b neuer-branch

# Branches anzeigen
git branch

# Branch mergen
git merge branch-name

# Letzten Commit rückgängig
git reset --soft HEAD~1

# Alle Änderungen verwerfen (VORSICHT!)
git reset --hard HEAD
```

### Git Workflow

```
1. Code ändern
   ↓
2. git add .
   ↓
3. git commit -m "message"
   ↓
4. git push
   ↓
5. Vercel deployed automatisch
```

## ✅ Checkliste

**Vor dem ersten Push:**
- [ ] `.gitignore` erstellt
- [ ] `.env` zu `.gitignore` hinzugefügt
- [ ] `.env.example` mit Platzhaltern erstellt
- [ ] Keine Secrets im Code
- [ ] README.md aktuell

**GitHub Setup:**
- [ ] Repository erstellt
- [ ] Git initialisiert (`git init`)
- [ ] Remote hinzugefügt (`git remote add origin ...`)
- [ ] Erster Commit gemacht
- [ ] Auf GitHub gepushed

**Vercel Setup:**
- [ ] Mit GitHub verbunden
- [ ] Projekt importiert
- [ ] Environment Variables gesetzt
- [ ] Deployed
- [ ] URL funktioniert

## 🎉 Fertig!

Dein Code ist jetzt auf GitHub und Vercel:

**GitHub:** `https://github.com/DEIN_USERNAME/moodboard-app`  
**Vercel:** `https://moodboard-app-xyz.vercel.app`

**Workflow ab jetzt:**

```powershell
git add .
git commit -m "Update"
git push
# → Automatisch auf Vercel deployed! 🚀
```

Viel Erfolg! 🌟

