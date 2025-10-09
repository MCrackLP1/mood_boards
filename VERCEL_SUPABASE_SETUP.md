# Vercel + Supabase Setup Guide

## 🔑 Environment Variables für Vercel

Um Ihre Moodboard-App mit Supabase auf Vercel zu deployen, müssen Sie folgende Environment Variables hinzufügen:

### Schritt-für-Schritt Anleitung:

1. **Öffnen Sie Ihr Vercel Dashboard**
   - Gehen Sie zu: https://vercel.com/dashboard
   - Wählen Sie Ihr Projekt aus

2. **Navigieren Sie zu Settings**
   - Klicken Sie auf "Settings" (oben)
   - Wählen Sie "Environment Variables" im Menü links

3. **Fügen Sie folgende Variables hinzu:**

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://bzncifehxpmyixprwqgi.supabase.co
   ```
   
   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bmNpZmVoeHBteWl4cHJ3cWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Nzc1MDEsImV4cCI6MjA3NTU1MzUwMX0.m_GJxXfte1lUzEOhVErGVp1I5mOUrwaDJdckorB-AWE
   ```

4. **Wählen Sie die Environments**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Speichern Sie die Variables**
   - Klicken Sie auf "Save"

6. **Neu deployen**
   - Gehen Sie zu "Deployments"
   - Klicken Sie auf "Redeploy" beim letzten Deployment
   - ODER: Pushen Sie einen neuen Commit zu GitHub

## 📋 Zusammenfassung

### Variables die Sie brauchen:

| Name | Wert |
|------|------|
| `VITE_SUPABASE_URL` | `https://bzncifehxpmyixprwqgi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (siehe oben) |

## ✅ Nach dem Setup

Nach dem Hinzufügen der Environment Variables und einem Neu-Deployment:

1. **Testen Sie die Produktion-App**
   - Öffnen Sie Ihre Vercel-URL
   - Erstellen Sie ein Test-Moodboard
   - Prüfen Sie im Supabase Dashboard, ob die Daten ankommen

2. **Migration für Live-Nutzer**
   - Ihre bestehenden Nutzer können zu `ihre-domain.vercel.app/#/migrate` gehen
   - Dort ihre lokalen Daten zu Supabase migrieren

## 🔒 Sicherheit

**Wichtig:** Der `ANON_KEY` ist öffentlich und kann sicher im Frontend verwendet werden. Er hat eingeschränkte Rechte durch Row Level Security (RLS).

Für zusätzliche Sicherheit in Produktion:
- [ ] Aktivieren Sie Supabase Auth
- [ ] Konfigurieren Sie RLS Policies
- [ ] Beschränken Sie Zugriff auf eigene Daten

## 🐛 Troubleshooting

### "Missing Supabase environment variables" Error

**Problem:** Die App zeigt einen Fehler nach dem Deployment

**Lösung:**
1. Überprüfen Sie, dass beide Variables in Vercel gesetzt sind
2. Stellen Sie sicher, dass sie für "Production" aktiviert sind
3. Deployen Sie erneut

### Daten werden nicht synchronisiert

**Problem:** Lokale Änderungen erscheinen nicht in der Cloud

**Lösung:**
1. Öffnen Sie Browser-Konsole (F12)
2. Prüfen Sie auf Netzwerkfehler
3. Verifizieren Sie die Supabase-URL im Network-Tab
4. Prüfen Sie Supabase Dashboard → Settings → API für korrekte Credentials

## 📸 Visual Guide

### So finden Sie die Environment Variables in Vercel:

```
Vercel Dashboard
└── Ihr Projekt auswählen
    └── Settings (Tab)
        └── Environment Variables (Sidebar)
            └── Add New (Button)
                ├── Name: VITE_SUPABASE_URL
                ├── Value: [Supabase URL]
                └── Environments: ✓ Production ✓ Preview ✓ Development
```

## 🚀 Deployment Checklist

- [ ] Environment Variables in Vercel hinzugefügt
- [ ] Beide für Production, Preview und Development aktiviert
- [ ] Neu deployed (via Vercel oder Git Push)
- [ ] Produktions-URL getestet
- [ ] Test-Moodboard erstellt
- [ ] Daten im Supabase Dashboard sichtbar
- [ ] Migration-URL funktioniert (`/#/migrate`)

---

**Nach dem Setup ist Ihre App live und synchronisiert alle Daten in Echtzeit! 🎉**

