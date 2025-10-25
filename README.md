# Mood Boards - Cinematische Zeitleisten

Eine moderne Web-App zum Erstellen von Mood Boards mit vertikalen Zeitleisten. Erstelle Boards, füge Bilder und Notizen hinzu und teile deine kreativen Ideen.

## ✨ Features

- 🎨 **Cinematisches Design** - Dunkles Theme mit Gradient-Akzenten
- 📅 **Vertikale Zeitleiste** - Organisiere deine Ideen chronologisch
- 🖼️ **Drag & Drop Bilder** - Einfaches Hochladen von Bildern
- 📝 **Notizen** - Füge Textnotizen zur Zeitleiste hinzu
- 🔗 **Teilen** - Teile deine Boards mit anderen
- 📱 **Responsive** - Funktioniert auf Desktop und Mobile

## 🚀 Technologie-Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Datenbank**: Vercel Postgres
- **Bild-Speicherung**: Vercel Blob Storage
- **Styling**: Tailwind CSS + Framer Motion
- **Drag & Drop**: @dnd-kit/core
- **Deployment**: Vercel

## 📦 Installation & Setup

### 1. Repository klonen

```bash
git clone https://github.com/MCrackLP1/mood_boards.git
cd mood_boards
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen

Die Umgebungsvariablen werden automatisch von Vercel bereitgestellt. Für lokale Entwicklung:

```bash
# Installiere Vercel CLI
npm i -g vercel

# Starte Entwicklungsserver mit Vercel
vercel dev
```

### 4. Datenbank initialisieren

Die Datenbank-Tabellen werden automatisch erstellt, wenn du die App das erste Mal startest.

## 🏗️ Projekt-Struktur

```
mood_boards/
├── app/
│   ├── page.tsx                 # Dashboard mit Board-Übersicht
│   ├── board/[id]/page.tsx      # Einzelnes Board mit Zeitleiste
│   ├── api/
│   │   ├── boards/route.ts      # Board CRUD API
│   │   ├── items/route.ts       # Timeline Items API
│   │   └── upload/route.ts      # Bild-Upload API
│   └── layout.tsx               # Root Layout
├── components/
│   ├── BoardCard.tsx            # Board-Karte für Übersicht
│   ├── Timeline.tsx             # Zeitleiste Komponente
│   ├── TimelineItem.tsx         # Einzelnes Timeline-Item
│   ├── CreateBoardModal.tsx     # Modal zum Erstellen neuer Boards
│   └── ...
├── lib/
│   ├── db.ts                    # Datenbank-Funktionen
│   └── types.ts                 # TypeScript Typen
└── ...
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. **Repository mit Vercel verbinden**
   - Gehe zu [vercel.com](https://vercel.com)
   - Importiere dein GitHub Repository
   - Vercel erkennt automatisch Next.js und konfiguriert alles

2. **Datenbank & Storage einrichten**
   - Vercel Postgres: Wird automatisch aktiviert
   - Vercel Blob: Wird automatisch aktiviert
   - Keine manuelle Konfiguration nötig!

3. **Deploy**
   - Push zu GitHub triggert automatisch einen neuen Deploy
   - Deine App ist live!

### Lokale Entwicklung

```bash
# Mit Vercel CLI (empfohlen für volle Funktionalität)
vercel dev

# Oder normaler Next.js dev server
npm run dev
```

## 📖 Verwendung

### Board erstellen
1. Klicke auf "Neues Board erstellen"
2. Gib einen Titel ein
3. Klicke auf "Erstellen"

### Bilder hinzufügen
- **Drag & Drop**: Ziehe Bilder direkt in die Zeitleiste
- **Button**: Klicke auf "Bilder hochladen"

### Notizen hinzufügen
- Klicke auf eine leere Stelle in der Zeitleiste
- Bearbeite den Text direkt

### Teilen
- Klicke auf "Teilen" im Header
- Der Link wird in die Zwischenablage kopiert

## 🎨 Design-Prinzipien

- **Cinematisch**: Dunkles Theme mit subtilen Animationen
- **Minimalistisch**: Fokussiert auf Content, nicht auf UI
- **Intuitiv**: Drag & Drop für maximale Benutzerfreundlichkeit
- **Responsive**: Funktioniert auf allen Geräten

## 🔧 API-Referenz

### Boards
- `GET /api/boards` - Alle Boards abrufen
- `POST /api/boards` - Neues Board erstellen
- `GET /api/boards/[id]` - Board mit Items laden
- `PATCH /api/boards/[id]` - Board aktualisieren
- `DELETE /api/boards/[id]` - Board löschen

### Timeline Items
- `POST /api/items` - Neues Item erstellen
- `PATCH /api/items/[id]` - Item aktualisieren
- `DELETE /api/items/[id]` - Item löschen

### Upload
- `POST /api/upload` - Bild hochladen

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zu deinem Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue auf GitHub
- Schaue in die Vercel-Dokumentation für Deploy-Fragen