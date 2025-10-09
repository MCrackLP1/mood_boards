# Canvas Customer View - Dokumentation

## Übersicht

Die Canvas Customer View transformiert die Kunden-Präsentationsansicht in eine emotional ansprechende, künstlerische Leinwand mit Mixed-Media-Ästhetik. Der Editor bleibt dabei unverändert funktional für die Arbeit.

## Architektur

### Zwei Modi
- **Editor Mode** (für dich): Funktional, strukturiert, alle Tools verfügbar
- **Canvas Mode** (für Kunden): Emotional, künstlerisch, inspirierend

### Technologie-Stack
- **Framer Motion**: Organische Animationen mit Spring-Easing
- **CSS Grid**: Asymmetrisches Layout-System
- **Custom Fonts**:
  - Playfair Display (Serif) - Headlines
  - Inter (Sans-Serif) - Body Text  
  - Caveat (Handwriting) - Labels und Akzente

## Komponenten-Struktur

### Utility Components (`src/components/canvas/`)

#### CanvasGrain
```tsx
<CanvasGrain />
```
- SVG-basierte Papier-Textur
- 6% Opacity
- Fixed position overlay
- Multiply blend mode

#### PolaroidFrame
```tsx
<PolaroidFrame rotation={-2} caption="Hochzeit">
  <img src="..." />
</PolaroidFrame>
```
- Authentischer Polaroid-Rahmen
- Weiße Border (15px/40px bottom)
- Multi-Layer Schatten
- Optional: Handschriftliche Caption

#### TapeStrip
```tsx
<TapeStrip rotation={-3} length="80px" />
```
- Semi-transparentes Klebeband
- Horizontal/Vertical Varianten
- Subtle Textur-Overlay

#### HandwrittenLabel
```tsx
<HandwrittenLabel rotation={-1} size="lg">
  Text
</HandwrittenLabel>
```
- Caveat Handwriting Font
- Slight Rotation
- 3 Größen: sm, md, lg

### Zone Components (`src/components/canvas/zones/`)

#### MoodHeroZone
**Grid Area:** `mood`  
**Inhalt:** Hauptinspiration mit Masonry-Grid
- 6-10 Bilder in Polaroid-Rahmen
- Mini-Farbpaletten unter jedem Bild
- Quellen-Credits on hover
- Tape-Deko auf ausgewählten Items
- Stagger Animation (40ms)

#### ColorStripeZone
**Grid Area:** `colors`  
**Inhalt:** Vertikale Farbpalette
- 5-7 Farbswatches
- Handschriftliche Labels (HEX Codes)
- Click-to-Copy Funktionalität
- Subtle Rotation pro Swatch (-2° bis 2°)
- Toast-Feedback "Kopiert!"

#### NotesZone
**Grid Area:** `notes`  
**Inhalt:** Sticky Notes
- 2-4 Notizen
- Verschiedene Pastellfarben
- Rotation (-2° bis 2°)
- Tape-Effekt oben
- Handwriting Font

#### LocationZone
**Grid Area:** `location`  
**Inhalt:** Location Polaroids
- 3-5 Location-Bilder
- Scattered Arrangement
- Polaroid-Style mit Captions
- Verschiedene Rotationen

#### TimelineCanvasZone
**Grid Area:** `timeline`  
**Inhalt:** Vertikale Künstler-Timeline
- Zeit-Items mit Icons
- Handschriftliche Zeiten
- Pinselstrich-Verbinder (Gradient)
- Location + Description

#### WeatherBadgeZone
**Grid Area:** `weather`  
**Inhalt:** Floating Weather Badge
- Runder Badge (120x120px)
- Glassmorphism (backdrop-blur)
- Floating rechts oben
- Live Temperatur & Condition
- Icon mit Tag/Nacht Support

## Layout-System

### Desktop Grid (>1024px)
```css
grid-template-columns: 200px 1fr 200px 200px;
grid-template-areas:
  "colors mood mood weather"
  "colors mood mood notes"
  "location timeline notes notes";
```

### Tablet Grid (640px - 1024px)
```css
grid-template-columns: 1fr 1fr;
grid-template-areas:
  "mood mood"
  "colors timeline"
  "location notes"
  "weather weather";
```

### Mobile Grid (<640px)
```css
grid-template-columns: 1fr;
grid-template-areas:
  "mood"
  "colors"
  "timeline"
  "location"
  "weather"
  "notes";
```

## Animations-System

### Timings
```typescript
fast: 150ms    // Micro-interactions
base: 250ms    // Standard transitions
slow: 400ms    // Complex animations
```

### Easing Functions
```typescript
enter: [0.34, 1.56, 0.64, 1]        // Spring (bounce in)
exit: [0.4, 0, 0.2, 1]              // EaseOut (smooth)
anticipate: [0.68, -0.55, 0.265, 1.55] // Anticipate
```

### Animation Variants

#### zoneEnter
- Fade: opacity 0 → 1
- Slide: y +20px → 0
- Scale: 0.96 → 1
- Stagger: 60ms delay zwischen Zones

#### zoneHover
- Scale: 1.03
- Y-translate: -8px
- Smooth shadow expansion

#### panelOpen/Close
- Scale: 0.96 ↔ 1
- Fade mit Blur
- Spring animation

## Farb-System

### Canvas-Palette
```css
--canvas-bg: #F7F7F6      /* Off-White Background */
--canvas-ink: #0E0E10     /* Ink Black */
--canvas-accent: #14B8A6  /* Teal (sparsam) */
--canvas-warm: #EDE7E1    /* Warm Beige */
--canvas-tape: rgba(255, 255, 255, 0.6) /* Tape */
```

### Typography
```css
--font-heading: 'Playfair Display', serif
--font-body: Inter, system-ui
--font-handwriting: 'Caveat', cursive
```

## Sections → Zones Mapping

Das System mappt automatisch die Daten-Sections zu visuellen Zones:

| Data Section | Visual Zone | Beschreibung |
|-------------|-------------|--------------|
| `general` | MoodHeroZone | Hauptbilder & Inspiration |
| `colors` | ColorStripeZone | Extrahierte Farbpaletten |
| `location` | LocationZone | Location-Bilder |
| `timeline` | TimelineCanvasZone | Timeline-Items |
| `weather` | WeatherBadgeZone | Wetter-Info (statisch) |
| `notes` | NotesZone | Notizen |

## Features

### ✨ Emotional Design
- Mixed-Media Ästhetik
- Polaroid-Rahmen mit Schatten
- Handschriftliche Labels
- Klebestreifen-Deko
- Papier-Textur Overlay

### 🎨 Organische Animationen
- Spring-basierte Entrance
- Stagger-Effekte
- Hover mit Lift & Shadow
- Smooth Transitions

### 🎯 Interaktivität
- Click-to-Copy Farben
- Image Lightbox
- Hover-States mit Parallax
- Smooth Scrolling

### 📱 Responsive
- 3 Breakpoints (Desktop/Tablet/Mobile)
- Adaptive Layouts
- Touch-optimiert

## Performance

### Optimierungen
- GPU-accelerated animations (transform, opacity)
- Lazy image loading
- CSS Grid statt JavaScript
- will-change für Hover-Elemente
- Intersection Observer für Entrance

### Bundle Size
- JS: 638KB (199KB gzipped)
- CSS: 64.6KB (11.9KB gzipped)
- Fonts: ~60KB (Google Fonts CDN)

## Nutzung

### Für den Ersteller (du)
1. Arbeite im **Editor** wie gewohnt
2. Organisiere Inhalte in Sections
3. Teile den Link mit Kunden

### Für Kunden
1. Öffnen den Share-Link (`#/view/{id}`)
2. Sehen die **Canvas-Ansicht**
3. Erleben emotionale Präsentation
4. Können Farben kopieren
5. Lightbox für Bilder

## Zukünftige Erweiterungen

### Geplant (Optional)
- [ ] Ambient Sound Toggle (eleganter Vinyl-Disc Button)
- [ ] Scroll Parallax für Tiefe
- [ ] Drag & Rearrange für Kunden
- [ ] PDF Export der Canvas-Ansicht
- [ ] Custom Canvas Templates
- [ ] Dark Mode Variante
- [ ] Animation Preferences (reduced motion)

### Technisch
- [ ] Code-Splitting für kleinere Bundles
- [ ] WebP Image Format
- [ ] Service Worker für Offline
- [ ] i18n für mehrsprachige Canvas

## Maintenance

### Adding New Zones
1. Create Component: `src/components/canvas/zones/NewZone.tsx`
2. Add CSS Module: `NewZone.module.css`
3. Import in CustomerView
4. Add to Grid Template Areas
5. Map data section to zone

### Modifying Animations
Edit `src/animations/canvas.ts` für globale Änderungen

### Adjusting Layout
Edit `CustomerView.module.css` grid-template-areas

## Troubleshooting

### Fonts laden nicht
- Prüfe `index.html` Google Fonts Link
- Fallback auf System-Fonts ist aktiv

### Animationen ruckeln
- Prüfe GPU-Acceleration
- will-change bereits auf Hover-Elementen
- Reduced Motion User bevorzugen

### Grid bricht auf Mobile
- Prüfe Breakpoints in CSS
- grid-template-columns: 1fr für Mobile

### Farben werden nicht extrahiert
- Prüfe ob Bilder Palette haben
- colorExtraction.ts läuft im Editor

---

## Ergebnis

Eine **emotional ansprechende, künstlerische Präsentationsansicht** die:
- ✨ Wie eine inspirierende Leinwand wirkt
- 🎨 Mixed-Media Ästhetik vermittelt  
- 🌊 Organisch und flüssig animiert
- 💎 Tiefe und Atmosphäre ausstrahlt
- 🎯 Perfekt für Kunden-Präsentationen ist

Während der **Editor funktional und strukturiert** für die Arbeit bleibt!

