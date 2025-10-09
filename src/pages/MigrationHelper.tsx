/**
 * Migration Helper Component
 * Provides UI for migrating data from IndexedDB to Supabase
 */

import { useState } from 'react';
import { migrateToSupabase, clearLocalData, type MigrationResult } from '@/modules/database/migration';
import styles from './MigrationHelper.module.css';

export function MigrationHelper() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleMigrate = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const migrationResult = await migrateToSupabase();
      setResult(migrationResult);
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearData = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    try {
      await clearLocalData();
      alert('Lokale Daten wurden gelöscht!');
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Fehler beim Löschen der Daten');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Daten-Migration zu Supabase</h1>
        
        <div className={styles.info}>
          <p>
            Diese Seite hilft Ihnen, Ihre lokalen Daten (IndexedDB) zu Supabase zu übertragen,
            damit sie auf allen Geräten verfügbar sind.
          </p>
          <ul>
            <li>✅ Alle Moodboards werden synchronisiert</li>
            <li>✅ Alle Board-Items werden übertragen</li>
            <li>✅ Ihre Asset-Bibliothek wird in die Cloud geladen</li>
            <li>✅ Ordnerstruktur bleibt erhalten</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.migrateButton}
            onClick={handleMigrate}
            disabled={isRunning}
          >
            {isRunning ? '⏳ Migration läuft...' : '🚀 Migration starten'}
          </button>
        </div>

        {result && (
          <div className={result.success ? styles.success : styles.error}>
            <h2>{result.success ? '✅ Migration erfolgreich!' : '⚠️ Migration mit Fehlern'}</h2>
            <div className={styles.stats}>
              <div>📋 Boards: {result.boards}</div>
              <div>📝 Items: {result.items}</div>
              <div>📁 Ordner: {result.folders}</div>
              <div>🖼️ Assets: {result.assets}</div>
            </div>
            
            {result.errors.length > 0 && (
              <details className={styles.errors}>
                <summary>Fehler anzeigen ({result.errors.length})</summary>
                <ul>
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </details>
            )}

            {result.success && (
              <div className={styles.clearSection}>
                <p>
                  <strong>Optional:</strong> Sie können nun die lokalen Daten löschen,
                  da sie jetzt in Supabase gespeichert sind.
                </p>
                <button
                  className={showClearConfirm ? styles.confirmButton : styles.clearButton}
                  onClick={handleClearData}
                >
                  {showClearConfirm ? '⚠️ Wirklich löschen?' : '🗑️ Lokale Daten löschen'}
                </button>
                {showClearConfirm && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Abbrechen
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

