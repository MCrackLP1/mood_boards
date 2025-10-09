# Supabase Troubleshooting Guide

## Problem: Bilder verschwinden nach dem Upload (409 Conflict)

### Fehler-Symptome:
```
Failed to save asset to Supabase: Object
Status: 409 (Conflict)
```

### Mögliche Ursachen:

#### 1. **Duplicate Key Conflict**
Die Asset-ID existiert bereits in der Datenbank.

**Lösung:**
```sql
-- Prüfen Sie doppelte IDs
SELECT id, COUNT(*) 
FROM library_assets 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Falls vorhanden, alte Duplikate löschen
DELETE FROM library_assets 
WHERE id IN (SELECT id FROM library_assets GROUP BY id HAVING COUNT(*) > 1);
```

#### 2. **Foreign Key Constraint**
Der `folder_id` existiert nicht in `library_folders`.

**Lösung:**
```sql
-- Prüfen Sie fehlende Ordner
SELECT DISTINCT folder_id 
FROM library_assets 
WHERE folder_id NOT IN (SELECT id FROM library_folders);

-- Uncategorized Ordner existiert?
SELECT * FROM library_folders WHERE id = 'uncategorized';
```

#### 3. **IndexedDB vs Supabase Sync Problem**
Lokale Daten sind nicht synchron mit Supabase.

**Lösung:**
1. Browser-Cache leeren (F12 → Application → IndexedDB → Löschen)
2. App neu laden
3. Oder: Migration-Tool nutzen (`/#/migrate`)

### Debugging Steps:

1. **Öffnen Sie die Browser-Konsole (F12)**
   ```javascript
   // Prüfen Sie die Error-Details
   console.log(error.message);
   console.log(error.code);
   console.log(error.details);
   ```

2. **Prüfen Sie Supabase direkt:**
   - Dashboard: https://supabase.com/dashboard
   - Projekt: Moodboard_API
   - Table Editor → `library_assets`
   - Sehen Sie die hochgeladenen Assets?

3. **Prüfen Sie die Ordner:**
   ```sql
   SELECT * FROM library_folders ORDER BY "order";
   ```

4. **Prüfen Sie Foreign Key Constraints:**
   ```sql
   SELECT * FROM information_schema.table_constraints 
   WHERE table_name = 'library_assets';
   ```

### Quick Fixes:

#### Fix 1: Datenbank zurücksetzen
```sql
-- VORSICHT: Löscht alle Assets!
TRUNCATE library_assets CASCADE;

-- Dann neu hochladen
```

#### Fix 2: IndexedDB leeren
```javascript
// In Browser-Konsole:
indexedDB.deleteDatabase('MoodboardDB');
location.reload();
```

#### Fix 3: Migration erneut durchführen
1. Gehen Sie zu `/#/migrate`
2. Klicken Sie auf "Migration starten"
3. Warten Sie bis fertig
4. Optional: Lokale Daten löschen

### Bekannte Probleme:

#### Problem: "Failed to load folders"
**Ursache:** Supabase-Verbindung fehlgeschlagen
**Lösung:** 
- Internetverbindung prüfen
- Supabase-Status prüfen: https://status.supabase.com/
- API-Keys in `.env.local` verifizieren

#### Problem: Bilder erscheinen nicht nach Upload
**Ursache:** Assets werden zu Supabase hochgeladen, aber UI aktualisiert nicht
**Lösung:**
- Seite neu laden (F5)
- Cache leeren
- Prüfen Sie Network-Tab (F12) für 200 OK Status

#### Problem: "Invalid folder_id"
**Ursache:** Der angegebene Ordner existiert nicht
**Lösung:**
```sql
-- Erstellen Sie fehlende Standardordner
INSERT INTO library_folders (id, name, icon, "order", created_at)
VALUES ('uncategorized', 'Nicht kategorisiert', '📦', 0, extract(epoch from now()) * 1000)
ON CONFLICT (id) DO NOTHING;
```

### Performance-Tipps:

1. **Bilder komprimieren**
   - Data URLs können sehr groß werden
   - Empfohlen: < 1MB pro Bild
   - Verwenden Sie Bildkompression vor dem Upload

2. **Batch-Uploads vermeiden**
   - Uploaden Sie nicht 100 Bilder auf einmal
   - Max 10-20 Bilder gleichzeitig

3. **IndexedDB als Cache nutzen**
   - Die App cached automatisch in IndexedDB
   - Schnellerer Zugriff beim erneuten Laden

### Support-Kontakte:

- **Supabase Support:** https://supabase.com/support
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** (Ihr Repository)

---

**Für weitere Hilfe, öffnen Sie ein Issue mit:**
- Browser-Konsole Log (F12)
- Network-Tab Fehler
- Supabase Dashboard Screenshot

