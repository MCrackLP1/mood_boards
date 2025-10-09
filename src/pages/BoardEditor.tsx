/**
 * Board editor page
 */

import { useEffect, useState, useRef } from 'react';
import { useBoardStore } from '@/modules/boards/store';
import { ImageCard } from '@/components/ImageCard';
import { ImageLightbox } from '@/components/ImageLightbox';
import { ImageSearch } from '@/components/ImageSearch';
import { ColorPalette } from '@/components/ColorPalette';
import { KeyboardHelp } from '@/components/KeyboardHelp';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Modal } from '@/modules/ui/Modal';
import { SmoothScroller } from '@/components/SmoothScroller';
import { processImageFile } from '@/modules/assets/imageUpload';
import { extractColors } from '@/modules/assets/colorExtraction';
import { hasSimilarColor } from '@/modules/assets/colorExtraction';
import { Color, BoardItem } from '@/types';
import { ImageSearchResult } from '@/modules/images/providers/base';
import styles from './BoardEditor.module.css';

interface BoardEditorProps {
  boardId: string;
  onBack: () => void;
  onShare: (id: string) => void;
}

export function BoardEditor({ boardId, onBack, onShare }: BoardEditorProps) {
  const { currentBoard, currentItems, selectBoard, updateBoard, addItem, updateItem, deleteItem } = useBoardStore();
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [welcomeText, setWelcomeText] = useState('');
  const [lightboxItem, setLightboxItem] = useState<BoardItem | null>(null);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
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
  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processImageFile(file);
        
        await addItem(boardId, {
          type: 'image',
          src: processed.dataUrl,
          palette: processed.palette,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Bilder');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleSaveSettings = () => {
    updateBoard(boardId, {
      title: boardTitle,
      welcomeText,
    });
    setIsSettingsOpen(false);
  };
  
  const handleImageSearchSelect = async (dataUrl: string, result: ImageSearchResult) => {
    setIsUploading(true);
    
    try {
      // Extract colors from the image
      const palette = await extractColors(dataUrl);
      
      await addItem(boardId, {
        type: 'image',
        src: dataUrl,
        palette,
        meta: {
          label: result.photographer ? `By ${result.photographer}` : undefined,
          description: `From ${result.source}`,
        },
      });
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Fehler beim Hinzufügen des Bildes');
    } finally {
      setIsUploading(false);
    }
  };
  
  const imageItems = currentItems.filter(item => item.type === 'image');
  
  // Extract all colors from all images
  const allColors: Color[] = [];
  imageItems.forEach(item => {
    if (item.palette) {
      allColors.push(...item.palette);
    }
  });
  
  // Get unique colors (by hex)
  const uniqueColors = Array.from(
    new Map(allColors.map(c => [c.hex, c])).values()
  ).slice(0, 12);
  
  const highlightedItems = selectedColor
    ? imageItems.filter(item => hasSimilarColor(item.palette, selectedColor))
    : [];
  
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
        {uniqueColors.length > 0 && (
          <ColorPalette
            colors={uniqueColors}
            selectedColor={selectedColor}
            onColorSelect={(color) => setSelectedColor(
              selectedColor?.hex === color.hex ? undefined : color
            )}
            title="Farbpalette filtern"
          />
        )}
        
        {selectedColor && (
          <div className={styles.filterInfo}>
            <span>
              {highlightedItems.length} {highlightedItems.length === 1 ? 'Bild' : 'Bilder'} mit ähnlicher Farbe
            </span>
            <button onClick={() => setSelectedColor(undefined)}>
              Filter zurücksetzen
            </button>
          </div>
        )}
        
        <div
          className={styles.uploadZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
          
          <div className={styles.uploadContent}>
            <p>Bilder hier ablegen oder</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? 'Lädt...' : '📁 Eigene Bilder'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsImageSearchOpen(true)}
                disabled={isUploading}
              >
                🔍 Web-Suche
              </Button>
            </div>
          </div>
        </div>
        
        {imageItems.length > 0 ? (
          <SmoothScroller>
            <div className={styles.grid}>
              {imageItems.map(item => (
                <div key={item.id} style={{ position: 'relative' }}>
                  <ImageCard
                    item={item}
                    isHighlighted={selectedColor ? highlightedItems.includes(item) : false}
                    onClick={() => handleImageClick(item)}
                    onDelete={() => deleteItem(item.id)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const label = prompt('Label für dieses Bild:', item.meta?.label || '');
                      if (label !== null) {
                        updateItem(item.id, {
                          meta: { ...item.meta, label: label || undefined }
                        });
                      }
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      opacity: 0.7,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    {item.meta?.label ? '✏️' : '📝'} Label
                  </button>
                </div>
              ))}
            </div>
          </SmoothScroller>
        ) : (
          <div className={styles.empty}>
            <p>Noch keine Bilder im Board</p>
          </div>
        )}
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
      
      <KeyboardHelp />
    </div>
  );
}

