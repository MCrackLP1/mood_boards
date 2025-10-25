<!-- 8387cc1f-68d8-487f-b8be-21bdceb1c520 43495e12-8c53-452e-a547-b28c5de5d9aa -->
# Mood-Board Web-App mit Zeitleiste

## Technologie-Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Datenbank**: Vercel Postgres (nativ integriert)
- **Bild-Speicherung**: Vercel Blob Storage (nativ integriert)
- **Styling**: Tailwind CSS + Framer Motion (für Animationen)
- **Drag & Drop**: @dnd-kit/core
- **Deployment**: Vercel

## Projektstruktur

```
mood_boards/
├── app/
│   ├── page.tsx (Dashboard mit Board-Übersicht)
│   ├── board/[id]/page.tsx (Einzelnes Board mit Zeitleiste)
│   ├── api/
│   │   ├── boards/route.ts
│   │   ├── items/route.ts
│   │   └── upload/route.ts
│   └── layout.tsx
├── components/
│   ├── BoardCard.tsx
│   ├── Timeline.tsx
│   ├── TimelineItem.tsx (Notizen/Bilder)
│   ├── DraggableItem.tsx
│   └── CreateBoardModal.tsx
├── lib/
│   ├── db.ts (Postgres Client)
│   └── types.ts
└── package.json
```

## Datenbankschema (Vercel Postgres)

### Tabelle: `boards`

- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255))
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

### Tabelle: `timeline_items`

- `id` (SERIAL PRIMARY KEY)
- `board_id` (INTEGER, FOREIGN KEY -> boards.id)
- `type` (VARCHAR(10): 'note' | 'image')
- `content` (TEXT für Notizen, blob_url für Bilder)
- `position_y` (INTEGER, Position auf Zeitleiste)
- `position_x` (INTEGER, horizontale Position)
- `created_at` (TIMESTAMP DEFAULT NOW())

## Implementierungsschritte

### 1. Projekt-Setup

- Next.js Projekt initialisieren mit TypeScript und Tailwind
- Dependencies installieren (@vercel/postgres, @vercel/blob, Framer Motion, @dnd-kit/core)
- Basis-Struktur für App Router erstellen

### 2. Vercel Postgres Konfiguration

- `@vercel/postgres` SDK installieren
- Datenbank-Client in `lib/db.ts` einrichten
- SQL-Schema für Tabellen erstellen
- Migrations-Skript für initiale Tabellen

### 3. Vercel Blob Storage Setup

- `@vercel/blob` SDK installieren
- Upload-API-Route erstellen (`/api/upload`)
- Multipart-Form-Daten handling

### 4. Dashboard-Seite (Homepage)

- Board-Übersicht mit Grid-Layout
- "Neues Board erstellen"-Button
- Modal für Board-Erstellung
- Cinematischer Fade-In-Effekt beim Laden
- API-Integration zum Laden aller Boards

### 5. Board-Detail-Seite mit Zeitleiste

- Vertikale Zeitleiste im Hintergrund (cinematisch einglendet)
- Parallax-Effekt beim Scrollen
- Leere Zeitleiste initial anzeigen
- Header mit Board-Titel
- Items aus Datenbank laden und anzeigen

### 6. Drag & Drop für Bilder

- Dropzone für Bild-Upload (gesamte Seite)
- Upload zu Vercel Blob via API
- @dnd-kit für Drag & Drop zum Verschieben
- Position-Update via API
- Visual Feedback beim Dragging

### 7. Notizen-Funktion

- "Notiz hinzufügen"-Button (floating action button)
- Inline-Textfeld für Notizen
- Drag & Drop zum Verschieben von Notizen
- Auto-Save beim Bearbeiten (debounced)
- Delete-Button bei Hover

### 8. Cinematisches Design

- Gradient-Hintergründe mit Animationen
- Smooth Scroll-Behavior
- Fade-in/Slide-in Animationen für Items (Framer Motion)
- Hover-Effekte mit Elevation
- Glassmorphism-Effekte für Cards
- Dark Theme mit lila/blauen Akzenten

### 9. API-Routes

- `POST /api/boards` - Neues Board erstellen
- `GET /api/boards` - Alle Boards abrufen
- `GET /api/boards/[id]` - Board mit Items laden
- `POST /api/items` - Item hinzufügen
- `PATCH /api/items/[id]` - Position/Content aktualisieren
- `DELETE /api/items/[id]` - Item löschen
- `POST /api/upload` - Bild-Upload zu Vercel Blob

### 10. Teilen-Funktion

- Jedes Board hat eine öffentliche URL (`/board/[id]`)
- Copy-Link-Button mit Clipboard API
- Toast-Notification beim Kopieren
- Optional: Open Graph Meta-Tags

### 11. Git & Deployment

- Git Repository initialisieren
- `.gitignore` erstellen (node_modules, .env.local, .next)
- `.env.example` für benötigte Umgebungsvariablen
- README mit Setup- und Deployment-Anleitung
- Erster Commit mit kompletter Funktionalität
- Push zu GitHub: https://github.com/MCrackLP1/mood_boards.git
- Vercel automatisch mit GitHub verbinden

## Design-Features (Cinematisch)

- Dunkler Modus als Standard mit Gradient-Akzenten (lila/blau/pink)
- Smooth Transitions (300-500ms) überall
- Parallax-Scrolling auf der Zeitleiste
- Blur-Effekte im Hintergrund
- Staggered Animations beim Laden von Items
- Glow-Effekte bei Hover
- Animated Gradient Background

## Wichtige Hinweise

- Vercel Postgres und Blob benötigen Vercel-Deployment für volle Funktionalität
- Lokale Entwicklung: Vercel CLI verwenden (`vercel dev`)
- Umgebungsvariablen werden automatisch von Vercel bereitgestellt nach Setup

### To-dos

- [ ] Next.js Projekt mit TypeScript, Tailwind CSS und Dependencies initialisieren
- [ ] Supabase Projekt erstellen, Datenbank-Schema und Storage konfigurieren
- [ ] Dashboard mit Board-Übersicht und Create-Modal implementieren
- [ ] Board-Detail-Seite mit vertikaler Zeitleiste und cinematischen Animationen
- [ ] Bild-Upload und Drag & Drop Funktionalität für Bilder
- [ ] Notizen hinzufügen, bearbeiten und verschieben
- [ ] Alle API-Endpunkte für CRUD-Operationen implementieren
- [ ] Git initialisieren und ersten Commit zu GitHub pushen