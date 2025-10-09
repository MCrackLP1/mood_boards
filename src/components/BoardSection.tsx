/**
 * Board Section Component
 * Structured area with title, description, and items
 * Now supports drag & drop and multiple item types
 */

import { useState } from 'react';
import { Section } from '@/types';
import { BoardItem } from '@/types';
import { ImageCard } from './ImageCard';
import { LinkCard } from './LinkCard';
import { Checklist } from './Checklist';
import { Timeline } from './Timeline';
import { Button } from '@/modules/ui/Button';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import styles from './BoardSection.module.css';

interface BoardSectionProps {
  section: Section;
  items: BoardItem[];
  layoutMode?: 'grid' | 'masonry' | 'single-column';
  onAddImage: (section: Section) => void;
  onAddNote: (section: Section) => void;
  onAddLink: (section: Section) => void;
  onAddChecklist: (section: Section) => void;
  onAddTimeline: (section: Section) => void;
  onOpenLibrary: (section: Section) => void;
  onOpenWebSearch: (section: Section) => void;
  onImageClick: (item: BoardItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<BoardItem>) => void;
  onReorderItems: (itemIds: string[]) => void;
}

export function BoardSection({
  section,
  items,
  layoutMode = 'grid',
  onAddImage,
  onAddNote,
  onAddLink,
  onAddChecklist,
  onAddTimeline,
  onOpenLibrary,
  onOpenWebSearch,
  onImageClick,
  onDeleteItem,
  onUpdateItem,
  onReorderItems,
}: BoardSectionProps) {
  const [isEditingNote, setIsEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  
  const imageItems = items.filter(i => i.type === 'image');
  const linkItems = items.filter(i => i.type === 'link');
  const noteItems = items.filter(i => i.type === 'note');
  const checklistItems = items.filter(i => i.type === 'checklist');
  const timelineItems = items.filter(i => i.type === 'timeline');
  
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
          <Button variant="secondary" onClick={() => onAddLink(section)} title="Link einbetten">
            🔗
          </Button>
          <Button variant="secondary" onClick={handleAddNote} title="Notiz hinzufügen">
            📝
          </Button>
          <Button variant="secondary" onClick={() => onAddChecklist(section)} title="Checkliste">
            ✓
          </Button>
          <Button variant="secondary" onClick={() => onAddTimeline(section)} title="Timeline">
            ⏱️
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
        
        {/* Checklists */}
        {checklistItems.map(item => (
          <Checklist
            key={item.id}
            items={item.checklistItems || []}
            onChange={(checklistItems) => onUpdateItem(item.id, { checklistItems })}
          />
        ))}

        {/* Timelines */}
        {timelineItems.map(item => (
          <Timeline
            key={item.id}
            items={item.timelineItems || []}
            onChange={(timelineItems) => onUpdateItem(item.id, { timelineItems })}
          />
        ))}
        
        {/* Images with Drag & Drop */}
        {imageItems.length > 0 && (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={imageItems.map(i => i.id)} strategy={rectSortingStrategy}>
              <div className={`${styles.imageGrid} ${styles[layoutMode]}`}>
                {imageItems.map(item => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    onClick={() => onImageClick(item)}
                    onDelete={() => onDeleteItem(item.id)}
                    isDraggable={true}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Links */}
        {linkItems.length > 0 && (
          <div className={`${styles.linksGrid} ${styles[layoutMode]}`}>
            {linkItems.map(item => (
              <LinkCard
                key={item.id}
                url={item.linkUrl || ''}
                preview={item.linkPreview!}
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
              Füge Bilder, Links, Checklisten oder Timelines hinzu
            </p>
          </div>
        )}
      </div>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = imageItems.findIndex(item => item.id === active.id);
    const newIndex = imageItems.findIndex(item => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...imageItems];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorderItems(reordered.map(i => i.id));
  }
}

