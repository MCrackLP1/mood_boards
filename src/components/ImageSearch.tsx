/**
 * Image search component
 * Search and add images from Unsplash, Pexels, Pixabay
 */

import { useState } from 'react';
import { imageSearchManager } from '@/modules/images/imageSearchManager';
import { ImageSearchResult } from '@/modules/images/providers/base';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import styles from './ImageSearch.module.css';

interface ImageSearchProps {
  onImageSelect: (dataUrl: string, result: ImageSearchResult) => void;
  onClose: () => void;
}

export function ImageSearch({ onImageSelect, onClose }: ImageSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await imageSearchManager.search({
        query: query.trim(),
        perPage: 20,
      });
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        alert('Keine Bilder gefunden. Versuche einen anderen Suchbegriff oder füge API-Keys hinzu (.env).');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Fehler bei der Suche. Bitte versuche es erneut.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleImageClick = (result: ImageSearchResult) => {
    // Toggle selection
    const newSelected = new Set(selectedImages);
    const imageKey = `${result.source}-${result.id}`;
    
    if (newSelected.has(imageKey)) {
      newSelected.delete(imageKey);
    } else {
      newSelected.add(imageKey);
    }
    
    setSelectedImages(newSelected);
  };
  
  const handleAddSelected = async () => {
    if (selectedImages.size === 0) return;
    
    setIsAddingBatch(true);
    
    try {
      // Find all selected results
      const selectedResults = results.filter(result => 
        selectedImages.has(`${result.source}-${result.id}`)
      );
      
      // Download and add all images
      for (const result of selectedResults) {
        try {
          const dataUrl = await imageSearchManager.downloadImage(result);
          await onImageSelect(dataUrl, result);
        } catch (error) {
          console.error(`Failed to add image ${result.id}:`, error);
          // Continue with other images even if one fails
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Batch add error:', error);
      alert('Einige Bilder konnten nicht hinzugefügt werden. Bitte versuche es erneut.');
    } finally {
      setIsAddingBatch(false);
    }
  };
  
  const isImageSelected = (result: ImageSearchResult) => {
    return selectedImages.has(`${result.source}-${result.id}`);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Bilder suchen</h2>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.searchBar}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. Wedding, Portrait, Landscape..."
            autoFocus
          />
          <div className={styles.searchButtons}>
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? 'Suche...' : 'Suchen'}
            </Button>
            {selectedImages.size > 0 && (
              <Button 
                onClick={handleAddSelected}
                disabled={isAddingBatch}
                style={{ minWidth: '200px' }}
              >
                {isAddingBatch 
                  ? `Füge ${selectedImages.size} Bilder hinzu...` 
                  : `${selectedImages.size} ${selectedImages.size === 1 ? 'Bild' : 'Bilder'} hinzufügen`
                }
              </Button>
            )}
          </div>
        </div>
        
        <div className={styles.info}>
          <small>
            Quellen: Unsplash, Pexels, Pixabay
            {' · '}
            <a 
              href="https://github.com/MCrackLP1/mood_boards#-audio-features-aktivieren-optional" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              API-Keys hinzufügen
            </a>
          </small>
        </div>
        
        {results.length > 0 && (
          <div className={styles.results}>
            <div className={styles.resultHeader}>
              <p className={styles.resultCount}>
                {results.length} Bilder gefunden
              </p>
              {selectedImages.size > 0 && (
                <button 
                  className={styles.clearSelection}
                  onClick={() => setSelectedImages(new Set())}
                >
                  Auswahl aufheben
                </button>
              )}
            </div>
            
            <div className={styles.grid}>
              {results.map(result => {
                const selected = isImageSelected(result);
                return (
                  <div 
                    key={`${result.source}-${result.id}`}
                    className={`${styles.imageCard} ${selected ? styles.selected : ''}`}
                    onClick={() => handleImageClick(result)}
                  >
                    <img 
                      src={result.thumbnailUrl} 
                      alt={result.alt || 'Image'}
                      className={styles.thumbnail}
                    />
                    
                    {selected && (
                      <div className={styles.checkmark}>
                        <div className={styles.checkmarkIcon}>✓</div>
                      </div>
                    )}
                    
                    <div className={styles.imageInfo}>
                      <div className={styles.photographer}>
                        📷 {result.photographer || 'Unknown'}
                      </div>
                      <div className={styles.source}>
                        {result.source}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {results.length === 0 && !isSearching && (
          <div className={styles.empty}>
            <p>🔍 Suche nach inspirierenden Bildern</p>
            <p className={styles.examples}>
              Beispiele: "Wedding Photography", "Sunset", "Portrait"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

