# Ordner-System für Mediathek

Organisiere deine Bilder in Ordnern für bessere Übersichtlichkeit!

## 📁 Was ist neu?

### Vorher (ohne Ordner):
```
📚 Mediathek
├── Logo.png
├── Portrait1.jpg
├── Location_Park.jpg
├── Hochzeit_Ref.jpg
├── Produkt_Shot.jpg
└── ... 50 weitere Bilder ...

❌ Unübersichtlich
❌ Schwer zu finden
❌ Keine Kategorien
```

### Jetzt (mit Ordnern):
```
📚 Mediathek
├── 🏷️ Logos & Branding
│   ├── Logo_Haupt.png
│   └── Wasserzeichen.png
├── 👤 Portraits
│   ├── Portrait1.jpg
│   └── Portrait2.jpg
├── 📍 Locations
│   ├── Location_Park.jpg
│   └── Location_Studio.jpg
├── 💍 Hochzeiten
│   └── Hochzeit_Ref.jpg
└── 📦 Produkte
    └── Produkt_Shot.jpg

✅ Strukturiert
✅ Schnell gefunden
✅ Klar kategorisiert
```

## 🎯 Standard-Ordner

Beim ersten Öffnen werden automatisch 5 Ordner erstellt:

| Icon | Name | Für |
|------|------|-----|
| 🏷️ | **Logos & Branding** | Logos, Wasserzeichen, Signaturen |
| 👤 | **Portraits** | Portrait-Referenzen, Posing-Beispiele |
| 📍 | **Locations** | Standort-Fotos, Setting-Bilder |
| 💍 | **Hochzeiten** | Hochzeits-Inspiration, Referenzen |
| 📦 | **Produkte** | Produktfotos, Referenzen |

**Plus:**
- 📁 **Nicht kategorisiert** - Für alles andere (kann nicht gelöscht werden)

## 💡 Verwendung

### Ordner erstellen

1. Mediathek öffnen
2. Klicke **➕** neben "Ordner"
3. Namen eingeben (z.B. "Events")
4. Enter drücken → Ordner erstellt! ✨

**Schnell:**
- Enter = Erstellen
- ESC = Abbrechen

### Bilder hochladen

1. **Ordner auswählen** (links klicken)
2. **➕ Hochladen** klicken
3. Dateien auswählen
4. **Bilder landen im aktuellen Ordner!**

### Ordner wechseln

1. **Klick auf anderen Ordner** in Sidebar
2. Bilder aus diesem Ordner werden angezeigt
3. Upload geht in den neuen Ordner

### Ordner löschen

1. **Hover über Ordner** → 🗑️ erscheint
2. Klicken → Bestätigung
3. **Bilder werden nach "Nicht kategorisiert" verschoben**
4. Ordner wird gelöscht

**Wichtig:** "Nicht kategorisiert" kann NICHT gelöscht werden (Fallback-Ordner)

### Ordner umbenennen

TODO (kommt bald - aktuell nicht möglich)

## 🎨 UI-Übersicht

```
┌────────────────────────────────────────────┐
│ 📚 Mediathek                          [×]  │
├────────────────────────────────────────────┤
│ Ordner ➕     │  🏷️ Logos & Branding       │
│               │  [➕ Hochladen] [3 verwenden]│
│ 🏷️ Logos     │  ┌─────┐ ┌─────┐ ┌─────┐   │
│ 👤 Portraits  │  │ ✓   │ │     │ │ ✓   │   │
│ 📍 Locations ●│  │Logo1│ │Logo2│ │Logo3│   │
│ 💍 Hochzeiten │  └─────┘ └─────┘ └─────┘   │
│ 📦 Produkte   │  ┌─────┐ ┌─────┐           │
│ 📁 Nicht kat. │  │Logo4│ │Logo5│           │
│               │  └─────┘ └─────┘           │
└────────────────────────────────────────────┘
  Sidebar          Hauptbereich
```

**Legende:**
- ● = Aktiver Ordner (schwarz)
- ➕ = Neuer Ordner Button
- 🗑️ = Ordner löschen (hover)

## 📊 Workflows

### Workflow 1: Neue Mediathek organisieren

```
1. Mediathek öffnen
   → 5 Standard-Ordner sind schon da ✅

2. Ordner "Logos & Branding" wählen
   → Logos hochladen (Logo_Haupt.png, etc.)

3. Ordner "Portraits" wählen
   → Portrait-Referenzen hochladen

4. Eigenen Ordner erstellen: "Events"
   → Event-Fotos hochladen

= Perfekt organisiert! 🎯
```

### Workflow 2: Beim Board-Erstellen

```
Board Editor öffnen
  ↓
"📚 Mediathek" klicken
  ↓
Ordner "Logos" wählen
  ↓
Logo auswählen ✓
  ↓
"1 verwenden" → Logo im Board! ✨
```

### Workflow 3: Ordner aufräumen

```
Mediathek öffnen
  ↓
Ordner "Nicht kategorisiert" wählen
  ↓
Bilder durchsehen
  ↓
TODO: Bilder in richtige Ordner verschieben
(Feature kommt bald - aktuell: neu hochladen in richtigen Ordner)
```

## 🎯 Best Practices

### 1. Sinnvolle Ordner-Struktur

**Gut:**
```
✅ Nach Verwendungszweck:
   - Logos & Branding
   - Referenzen
   - Templates

✅ Nach Projekt-Typ:
   - Hochzeiten
   - Portraits
   - Events

✅ Nach Location:
   - Studio
   - Outdoor
   - Spezielle Locations
```

**Weniger gut:**
```
❌ Nach Datum: "2024-01", "2024-02"
❌ Zu viele Ordner: > 15 Ordner
❌ Keine Struktur: "Verschiedenes", "Temp"
```

### 2. Ordner-Namen

**Gut:**
```
✅ Kurz & präzise: "Logos", "Portraits"
✅ Beschreibend: "Hochzeits-Inspiration"
✅ Mit Kontext: "Studio-Setups"
```

**Weniger gut:**
```
❌ Zu lang: "Verschiedene Portrait-Referenzen für Outdoor-Shootings 2024"
❌ Unklar: "Ordner 1", "Neu"
❌ Sonderzeichen: "Logos///2024!!!"
```

### 3. Standard-Ordner nutzen

Die 5 Standard-Ordner decken die meisten Use-Cases ab:

```
🏷️ Logos & Branding  → Wiederkehrende Assets
👤 Portraits         → Portrait-Referenzen
📍 Locations         → Standort-Fotos
💍 Hochzeiten        → Hochzeits-Inspiration
📦 Produkte          → Produkt-Referenzen
```

**Nur zusätzliche Ordner erstellen, wenn wirklich nötig!**

## 🔄 Migration

### Was passiert mit bestehenden Bildern?

**Automatisch:**
- Beim ersten Laden mit neuem System
- Alle bestehenden Bilder → "Nicht kategorisiert"
- 5 Standard-Ordner werden erstellt
- Keine Datenverluste

### Manuell organisieren:

**Aktuell** (Workaround):
1. Mediathek öffnen
2. Ordner erstellen (falls nötig)
3. Bilder aus "Nicht kategorisiert" herunterladen
4. Neu in richtigen Ordner hochladen

**Bald** (geplant):
- Drag & Drop zwischen Ordnern
- "Verschieben nach..." Kontext-Menü
- Batch-Move

## 🐛 Troubleshooting

### "Ordner verschwunden"

**Lösung:**
- Ordner können nicht wirklich verschwinden
- Browser-Cache leeren → F5
- Prüfe IndexedDB: DevTools → Application → IndexedDB → MoodboardDB → libraryFolders

### "Bilder im falschen Ordner"

**Aktuell:**
- Bild löschen (nur aus Mediathek!)
- Neu in richtigen Ordner hochladen

**Bald:**
- Verschieben-Funktion

### "Kann Ordner nicht löschen"

**Wenn es 'Nicht kategorisiert' ist:**
- Das ist der Fallback-Ordner
- Kann nicht gelöscht werden (by design)

**Bei anderen Ordnern:**
- Prüfe ob Ordner Bilder enthält
- Bestätigung lesen (Bilder werden verschoben)

### "Standard-Ordner neu erstellen"

Falls gelöscht:
1. Browser-Konsole öffnen (F12)
2. Eingeben:
```javascript
import { useFolderStore } from '@/modules/library/folderStore'
useFolderStore.getState().initializeDefaultFolders()
```
3. Seite neu laden

## 📊 Technische Details

### Datenbank-Schema

```typescript
interface LibraryFolder {
  id: string;
  name: string;
  icon: string;
  createdAt: number;
  order: number;
}

interface LibraryAsset {
  id: string;
  folderId: string; // ← NEU!
  name: string;
  // ... rest
}
```

### Standard-IDs

```
uncategorized → "Nicht kategorisiert"
default-logos-branding → "Logos & Branding"
default-portraits → "Portraits"
default-locations → "Locations"
default-hochzeiten → "Hochzeiten"
default-produkte → "Produkte"
```

### Datenbank-Version

**Version 4:**
- Neue Tabelle: `libraryFolders`
- Neue Spalte: `libraryAssets.folderId`
- Automatische Migration beim ersten Laden

## 🔮 Roadmap

### Geplant:
- [ ] **Ordner umbenennen** (Inline-Edit)
- [ ] **Bilder verschieben** (Drag & Drop zwischen Ordnern)
- [ ] **Ordner-Icons anpassen** (Emoji-Picker)
- [ ] **Ordner sortieren** (Drag & Drop)
- [ ] **Batch-Operations** (Alle Bilder in Ordner verschieben)

### In Überlegung:
- [ ] **Verschachtelte Ordner** (Unter-Ordner)
- [ ] **Ordner-Farben**
- [ ] **Smart Folders** (Automatische Filter)
- [ ] **Ordner-Templates**

## 🎉 Zusammenfassung

**Was ist neu?**
- ✅ Ordner-System für Mediathek
- ✅ 5 vordefinierte Kategorien
- ✅ Sidebar-Navigation
- ✅ Inline-Ordner-Erstellung
- ✅ Automatische Migration
- ✅ Ordner löschen (mit Bilder-Verschiebung)

**Performance:**
- ✅ Nur +1.45 KB Bundle-Size
- ✅ Schnelle Ordner-Wechsel
- ✅ Effiziente DB-Queries

**Perfect für:**
- ✅ Große Mediatheken (100+ Bilder)
- ✅ Verschiedene Projekt-Typen
- ✅ Wiederkehrende Assets
- ✅ Professionelle Organisation

---

**Live testen**: https://mood-boards.vercel.app/

1. Board öffnen → "📚 Mediathek"
2. **Sidebar mit Ordnern** (links)
3. **➕ Klicken** → Neuer Ordner erstellen
4. **Ordner auswählen** → Bilder hochladen
5. **Organisiert!** 🎉

