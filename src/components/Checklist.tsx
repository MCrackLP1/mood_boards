/**
 * Checklist Component
 * Manages a list of checkbox items for shooting preparation
 */

import { useState } from 'react';
import { ChecklistItem } from '@/types';
import { nanoid } from '@/modules/utils/id';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Checklist.module.css';

interface ChecklistProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  readOnly?: boolean;
}

function SortableChecklistItem({
  item,
  onToggle,
  onDelete,
  readOnly,
}: {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
  readOnly?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.item} ${item.checked ? styles.checked : ''}`}
    >
      {!readOnly && (
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          ⋮⋮
        </div>
      )}
      <input
        type="checkbox"
        checked={item.checked}
        onChange={onToggle}
        disabled={readOnly}
        className={styles.checkbox}
      />
      <span className={styles.text}>{item.text}</span>
      {!readOnly && (
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          title="Löschen"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function Checklist({ items, onChange, readOnly = false }: ChecklistProps) {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: nanoid(),
      text: newItemText.trim(),
      checked: false,
      order: items.length,
    };

    onChange([...items, newItem]);
    setNewItemText('');
  };

  const handleToggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onChange(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onChange(updatedItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(oldIndex, 1);
    reorderedItems.splice(newIndex, 0, movedItem);

    // Update order values
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.checklist}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.items}>
            {sortedItems.map(item => (
              <SortableChecklistItem
                key={item.id}
                item={item}
                onToggle={() => handleToggleItem(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!readOnly && (
        <div className={styles.addItem}>
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Neues Item hinzufügen..."
            className={styles.input}
          />
          <button onClick={handleAddItem} className={styles.addButton}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

