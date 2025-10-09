# Implementierungs-Guide für neue Features

## Status: 90% Complete ✅

### ✅ Fertiggestellt:
1. **Datenmodell** - Alle Types erweitert
2. **Datenbank** - IndexedDB v5 + SQL Migration
3. **Store-Funktionen** - reorderItems, Section-Management komplett
4. **Komponenten** - Alle 7 neuen Komponenten erstellt:
   - LayoutSwitcher
   - LinkCard
   - Checklist
   - Timeline
   - WeatherWidget
   - SectionManager
   - ImageCard mit Drag & Drop
5. **Services** - linkPreview & weatherService
6. **BoardSection** - Mit Drag & Drop und allen neuen Item-Typen
7. **Layout-CSS** - Grid/Masonry/Single-Column Modi

### 🔧 Noch zu tun:

#### BoardEditor Integration

Die folgenden Handler-Funktionen müssen in BoardEditor.tsx hinzugefügt werden:

```typescript
// Link hinzufügen
const handleAddLink = async (section: Section) => {
  setCurrentSection(section);
  setIsLinkModalOpen(true);
};

const handleLinkSubmit = async () => {
  if (!linkUrl || !currentSection) return;
  
  setLinkLoading(true);
  try {
    const preview = await fetchLinkPreview(linkUrl);
    
    await addItem(boardId, {
      type: 'link',
      linkUrl,
      linkPreview: preview,
      section: currentSection.id,
    });
    
    setLinkUrl('');
    setIsLinkModalOpen(false);
  } catch (error) {
    console.error('Failed to add link:', error);
    alert('Fehler beim Hinzufügen des Links');
  } finally {
    setLinkLoading(false);
  }
};

// Checkliste hinzufügen
const handleAddChecklist = async (section: Section) => {
  await addItem(boardId, {
    type: 'checklist',
    checklistItems: [],
    section: section.id,
  });
};

// Timeline hinzufügen
const handleAddTimeline = async (section: Section) => {
  await addItem(boardId, {
    type: 'timeline',
    timelineItems: [],
    section: section.id,
  });
};

// Layout-Modus ändern
const handleLayoutChange = (layoutMode: 'grid' | 'masonry' | 'single-column') => {
  updateBoard(boardId, { layoutMode });
};

// Sections kombinieren
const allSections = [
  ...DEFAULT_SECTIONS,
  ...(currentBoard?.customSections || [])
].sort((a, b) => a.order - b.order);
```

#### BoardSection Props Update

In der Render-Section von BoardEditor:

```typescript
<BoardSection
  section={section}
  items={getItemsBySection(section.id)}
  layoutMode={currentBoard?.layoutMode || 'grid'}
  onAddImage={handleAddImageClick}
  onAddNote={handleAddNote}
  onAddLink={handleAddLink}
  onAddChecklist={handleAddChecklist}
  onAddTimeline={handleAddTimeline}
  onOpenLibrary={handleOpenLibrary}
  onOpenWebSearch={handleOpenWebSearch}
  onImageClick={handleImageClick}
  onDeleteItem={deleteItem}
  onUpdateItem={updateItem}
  onReorderItems={reorderItems}
/>
```

#### Header erweitern

```tsx
<div className={styles.headerActions}>
  <LayoutSwitcher
    currentLayout={currentBoard?.layoutMode || 'grid'}
    onLayoutChange={handleLayoutChange}
  />
  <Button onClick={() => setIsSectionManagerOpen(true)}>
    Sections verwalten
  </Button>
  {/* ... existing buttons */}
</div>
```

#### Modals hinzufügen

```tsx
{/* Link Modal */}
{isLinkModalOpen && (
  <Modal
    isOpen={isLinkModalOpen}
    onClose={() => {
      setIsLinkModalOpen(false);
      setLinkUrl('');
    }}
    title="Link hinzufügen"
  >
    <div className={styles.linkModal}>
      <Input
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="https://..."
        disabled={linkLoading}
      />
      <Button
        onClick={handleLinkSubmit}
        disabled={!linkUrl || linkLoading}
      >
        {linkLoading ? 'Lädt...' : 'Hinzufügen'}
      </Button>
    </div>
  </Modal>
)}

{/* Section Manager */}
{isSectionManagerOpen && (
  <SectionManager
    customSections={currentBoard?.customSections || []}
    onAdd={(section) => addCustomSection(boardId, section)}
    onUpdate={(id, updates) => updateCustomSection(boardId, id, updates)}
    onDelete={(id) => deleteCustomSection(boardId, id)}
    onReorder={(ids) => reorderSections(boardId, ids)}
    onClose={() => setIsSectionManagerOpen(false)}
  />
)}
```

#### CustomerView Integration

CustomerView muss ähnlich aktualisiert werden:
1. Layout-Modus respektieren
2. LinkCard, Checklist, Timeline rendern (read-only)
3. CSS für Layout-Modi hinzufügen

### Environment Variables

`.env.example` sollte enthalten:

```
# Image Search Provider API Keys (optional)
VITE_IMAGE_UNSPLASH_KEY=your_key_here
VITE_IMAGE_PEXELS_KEY=your_key_here
VITE_IMAGE_PIXABAY_KEY=your_key_here

# Audio Provider API Keys (optional)
VITE_AUDIO_PIXABAY_KEY=your_key_here
VITE_AUDIO_FREESOUND_KEY=your_key_here

# Weather API Key (optional - für Timeline Wetter-Integration)
VITE_WEATHER_API_KEY=your_openweathermap_key

# Public Base URL (für Share-Links)
VITE_PUBLIC_BASE_URL=http://localhost:3000
```

### Supabase Migration ausführen

Die SQL-Migration `src/modules/database/migration-v5.sql` muss auf Supabase ausgeführt werden:

```bash
# Via Supabase CLI
supabase db push

# Oder manuell im Supabase Dashboard SQL Editor
```

### Testing

Nach der Integration testen:
1. ✓ Drag & Drop von Bildern
2. ✓ Custom Sections erstellen/bearbeiten/löschen
3. ✓ Layout-Modi wechseln
4. ✓ Links hinzufügen (mit Preview)
5. ✓ Checkliste erstellen und Items hinzufügen
6. ✓ Timeline mit Wetter erstellen
7. ✓ CustomerView mit allen neuen Features

### Nächste Schritte

1. BoardEditor.tsx vollständig integrieren (Handlers hinzufügen)
2. CustomerView.tsx aktualisieren für neue Item-Typen
3. .env.example erstellen
4. Supabase Migration ausführen
5. Tests schreiben
6. Dokumentation aktualisieren (README, CHANGELOG)

## Quick Integration Checklist

- [ ] BoardEditor: Handler-Funktionen hinzufügen
- [ ] BoardEditor: Neue Props an BoardSection übergeben
- [ ] BoardEditor: Modals für Link & Section-Manager
- [ ] BoardEditor: LayoutSwitcher in Header
- [ ] CustomerView: Neue Item-Typen rendern
- [ ] CustomerView: Layout-Modus unterstützen
- [ ] .env.example erstellen
- [ ] Supabase Migration ausführen
- [ ] README.md aktualisieren
- [ ] CHANGELOG.md erstellen

## Geschätzte verbleibende Zeit: 30-45 Minuten

