/**
 * Asset Library Component
 * Browse and select images from personal library with folder organization
 */

import { useEffect, useState, useRef } from 'react';
import { useLibraryStore } from '@/modules/library/store';
import { useFolderStore } from '@/modules/library/folderStore';
import { LibraryAsset } from '@/modules/library/types';
import { LibraryFolder } from '@/modules/library/folderTypes';
import { db } from '@/modules/database/db';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import styles from './AssetLibrary.module.css';

interface AssetLibraryProps {
  onSelect: (assets: LibraryAsset[]) => void;
  onClose: () => void;
  multiSelect?: boolean;
}

export function AssetLibrary({ onSelect, onClose, multiSelect = true }: AssetLibraryProps) {
  const { assets, loadAssets, addAsset, deleteAsset, isLoading } = useLibraryStore();
  const { folders, loadFolders, createFolder, deleteFolder } = useFolderStore();
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [currentFolder, setCurrentFolder] = useState<LibraryFolder | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);
  
  useEffect(() => {
    if (currentFolder) {
      loadAssets(currentFolder.id);
    }
  }, [currentFolder, loadAssets]);
  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const folderId = currentFolder?.id || 'uncategorized';
    
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        await addAsset(files[i], folderId);
      }
      
      // Reload current folder
      await loadAssets(folderId);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Bilder');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    await createFolder(newFolderName.trim());
    setNewFolderName('');
    setIsCreatingFolder(false);
  };
  
  const handleDeleteFolder = async (folder: LibraryFolder) => {
    if (folder.id === 'uncategorized') {
      alert('Der Standard-Ordner kann nicht gelöscht werden.');
      return;
    }
    
    const assetCount = await db.libraryAssets.where('folderId').equals(folder.id).count();
    
    const confirmed = confirm(
      `Ordner "${folder.name}" löschen?\n\n` +
      `${assetCount} ${assetCount === 1 ? 'Bild wird' : 'Bilder werden'} nach "Nicht kategorisiert" verschoben.`
    );
    
    if (!confirmed) return;
    
    await deleteFolder(folder.id);
    
    // Switch to uncategorized if current folder was deleted
    if (currentFolder?.id === folder.id) {
      const uncategorized = folders.find(f => f.id === 'uncategorized');
      setCurrentFolder(uncategorized || null);
    }
  };
  
  const handleFolderClick = (folder: LibraryFolder) => {
    setCurrentFolder(folder);
    setSelectedAssets(new Set());
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
        
        <div className={styles.layout}>
          {/* Sidebar with folders */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Ordner</h3>
              <button
                className={styles.addFolderBtn}
                onClick={() => setIsCreatingFolder(true)}
                title="Neuer Ordner"
              >
                ➕
              </button>
            </div>
            
            {isCreatingFolder && (
              <div className={styles.newFolderForm}>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ordnername..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') setIsCreatingFolder(false);
                  }}
                />
                <div className={styles.newFolderActions}>
                  <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                    ✓
                  </Button>
                  <Button variant="ghost" onClick={() => setIsCreatingFolder(false)}>
                    ✕
                  </Button>
                </div>
              </div>
            )}
            
            <div className={styles.folderList}>
              {folders.map(folder => (
                <div
                  key={folder.id}
                  className={`${styles.folderItem} ${currentFolder?.id === folder.id ? styles.active : ''}`}
                  onClick={() => handleFolderClick(folder)}
                >
                  <span className={styles.folderIcon}>{folder.icon}</span>
                  <span className={styles.folderName}>{folder.name}</span>
                  
                  {folder.id !== 'uncategorized' && (
                    <button
                      className={styles.deleteFolderBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder);
                      }}
                      title="Ordner löschen"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className={styles.main}>
            <div className={styles.toolbar}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              
              <div className={styles.toolbarLeft}>
                {currentFolder && (
                  <span className={styles.currentFolder}>
                    {currentFolder.icon} {currentFolder.name}
                  </span>
                )}
              </div>
              
              <div className={styles.toolbarRight}>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !currentFolder}
                >
                  {isUploading ? 'Lädt hoch...' : '➕ Hochladen'}
                </Button>
                
                {multiSelect && selectedAssets.size > 0 && (
                  <Button onClick={handleAddSelected}>
                    {selectedAssets.size} verwenden
                  </Button>
                )}
              </div>
            </div>
        
            {!currentFolder ? (
              <div className={styles.empty}>
                <p>← Wähle einen Ordner aus</p>
                <p className={styles.emptyHint}>
                  Oder erstelle einen neuen Ordner mit ➕
                </p>
              </div>
            ) : assets.length === 0 && !isLoading ? (
              <div className={styles.empty}>
                <p>📁 Dieser Ordner ist leer</p>
                <p className={styles.emptyHint}>
                  Lade Bilder in "{currentFolder.name}" hoch
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
      </div>
    </div>
  );
}

