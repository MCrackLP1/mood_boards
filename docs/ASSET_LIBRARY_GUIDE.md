# Asset-Bibliothek / Mediathek

Die Mediathek ist dein persönlicher lokaler Speicher für Bilder, die du über alle Boards hinweg verwenden kannst.

## 💡 Wofür ist die Mediathek?

### Problem ohne Mediathek:
```
Board 1: Logo hochladen
Board 2: Gleiches Logo nochmal hochladen
Board 3: Gleiches Logo nochmal hochladen
= 3x der gleiche Upload, 3x Speicherplatz
```

### Lösung mit Mediathek:
```
Mediathek: Logo einmal hochladen
Board 1: Aus Mediathek wählen
Board 2: Aus Mediathek wählen  
Board 3: Aus Mediathek wählen
= 1x Upload, mehrfach verwendbar ✨
```

## 🚀 Verwendung

### Bilder zur Mediathek hinzufügen

**Methode 1: Beim Board-Bearbeiten**
1. Öffne ein Board
2. Klicke "📚 Mediathek"
3. Klicke "➕ Bilder hochladen"
4. Wähle Dateien aus → Automatisch in Mediathek gespeichert

**Methode 2: Direkt in Mediathek**
1. Board öffnen → "📚 Mediathek"
2. Upload → Bilder sind jetzt in Mediathek
3. Schließen (Bilder bleiben gespeichert)

### Bilder aus Mediathek verwenden

1. Board öffnen
2. Klicke "📚 Mediathek"
3. Bilder anklicken zum Auswählen (✓)
4. "X Bilder verwenden" klicken
5. Bilder werden zum Board hinzugefügt

### Bilder aus Mediathek löschen

1. "📚 Mediathek" öffnen
2. Hover über Bild → 🗑️ Button erscheint
3. Klicken → Bestätigen
4. Bild wird aus Mediathek entfernt

**Wichtig**: Löschen aus Mediathek löscht NICHT aus bestehenden Boards!

## 🎯 Use Cases

### 1. Logo & Branding
```
✅ Dein Logo
✅ Deine Signatur
✅ Wasserzeichen
✅ Farbpaletten-Referenz
```
→ Einmal hochladen, in jedem Board verwenden

### 2. Oft genutzte Assets
```
✅ Lieblingsfotos
✅ Mood-Referenzen
✅ Texturen
✅ Overlays
```
→ Schneller Zugriff ohne erneuten Upload

### 3. Template-Bilder
```
✅ Beispielbilder für Kunden
✅ Before/After Vorlagen
✅ Style-Referenzen
```
→ Konsistente Boards erstellen

### 4. Kategorien
```
Portraits → Eigene Sammlung
Landschaften → Eigene Sammlung
Produkte → Eigene Sammlung
```
→ Organisierter Workflow

## 📊 Speicherung

### Wo werden Bilder gespeichert?

**IndexedDB** (Browser-interne Datenbank)
- Lokal auf deinem Computer
- Pro Domain/Website isoliert
- Bleibt auch nach Browser-Neustart erhalten
- Keine Cloud, kein Server

### Wie viel Speicher steht zur Verfügung?

**Browser-Limits:**
- Chrome: ~60% des freien Speicherplatzes
- Firefox: ~50% des freien Speicherplatzes  
- Safari: ~1 GB

**Praktisch:**
- ~100-500 Bilder (je nach Größe)
- Empfehlung: Bilder komprimieren vor Upload

### Backup & Export?

**Aktuell:**
- Keine automatische Backup-Funktion
- Daten bleiben lokal

**Zukünftig** (siehe TASKS.md):
- Export als ZIP
- Import aus Backup
- Cloud-Sync (optional)

## 🔍 Features

### ✅ Was kann die Mediathek?

- [x] Multi-Upload (mehrere Bilder auf einmal)
- [x] Multi-Select (mehrere Bilder auswählen)
- [x] Automatische Farbextraktion
- [x] Meta-Informationen (Name, Größe, Auflösung)
- [x] Löschen einzelner Bilder
- [x] Vorschau-Grid
- [x] Statistik (Anzahl Bilder)
- [x] Hover-Info

### 🔮 Was kommt noch?

- [ ] Suche & Filter
- [ ] Tags/Kategorien
- [ ] Umbenennen
- [ ] Favoriten
- [ ] Sortierung (Name, Datum, Größe)
- [ ] Export/Import
- [ ] Cloud-Sync

## 💾 Technische Details

### Datenmodell

```typescript
interface LibraryAsset {
  id: string;
  name: string;
  src: string; // Data URL (Base64)
  palette?: Color[]; // Farbpalette
  width: number;
  height: number;
  fileSize: number; // Bytes
  uploadedAt: number; // Timestamp
  tags?: string[]; // Für zukünftige Features
}
```

### Speicher-Strategie

**Format**: Data URL (Base64)
- Vorteile: Einfach, keine Pfad-Abhängigkeiten
- Nachteile: ~33% größer als Original

**Alternative** (TODO):
- Blob-Storage
- Referenz statt Kopie

### Migration

Die Mediathek nutzt IndexedDB Version 2.

**Automatische Migration:**
- Beim ersten Laden wird DB aktualisiert
- Bestehende Boards bleiben unberührt
- Neue Tabelle `libraryAssets` wird erstellt

## 🐛 Troubleshooting

### "Bilder nicht in Mediathek sichtbar"

**Lösung:**
1. Browser-Cache leeren
2. Seite neu laden (F5)
3. Dev-Tools → Application → IndexedDB → MoodboardDB prüfen

### "Speicher voll"

**Lösung:**
1. Alte Bilder aus Mediathek löschen
2. Bilder vor Upload komprimieren (z.B. TinyPNG)
3. Browser-Speicher prüfen (chrome://settings/siteData)

### "Bilder nach Browser-Update weg"

**Normalerweise nicht!** IndexedDB bleibt erhalten.

**Falls doch:**
- Prüfe Browser-Einstellungen (Automatisches Löschen?)
- IndexedDB wurde manuell gelöscht
- Domain hat sich geändert (localhost → production)

### "Kann Bild nicht löschen"

**Lösung:**
1. Prüfe ob Bild in anderem Tab offen ist
2. Browser-Konsole öffnen (F12) für Fehler
3. Seite neu laden

## 📈 Best Practices

### 1. Bilder komprimieren

**Vor Upload:**
- Online-Tools: TinyPNG, ImageOptim
- Ziel: < 2 MB pro Bild
- Format: JPEG für Fotos, PNG für Grafiken

### 2. Aussagekräftige Namen

```
✅ Gut:
- Logo_MarkTietz_2024.png
- Portrait_Outdoor_Ref.jpg
- Hochzeit_Style_Vintage.jpg

❌ Schlecht:
- IMG_1234.jpg
- DSC_5678.jpg  
- Unbenannt.png
```

### 3. Regelmäßig aufräumen

- Nicht mehr genutzte Bilder löschen
- Duplikate vermeiden
- Ähnliche Bilder konsolidieren

### 4. Sinnvoll organisieren

**Naming-Konvention:**
```
[Kategorie]_[Beschreibung]_[Detail].ext

Beispiele:
Logo_Haupt_Schwarz.png
Portrait_Studio_Ref1.jpg
Hochzeit_Deko_Vintage.jpg
```

## 🔗 Integration

### Mit eigenen Uploads

```
1. "📁 Eigene Bilder" → Direkter Upload zum Board
2. "📚 Mediathek" → Upload zur Bibliothek → Auswahl
```

**Wann was nutzen?**
- **Eigene Bilder**: Einmalige Nutzung
- **Mediathek**: Mehrfache Nutzung

### Mit Web-Suche

```
Web-Suche → Direkter Import
Mediathek → Wiederverwertung
```

**Kombination:**
1. Web-Suche für Inspiration
2. Eigene Bilder aus Mediathek
3. Mix im Board

## 🎉 Zusammenfassung

**Was ist die Mediathek?**
- Lokaler Speicher für eigene Bilder
- Projektübergreifend nutzbar
- Browser-basiert (IndexedDB)

**Vorteile:**
- ✅ Einmal hochladen, überall nutzen
- ✅ Schneller Zugriff
- ✅ Konsistente Assets
- ✅ Speicherplatz sparen
- ✅ Organisierter Workflow

**Perfekt für:**
- Logos & Branding
- Häufig genutzte Bilder
- Template-Assets
- Referenz-Sammlungen

---

**Live testen**: https://mood-boards.vercel.app/ → Board öffnen → "📚 Mediathek" 🚀

