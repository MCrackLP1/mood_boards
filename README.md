# 🎨 Moodboard-Webapp – Mark Tietz Fotografie Edition

Eine minimalistische, persönliche Web-App, um Moodboards für Kunden zu erstellen, zu speichern und stilvoll zu präsentieren — ohne unnötigen UI-Overload, nur pure Ästhetik & Funktion.

> "Ein digitaler Raum, in dem deine kreative Vision entsteht und Kunden sie fühlen können."

---

## ✨ Features

### 🎯 Board-Verwaltung
- ✅ **Boards erstellen** mit individuellem Titel
- ✅ **Boards duplizieren** für schnelle Vorlagen
- ✅ **Boards löschen** mit Bestätigungs-Dialog
- ✅ **Titel bearbeiten** per Click-to-Edit
- ✅ **Automatische Vorschaubilder** aus erstem Board-Bild

### 📸 Board-Inhalte
- ✅ **Drag & Drop Upload** von Bildern
- ✅ **Freitext-Notizen** mit Auto-Resize
- ✅ **Masonry Grid Layout** (Pinterest-Style) für ästhetische Darstellung
- ✅ **Responsive Design** für alle Geräte

### 🎨 Farb-Sampler
- ✅ **Automatische Farbextraktion** aus Bildern (5 Hauptfarben)
- ✅ **Klickbare Farbfelder** zum Filtern
- ✅ **Smart Highlighting**: Bilder mit gewählter Farbe bleiben sichtbar, andere werden transparent
- ✅ **Visueller Filter-Status** mit Clear-Button

### 🌐 Kundenansicht
- ✅ **Öffentlicher Share-Link** (`/share/[boardId]`)
- ✅ **Passwortschutz** für geschützte Boards
- ✅ **Read-Only Modus** ohne Edit-Funktionen
- ✅ **Link kopieren** mit einem Klick

### 🎬 Willkommensanimation
- ✅ **Emotionaler Einstieg** mit Fade-In Animation
- ✅ **Personalisierte Begrüßung** mit Kundenname
- ✅ **Individuelle Willkommensnachricht**
- ✅ **Animierter Hintergrund** mit sanften Gradienten
- ✅ **Automatisches Timing** (2,5 Sekunden)

### ✨ Motion Design
- ✅ **Smooth Scrolling** mit Lenis.js
- ✅ **Fade-In Animationen** beim Laden aller Elemente
- ✅ **Staggered Animations** für Board-Grid
- ✅ **Hover-Effekte** auf Interaktions-Elementen
- ✅ **Framer Motion** Integration

### 🖋️ Branding
- ✅ **Dezente Signatur** ("by Mark Tietz Fotografie")
- ✅ **Toggle-Funktion** zum Ein-/Ausblenden
- ✅ **Opacity-Hover** für subtiles Branding

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Sprache:** TypeScript
- **Styling:** TailwindCSS
- **Animationen:** Framer Motion + Lenis.js
- **Farbextraktion:** color-thief-react
- **Layout:** react-masonry-css
- **Icons:** lucide-react
- **Storage:** LocalStorage (clientseitig)

---

## 🚀 Installation & Start

### 1. Dependencies installieren
```bash
npm install
```

### 2. Development Server starten
```bash
npm run dev
```

### 3. Browser öffnen
Öffne [http://localhost:3000](http://localhost:3000)

---

## 📖 Benutzung

### Board erstellen
1. Startseite: Titel eingeben und "Create" klicken
2. Board öffnet sich automatisch

### Inhalte hinzufügen
- **Bilder:** Drag & Drop in die Dropzone oder klicken zum Auswählen
- **Notizen:** "Add Note" Button klicken

### Board mit Kunden teilen
1. Board öffnen
2. "Einstellungen" Button klicken
3. Optional: Kundenname, Willkommensnachricht und Passwort eingeben
4. Share-Link kopieren und an Kunden senden

### Farben filtern
1. Auf ein Farbfeld unter einem Bild klicken
2. Alle Bilder mit ähnlicher Farbe bleiben sichtbar
3. "Clear" klicken zum Zurücksetzen

---

## 🎨 Board-Einstellungen

Im Settings-Modal kannst du konfigurieren:

- **Kundenname**: Wird in Willkommensanimation angezeigt
- **Willkommensnachricht**: Personalisierte Begrüßung
- **Passwort**: Schütze dein Board vor unbefugtem Zugriff
- **Signatur anzeigen**: Toggle für Branding in Kundenansicht
- **Share-Link**: Automatisch generiert, mit Copy-Button

---

## 🌐 Deployment

### Vercel (empfohlen)

1. Push Code zu GitHub
2. Importiere Repository auf [Vercel](https://vercel.com)
3. Vercel erkennt automatisch Next.js
4. Deploy!

### Build für Production
```bash
npm run build
npm start
```

---

## 📂 Projektstruktur

```
mood_boards/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Startseite (Board-Übersicht)
│   │   ├── layout.tsx            # Root Layout
│   │   ├── globals.css           # Global Styles
│   │   ├── board/[id]/           # Board-Detail (Edit-Modus)
│   │   └── share/[id]/           # Kundenansicht (Read-Only)
│   ├── components/
│   │   ├── BoardCard.tsx         # Board-Kachel mit Preview
│   │   ├── BoardDetail.tsx       # Board-Inhalte (Masonry)
│   │   ├── BoardSettings.tsx     # Settings-Modal
│   │   ├── ImageCard.tsx         # Bild mit Farbpalette
│   │   ├── Note.tsx              # Notiz-Komponente
│   │   ├── WelcomeAnimation.tsx  # Willkommensscreen
│   │   ├── Signature.tsx         # Branding-Signatur
│   │   └── SmoothScroller.tsx    # Lenis.js Wrapper
│   ├── lib/
│   │   └── BoardContext.tsx      # Global State Management
│   └── types/
│       └── index.ts              # TypeScript Interfaces
└── package.json
```

---

## 🎯 Roadmap / Future Features

### 🟡 Geplant
- [ ] **Sound-Integration** (Ambient-Sounds via Pixabay/Freesound API)
- [ ] **Parallax-Effekte** beim Scrollen
- [ ] **Gradient-Generator** aus Farbpaletten
- [ ] **Export-Funktion** (PDF/Bild)
- [ ] **Drag & Drop Reihenfolge** für Items

### 🔵 Nice-to-Have
- [ ] **Supabase-Migration** (statt LocalStorage)
- [ ] **Multi-User Support** mit Auth
- [ ] **Analytics** für Kundenlinks (Wer hat wann geöffnet?)
- [ ] **Board-Templates** für schnellen Start
- [ ] **Bulk-Image-Upload**

---

## 🐛 Behobene Bugs

- ✅ **404-Fehler** bei direktem Board-Aufruf (useState-Initialisierung)
- ✅ **LocalStorage Persistence** beim Refresh
- ✅ **Responsive Layout** auf Mobile

---

## 🤝 Credits

**Entwickelt von:** Mark Tietz & AI Assistant (Claude Sonnet 4.5)  
**Design-Philosophie:** Minimalismus, Ästhetik, Funktion  
**Font:** Geist Sans  
**Inspiration:** Digital Artbook, Portfolio-Websites

---

## 📄 Lizenz

Private Use - Mark Tietz Fotografie

---

## 💡 Tipps

### Optimale Board-Präsentation
- **Max. 15-20 Bilder** pro Board für beste Wirkung
- **Konsistente Bildqualität** (min. 1920px Breite)
- **Kurze, prägnante Notizen** statt lange Texte
- **Farbpalette nutzen** für visuelle Story

### Performance
- **Base64-Limit beachten**: LocalStorage hat ca. 5-10MB Limit
- **Für große Projekte**: Migration zu Supabase empfohlen
- **Bildoptimierung**: Vor Upload komprimieren (z.B. TinyPNG)

---

## 📞 Support

Bei Fragen oder Problemen:
- **Website:** [marktietz.de](https://www.marktietz.de)
- **GitHub Issues:** Erstelle ein Issue im Repository

---

**Made with ❤️ for creative professionals**
