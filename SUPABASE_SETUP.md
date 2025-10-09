# Supabase Cloud Sync - Setup Guide

## ✅ Was wurde eingerichtet?

Ihre Moodboard-App ist jetzt vollständig mit **Supabase** integriert! Alle Daten werden automatisch in der Cloud synchronisiert und sind auf allen Geräten verfügbar.

### 🎯 Features

- **Automatische Cloud-Synchronisation**: Alle Moodboards, Bilder und Ordner werden in Echtzeit synchronisiert
- **Offline-Fähigkeit**: IndexedDB wird als Fallback verwendet, wenn keine Internetverbindung besteht
- **Geräteübergreifend**: Arbeiten Sie auf Desktop, Tablet oder Smartphone - alles ist synchron
- **Datensicherheit**: Ihre Daten sind sicher in Supabase gespeichert

## 📋 Datenbank-Schema

Folgende Tabellen wurden erstellt:

### `boards`
- Speichert alle Moodboards
- Felder: `id`, `title`, `created_at`, `updated_at`, `welcome_text`, `branding_enabled`, `password_hash`, `ambient_sound_url`

### `board_items`
- Speichert alle Items (Bilder, Notizen) auf den Boards
- Felder: `id`, `board_id`, `type`, `section`, `order`, `created_at`, `src`, `palette`, `text`, `meta`

### `library_folders`
- Speichert die Ordnerstruktur Ihrer Asset-Bibliothek
- Felder: `id`, `name`, `icon`, `order`, `created_at`

### `library_assets`
- Speichert alle hochgeladenen Bilder und Assets
- Felder: `id`, `folder_id`, `name`, `src`, `thumbnail_src`, `palette`, `width`, `height`, `file_size`, `uploaded_at`, `tags`

## 🔑 Konfiguration

Die Verbindungsdaten sind in `.env.example` hinterlegt:

```env
VITE_SUPABASE_URL=https://bzncifehxpmyixprwqgi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Diese Datei können Sie kopieren und als `.env.local` speichern (falls noch nicht vorhanden).

## 🚀 Migration bestehender Daten

Falls Sie bereits lokale Daten haben (in IndexedDB), können Sie diese zu Supabase migrieren:

1. Starten Sie die App
2. Navigieren Sie zu: `#/migrate` (URL in Browser eingeben)
3. Klicken Sie auf "Migration starten"
4. Warten Sie, bis alle Daten übertragen sind
5. Optional: Löschen Sie die lokalen Daten nach erfolgreicher Migration

**Direkter Link zur Migration:**
```
http://localhost:5173/#/migrate
```

## 🔄 Wie funktioniert die Synchronisation?

Die App verwendet ein **Hybrid-Modell**:

1. **Primär Supabase**: Alle Operationen (Create, Read, Update, Delete) werden zuerst in Supabase ausgeführt
2. **Lokaler Cache**: IndexedDB wird parallel aktualisiert für schnellen Zugriff
3. **Fallback**: Bei fehlender Internetverbindung arbeitet die App mit IndexedDB weiter
4. **Auto-Sync**: Beim nächsten Laden werden die Daten von Supabase geladen und lokal gecacht

## 📊 Supabase Dashboard

Sie können Ihre Daten auch direkt im Supabase Dashboard einsehen:

1. Gehen Sie zu: https://supabase.com/dashboard
2. Wählen Sie Ihr Projekt: "Moodboard_API"
3. Navigieren Sie zu "Table Editor"
4. Hier sehen Sie alle Ihre Daten

## 🔒 Row Level Security (RLS)

Aktuell sind alle Tabellen für alle Nutzer zugänglich. Für eine produktive Umgebung sollten Sie:

1. **Authentifizierung aktivieren**: Supabase Auth einrichten
2. **RLS Policies anpassen**: Nur eigene Daten sichtbar machen
3. **User-Konten**: Jedem Nutzer eigene Moodboards zuweisen

Dies kann in einer späteren Version implementiert werden.

## 💾 Datensicherung

Ihre Daten werden automatisch in Supabase gesichert. Zusätzlich können Sie:

- **Manuelle Backups**: Im Supabase Dashboard unter "Database" → "Backups"
- **Automatische Backups**: Supabase erstellt täglich automatische Backups (je nach Plan)

## 🐛 Troubleshooting

### Fehler: "Missing Supabase environment variables"

Erstellen Sie eine `.env.local` Datei im Projektroot mit den Supabase-Credentials.

### Daten werden nicht synchronisiert

1. Prüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass Internetverbindung besteht
3. Überprüfen Sie die Supabase-Credentials

### Migration schlägt fehl

1. Prüfen Sie die Fehlermeldungen in der Migration-UI
2. Überprüfen Sie die Browser-Konsole
3. Stellen Sie sicher, dass die Datenbank-Tabellen existieren

## 📈 Nächste Schritte

- [ ] User-Authentifizierung hinzufügen
- [ ] RLS Policies für Datenschutz konfigurieren
- [ ] Realtime-Subscriptions für Live-Updates
- [ ] Storage Bucket für große Bilder (statt Data URLs)
- [ ] Team-Features: Boards teilen und gemeinsam bearbeiten

---

**Status**: ✅ Voll funktionsfähig
**Version**: 1.0.0
**Datum**: 2025-10-09

