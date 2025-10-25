# 🎨 Mood Boards

Eine moderne, cinematische Web-App zum Erstellen visueller Zeitleisten und Mood Boards.

## ✨ Features

- 🎬 **Cinematisches Design** mit animierten Gradienten und glassmorphen Effekten
- 📝 **Notizen** hinzufügen, bearbeiten und verschieben
- 🖼️ **Bilder** hochladen und auf der Zeitleiste platzieren
- 🔄 **Drag & Drop** zum Neuordnen von Items
- 🔗 **Teilbare Links** für jedes Board
- 📱 **Responsive Design** für alle Geräte
- ⚡ **Schnell** dank Next.js 15 und Turbopack

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Datenbank**: Vercel Postgres
- **Bild-Speicherung**: Vercel Blob Storage
- **Drag & Drop**: @dnd-kit

## 📋 Voraussetzungen

- Node.js 18+ 
- npm oder pnpm
- Vercel Account (für Deployment)

## 🛠️ Installation

1. **Repository klonen:**

```bash
git clone https://github.com/MCrackLP1/mood_boards.git
cd mood_boards
```

2. **Dependencies installieren:**

```bash
npm install
```

3. **Umgebungsvariablen einrichten:**

Für lokale Entwicklung:

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
```

Dies lädt automatisch die Vercel Postgres und Blob Storage Credentials herunter.

## 🏃‍♂️ Entwicklung

Lokalen Dev-Server starten:

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Datenbank initialisieren

Beim ersten Start die Datenbank initialisieren:

```
http://localhost:3000/api/init
```

## 📦 Deployment

### Vercel (empfohlen)

1. **Repository mit Vercel verbinden:**

```bash
vercel
```

2. **Postgres Datenbank hinzufügen:**
   - Im Vercel Dashboard: Storage → Create Database → Postgres

3. **Blob Storage hinzufügen:**
   - Im Vercel Dashboard: Storage → Create Store → Blob

4. **Datenbank initialisieren:**
   Nach dem Deployment:
   ```
   https://your-app.vercel.app/api/init
   ```

## 📁 Projektstruktur

```
mood_boards/
├── app/
│   ├── api/              # API Routes
│   │   ├── boards/       # Board CRUD
│   │   ├── items/        # Timeline Items CRUD
│   │   ├── upload/       # Bild-Upload
│   │   └── init/         # DB Initialisierung
│   ├── board/[id]/       # Board-Detail-Seite
│   ├── page.tsx          # Dashboard
│   ├── layout.tsx        # Root Layout
│   └── globals.css       # Globale Styles
├── components/
│   ├── BoardCard.tsx          # Board Karte
│   ├── CreateBoardModal.tsx   # Modal zum Erstellen
│   ├── Timeline.tsx           # Zeitleiste Container
│   └── TimelineItem.tsx       # Notiz/Bild Item
├── lib/
│   ├── db.ts             # Datenbank Client
│   └── types.ts          # TypeScript Types
└── package.json
```

## 🎮 Verwendung

1. **Board erstellen**: Klicke auf "Neues Board erstellen" auf der Startseite

2. **Notizen hinzufügen**: Klicke auf den lila Button unten rechts (Stift-Icon)

3. **Bilder hochladen**: Klicke auf den blauen Button unten rechts (Bild-Icon)

4. **Items verschieben**: Ziehe Notizen oder Bilder, um sie neu zu ordnen

5. **Items bearbeiten**: 
   - Notizen: Klicke auf den Text zum Bearbeiten
   - Items löschen: Hover über ein Item und klicke auf das X

6. **Board teilen**: Klicke auf "Teilen" oben rechts, um den Link zu kopieren

## 🔧 Konfiguration

### Tailwind CSS

Anpassungen in `tailwind.config.ts`:
- Farben
- Animationen
- Breakpoints

### Next.js

Konfiguration in `next.config.ts`:
- Image Domains
- API Routes
- Build-Optionen

## 📄 API Referenz

### Boards

- `GET /api/boards` - Alle Boards abrufen
- `POST /api/boards` - Neues Board erstellen
- `GET /api/boards/[id]` - Board mit Items laden
- `DELETE /api/boards/[id]` - Board löschen

### Timeline Items

- `POST /api/items` - Item hinzufügen
- `PATCH /api/items/[id]` - Item aktualisieren
- `DELETE /api/items/[id]` - Item löschen

### Upload

- `POST /api/upload` - Bild hochladen (multipart/form-data)

## 🐛 Troubleshooting

### Datenbank-Verbindungsfehler

```bash
# Vercel Env Vars neu laden
vercel env pull
```

### Bilder werden nicht geladen

1. Überprüfe `BLOB_READ_WRITE_TOKEN` in den Env Vars
2. Stelle sicher, dass Vercel Blob Storage aktiviert ist

### Build-Fehler

```bash
# Cache löschen und neu bauen
rm -rf .next
npm run build
```

## 🤝 Contributing

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue öffnen.

## 📝 Lizenz

MIT

## 👤 Autor

**MCrackLP1**
- GitHub: [@MCrackLP1](https://github.com/MCrackLP1)

## 🙏 Acknowledgments

- Next.js Team für das fantastische Framework
- Vercel für das großartige Hosting und die Infrastruktur
- Framer Motion für die butterweichen Animationen

