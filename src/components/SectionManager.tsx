/**
 * Section Manager Component
 * Manages custom sections for moodboards
 */

import { useState } from 'react';
import { Section } from '@/types';
import { nanoid } from '@/modules/utils/id';
import { DEFAULT_SECTIONS } from '@/types/sections';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './SectionManager.module.css';

interface SectionManagerProps {
  customSections: Section[];
  onAdd: (section: Omit<Section, 'isCustom' | 'order'>) => void;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
  onReorder: (sectionIds: string[]) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  '✨', '📍', '📋', '👗', '📸', '💄', '💍', '🎨', 
  '🌟', '💐', '🕐', '📝', '🎭', '🎪', '🎬', '🎵',
];

function SortableSectionItem({
  section,
  onEdit,
  onDelete,
}: {
  section: Section;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: !section.isCustom });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sectionItem} ${!section.isCustom ? styles.locked : ''}`}
    >
      {section.isCustom && (
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          ⋮⋮
        </div>
      )}
      
      <span className={styles.icon}>{section.icon}</span>
      
      <div className={styles.info}>
        <div className={styles.title}>{section.title}</div>
        <div className={styles.description}>{section.description}</div>
      </div>

      {section.isCustom ? (
        <div className={styles.actions}>
          <button className={styles.editButton} onClick={onEdit} title="Bearbeiten">
            ✏️
          </button>
          <button className={styles.deleteButton} onClick={onDelete} title="Löschen">
            🗑️
          </button>
        </div>
      ) : (
        <div className={styles.badge}>Standard</div>
      )}
    </div>
  );
}

export function SectionManager({
  customSections,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onClose,
}: SectionManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '📋',
  });

  const allSections = [...DEFAULT_SECTIONS, ...customSections].sort((a, b) => a.order - b.order);

  const handleStartAdd = () => {
    setFormData({ id: nanoid(), title: '', description: '', icon: '📋' });
    setIsAdding(true);
    setEditingSection(null);
  };

  const handleStartEdit = (section: Section) => {
    setFormData({
      id: section.id,
      title: section.title,
      description: section.description,
      icon: section.icon,
    });
    setEditingSection(section);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingSection) {
      onUpdate(editingSection.id, {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
      });
    } else {
      onAdd({
        id: formData.id,
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
      });
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingSection(null);
    setFormData({ id: '', title: '', description: '', icon: '📋' });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const customOnly = customSections;
    const oldIndex = customOnly.findIndex(s => s.id === active.id);
    const newIndex = customOnly.findIndex(s => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...customOnly];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(reordered.map(s => s.id));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Sections verwalten">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.intro}>
            Passe die Sections deines Moodboards an. Standard-Sections können nicht bearbeitet werden.
          </p>
          <Button onClick={handleStartAdd}>+ Neue Section</Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={customSections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.sections}>
              {allSections.map(section => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  onEdit={() => handleStartEdit(section)}
                  onDelete={() => onDelete(section.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {(isAdding || editingSection) && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>
              {editingSection ? 'Section bearbeiten' : 'Neue Section'}
            </h3>

            <div className={styles.formField}>
              <label className={styles.label}>Icon</label>
              <div className={styles.emojiPicker}>
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    className={`${styles.emojiButton} ${formData.icon === emoji ? styles.selected : ''}`}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Titel *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Outfits"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Beschreibung</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kurze Beschreibung"
              />
            </div>

            <div className={styles.formActions}>
              <Button onClick={handleCancel} variant="secondary">
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={!formData.title.trim()}>
                Speichern
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

