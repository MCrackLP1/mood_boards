# Moodboard Webapp

Eine minimalistische, private Moodboard-Webapp für Fotografen.

## ✨ Features

### Übersicht (Home)
- Grid-Ansicht aller Moodboards mit Vorschaubildern
- Erstellen, Duplizieren und Löschen von Boards
- Persistenz via IndexedDB (local-first)

### Board-Editor
- **Drag & Drop Upload**: Bilder per Drag & Drop oder Datei-Dialog hochladen
- **Automatische Farbextraktion**: 5-8 dominante Farben pro Bild
- **Farb-Filter**: Klick auf Farbe hebt Bilder mit ähnlicher Farbdominanz hervor
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

### Voraussetzungen
- Node.js 18+ und npm

### Installation

```bash
npm install
```

### Umgebungsvariablen

Kopiere `.env.example` zu `.env` und füge optional API-Keys hinzu:

```bash
# Audio Provider API Keys (optional)
VITE_AUDIO_PIXABAY_KEY=your_key_here
VITE_AUDIO_FREESOUND_KEY=your_key_here

# Public Base URL (für Share-Links)
VITE_PUBLIC_BASE_URL=http://localhost:3000
```

> **Hinweis**: Ohne API-Keys funktioniert die App vollständig, nur Audio-Features sind deaktiviert.

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

