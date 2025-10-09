# API-Keys: Visueller Guide

Dieser Guide zeigt genau, welche Keys Sie wo finden.

## 🖼️ Unsplash

### Wo finde ich die Keys?

1. **Dashboard**: https://unsplash.com/oauth/applications
2. **Deine App auswählen**
3. **Scroll runter zu "Keys"**

### Welche Keys gibt es?

```
┌─────────────────────────────────────────┐
│ Application ID                          │
│ [Wird nicht mehr verwendet]             │
├─────────────────────────────────────────┤
│ Access Key ✅                            │
│ abcd1234efgh5678ijkl9012mnop...         │
│ [DAS BRAUCHST DU!]                      │
├─────────────────────────────────────────┤
│ Secret Key ❌                            │
│ xyz789...                                │
│ [NUR FÜR SERVER, NICHT VERWENDEN!]      │
└─────────────────────────────────────────┘
```

### ✅ Richtig in .env:

```bash
VITE_IMAGE_UNSPLASH_KEY=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwxyz1234567890
```

### ❌ Falsch:

```bash
# FALSCH - Application ID (veraltet)
VITE_IMAGE_UNSPLASH_KEY=123456

# FALSCH - Secret Key (nur für Server)
VITE_IMAGE_UNSPLASH_KEY=xyz789secret...
```

## 📸 Pexels

### Wo finde ich den Key?

1. **Dashboard**: https://www.pexels.com/api/
2. **"Your API Key" Sektion**
3. **Key ist direkt sichtbar**

```
┌─────────────────────────────────────────┐
│ Your API Key                            │
│                                         │
│ 1234567890abcdef1234567890abcdef       │
│ [📋 Copy]                               │
└─────────────────────────────────────────┘
```

### ✅ In .env:

```bash
VITE_IMAGE_PEXELS_KEY=1234567890abcdef1234567890abcdef
```

## 🌈 Pixabay

### Wo finde ich den Key?

1. **API Docs**: https://pixabay.com/api/docs/
2. **Nach Login**: Key wird oben angezeigt
3. **Oder**: Account Settings → API

```
┌─────────────────────────────────────────┐
│ Your API key:                           │
│ 12345678-abc123def456                   │
└─────────────────────────────────────────┘
```

### ✅ In .env:

```bash
VITE_IMAGE_PIXABAY_KEY=12345678-abc123def456
```

## 🧪 Keys testen

### Methode 1: In der App

1. Keys in `.env` eintragen
2. Dev-Server neu starten: `npm run dev`
3. Board öffnen → "🔍 Web-Suche"
4. Nach "test" suchen
5. Ergebnisse sollten erscheinen

### Methode 2: Browser-Konsole

1. App öffnen (nach Key-Setup)
2. F12 drücken → Konsole-Tab
3. "🔍 Web-Suche" öffnen
4. Bei Suche:
   - ✅ Erfolg: Keine Fehler, Bilder erscheinen
   - ❌ Fehler: "401 Unauthorized" → Falscher/fehlender Key
   - ❌ Fehler: "403 Forbidden" → Rate Limit erreicht

## 🔒 Sicherheit

### ✅ Sicher:

```bash
# .env (wird von Git ignoriert)
VITE_IMAGE_UNSPLASH_KEY=mein_echter_key
```

### ❌ NIEMALS:

```javascript
// Direkt im Code
const API_KEY = "mein_echter_key"; // ❌ NICHT MACHEN!

// In Git committen
git add .env // ❌ NICHT MACHEN!
```

### Prüfe .gitignore:

```bash
# .gitignore sollte enthalten:
.env
.env.local
.env.*.local
```

## 📊 Rate Limits prüfen

### Unsplash:
- **Demo**: 50 Anfragen/Stunde
- **Production** (nach Approval): 5000/Stunde

Prüfen:
```bash
# Response Header ansehen (Browser DevTools → Network)
X-Ratelimit-Remaining: 48
```

### Pexels:
- **Free**: 200 Anfragen/Stunde

### Pixabay:
- **Free**: Unbegrenzt ✨

## 🐛 Häufige Fehler

### 1. "401 Unauthorized"

**Problem**: Falscher oder fehlender API-Key

**Lösung**:
- Prüfe Key in `.env`
- Bei Unsplash: Access Key verwenden, nicht Secret Key
- Dev-Server neu starten

### 2. "403 Forbidden"

**Problem**: Rate Limit erreicht

**Lösung**:
- 1 Stunde warten
- Anderen Provider nutzen
- Production-Key beantragen (Unsplash)

### 3. "Keine Bilder gefunden" (aber keine Fehler)

**Problem**: Keys nicht geladen

**Lösung**:
```bash
# Terminal:
npm run dev

# In der Konsole sollte NICHT stehen:
# "Unsplash API key not configured"
```

## 📞 Support

**Bei Problemen**:

1. **Browser-Konsole öffnen** (F12)
2. **Nach "Unsplash", "Pexels", "Pixabay" filtern**
3. **Fehlermeldung kopieren**
4. **GitHub Issue öffnen** mit Fehlermeldung

**Niemals** den echten API-Key in Issues posten! ❌

---

## ✅ Quick-Check

Funktioniert alles? Teste mit dieser Checkliste:

- [ ] `.env` Datei erstellt
- [ ] Unsplash Access Key (nicht Secret Key!) eingetragen
- [ ] Pexels API Key eingetragen
- [ ] Pixabay API Key eingetragen
- [ ] Dev-Server neu gestartet
- [ ] "🔍 Web-Suche" öffnet sich
- [ ] Suche nach "test" zeigt Ergebnisse
- [ ] Bild-Import funktioniert
- [ ] Keine Fehler in Browser-Konsole

Alles ✅? Perfekt! 🎉

