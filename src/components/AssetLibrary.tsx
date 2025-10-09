/**
 * Asset Library Component
 * Browse and select images from personal library
 */

import { useEffect, useState, useRef } from 'react';
import { useLibraryStore } from '@/modules/library/store';
import { LibraryAsset } from '@/modules/library/types';
import { Button } from '@/modules/ui/Button';
import styles from './AssetLibrary.module.css';

interface AssetLibraryProps {
  onSelect: (assets: LibraryAsset[]) => void;
  onClose: () => void;
  multiSelect?: boolean;
}

export function AssetLibrary({ onSelect, onClose, multiSelect = true }: AssetLibraryProps) {
  const { assets, loadAssets, addAsset, deleteAsset, isLoading } = useLibraryStore();
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    loadAssets();
  }, [loadAssets]);
  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        await addAsset(files[i]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Bilder');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleAssetClick = (asset: LibraryAsset) => {
    if (!multiSelect) {
      // Single select - immediate selection
      onSelect([asset]);
      onClose();
      return;
    }
    
    // Multi-select - toggle
    const newSelected = new Set(selectedAssets);
    
    if (newSelected.has(asset.id)) {
      newSelected.delete(asset.id);
    } else {
      newSelected.add(asset.id);
    }
    
    setSelectedAssets(newSelected);
  };
  
  const handleAddSelected = () => {
    const selected = assets.filter(a => selectedAssets.has(a.id));
    onSelect(selected);
    onClose();
  };
  
  const handleDelete = async (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Bild aus Mediathek löschen?')) return;
    
    await deleteAsset(assetId);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const isAssetSelected = (asset: LibraryAsset) => {
    return selectedAssets.has(asset.id);
  };
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>📚 Mediathek</h2>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.toolbar}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Lädt hoch...' : '➕ Bilder hochladen'}
          </Button>
          
          {multiSelect && selectedAssets.size > 0 && (
            <Button onClick={handleAddSelected}>
              {selectedAssets.size} {selectedAssets.size === 1 ? 'Bild' : 'Bilder'} verwenden
            </Button>
          )}
          
          <div className={styles.stats}>
            {assets.length} {assets.length === 1 ? 'Bild' : 'Bilder'} in Mediathek
          </div>
        </div>
        
        {assets.length === 0 && !isLoading ? (
          <div className={styles.empty}>
            <p>📚 Deine Mediathek ist leer</p>
            <p className={styles.emptyHint}>
              Lade Bilder hoch, um sie in allen Projekten zu verwenden
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Erste Bilder hochladen
            </Button>
          </div>
        ) : (
          <div className={styles.grid}>
            {assets.map(asset => {
              const selected = isAssetSelected(asset);
              return (
                <div
                  key={asset.id}
                  className={`${styles.assetCard} ${selected ? styles.selected : ''}`}
                  onClick={() => handleAssetClick(asset)}
                >
                  <img
                    src={asset.src}
                    alt={asset.name}
                    className={styles.thumbnail}
                  />
                  
                  {selected && (
                    <div className={styles.checkmark}>
                      <div className={styles.checkmarkIcon}>✓</div>
                    </div>
                  )}
                  
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDelete(asset.id, e)}
                    aria-label="Löschen"
                  >
                    🗑️
                  </button>
                  
                  <div className={styles.assetInfo}>
                    <div className={styles.assetName} title={asset.name}>
                      {asset.name}
                    </div>
                    <div className={styles.assetMeta}>
                      {asset.width}×{asset.height} · {formatFileSize(asset.fileSize)}
                    </div>
                  </div>
                  
                  {asset.palette && asset.palette.length > 0 && (
                    <div className={styles.palette}>
                      {asset.palette.slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className={styles.swatch}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

