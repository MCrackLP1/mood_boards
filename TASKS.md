# TODOs & Erweiterungen

## 🔜 Nächste Schritte (MVP-Erweiterungen)

### Passwortschutz komplett implementieren
- [ ] UI im Board-Editor für Passwort-Eingabe
- [ ] Passwort-Hash in Board speichern
- [ ] Test-Suite für Passwort-Flow

### Audio-Features aktivieren
- [ ] UI für Audio-Suche im Board-Editor
- [ ] Board mit ausgewähltem Sound verknüpfen
- [ ] Fallback für lokale Audio-Dateien (`/public/sounds/`)
- [ ] Audio-Provider-Tests

### Fullscreen-View
- [ ] Lightbox für Bilder mit Notiz/Meta
- [ ] Tastatur-Navigation (←/→ für Bilder)
- [ ] ESC zum Schließen

### Notizen pro Element
- [ ] Text-Input für Bild-Labels
- [ ] Beschreibung/Meta-Daten hinzufügen
- [ ] UI für Notiz-Anzeige in CustomerView

## 🎁 Stretch Goals

### Export als PDF
- [ ] PDF-Generator (z.B. jsPDF oder Puppeteer)
- [ ] Hübsches Layout für Board-Druck
- [ ] "Als PDF exportieren" Button im Editor

### Erweiterte Passwort-Funktionen
- [ ] Share-Link-Generator mit Ablaufdatum
- [ ] Zugriffszähler für Customer-Views

### Local-First + Sync
- [ ] Sync-Adapter-Interface
- [ ] Optional: Firebase/Supabase Adapter
- [ ] Konfliktauflösung bei Multi-Device-Nutzung

### Performance-Optimierungen
- [ ] Lazy-Loading für Bilder (Intersection Observer)
- [ ] Thumbnail-Generierung für Vorschaubilder
- [ ] Service Worker für Offline-Nutzung

### UI/UX-Verbesserungen
- [ ] Drag & Drop Reordering der Bilder
- [ ] Grid vs. Masonry Layout Toggle
- [ ] Dark Mode
- [ ] Keyboard Shortcuts

### Barrierefreiheit
- [ ] Alt-Texte für alle Bilder
- [ ] ARIA-Labels überprüfen
- [ ] Kontrast-Prüfung (WCAG AA)
- [ ] Screen-Reader-Tests

### SEO (Customer View)
- [ ] Dynamic Meta-Tags (Title, OG-Image)
- [ ] Generierte OG-Preview-Images

## 🐛 Bekannte Einschränkungen

### Datenspeicherung
- **IndexedDB-Limits**: Bilder als Base64 können Browser-Limits erreichen
- **Lösung**: Object URLs + Blob Storage oder Server-Upload für größere Boards

### Audio-Provider
- **API-Keys erforderlich**: Ohne Keys sind Audio-Features deaktiviert
- **CORS**: Manche Audio-URLs erfordern Proxy

### Passwortschutz
- **Clientseitig**: Kein echter Schutz, nur Komfort-Feature
- **Lösung**: Serverseitige Authentifizierung für echte Sicherheit

### Browser-Kompatibilität
- **crypto.randomUUID()**: Fallback vorhanden, aber älter Browser könnten Probleme haben
- **IndexedDB**: IE11 nicht unterstützt (akzeptabel)

## 🔌 Erweiterungspunkte

### Audio-Provider hinzufügen
1. Neue Klasse in `src/modules/audio/providers/` erstellen
2. `BaseAudioProvider` erweitern
3. In `audioManager.ts` registrieren

Beispiel:
```typescript
// src/modules/audio/providers/spotify.ts
export class SpotifyAudioProvider extends BaseAudioProvider {
  name = 'Spotify';
  // ... implementation
}
```

### Neuen Item-Typ hinzufügen
1. `BoardItem['type']` in `src/types/index.ts` erweitern
2. UI-Komponente in `src/components/` erstellen
3. Handling in `BoardEditor` und `CustomerView` hinzufügen

### Storage-Adapter wechseln
1. Neue Adapter-Klasse erstellen (z.B. `FirebaseAdapter`)
2. Dexie-Interface beibehalten oder abstrahieren
3. In `src/modules/database/db.ts` austauschen

## 📊 Metriken

### Performance-Ziele
- [x] Home lädt in < 1s (dev-mode)
- [x] Bilder-Upload mit sofortiger Palette
- [ ] Lighthouse Score > 90 (Performance, A11y, Best Practices)

### Code-Qualität
- [x] TypeScript strict mode
- [x] Keine ESLint-Fehler
- [ ] Test-Coverage > 70% (aktuell ~30%)
- [x] Modulare Architektur

---

**Hinweis**: Diese Datei ist ein lebendiges Dokument. Bei Änderungen bitte hier aktualisieren.

