# Quick Start

Schnelleinstieg in die Moodboard-Webapp.

## ⚡ In 3 Schritten starten

### 1. Dependencies installieren
```bash
npm install
```

### 2. Dev-Server starten
```bash
npm run dev
```

Öffne http://localhost:3000 in deinem Browser.

### 3. Erstes Board erstellen
1. Klicke auf "Neues Board"
2. Gib einen Titel ein (z.B. "Mein erstes Moodboard")
3. Lade Bilder hoch per Drag & Drop
4. Klicke auf Farben, um ähnliche Bilder zu filtern

## 🎯 Wichtigste Features ausprobieren

### Board teilen
1. Öffne ein Board im Editor
2. Klicke auf "Teilen"
3. Link wird in die Zwischenablage kopiert
4. Öffne den Link in einem Inkognito-Fenster → Kundenansicht

### Farb-Filter
1. Lade mehrere Bilder hoch
2. Warte, bis die Farbpaletten erscheinen
3. Klicke auf eine Farbe → ähnliche Bilder werden hervorgehoben
4. Nochmal klicken zum Zurücksetzen

### Board-Einstellungen
1. Im Editor auf "Einstellungen" klicken
2. Willkommenstext für Kunden anpassen
3. Änderungen speichern

## 🧪 Demo-Daten laden

Öffne die Browser-Console (F12) und führe aus:

```javascript
import { seedDemo } from './src/modules/database/seed.ts'
seedDemo()
```

Alternativ: Erstelle manuell ein Board und lade ein paar Bilder hoch.

## 📦 Build für Produktion

```bash
npm run build
```

Der `dist/` Ordner enthält die fertigen Dateien für Deployment.

## 🐛 Troubleshooting

### "Cannot find module" Fehler
```bash
rm -rf node_modules package-lock.json
npm install
```

### IndexedDB-Daten zurücksetzen
Browser-Console öffnen (F12):
```javascript
indexedDB.deleteDatabase('MoodboardDB')
```
Dann Seite neu laden.

### Tests laufen nicht
```bash
npm install --save-dev jsdom
npm test
```

## 🔑 Audio-Features aktivieren (optional)

1. Kopiere `.env.example` zu `.env`
2. Trage API-Keys ein:
   ```
   VITE_AUDIO_PIXABAY_KEY=dein_key
   VITE_AUDIO_FREESOUND_KEY=dein_key
   ```
3. Server neu starten

Audio-Keys erhältst du hier:
- Pixabay: https://pixabay.com/api/docs/
- Freesound: https://freesound.org/apiv2/apply/

## 📚 Weitere Dokumentation

- **Vollständige Anleitung**: [README.md](./README.md)
- **Erweiterungen & TODOs**: [TASKS.md](./TASKS.md)

## 💡 Tipps

- **Lighthouse-Score prüfen**: Chrome DevTools → Lighthouse → Performance/Accessibility testen
- **Bilder optimieren**: Große Bilder (>2MB) komprimieren vor Upload
- **Mehrere Boards**: Teste Duplizieren-Funktion für Vorlagen
- **Responsiveness**: Teste auf verschiedenen Bildschirmgrößen

Viel Erfolg! 🎨✨


