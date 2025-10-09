# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [1.6.0] - 2024-10-09

### ✨ Neue Features - Ordner-System für Mediathek

#### Ordner-Organisation 📁
- **Ordner erstellen**: Eigene Kategorien für Bilder anlegen
- **5 Standard-Ordner**: Logos & Branding, Portraits, Locations, Hochzeiten, Produkte
- **Sidebar-Navigation**: Klare Ordner-Übersicht links
- **Automatische Migration**: Bestehende Bilder → "Nicht kategorisiert"
- **Ordner löschen**: Bilder werden automatisch verschoben
- **Upload in Ordner**: Bilder landen direkt im aktuellen Ordner

#### UI-Verbesserungen 🎨
- **Zwei-Spalten-Layout**: Sidebar + Hauptbereich
- **Aktiver Ordner**: Schwarz hervorgehoben
- **Ordner-Icons**: Visuelle Unterscheidung (🏷️ 👤 📍 💍 📦)
- **Inline-Ordner-Erstellung**: Schnell neue Ordner mit ➕
- **Hover-Delete**: 🗑️ Button pro Ordner (außer Standard)

### 📊 Performance
- Bundle-Size: +1.45 KB (gzip)
- IndexedDB Version 4 Migration (automatisch)
- Effiziente Folder-Queries

### 🔄 Migration
- Neue Tabelle: `libraryFolders`
- Bestehende Assets: → "Nicht kategorisiert" Ordner
- 5 Default-Ordner werden automatisch erstellt

## [1.4.0] - 2024-10-09

### ✨ Neue Features

#### Asset-Bibliothek / Mediathek 📚
- **Projektübergreifender Speicher**: Einmal hochladen, in allen Boards verwenden
- **Lokale IndexedDB**: Bilder bleiben lokal gespeichert
- **Multi-Select**: Mehrere Bilder aus Mediathek auf einmal hinzufügen
- **Farbpaletten**: Automatisch gespeichert beim Upload
- **Verwaltung**: Bilder direkt aus Mediathek löschen
- **Meta-Informationen**: Dateiname, Größe, Auflösung anzeigen
- **Performance**: Effiziente Speicherung mit Dexie.js
- **UI**: Modales Grid-Layout ähnlich wie Bildsuche

### 🎨 UX-Verbesserungen
- Neuer "📚 Mediathek" Button im Upload-Bereich
- Konsistentes Design mit Bildsuche
- Hover-Delete-Button pro Bild
- Statistik: "X Bilder in Mediathek"

### 📊 Performance
- Bundle-Size: +1.28 KB (gzip) für komplettes System
- Effiziente IndexedDB-Queries
- Version 2 Migration (automatisch)

## [1.5.0] - 2024-10-09

### ✨ Neue Features - Strukturiertes Board-Layout

#### Feste Bereiche (Sections) 📋
- **3 vordefinierte Bereiche**: 
  - ✨ Beispielbilder (Inspiration & Referenzen)
  - 📍 Location (Ort, Setting & Atmosphäre)
  - 📋 Allgemein (Weitere Inhalte)
- **Text & Bilder pro Bereich**: Jede Section kann Notizen UND Bilder enthalten
- **Dedizierte Aktionen**: 4 Buttons pro Section (📁 📚 🔍 📝)
- **Strukturierte Präsentation**: Kunden sehen klar getrennte Bereiche
- **Automatische Migration**: Bestehende Items werden zu "Allgemein" migriert

#### Notizen-System 📝
- **Inline-Editor**: Notizen direkt in der Section bearbeiten
- **Gelbe Notiz-Karten**: Visuell von Bildern getrennt
- **Multi-Line Support**: Mehrzeilige Notizen möglich
- **Bearbeiten & Löschen**: ✏️ und 🗑️ Buttons pro Notiz

### 🎨 UX-Verbesserungen
- Klare visuelle Hierarchie (Icon + Titel + Beschreibung)
- Kompakte Icon-Buttons statt Text-Buttons
- Bessere Übersicht durch Sections
- Customer-View zeigt Struktur prominent

### 📊 Performance
- Bundle-Size: +1.84 KB (gzip)
- IndexedDB Version 3 Migration (automatisch)
- Backwards-compatible mit alten Boards

### 🔄 Migration
- Bestehende Boards: Alle Items → "Allgemein"
- Neue Boards: Leere Sections, ready to use
- Keine manuellen Schritte nötig

## [1.3.0] - 2024-10-09

### ✨ Neue Features

#### Multi-Select für Bildsuche 🎯
- **Mehrere Bilder auswählen**: Klicke auf mehrere Bilder (Toggle mit ✓)
- **Batch-Import**: Alle ausgewählten Bilder mit einem Klick hinzufügen
- **Visuelles Feedback**: Blaue Border + Checkmark bei ausgewählten Bildern
- **Counter-Button**: "X Bilder hinzufügen" zeigt Anzahl an
- **Auswahl aufheben**: Button zum Zurücksetzen der Selektion
- **Performance**: Sequentieller Download verhindert Überlastung

### 🎨 UX-Verbesserungen
- Animierter Checkmark beim Auswählen (Pop-Animation)
- Ausgewählte Bilder bleiben visuell hervorgehoben
- Progress während Batch-Import ("Füge X Bilder hinzu...")

## [1.2.0] - 2024-10-09

### ✨ Neue Features

#### Web-Bildsuche 🔍
- **Multi-Provider-Suche**: Durchsuche Unsplash, Pexels und Pixabay gleichzeitig
- **Direkter Import**: Bilder mit einem Klick ins Board einfügen
- **Automatische Attribution**: Fotografen-Namen werden als Label hinzugefügt
- **Kostenlose APIs**: Alle Provider haben großzügige Free-Tiers
- **Fallback-Modus**: Funktioniert auch ohne API-Keys (zeigt Hinweis)

### 📊 Performance
- Bundle-Size: +1.8 KB (gzip) für komplettes Bildsuche-System
- Parallele API-Anfragen für schnellere Ergebnisse
- Lazy-Loading der Suchergebnisse

### 🎨 UX-Verbesserungen
- Neuer "🔍 Web-Suche" Button im Upload-Bereich
- Modal mit Grid-Layout für Suchergebnisse
- Loading-States während Download
- Photographer-Attribution im Hover-State

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

