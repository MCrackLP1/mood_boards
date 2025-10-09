# Architektur-Dokumentation

Detaillierte Dokumentation der Moodboard-Webapp Architektur.

## 🏗️ Technologie-Entscheidungen

### Warum Vite + React?
- **Vite**: Extrem schneller Dev-Server, minimale Konfiguration, ESM-native
- **React**: Große Community, gute DX, stabil, AI-freundlich
- **TypeScript**: Type-Safety, bessere IDE-Unterstützung, selbst-dokumentierender Code

### Warum Zustand statt Redux?
- Minimaler Boilerplate (50% weniger Code)
- Keine Provider-Wrapper nötig
- Direkter Zugriff auf State außerhalb von Components
- Perfekt für kleine-mittlere Apps

### Warum Dexie.js (IndexedDB)?
- Local-First: Funktioniert offline, keine Server-Abhängigkeit
- Große Datenmengen: Bilder als Base64 speicherbar
- Transaktionen: ACID-Garantien für Daten-Integrität
- Erweiterbar: Sync-Adapter später einfach hinzufügbar

### Warum CSS Modules statt Tailwind/Styled-Components?
- Keine externe Dependency
- Volle CSS-Kontrolle ohne Framework-Lernkurve
- Bessere Performance (kein Runtime)
- Scoped Styles ohne Konflikte

## 📂 Modulare Architektur

```
src/
├── modules/              # Kernlogik (framework-agnostic)
│   ├── boards/          # Board State & CRUD
│   ├── assets/          # Bild-Verarbeitung & Farben
│   ├── audio/           # Audio-Provider-System
│   ├── database/        # Datenbank-Layer (Dexie)
│   ├── ui/              # Primitive UI-Komponenten
│   └── utils/           # Utilities (ID, Hash, etc.)
│
├── components/          # Feature-spezifische Komponenten
│   ├── BoardCard.tsx
│   ├── ImageCard.tsx
│   ├── ColorPalette.tsx
│   └── ...
│
├── pages/               # Top-Level Views
│   ├── Home.tsx         # Übersicht
│   ├── BoardEditor.tsx  # Editor
│   └── CustomerView.tsx # Read-Only
│
├── types/               # Zentrale TypeScript-Typen
└── App.tsx              # Routing & App-Shell
```

### Prinzipien

1. **Module sind framework-agnostic**: `modules/` kennt React nicht
2. **Components nutzen Modules**: Unidirektionale Abhängigkeit
3. **Pages orchestrieren**: Kombinieren Components & Module-Logic
4. **Types sind zentral**: Single Source of Truth

## 🔄 Datenfluss

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
IndexedDB Write (via Dexie)
    ↓
Zustand State Update
    ↓
React Re-Render
```

### Beispiel: Bild hochladen

1. User droppt Datei in `BoardEditor`
2. `handleFileUpload()` ruft `processImageFile()` auf
3. `processImageFile()` extrahiert Farben via `extractColors()`
4. Store-Action `addItem()` schreibt zu Dexie
5. State-Update triggert Re-Render
6. `ImageCard` zeigt Bild + Palette

## 🎨 Color-Extraction Algorithmus

### Strategie: Color Quantization

```
1. Image → Canvas → ImageData
2. Pixel → RGB-Tripel
3. Quantize in Buckets (16x16x16 = 4096 Farben)
4. Zähle Pixel pro Bucket
5. Sortiere nach Häufigkeit
6. Return Top N Farben
```

### Performance-Optimierungen
- Downscale zu max 200x200px
- Skip transparente Pixel (alpha < 128)
- Nur Top 6 Farben extrahieren

### Ähnlichkeits-Check
- Euclidean Distance in RGB-Space
- Normalisiert zu 0-1 (max distance = ~441)
- Default threshold: 0.7 (70% Ähnlichkeit)

## 🎵 Audio-Provider-System

### Design-Pattern: Strategy Pattern

```typescript
interface AudioProvider {
  name: string;
  search(query, options): Promise<AudioResult[]>
  getStreamUrl(id): Promise<string>
}
```

### Implementierungen
1. **PixabayAudioProvider**: CC0-Sounds von Pixabay
2. **FreesoundAudioProvider**: CC-lizenzierte Sounds
3. **FallbackAudioProvider**: Lokale Dateien/kein Sound

### Registrierung
```typescript
audioManager = new AudioManager([
  new PixabayAudioProvider(),
  new FreesoundAudioProvider(),
  new FallbackAudioProvider(),
]);
```

### Erweiterung
Neuen Provider hinzufügen:
1. Erstelle `src/modules/audio/providers/spotify.ts`
2. Implementiere `AudioProvider`-Interface
3. Registriere in `audioManager`

## 🔐 Passwortschutz

### Aktuelles System (clientseitig)
1. User setzt Passwort
2. SHA-256 Hash via Web Crypto API
3. Hash in `Board.passwordHash` gespeichert
4. Bei Zugriff: Input-Hash vs. gespeicherter Hash

**⚠️ Limitation**: Hash ist im IndexedDB sichtbar → kein echter Schutz

### Zukünftige Verbesserung
1. Server-Side Authentication
2. JWT-Tokens für Read-Only Links
3. Expiry-Dates für Links

## 🔗 Routing

### Hash-basiertes Routing (kein React Router)

**Warum?**
- Keine zusätzliche Dependency
- Funktioniert ohne Server-Config
- Einfach für statisches Hosting

**Format:**
- `#/` → Home
- `#/board/{id}` → Editor
- `#/view/{id}` → Kundenansicht

**Mechanismus:**
```typescript
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  // Parse & set state
});
```

### Erweiterung zu React Router
Falls gewünscht, später einfach ersetzbar:
```typescript
// Ersetze App.tsx routing logic mit:
import { BrowserRouter, Routes, Route } from 'react-router-dom';
```

## 🧪 Testing-Strategie

### Unit-Tests (Vitest)
- **Color Extraction**: Ähnlichkeitsberechnung
- **Password Hashing**: Hash-Generierung & Verifikation
- **Utils**: ID-Generierung, etc.

### Integration-Tests (TODO)
- Board CRUD-Operationen
- Image Upload Flow
- Store → Database Sync

### E2E-Tests (TODO)
- Playwright/Cypress für User-Flows

## 🚀 Performance-Optimierungen

### Aktuelle Optimierungen
1. **Image Downscaling**: Color-Extraction auf 200x200px
2. **Lazy Imports**: Nicht benötigte Module lazy-loaded
3. **CSS Modules**: Scoped Styles, keine globalen Konflikte
4. **IndexedDB**: Große Datenmengen, async I/O

### Zukünftige Optimierungen (siehe TASKS.md)
1. **Lazy Loading**: Bilder außerhalb Viewport erst bei Scroll
2. **Thumbnails**: Separates Thumbnail-Feld für Vorschaubilder
3. **Service Worker**: Offline-Funktionalität
4. **Code Splitting**: Route-basiertes Splitting

## 📊 Bundle-Analyse

Aktueller Build:
- **CSS**: ~9.5 KB (gzip: 2.5 KB)
- **JS**: ~265 KB (gzip: 87 KB)

### Größte Dependencies
1. React + React-DOM (~130 KB)
2. Dexie.js (~30 KB)
3. Zustand (~3 KB)

### Optimierungspotential
- Tree-shaking aktiviert ✅
- Minification via esbuild ✅
- Gzip-Compression empfohlen ✅

## 🔌 Erweiterungspunkte

### 1. Neue Board-Item-Typen
```typescript
// types/index.ts
type BoardItem = {
  type: 'image' | 'note' | 'video' | 'link';
  // ... type-specific fields
}
```

### 2. Custom Storage Backend
```typescript
// modules/database/adapters/firebase.ts
export class FirebaseAdapter implements StorageAdapter {
  async getBoard(id) { /* Firebase query */ }
  async saveBoard(board) { /* Firebase write */ }
}
```

### 3. Export-Formate
```typescript
// modules/export/pdf.ts
export async function exportAsPDF(board: Board) {
  // jsPDF implementation
}
```

## 🎯 Design-Entscheidungen

### Warum keine Navbar?
- Minimalistischer Fokus auf Content
- Zurück-Button per Browser oder in-page
- Reduziert visuelle Komplexität

### Warum keine Drag & Drop Reordering?
- MVP-Scope: Nice-to-have, nicht kritisch
- Leicht erweiterbar mit react-beautiful-dnd

### Warum clientseitiger Passwortschutz?
- Einfacher MVP ohne Backend
- Ausreichend für nicht-sensible Daten
- Hinweis auf Limitation im Code

## 📝 Code-Konventionen

### Naming
- **Komponenten**: PascalCase (`BoardCard.tsx`)
- **Utilities**: camelCase (`colorExtraction.ts`)
- **Konstanten**: UPPER_SNAKE_CASE (`DEMO_IMAGES`)

### Kommentare
- JSDoc für Public-Funktionen
- Inline-Kommentare für "Warum", nicht "Was"
- TODO-Kommentare für Erweiterungspunkte

### File-Struktur
- Eine Komponente = Eine Datei + CSS Module
- Tests neben Source (`.test.ts`)
- Types zentral in `/types`

## 🔄 CI/CD (Empfehlung)

### GitHub Actions Workflow
```yaml
- name: Build
  run: npm run build
  
- name: Test
  run: npm test
  
- name: Deploy
  uses: vercel/action@v2
```

### Deployment-Targets
- **Vercel**: Zero-Config, optimiert für Vite
- **Netlify**: CDN, Branch-Previews
- **GitHub Pages**: Kostenlos, einfach

---

**Letzte Aktualisierung**: 2024

