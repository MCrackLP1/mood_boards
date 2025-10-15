# 🎨 Beispiel-Moodboards erstellen

Dieses Projekt enthält 10 vorgefertigte, fundierte Moodboard-Beispiele mit professionellen Stock-Bildern von Unsplash.

## 📋 Enthaltene Moodboards

1. **Elegante Hochzeit** - Klassisch elegant mit sanften Pastelltönen
2. **Modern Corporate Event** - Minimalistisch modern mit kühlen Tönen
3. **Festlicher Geburtstag** - Lebhaft und festlich mit bunten Akzenten
4. **Fashion Editorial Shoot** - Editorial chic mit urbaner Eleganz
5. **Tech Product Launch** - Technologisch und zukunftsweisend
6. **Restaurant Opening** - Kulinarisch sophisticated mit warmen Tönen
7. **Fitness Brand Campaign** - Dynamisch und motivierend
8. **Boutique Hotel Experience** - Luxuriös und gemütlich
9. **Kunst-Ausstellung** - Kreativ und inspirierend
10. **Music Festival** - Lebendig und elektrisierend

## 🚀 Beispiele erstellen

### Methode 1: Browser-Konsole (Empfohlen)

1. Öffne deine Anwendung im Browser
2. Öffne die Developer Tools (F12)
3. Gehe zum Console-Tab
4. Führe folgenden Code aus:

```javascript
// Importiere die Funktion
import { createExampleBoards } from './src/scripts/create-example-boards.ts';

// Erstelle alle Beispiel-Boards
const boardIds = await createExampleBoards();
```

### Methode 2: Direkter Import in main.tsx

Füge temporär folgendes in `src/main.tsx` hinzu:

```typescript
import { createExampleBoards } from './scripts/create-example-boards';

// Bei Bedarf im Browser aufrufen
(window as any).createExampleBoards = createExampleBoards;
```

Dann in der Browser-Konsole:

```javascript
await createExampleBoards();
```

## 📝 Was wird erstellt?

Jedes Moodboard enthält:

- **5 Stock-Bilder** von Unsplash mit passenden Labels
  - Bilder werden in Sektionen "mood" und "details" organisiert
  - Hochwertige 800px Breite für schnelles Laden
  
- **3 Notizen** mit thematischen Informationen
  - Farbpalette
  - Stil-Beschreibung
  - Besondere Details
  
- **1 Checkliste** mit 4 relevanten Aufgaben
  - Vorbereitung
  - Planung
  - Umsetzung

## 🎯 Features

- ✅ **Keine Location/Zeit** - Kann später hinzugefügt werden
- ✅ **Professionelle Bilder** - Direkt von Unsplash
- ✅ **Thematisch sortiert** - Nach Sektionen organisiert
- ✅ **Masonry Layout** - Optimale Darstellung
- ✅ **Vollständig editierbar** - Alle Inhalte können angepasst werden

## 🔧 Anpassungen

Nach dem Erstellen kannst du:

1. **Timeline hinzufügen** - Location und Zeitpunkt für jedes Board
2. **Bilder ersetzen** - Eigene Bilder hochladen oder aus der Library
3. **Notizen erweitern** - Weitere Details hinzufügen
4. **Checklisten ergänzen** - Mehr Aufgaben hinzufügen
5. **Custom Sections** - Eigene Sektionen erstellen

## 💡 Verwendungszwecke

Diese Beispiele sind perfekt für:

- **Kunden-Präsentationen** - Zeige, was möglich ist
- **Portfolio** - Demonstriere deine Fähigkeiten
- **Templates** - Als Ausgangspunkt für echte Projekte
- **Testing** - Teste neue Features mit realistischen Daten

## ⚠️ Hinweise

- Die Bilder werden von Unsplash geladen (Online-Verbindung erforderlich)
- Jedes Board erhält eine eindeutige ID
- Die Boards werden direkt in Supabase gespeichert
- Die URLs zu den Boards werden in der Konsole ausgegeben

## 🔗 Verwendete Unsplash Collections

Die Bilder stammen aus kuratierten Unsplash-Sammlungen und sind frei verwendbar unter der [Unsplash Lizenz](https://unsplash.com/license).

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfe die Browser-Konsole auf Fehler
2. Stelle sicher, dass Supabase korrekt konfiguriert ist
3. Prüfe deine Internet-Verbindung

