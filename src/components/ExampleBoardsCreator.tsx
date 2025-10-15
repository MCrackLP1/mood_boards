/**
 * Component to create example moodboards
 * Shows a button to generate 10 curated example boards with stock images
 */

import { useState } from 'react';
import { createExampleBoards } from '@/scripts/create-example-boards';
import styles from './ExampleBoardsCreator.module.css';

export function ExampleBoardsCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdBoards, setCreatedBoards] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!confirm('10 Beispiel-Moodboards erstellen? Diese werden direkt in deiner Datenbank gespeichert.')) {
      return;
    }

    setIsCreating(true);
    setError(null);
    setCreatedBoards([]);

    try {
      const boardIds = await createExampleBoards();
      setCreatedBoards(boardIds);
      alert(`✅ ${boardIds.length} Beispiel-Moodboards erfolgreich erstellt!`);
      
      // Reload the page to show new boards
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Error creating example boards:', err);
      setError(err.message || 'Fehler beim Erstellen der Beispiel-Boards');
      alert(`❌ Fehler: ${err.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🎨 Beispiel-Moodboards</h3>
        <p>Erstelle 10 fundierte Moodboard-Beispiele mit professionellen Stock-Bildern</p>
      </div>

      <button
        onClick={handleCreate}
        disabled={isCreating}
        className={styles.createButton}
      >
        {isCreating ? (
          <>
            <span className={styles.spinner}>⏳</span>
            Erstelle Beispiele...
          </>
        ) : (
          <>
            ✨ 10 Beispiel-Boards erstellen
          </>
        )}
      </button>

      {error && (
        <div className={styles.error}>
          <strong>❌ Fehler:</strong> {error}
        </div>
      )}

      {createdBoards.length > 0 && (
        <div className={styles.success}>
          <h4>✅ Erfolgreich erstellt!</h4>
          <ul>
            {createdBoards.map((id, idx) => (
              <li key={id}>
                <a href={`#/board/${id}`} target="_blank" rel="noopener noreferrer">
                  Board {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.info}>
        <h4>📋 Enthaltene Beispiele:</h4>
        <ul>
          <li>Elegante Hochzeit</li>
          <li>Modern Corporate Event</li>
          <li>Festlicher Geburtstag</li>
          <li>Fashion Editorial Shoot</li>
          <li>Tech Product Launch</li>
          <li>Restaurant Opening</li>
          <li>Fitness Brand Campaign</li>
          <li>Boutique Hotel Experience</li>
          <li>Kunst-Ausstellung</li>
          <li>Music Festival</li>
        </ul>
      </div>
    </div>
  );
}

