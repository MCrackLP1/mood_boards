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
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
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
  
  const handleImageClick = async (result: ImageSearchResult) => {
    setIsDownloading(result.id);
    
    try {
      const dataUrl = await imageSearchManager.downloadImage(result);
      onImageSelect(dataUrl, result);
      onClose();
    } catch (error) {
      console.error('Download error:', error);
      alert('Fehler beim Laden des Bildes. Bitte versuche es erneut.');
    } finally {
      setIsDownloading(null);
    }
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
          <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
            {isSearching ? 'Suche...' : 'Suchen'}
          </Button>
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
            <p className={styles.resultCount}>
              {results.length} Bilder gefunden
            </p>
            
            <div className={styles.grid}>
              {results.map(result => (
                <div 
                  key={`${result.source}-${result.id}`}
                  className={`${styles.imageCard} ${isDownloading === result.id ? styles.downloading : ''}`}
                  onClick={() => handleImageClick(result)}
                >
                  <img 
                    src={result.thumbnailUrl} 
                    alt={result.alt || 'Image'}
                    className={styles.thumbnail}
                  />
                  
                  {isDownloading === result.id && (
                    <div className={styles.loadingOverlay}>
                      <div className={styles.spinner} />
                      Lädt...
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
              ))}
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

