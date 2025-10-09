# Moodboard Webapp

Eine minimalistische, private Moodboard-Webapp für Fotografen mit **Geräte-Synchronisation**.

## 🆕 Neu: Geräte-übergreifende Synchronisation + Internet-Zugriff

**Alle deine Moodboards auf allen Geräten - überall im Internet!** 
- ✅ **Windows Home Server Backend** - Deine eigene Cloud-Lösung
- ✅ **Internet-Zugriff** - Via DuckDNS von überall erreichbar
- ✅ **Vercel Frontend** - Kostenlos, schnell, HTTPS inklusive
- ✅ **Automatische Sync** - Desktop, Handy, Tablet immer synchron
- ✅ **100% privat** - Backend läuft auf deinem Server
- ✅ **Kostenlos** - Keine Cloud-Gebühren

**API URL**: `http://www.mark-tietz.duckdns.org:3001/api`

👉 **[Lokales Setup](./SYNC_SETUP_GUIDE.md)** - Nur im lokalen Netzwerk  
👉 **[Internet Setup](./INTERNET_UND_VERCEL_SETUP.md)** - Von überall erreichbar + Vercel

## ✨ Features

### Übersicht (Home)
- Grid-Ansicht aller Moodboards mit Vorschaubildern
- Erstellen, Duplizieren und Löschen von Boards
- Geräte-übergreifende Synchronisation über eigenen Server

### Board-Editor
- **Strukturierte Bereiche**: 3 feste Sections (✨ Beispielbilder, 📍 Location, 📋 Allgemein)
- **Text & Bilder kombiniert**: Notizen und Bilder pro Section
- **Mediathek mit Ordnern**: Organisiere Bilder in Kategorien - 5 Standard-Ordner + eigene
- **Web-Bildsuche**: Suche & Import von Bildern direkt aus Unsplash, Pexels & Pixabay
- **Multi-Select**: Mehrere Bilder auf einmal auswählen und hinzufügen
- **Automatische Farbextraktion**: 5-8 dominante Farben pro Bild
- **Inline-Notizen**: Bearbeitbare Text-Notizen pro Section
- **Auto-Save**: Änderungen werden automatisch gespeichert
- **Einstellungen**: Board-Titel und Willkommenstext anpassen

### Kundenansicht (Read-Only)
- Öffentlicher, nicht gelisteter Link (`#/view/{id}`)
- **Willkommensanimation**: Dezente Animation mit Branding und personalisiertem Text
- **Ambient Sound** (optional): Audio-Player mit Lautstärkeregler
- **Passwortschutz** (optional): Einfacher clientseitiger Schutz
- **Branding-Signatur**: "by Mark Tietz Fotografie" (toggelbar)
- **Smooth Scrolling**: Sanfte Scroll-Animationen und Fade-Ins

### Audio-Provider-System
Provider-basierte Architektur für Ambient Sounds:
- **Pixabay Sounds** (CC0)
- **Freesound.org** (CC-Lizenzen)
- **Fallback**: Lokale Audio-Dateien oder kein Sound

## 🚀 Setup

### Option 1: Mit Server-Synchronisation (Empfohlen)

Für geräteübergreifende Synchronisation auf deinem Windows Home Server:

1. **Server einrichten** (siehe [SYNC_SETUP_GUIDE.md](./SYNC_SETUP_GUIDE.md))
   ```powershell
   cd server
   npm install
   npm start
   ```

2. **Frontend installieren**
   ```bash
   npm install
   ```

3. **Server-URL konfigurieren** (`.env`)
   ```
   VITE_API_URL=http://192.168.1.100:3001
   ```

4. **App bauen**
   ```bash
   npm run build
   ```

**Detaillierte Anleitung**: [SYNC_SETUP_GUIDE.md](./SYNC_SETUP_GUIDE.md)

### Option 2: Standalone (nur lokaler Browser)

Für lokale Nutzung ohne Synchronisation:

```bash
npm install
npm run dev
```

> **Hinweis**: Im Standalone-Modus werden Daten nur lokal im Browser gespeichert (IndexedDB)

### Umgebungsvariablen

Kopiere `.env.example` zu `.env` und füge optional API-Keys hinzu:

```bash
# Image Search Provider API Keys (optional)
VITE_IMAGE_UNSPLASH_KEY=your_key_here
VITE_IMAGE_PEXELS_KEY=your_key_here
VITE_IMAGE_PIXABAY_KEY=your_key_here

# Audio Provider API Keys (optional)
VITE_AUDIO_PIXABAY_KEY=your_key_here
VITE_AUDIO_FREESOUND_KEY=your_key_here

# Public Base URL (für Share-Links)
VITE_PUBLIC_BASE_URL=http://localhost:3000
```

#### API-Keys erhalten (kostenlos):
- **Unsplash**: https://unsplash.com/developers (50 requests/Stunde gratis)
- **Pexels**: https://www.pexels.com/api/ (200 requests/Stunde gratis)
- **Pixabay**: https://pixabay.com/api/docs/ (Keine Limits, CC0-Lizenz)

> **Hinweis**: Ohne API-Keys funktioniert die App vollständig, nur Web-Bildsuche und Audio-Features sind deaktiviert.

## 🛠️ Development

```bash
# Dev-Server starten (http://localhost:3000)
npm run dev

# Build für Produktion
npm run build

# Preview des Production-Builds
npm run preview

# Tests ausführen
npm test
```

## 📁 Projektstruktur

```
src/
├── modules/           # Kern-Module (isoliert, wiederverwendbar)
│   ├── boards/       # Board CRUD & State Management
│   ├── assets/       # Bild-Upload & Farbextraktion
│   ├── audio/        # Audio-Provider-System
│   ├── database/     # IndexedDB Setup (Dexie)
│   ├── ui/           # Primitive UI-Komponenten
│   └── utils/        # Utilities (ID, Hash, etc.)
├── components/       # Feature-spezifische Komponenten
├── pages/            # Seiten (Home, BoardEditor, CustomerView)
├── types/            # TypeScript-Typen
├── App.tsx           # Main App & Routing
└── main.tsx          # Entry Point
```

## 🎨 Technologie-Stack

- **Framework**: Vite + React + TypeScript
- **State Management**: Zustand (minimal, performant)
- **Storage**: Dexie.js (IndexedDB-Wrapper)
- **Styling**: CSS Modules (keine externe Dependency)
- **Testing**: Vitest
- **Build**: Vite (schnell, ESNext)

## 🔗 Routing

Die App nutzt Hash-basiertes Routing (keine externe Router-Library):

- `/` oder `#/` → Home (Übersicht)
- `#/board/{id}` → Board-Editor
- `#/view/{id}` → Kundenansicht (Read-Only)

## 🔒 Sicherheit

**Hinweis**: Der Passwortschutz ist eine clientseitige Lösung (SHA-256 Hash) und bietet nur grundlegenden Schutz. Für sensible Daten sollte eine serverseitige Authentifizierung implementiert werden.

## 🌐 Deployment

Die App ist statisch und kann auf jedem Hosting deployed werden:

### Vercel
```bash
npm run build
# Deploye den dist/-Ordner
```

### Netlify
```bash
npm run build
# Deploye den dist/-Ordner
```

### GitHub Pages
```bash
npm run build
# Deploye den dist/-Ordner zu gh-pages branch
```

## 🎯 Verwendung

### Board erstellen
1. Auf "Neues Board" klicken
2. Titel eingeben
3. Board öffnet sich automatisch im Editor

### Bilder hochladen
1. Bilder per Drag & Drop in die Upload-Zone ziehen
2. Oder "Bilder auswählen" Button verwenden
3. Farbpalette wird automatisch extrahiert

### Farb-Filter nutzen
1. Auf eine Farb-Swatch klicken
2. Bilder mit ähnlicher Farbe werden hervorgehoben
3. Nochmal klicken zum Zurücksetzen

### Board teilen
1. Im Editor auf "Teilen" klicken
2. Link wird in Zwischenablage kopiert
3. Link an Kunden senden

### Board-Einstellungen
1. Im Editor auf "Einstellungen" klicken
2. Titel und Willkommenstext anpassen
3. Optional: Passwort setzen (TODO: Feature implementieren)

## 📝 TODOs & Erweiterungen

Siehe `TASKS.md` für:
- Geplante Features
- Bekannte Einschränkungen
- Verbesserungsmöglichkeiten
- Erweiterungspunkte

## 🧪 Tests

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Mode
npm test -- --watch

# Tests mit UI
npm run test:ui
```

Aktuell getestet:
- ✅ Color Extraction (Ähnlichkeitsberechnung)
- ✅ Password Hashing (SHA-256)

## 🤝 Beitragen

Das Projekt ist optimiert für AI-Editierbarkeit:
- Kleine, sprechende Module
- JSDoc/TSDoc an Public-Funktionen
- Klare Kommentare (Warum, nicht nur Was)
- Sinnvolle Dateinamen, keine God-Files

## 📄 Lizenz

Privates Projekt für Mark Tietz Fotografie.

---

**Entwickelt mit ❤️ für minimalistische und schöne UX.**

