# 🚀 Quick Start Guide – Moodboard-Webapp

**In 5 Minuten zum ersten Kunden-Board!**

---

## 📝 Schritt 1: Erstes Board erstellen

1. Server starten (falls noch nicht läuft):
   ```bash
   npm run dev
   ```

2. Browser öffnen: `http://localhost:3000`

3. Titel eingeben (z.B. "Hochzeit Lisa & Tom") → **Create** klicken

---

## 📸 Schritt 2: Bilder hochladen

1. **Drag & Drop** Bilder in die Dropzone  
   *ODER*  
   Auf Dropzone klicken → Bilder auswählen

2. **Tipp:** 5-15 Bilder sind ideal für ein Moodboard

3. Warte kurz – Bilder werden automatisch mit Farbpalette geladen

---

## ✍️ Schritt 3: Notizen hinzufügen

1. **"Add Note"** Button klicken

2. Text eingeben (z.B. "Goldene Stunde für romantische Stimmung")

3. Klicke außerhalb → Notiz wird automatisch gespeichert

---

## 🎨 Schritt 4: Mit Farben spielen (optional)

1. Klicke auf ein **Farbfeld** unter einem Bild

2. Alle Bilder mit ähnlicher Farbe bleiben sichtbar, andere werden transparent

3. **"Clear"** klicken zum Zurücksetzen

---

## 🌐 Schritt 5: Mit Kunden teilen

1. **"Einstellungen"** Button (oben rechts) klicken

2. **Board-Settings** ausfüllen:
   - **Kundenname:** "Lisa & Tom" *(erscheint in Willkommensanimation)*
   - **Willkommensnachricht:** "Hier ist mein Shooting-Vorschlag für euer Hochzeits-Shooting ✨"
   - **Passwort:** (optional) z.B. "hochzeit2025"
   - **Signatur anzeigen:** ✅ An

3. **Share-Link kopieren** (Copy-Button)

4. **"Speichern"** klicken

5. Link an Kunde senden (z.B. per E-Mail/WhatsApp)

---

## 👀 Schritt 6: Kundenansicht testen

1. **Öffne den kopierten Link** in einem neuen Tab/Inkognito-Fenster

2. Du siehst:
   - ✨ **Willkommensanimation** (2,5 Sekunden)
   - 📸 **Dein Moodboard** in Read-Only-Ansicht
   - 🖋️ **Deine Signatur** (falls aktiviert)

3. Falls Passwort gesetzt → Passwort-Eingabe erscheint

---

## 💡 Pro-Tipps

### Optimale Bilder
- **Format:** JPG oder PNG
- **Größe:** Min. 1920px Breite für beste Qualität
- **Komprimierung:** Nutze [TinyPNG](https://tinypng.com) vor Upload

### Board-Organisation
- **Thematisch gruppieren:** Verwende Notizen als Zwischen-Überschriften
- **Farb-Story:** Nutze Farbfilter, um Farbharmonien zu zeigen
- **Weniger ist mehr:** 10-15 starke Bilder > 30 mittelmäßige

### Workflow-Trick
1. **Template-Board erstellen** mit Standardnotizen
2. **Duplizieren** (Copy-Button auf Startseite)
3. **Bilder austauschen** → Neues Projekt in 2 Minuten!

---

## 🎭 Demo-Workflow: Hochzeits-Shooting

### Board: "Hochzeit Lisa & Tom – Goldene Stunde"

**Schritt-für-Schritt:**
1. Board erstellen: "Hochzeit Lisa & Tom"
2. Upload: 10 Bilder mit Sonnenuntergang/Golden Hour
3. Notiz: "🌅 Location: Strand bei Sonnenuntergang"
4. Notiz: "💍 Fokus auf natürliche, emotionale Momente"
5. Farbfilter testen: Klicke auf goldene/orange Farbtöne
6. Settings:
   - Kunde: "Lisa & Tom"
   - Message: "Euer Hochzeits-Moodboard – Ich freue mich darauf, eure Geschichte zu erzählen! ✨"
   - Passwort: "goldstunde2025"
7. Link kopieren & senden

**Ergebnis:** Professionelle Präsentation in 5 Minuten! 🎉

---

## 🔄 Weitere Aktionen

### Board duplizieren
- Auf Startseite → **Copy-Button** (erscheint bei Hover)
- Nutze als Template für ähnliche Projekte

### Board löschen
- Auf Startseite → **Trash-Button** (erscheint bei Hover)
- Bestätigung erforderlich

### Titel ändern
- Board öffnen → **Auf Titel klicken** → Neuen Titel eingeben → Enter

### Notiz/Bild löschen
- **Hover** über Element → **Trash-Icon** klicken

---

## ❓ FAQ

### Werden meine Daten gespeichert?
✅ Ja, lokal im Browser (LocalStorage). Kein Server-Upload.

### Kann ich Boards auf anderen Geräten öffnen?
❌ Nein, LocalStorage ist Browser-gebunden. Für Cross-Device: Supabase-Migration nötig.

### Wie viele Bilder kann ich hochladen?
⚠️ LocalStorage hat ~5-10MB Limit. Empfehlung: Max. 20 Bilder pro Board.

### Share-Link funktioniert nicht?
✅ Share-Links funktionieren NUR mit laufendem Dev-Server oder nach Deployment.

### Kann ich Bilder nachträglich löschen?
✅ Ja, Hover über Bild → Trash-Button. *(Aktuell nicht implementiert, ToDo)*

---

## 🌐 Deployment (Vercel)

### One-Click Deploy:

1. **Code auf GitHub pushen**
2. Auf [vercel.com](https://vercel.com) einloggen
3. "New Project" → Repository importieren
4. Vercel erkennt Next.js automatisch
5. **Deploy** klicken
6. Fertig! Link: `https://dein-projekt.vercel.app`

**Share-Links funktionieren dann weltweit!** 🌍

---

## 🆘 Probleme?

### Dev-Server startet nicht
```bash
# Dependencies neu installieren
rm -rf node_modules
npm install
npm run dev
```

### Bilder werden nicht angezeigt
- Browser-Console öffnen (F12) → Fehler checken
- LocalStorage voll? → Alte Boards löschen

### Share-Link zeigt "Board not found"
- **Dev-Server läuft?** → `npm run dev` starten
- **Nach Deployment:** Vercel-URL verwenden, nicht localhost

---

## 📞 Support

**Fragen oder Bugs?**
- GitHub Issues erstellen
- README.md & ANALYSE.md lesen

---

**Viel Erfolg mit deinen Kunden-Präsentationen!** 🎨✨

*Made with ❤️ by Mark Tietz Fotografie*

