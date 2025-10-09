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
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Modal } from '@/modules/ui/Modal';
import { SmoothScroller } from '@/components/SmoothScroller';
import { processImageFile } from '@/modules/assets/imageUpload';
import { extractColors } from '@/modules/assets/colorExtraction';
import { BoardItem } from '@/types';
import { ImageSearchResult } from '@/modules/images/providers/base';
import { LibraryAsset } from '@/modules/library/types';
import { DEFAULT_SECTIONS, Section, SectionType } from '@/types/sections';
import styles from './BoardEditor.module.css';

interface BoardEditorProps {
  boardId: string;
  onBack: () => void;
  onShare: (id: string) => void;
}

export function BoardEditor({ boardId, onBack, onShare }: BoardEditorProps) {
  const { currentBoard, currentItems, selectBoard, updateBoard, addItem, updateItem, deleteItem } = useBoardStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [lightboxItem, setLightboxItem] = useState<BoardItem | null>(null);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
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
  
  const handleFileUpload = async (files: FileList | null, section?: SectionType) => {
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
  
  const handleAddImage = (section: Section) => {
    setCurrentSection(section);
    fileInputRef.current?.click();
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
  
  // Group items by section
  const getItemsBySection = (sectionId: SectionType) => {
    return currentItems
      .filter(item => (item.section || 'general') === sectionId)
      .sort((a, b) => a.order - b.order);
  };
  
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
          {DEFAULT_SECTIONS.map(section => (
            <BoardSection
              key={section.id}
              section={section}
              items={getItemsBySection(section.id)}
              onAddImage={handleAddImage}
              onAddNote={handleAddNote}
              onOpenLibrary={handleOpenLibrary}
              onOpenWebSearch={handleOpenImageSearch}
              onImageClick={handleImageClick}
              onDeleteItem={deleteItem}
              onUpdateItem={updateItem}
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
      
      <KeyboardHelp />
    </div>
  );
}

