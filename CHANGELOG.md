# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [1.1.0] - 2024-10-09

### ✨ Neue Features

#### Fullscreen-Lightbox
- Klick auf Bild öffnet Vollbildansicht mit Metadaten
- Tastatur-Navigation: ← / → für Bildwechsel, ESC zum Schließen
- Zeigt Farb-Palette im Lightbox
- Funktioniert in Editor und Kundenansicht

#### Lazy Loading
- Bilder werden erst geladen, wenn sie im Viewport erscheinen
- 100px Preload-Margin für flüssiges Scrolling
- Skeleton-Loader während des Ladens
- Deutliche Performance-Verbesserung bei großen Boards

#### Notiz-Funktion
- Label-Button auf jedem Bild im Editor
- Quick-Add via Prompt
- Labels werden in Lightbox und auf Karten angezeigt
- Auto-Save beim Hinzufügen

#### SEO Meta-Tags
- Dynamische Meta-Tags für Kundenansicht
- Open Graph & Twitter Cards Support
- Board-Titel, Beschreibung und Vorschaubild
- Bessere Share-Links auf Social Media

#### Keyboard Shortcuts Help
- Drücke `?` für Hilfe-Overlay
- Zeigt alle verfügbaren Shortcuts
- Dezenter Hilfe-Button unten links

### 📦 Bundle-Size
- CSS: 9.45 KB → 13.38 KB (gzip: 2.54 KB → 3.29 KB)
- JS: 264.85 KB → 270.73 KB (gzip: 86.96 KB → 88.78 KB)
- Nur +6KB (gzip) für 5 neue Features

## [1.0.0] - 2024-10-09

### ✨ Initial Release

#### Kern-Features
- Board-Übersicht mit Grid-Layout
- Board-Editor mit Drag & Drop Upload
- Automatische Farbextraktion (5-8 dominante Farben)
- Farb-Filter für ähnliche Bilder
- Kundenansicht (Read-Only) mit Willkommensanimation
- Audio-Player mit Lautstärke-Regler
- Branding-Signatur (toggelbar)
- Smooth Scrolling & Fade-Ins

#### Audio-Provider-System
- Provider-Interface mit Adapter-Pattern
- Pixabay-Adapter (CC0-Sounds)
- Freesound-Adapter (CC-Lizenzen)
- Fallback-Provider

#### Technologie-Stack
- Vite + React 18 + TypeScript
- Zustand für State Management
- Dexie.js (IndexedDB) für local-first Storage
- CSS Modules
- Vitest für Testing

#### Dokumentation
- README.md mit vollständiger Feature-Beschreibung
- QUICK_START.md für schnellen Einstieg
- TASKS.md mit TODOs & Erweiterungen
- ARCHITEKTUR.md mit Design-Entscheidungen

---

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/)

