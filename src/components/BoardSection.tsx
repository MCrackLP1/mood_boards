/**
 * Board Section Component
 * Structured area with title, description, and items
 */

import { useState } from 'react';
import { Section } from '@/types/sections';
import { BoardItem } from '@/types';
import { ImageCard } from './ImageCard';
import { Button } from '@/modules/ui/Button';
import styles from './BoardSection.module.css';

interface BoardSectionProps {
  section: Section;
  items: BoardItem[];
  onAddImage: (section: Section) => void;
  onAddNote: (section: Section) => void;
  onOpenLibrary: (section: Section) => void;
  onOpenWebSearch: (section: Section) => void;
  onImageClick: (item: BoardItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<BoardItem>) => void;
}

export function BoardSection({
  section,
  items,
  onAddImage,
  onAddNote,
  onOpenLibrary,
  onOpenWebSearch,
  onImageClick,
  onDeleteItem,
  onUpdateItem,
}: BoardSectionProps) {
  const [isEditingNote, setIsEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  
  const imageItems = items.filter(i => i.type === 'image');
  const noteItems = items.filter(i => i.type === 'note');
  
  const handleAddNote = () => {
    onAddNote(section);
  };
  
  const handleEditNote = (item: BoardItem) => {
    setIsEditingNote(item.id);
    setNoteText(item.text || '');
  };
  
  const handleSaveNote = (item: BoardItem) => {
    onUpdateItem(item.id, { text: noteText });
    setIsEditingNote(null);
  };
  
  const handleCancelEdit = () => {
    setIsEditingNote(null);
    setNoteText('');
  };
  
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>{section.icon}</span>
          <div>
            <h2 className={styles.title}>{section.title}</h2>
            <p className={styles.description}>{section.description}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onAddImage(section)} title="Eigene Bilder hochladen">
            📁
          </Button>
          <Button variant="secondary" onClick={() => onOpenLibrary(section)} title="Aus Mediathek">
            📚
          </Button>
          <Button variant="secondary" onClick={() => onOpenWebSearch(section)} title="Web-Suche">
            🔍
          </Button>
          <Button variant="secondary" onClick={handleAddNote} title="Notiz hinzufügen">
            📝
          </Button>
        </div>
      </div>
      
      <div className={styles.content}>
        {/* Notes */}
        {noteItems.length > 0 && (
          <div className={styles.notes}>
            {noteItems.map(note => (
              <div key={note.id} className={styles.noteCard}>
                {isEditingNote === note.id ? (
                  <div className={styles.noteEdit}>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className={styles.noteTextarea}
                      placeholder="Notiz eingeben..."
                      autoFocus
                    />
                    <div className={styles.noteActions}>
                      <Button onClick={() => handleSaveNote(note)}>
                        Speichern
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noteView}>
                    <p className={styles.noteText}>{note.text || 'Leere Notiz'}</p>
                    <div className={styles.noteButtons}>
                      <button
                        className={styles.noteButton}
                        onClick={() => handleEditNote(note)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.noteButton}
                        onClick={() => onDeleteItem(note.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Images */}
        {imageItems.length > 0 && (
          <div className={styles.imageGrid}>
            {imageItems.map(item => (
              <ImageCard
                key={item.id}
                item={item}
                onClick={() => onImageClick(item)}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {items.length === 0 && (
          <div className={styles.empty}>
            <p>Noch keine Inhalte in diesem Bereich</p>
            <p className={styles.emptyHint}>
              Füge Bilder oder Notizen hinzu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

