# 🔑 API-Keys Setup-Guide

## Übersicht

Die Moodboard-App funktioniert **vollständig ohne API-Keys**! Alle Core-Features (Bilder hochladen, Sections, Drag & Drop, Checklisten, Timelines) arbeiten offline.

API-Keys sind **optional** und schalten zusätzliche Features frei:
- 🔍 Web-Bildsuche
- 🎵 Ambient Audio
- ☀️ **Wetter-Vorschau (NEU)**

---

## 🆓 Was funktioniert OHNE API-Keys?

### Vollständig funktional:
- ✅ Eigene Bilder hochladen
- ✅ Asset-Mediathek
- ✅ Drag & Drop Reordering
- ✅ Custom Sections erstellen
- ✅ Layout-Modi (Grid/Masonry/Single-Column)
- ✅ Links einbetten (mit Fallback-Icons)
- ✅ Checklisten
- ✅ Timelines (ohne Wetter)
- ✅ Notizen
- ✅ Farbpaletten-Extraktion
- ✅ Kundenansicht mit Passwortschutz

### Mit API-Keys zusätzlich:
- 🔍 Web-Bildsuche (Unsplash, Pexels, Pixabay)
- 🎵 Ambient Audio (Pixabay, Freesound)
- ☀️ **Wetter-Vorschau in Timelines (NEU)**

---

## 🌦️ Wetter-API (NEU) - Für Timeline-Feature

### OpenWeatherMap API

**Was es bringt:**
- Wetter-Vorschau für Timeline-Locations
- 5-Tage-Vorhersage
- Temperatur, Bedingungen, Wind, Regen-Wahrscheinlichkeit

**Kostenlos:**
- ✅ 60 Calls/Minute
- ✅ 1.000.000 Calls/Monat
- ✅ 5-Tage-Vorhersage
- ✅ Keine Kreditkarte erforderlich

### So bekommst du den Key:

1. **Gehe zu:** https://openweathermap.org/api
2. **Klicke auf:** "Sign Up" (oben rechts)
3. **Registriere dich:**
   - Email-Adresse
   - Username
   - Passwort
   - Bestätige Email
4. **API-Key generieren:**
   - Nach Login: Gehe zu "API keys"
   - Default-Key wird automatisch erstellt
   - Oder: Klicke "Generate" für neuen Key
5. **Key kopieren** (z.B. `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
6. **Warte 10-15 Minuten** (Key muss aktiviert werden)

### Key in .env einfügen:

```bash
VITE_WEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 🔍 Bildsuche-APIs (Optional)

### 1. Unsplash API

**Was es bringt:**
- Hochwertige, kostenlose Stock-Fotos
- Fotografen-Credits

**Kostenlos:**
- ✅ 50 Requests/Stunde
- ⚠️ Begrenzt, aber ausreichend

### So bekommst du den Key:

1. **Gehe zu:** https://unsplash.com/developers
2. **Klicke:** "Register as a developer"
3. **Erstelle eine App:**
   - App Name: "Moodboard Webapp"
   - Description: "Personal moodboard tool for photographers"
   - App Type: "Demo/Test"
4. **Key kopieren** unter "Keys" → "Access Key"

```bash
VITE_IMAGE_UNSPLASH_KEY=your_access_key_here
```

---

### 2. Pexels API

**Was es bringt:**
- Kostenlose Stock-Fotos & Videos
- Große Auswahl

**Kostenlos:**
- ✅ 200 Requests/Stunde
- ✅ Unbegrenzte Requests pro Monat

### So bekommst du den Key:

1. **Gehe zu:** https://www.pexels.com/api/
2. **Klicke:** "Get Started"
3. **Registriere dich** mit Email
4. **API-Key abrufen:**
   - Dashboard öffnen
   - "Your API Key" kopieren

```bash
VITE_IMAGE_PEXELS_KEY=your_api_key_here
```

---

### 3. Pixabay API

**Was es bringt:**
- Kostenlose CC0-Bilder
- Keine Attribution nötig

**Kostenlos:**
- ✅ Unbegrenzte Requests
- ✅ Keine Rate-Limits

### So bekommst du den Key:

1. **Gehe zu:** https://pixabay.com/api/docs/
2. **Registriere dich** (falls noch nicht)
3. **API-Key abrufen:**
   - Scrolle zu "API Search Images"
   - Klicke auf deinen API-Key Link
   - Key wird angezeigt

```bash
VITE_IMAGE_PIXABAY_KEY=your_api_key_here
```

---

## 🎵 Audio-APIs (Optional)

### 1. Pixabay Audio

**Was es bringt:**
- CC0 Ambient Sounds
- Kostenlose Musik

**Kostenlos:**
- ✅ Unbegrenzte Requests

### So bekommst du den Key:

Gleicher Key wie Pixabay Images (siehe oben)

```bash
VITE_AUDIO_PIXABAY_KEY=your_api_key_here
```

---

### 2. Freesound.org API

**Was es bringt:**
- CC-lizenzierte Sounds
- Große Community-Bibliothek

**Kostenlos:**
- ✅ Unbegrenzte Requests

### So bekommst du den Key:

1. **Gehe zu:** https://freesound.org/apiv2/apply/
2. **Registriere dich**
3. **API-Key beantragen:**
   - Name: "Moodboard Webapp"
   - Description: "Personal photography tool"
4. **Key wird per Email gesendet**

```bash
VITE_AUDIO_FREESOUND_KEY=your_api_key_here
```

---

## 📝 Komplette .env Datei

Erstelle eine `.env` Datei im Projekt-Root:

```bash
# ===== Wetter-API (NEU - für Timeline-Feature) =====
# OpenWeatherMap (https://openweathermap.org/api)
# Kostenlos: 60 Calls/Min, 1M Calls/Monat
VITE_WEATHER_API_KEY=

# ===== Bildsuche (Optional) =====
# Unsplash (https://unsplash.com/developers)
# Kostenlos: 50 Requests/Stunde
VITE_IMAGE_UNSPLASH_KEY=

# Pexels (https://www.pexels.com/api/)
# Kostenlos: 200 Requests/Stunde
VITE_IMAGE_PEXELS_KEY=

# Pixabay (https://pixabay.com/api/docs/)
# Kostenlos: Unbegrenzt
VITE_IMAGE_PIXABAY_KEY=

# ===== Audio (Optional) =====
# Pixabay Audio (gleicher Key wie Images)
VITE_AUDIO_PIXABAY_KEY=

# Freesound (https://freesound.org/apiv2/)
# Kostenlos: Unbegrenzt
VITE_AUDIO_FREESOUND_KEY=

# ===== Base URL =====
# Für lokale Entwicklung
VITE_PUBLIC_BASE_URL=http://localhost:3000

# Für Vercel Production
# VITE_PUBLIC_BASE_URL=https://your-app.vercel.app
```

---

## 🚀 Keys aktivieren

Nach dem Erstellen der `.env` Datei:

1. **Dev-Server neu starten:**
   ```bash
   # Strg+C zum Stoppen
   npm run dev
   ```

2. **Testen:**
   - Öffne die App
   - Teste Web-Bildsuche (wenn Keys vorhanden)
   - Teste Timeline mit Wetter (wenn Key vorhanden)

---

## ⚡ Schnellstart

### Nur Wetter-Feature (empfohlen):

```bash
# 1. OpenWeatherMap Key holen (siehe oben)
# 2. .env erstellen:
echo "VITE_WEATHER_API_KEY=your_key_here" > .env
echo "VITE_PUBLIC_BASE_URL=http://localhost:3000" >> .env

# 3. Server neu starten
npm run dev
```

### Alle Features:

Alle Keys (siehe oben) in `.env` eintragen und Server neu starten.

---

## 🔒 Sicherheit

**Wichtig:**
- ✅ `.env` ist in `.gitignore` (wird nicht committed)
- ✅ Keys sind client-side (VITE_ Prefix)
- ⚠️ Keys sind im Browser sichtbar (nicht für sensible Daten!)
- ✅ Alle APIs haben kostenlose Tiers mit Rate-Limits

**Für Production:**
- Keys in Vercel Environment Variables eintragen
- Nicht im Code hard-coden
- Rate-Limits beachten

---

## 🎯 Empfehlung

**Minimum für neue Features:**
```bash
VITE_WEATHER_API_KEY=...  # Für Timeline-Wetter
```

**Optional für bessere UX:**
```bash
VITE_IMAGE_PIXABAY_KEY=...  # Für Bildsuche (unbegrenzt)
VITE_AUDIO_PIXABAY_KEY=...  # Für Ambient Sounds
```

**Power-User:**
Alle Keys für maximale Features!

---

## ❓ Häufige Fragen

### Muss ich alle Keys haben?

**Nein!** Die App funktioniert komplett ohne Keys. Keys sind rein optional für zusätzliche Features.

### Kosten die APIs Geld?

**Nein!** Alle empfohlenen APIs sind kostenlos:
- OpenWeatherMap: 1M Calls/Monat gratis
- Pixabay: Unbegrenzt gratis
- Pexels: 200 Requests/Stunde gratis

### Wie teste ich, ob Keys funktionieren?

1. **Wetter:**
   - Timeline erstellen
   - Location mit Koordinaten hinzufügen
   - Wetter-Widget sollte erscheinen

2. **Bildsuche:**
   - Im Editor auf 🔍 (Web-Suche) klicken
   - Suchbegriff eingeben
   - Ergebnisse sollten erscheinen

### Was passiert ohne Keys?

- **Wetter:** Timeline funktioniert, aber ohne Wetter-Anzeige
- **Bildsuche:** Button ist deaktiviert
- **Audio:** Audio-Player ist deaktiviert

Alle anderen Features funktionieren normal!

---

## 📞 Support

Bei Problemen:
1. Überprüfe, ob `.env` im Root-Verzeichnis ist
2. Überprüfe Key-Format (keine Leerzeichen, Anführungszeichen)
3. Server neu starten nach `.env` Änderungen
4. Browser-Cache leeren

**Key funktioniert nicht?**
- OpenWeatherMap: 10-15 Min Aktivierungszeit
- Anderen APIs: Sofort aktiv

---

**Viel Erfolg!** 🚀

