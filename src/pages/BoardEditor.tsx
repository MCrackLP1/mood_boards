/**
 * Board editor page
 */

import { useEffect, useState, useRef } from 'react';
import { useBoardStore } from '@/modules/boards/store';
import { BoardSection } from '@/components/BoardSection';
import { ImageLightbox } from '@/components/ImageLightbox';
import { ImageSearch } from '@/components/ImageSearch';
import { AssetLibrary } from '@/components/AssetLibrary';
import { KeyboardHelp } from '@/components/KeyboardHelp';
import { SectionManager } from '@/components/SectionManager';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Modal } from '@/modules/ui/Modal';
import { SmoothScroller } from '@/components/SmoothScroller';
import { processImageFile } from '@/modules/assets/imageUpload';
import { extractColors } from '@/modules/assets/colorExtraction';
import { fetchLinkPreview, isPinterestUrl, isPinterestBoard } from '@/modules/links/linkPreview';
import { BoardItem, Section } from '@/types';
import { ImageSearchResult } from '@/modules/images/providers/base';
import { LibraryAsset } from '@/modules/library/types';
import { DEFAULT_SECTIONS } from '@/types/sections';
import styles from './BoardEditor.module.css';

interface BoardEditorProps {
  boardId: string;
  onBack: () => void;
  onShare: (id: string) => void;
}

export function BoardEditor({ boardId, onBack, onShare }: BoardEditorProps) {
  const { 
    currentBoard, 
    currentItems, 
    selectBoard, 
    updateBoard, 
    addItem, 
    updateItem, 
    deleteItem,
    reorderItems,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    reorderSections,
  } = useBoardStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [lightboxItem, setLightboxItem] = useState<BoardItem | null>(null);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    selectBoard(boardId);
  }, [boardId, selectBoard]);
  
  useEffect(() => {
    if (currentBoard) {
      setBoardTitle(currentBoard.title);
      setWelcomeText(currentBoard.welcomeText);
    }
  }, [currentBoard]);
  
  const handleFileUpload = async (files: FileList | null, section?: string) => {
    if (!files || files.length === 0) return;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processImageFile(file);
        
        await addItem(boardId, {
          type: 'image',
          src: processed.dataUrl,
          palette: processed.palette,
          section: section || 'general',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Bilder');
    }
  };
  
  
  const handleSaveSettings = () => {
    updateBoard(boardId, {
      title: boardTitle,
      welcomeText,
    });
    setIsSettingsOpen(false);
  };
  
  const handleImageSearchSelect = async (dataUrl: string, result: ImageSearchResult) => {
    try {
      // Extract colors from the image
      const palette = await extractColors(dataUrl);
      
      await addItem(boardId, {
        type: 'image',
        src: dataUrl,
        palette,
        section: currentSection?.id || 'general',
        meta: {
          label: result.photographer ? `By ${result.photographer}` : undefined,
          description: `From ${result.source}`,
        },
      });
    } catch (error) {
      console.error('Error adding image:', error);
      throw error; // Re-throw to handle in batch
    }
  };
  
  const handleLibrarySelect = async (assets: LibraryAsset[]) => {
    try {
      for (const asset of assets) {
        await addItem(boardId, {
          type: 'image',
          src: asset.src,
          palette: asset.palette,
          section: currentSection?.id || 'general',
          meta: {
            label: asset.name,
            description: 'Aus Mediathek',
          },
        });
      }
    } catch (error) {
      console.error('Error adding from library:', error);
      alert('Fehler beim Hinzufügen aus der Mediathek');
    }
  };
  
  const handleAddNote = async (section: Section) => {
    const text = prompt('Notiz eingeben:');
    if (text === null) return;
    
    await addItem(boardId, {
      type: 'note',
      text,
      section: section.id,
    });
  };
  
  const handleOpenImageSearch = (section: Section) => {
    setCurrentSection(section);
    setIsImageSearchOpen(true);
  };
  
  const handleOpenLibrary = (section: Section) => {
    setCurrentSection(section);
    setIsLibraryOpen(true);
  };

  // New Feature Handlers
  const handleAddLink = (section: Section) => {
    setCurrentSection(section);
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async () => {
    if (!linkUrl || !currentSection) return;
    
    setLinkLoading(true);
    try {
      // Check if it's a direct Pinterest image URL (i.pinimg.com)
      if (linkUrl.includes('pinimg.com')) {
        try {
          // Directly load the Pinterest image
          const response = await fetch(linkUrl);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          // Extract colors from the image
          const palette = await extractColors(dataUrl);
          
          // Add as image item
          await addItem(boardId, {
            type: 'image',
            src: dataUrl,
            palette,
            section: currentSection.id,
            meta: {
              label: 'Pinterest',
              description: 'Direkte Bild-URL',
            },
          });
          
          setLinkUrl('');
          setIsLinkModalOpen(false);
          return;
        } catch (error) {
          console.error('Error loading Pinterest image:', error);
          alert('❌ Fehler beim Laden des Bildes.\n\nStelle sicher, dass es eine gültige Bild-URL ist.');
          setLinkLoading(false);
          return;
        }
      }
      
      // Pinterest URLs (Boards or Pins) - just add as link without trying to fetch
      if (isPinterestBoard(linkUrl) || isPinterestUrl(linkUrl)) {
        // Add as simple link card without fetching preview (to avoid CORS issues)
        await addItem(boardId, {
          type: 'link',
          linkUrl,
          linkPreview: {
            title: 'Pinterest',
            description: linkUrl,
            image: '📌',
            domain: 'pinterest.com',
          },
          section: currentSection.id,
        });
        
        setLinkUrl('');
        setIsLinkModalOpen(false);
        return;
      }
      
      // Regular link handling for non-Pinterest URLs or failed Pinterest extraction
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

  const handleAddChecklist = async (section: Section) => {
    await addItem(boardId, {
      type: 'checklist',
      checklistItems: [],
      section: section.id,
    });
  };

  const handleAddTimeline = async (section: Section) => {
    await addItem(boardId, {
      type: 'timeline',
      timelineItems: [],
      section: section.id,
    });
  };

  const handleLayoutChange = (layoutMode: 'grid' | 'masonry' | 'single-column') => {
    updateBoard(boardId, { layoutMode });
  };

  const handleAddImageClick = (section: Section) => {
    setCurrentSection(section);
    fileInputRef.current?.click();
  };
  
  // Group items by section
  const getItemsBySection = (sectionId: string) => {
    return currentItems
      .filter(item => (item.section || 'general') === sectionId)
      .sort((a, b) => a.order - b.order);
  };

  // Combine default and custom sections
  const allSections = [
    ...DEFAULT_SECTIONS,
    ...(currentBoard?.customSections || [])
  ].sort((a, b) => a.order - b.order);
  
  const imageItems = currentItems.filter(item => item.type === 'image');
  
  const handleImageClick = (item: BoardItem) => {
    setLightboxItem(item);
  };
  
  const handleLightboxNext = () => {
    if (!lightboxItem) return;
    const currentIndex = imageItems.findIndex(i => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % imageItems.length;
    setLightboxItem(imageItems[nextIndex]);
  };
  
  const handleLightboxPrev = () => {
    if (!lightboxItem) return;
    const currentIndex = imageItems.findIndex(i => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + imageItems.length) % imageItems.length;
    setLightboxItem(imageItems[prevIndex]);
  };
  
  if (!currentBoard) {
    return <div className={styles.loading}>Lade Board...</div>;
  }
  
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" onClick={onBack}>
            ← Zurück
          </Button>
          <h1 className={styles.title}>{currentBoard.title}</h1>
        </div>
        
        <div className={styles.headerRight}>
          <LayoutSwitcher
            currentLayout={currentBoard?.layoutMode || 'grid'}
            onLayoutChange={handleLayoutChange}
          />
          <Button variant="secondary" onClick={() => setIsSectionManagerOpen(true)}>
            Sections
          </Button>
          <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
            Einstellungen
          </Button>
          <Button onClick={() => onShare(boardId)}>
            Teilen
          </Button>
        </div>
      </header>
      
      <div className={styles.content}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files, currentSection?.id)}
          style={{ display: 'none' }}
        />
        
        <SmoothScroller>
          {allSections.map(section => (
            <BoardSection
              key={section.id}
              section={section}
              items={getItemsBySection(section.id)}
              layoutMode={currentBoard?.layoutMode || 'grid'}
              onAddImage={handleAddImageClick}
              onAddNote={handleAddNote}
              onAddLink={handleAddLink}
              onAddChecklist={handleAddChecklist}
              onAddTimeline={handleAddTimeline}
              onOpenLibrary={handleOpenLibrary}
              onOpenWebSearch={handleOpenImageSearch}
              onImageClick={handleImageClick}
              onDeleteItem={deleteItem}
              onUpdateItem={updateItem}
              onReorderItems={reorderItems}
            />
          ))}
        </SmoothScroller>
      </div>
      
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Board-Einstellungen"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Titel"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
          />
          
          <Input
            label="Willkommenstext (für Kundenansicht)"
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
            placeholder="z.B. Hi Lisa & Tom – hier ist meine Vision ✨"
          />
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveSettings}>
              Speichern
            </Button>
          </div>
        </div>
      </Modal>
      
      {lightboxItem && (
        <ImageLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onNext={imageItems.length > 1 ? handleLightboxNext : undefined}
          onPrev={imageItems.length > 1 ? handleLightboxPrev : undefined}
        />
      )}
      
      {isImageSearchOpen && (
        <ImageSearch
          onImageSelect={handleImageSearchSelect}
          onClose={() => setIsImageSearchOpen(false)}
        />
      )}
      
      {isLibraryOpen && (
        <AssetLibrary
          onSelect={handleLibrarySelect}
          onClose={() => setIsLibraryOpen(false)}
        />
      )}

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://pinterest.com/..."
              disabled={linkLoading}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleLinkSubmit}
                disabled={!linkUrl || linkLoading}
              >
                {linkLoading ? 'Lädt...' : 'Hinzufügen'}
              </Button>
            </div>
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
      
      <KeyboardHelp />
    </div>
  );
}

