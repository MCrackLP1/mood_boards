# Web-Bildsuche Anleitung

Die Moodboard-App unterstützt die Suche und den Import von hochqualitativen Stock-Fotos direkt aus drei führenden Foto-Plattformen.

## 🌐 Unterstützte Provider

### 1. Unsplash
- **Lizenz**: Unsplash License (kostenlose Nutzung, keine Attribution erforderlich)
- **Qualität**: ⭐⭐⭐⭐⭐ Hochauflösend, professionell
- **Free Tier**: 50 Anfragen/Stunde
- **API-Key**: https://unsplash.com/developers

### 2. Pexels
- **Lizenz**: Pexels License (kostenlose Nutzung, keine Attribution erforderlich)
- **Qualität**: ⭐⭐⭐⭐⭐ Hochauflösend, kuratiert
- **Free Tier**: 200 Anfragen/Stunde
- **API-Key**: https://www.pexels.com/api/

### 3. Pixabay
- **Lizenz**: CC0 (Public Domain)
- **Qualität**: ⭐⭐⭐⭐ Gute Qualität, große Auswahl
- **Free Tier**: Keine Limits
- **API-Key**: https://pixabay.com/api/docs/

## 🚀 Einrichtung

### Schritt 1: API-Keys erhalten

#### Unsplash
1. Gehe zu https://unsplash.com/developers
2. Klicke auf "Register as a developer"
3. Erstelle eine neue App:
   - Name: "Moodboard Webapp" (oder beliebig)
   - Description: "Personal moodboard tool"
   - Akzeptiere die API Guidelines
4. Kopiere den **"Access Key"** (NICHT Secret Key!)
   - Zu finden unter: Dashboard → Your Apps → [App Name]
   - Der Access Key beginnt meist mit einem langen alphanumerischen String

#### Pexels
1. Gehe zu https://www.pexels.com/api/
2. Klicke auf "Get Started"
3. Erstelle einen Account
4. Kopiere den API-Key aus dem Dashboard

#### Pixabay
1. Gehe zu https://pixabay.com/api/docs/
2. Melde dich an oder registriere dich
3. API-Key wird direkt angezeigt

### Schritt 2: Keys in .env einfügen

Erstelle eine `.env`-Datei im Projekt-Root:

```bash
# Image Search Providers
# Unsplash: Verwende den "Access Key" (nicht Secret Key!)
VITE_IMAGE_UNSPLASH_KEY=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwxyz

# Pexels: API Key aus dem Dashboard
VITE_IMAGE_PEXELS_KEY=dein_pexels_api_key

# Pixabay: API Key (wird direkt nach Anmeldung angezeigt)
VITE_IMAGE_PIXABAY_KEY=dein_pixabay_api_key
```

**Wichtig für Unsplash**: 
- ✅ **Access Key** verwenden (öffentliche Anfragen)
- ❌ **Nicht** den Secret Key verwenden (nur für Server)
- Der Access Key ist länger (~60 Zeichen)

### Schritt 3: Dev-Server neu starten

```bash
npm run dev
```

## 💡 Verwendung

### Im Board-Editor:

1. Öffne ein Board
2. Klicke auf **"🔍 Web-Suche"** im Upload-Bereich
3. Gib einen Suchbegriff ein (z.B. "Wedding", "Portrait", "Sunset")
4. Durchsuche die Ergebnisse aus allen Providern

**Einzelnes Bild hinzufügen:**
5. Klicke auf ein Bild (nur einmal) → Es wird ausgewählt (✓)
6. Klicke auf "1 Bild hinzufügen"
7. Das Bild wird heruntergeladen und mit Farbpalette hinzugefügt

**Mehrere Bilder auf einmal:**
5. Klicke auf mehrere Bilder (✓ erscheint bei jedem)
6. Klicke auf "X Bilder hinzufügen"
7. Alle ausgewählten Bilder werden importiert 🎉

### Tipps für bessere Suchergebnisse:

- **Englische Begriffe verwenden**: Die APIs funktionieren am besten mit englischen Suchbegriffen
- **Spezifisch sein**: "Beach sunset golden hour" statt nur "Beach"
- **Kategorien nutzen**: "Wedding photography", "Food styling", "Architecture modern"
- **Kombinationen**: "Portrait natural light outdoor"

## 📊 Performance

### Parallele Suche
Die App fragt alle konfigurierten Provider gleichzeitig ab, um schnellere Ergebnisse zu liefern.

### Caching
Suchergebnisse werden während der Session gecacht.

### Download-Optimierung
- Bilder werden erst beim Klick heruntergeladen
- Progress-Indicator während des Downloads
- Automatische Farbextraktion nach Import

## 🔒 Sicherheit & Privatsphäre

### API-Keys
- Keys werden nur clientseitig verwendet
- Niemals in den Code committen
- In `.env`-Datei (wird von Git ignoriert)

### Rate Limits
- Unsplash: 50 req/h (für Demo ausreichend)
- Pexels: 200 req/h (sehr großzügig)
- Pixabay: Unbegrenzt

### Fallback-Modus
Ohne API-Keys:
- Web-Suche zeigt Hinweis an
- Funktioniert mit Link zur Anleitung
- Kein Absturz der App

## 🎨 Automatische Attribution

Beim Import wird automatisch:
- **Photographer-Name** als Label hinzugefügt
- **Quellen-Info** in Beschreibung gespeichert
- In Lightbox und auf Karten angezeigt

Beispiel:
```
Label: "By Annie Spratt"
Description: "From Unsplash"
```

## 🐛 Troubleshooting

### "Keine Bilder gefunden"
- **Lösung**: Prüfe, ob API-Keys korrekt in `.env` eingetragen sind
- **Lösung**: Bei Unsplash: Access Key verwenden (nicht Secret Key!)
- **Lösung**: Dev-Server neu starten nach `.env`-Änderung
- **Lösung**: Andere Suchbegriffe probieren
- **Lösung**: Browser-Konsole öffnen für genaue Fehlermeldungen

### API-Rate-Limit erreicht
- **Lösung**: 1 Stunde warten (Limits resetten stündlich)
- **Lösung**: Anderen Provider nutzen
- **Lösung**: Eigene Bilder hochladen (immer möglich)

### Download schlägt fehl
- **Lösung**: Internetverbindung prüfen
- **Lösung**: Anderes Bild versuchen
- **Lösung**: Browser-Konsole für Details öffnen

### CORS-Fehler
- **Lösung**: Sollte nicht auftreten (Provider unterstützen CORS)
- **Falls doch**: Proxy-Server verwenden (siehe Deployment-Docs)

## 📚 Weitere Ressourcen

- **Unsplash Guidelines**: https://unsplash.com/api-terms
- **Pexels API Docs**: https://www.pexels.com/api/documentation/
- **Pixabay API Docs**: https://pixabay.com/api/docs/

## 🔮 Roadmap

### Geplante Features:
- [ ] **Filter**: Orientierung (Landscape/Portrait), Farbe, Größe
- [ ] **Favoriten**: Bilder für späteren Import merken
- [ ] **History**: Zuletzt gesuchte Begriffe
- [ ] **Batch-Import**: Mehrere Bilder auf einmal hinzufügen
- [ ] **Mehr Provider**: Getty Images, Adobe Stock (mit Paid APIs)

---

**Fragen oder Probleme?** Öffne ein Issue auf GitHub!

