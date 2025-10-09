/**
 * Timeline Component
 * Displays and manages timeline items for shooting schedule
 */

import { useState } from 'react';
import { TimelineItem } from '@/types';
import { nanoid } from '@/modules/utils/id';
import { WeatherWidget } from './WeatherWidget';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Timeline.module.css';

interface TimelineProps {
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
  readOnly?: boolean;
}

interface TimelineItemFormData {
  time: string;
  location: string;
  description: string;
  lat?: string;
  lng?: string;
}

function SortableTimelineItem({
  item,
  onDelete,
  readOnly,
}: {
  item: TimelineItem;
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

  // Parse time for display
  const timeDisplay = item.time ? new Date(item.time).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div ref={setNodeRef} style={style} className={styles.timelineItem}>
      <div className={styles.itemHeader}>
        {!readOnly && (
          <div className={styles.dragHandle} {...attributes} {...listeners}>
            ⋮⋮
          </div>
        )}
        <div className={styles.time}>🕐 {timeDisplay}</div>
        {!readOnly && (
          <button className={styles.deleteButton} onClick={onDelete} title="Löschen">
            ×
          </button>
        )}
      </div>

      <div className={styles.itemContent}>
        <div className={styles.location}>
          📍 <strong>{item.location}</strong>
        </div>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </div>

      {item.coordinates && (
        <div className={styles.weather}>
          <WeatherWidget
            coordinates={item.coordinates}
            date={item.time ? new Date(item.time) : undefined}
            compact
          />
        </div>
      )}
    </div>
  );
}

export function Timeline({ items, onChange, readOnly = false }: TimelineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<TimelineItemFormData>({
    time: '',
    location: '',
    description: '',
    lat: '',
    lng: '',
  });

  const handleAddItem = () => {
    if (!formData.time || !formData.location) return;

    const newItem: TimelineItem = {
      id: nanoid(),
      time: formData.time,
      location: formData.location,
      description: formData.description,
      coordinates: formData.lat && formData.lng ? {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      } : undefined,
      order: items.length,
    };

    onChange([...items, newItem]);
    setFormData({ time: '', location: '', description: '', lat: '', lng: '' });
    setIsAdding(false);
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

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <h3 className={styles.title}>⏱️ Zeitplan</h3>
        {!readOnly && !isAdding && (
          <button
            className={styles.addButton}
            onClick={() => setIsAdding(true)}
          >
            + Hinzufügen
          </button>
        )}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.items}>
            {sortedItems.map(item => (
              <SortableTimelineItem
                key={item.id}
                item={item}
                onDelete={() => handleDeleteItem(item.id)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!readOnly && isAdding && (
        <div className={styles.addForm}>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Zeit *
              <input
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Location *
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="z.B. Park am See"
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Beschreibung
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details zum Shooting..."
                className={styles.textarea}
                rows={2}
              />
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>
              Koordinaten (optional, für Wetter)
              <div className={styles.coordInputs}>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  placeholder="Latitude"
                  className={styles.input}
                />
                <input
                  type="number"
                  step="0.000001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  placeholder="Longitude"
                  className={styles.input}
                />
              </div>
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setIsAdding(false);
                setFormData({ time: '', location: '', description: '', lat: '', lng: '' });
              }}
            >
              Abbrechen
            </button>
            <button
              className={styles.saveButton}
              onClick={handleAddItem}
              disabled={!formData.time || !formData.location}
            >
              Speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

