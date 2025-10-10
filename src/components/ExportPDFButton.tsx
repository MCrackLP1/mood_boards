/**
 * Export PDF Button Component
 * Allows exporting moodboards as PDF with loading state
 */

import { useState } from 'react';
import { Button } from '@/modules/ui/Button';
import { db } from '@/modules/database/db';
import { generateMoodboardPDF } from '@/modules/export/pdfGenerator';
import { DEFAULT_SECTIONS } from '@/types/sections';
import styles from './ExportPDFButton.module.css';

interface ExportPDFButtonProps {
  boardId: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function ExportPDFButton({ boardId, variant = 'secondary' }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setProgress(0);
      setShowSuccess(false);

      // Load board and items from database
      const board = await db.boards.get(boardId);
      if (!board) {
        alert('Board nicht gefunden');
        return;
      }

      const items = await db.items
        .where('boardId')
        .equals(boardId)
        .sortBy('order');

      // Combine default sections with custom sections
      const allSections = [
        ...DEFAULT_SECTIONS,
        ...(board.customSections || [])
      ];

      // Generate PDF with progress callback
      await generateMoodboardPDF(board, items, allSections, {
        onProgress: (value) => setProgress(value),
      });

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Fehler beim PDF-Export. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        variant={variant}
        onClick={handleExport}
        disabled={isExporting}
        className={styles.button}
      >
        {isExporting ? (
          <>
            <span className={styles.spinner} />
            <span>Exportiere... {progress}%</span>
          </>
        ) : showSuccess ? (
          <>
            <span className={styles.checkmark}>✓</span>
            <span>PDF erstellt!</span>
          </>
        ) : (
          <>
            <span className={styles.icon}>📄</span>
            <span>Als PDF exportieren</span>
          </>
        )}
      </Button>

      {isExporting && progress > 0 && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

