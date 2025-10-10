/**
 * PDF Generator for Moodboards
 * Creates professional, print-ready PDFs with images, colors, checklists, and more
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Board, BoardItem, Color, Section } from '@/types';
import { 
  hexToRgb, 
  sanitizeFilename, 
  formatDate, 
  formatDateGerman, 
  getTimeIcon
} from './utils';

// A4 dimensions in mm
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

interface PDFGeneratorOptions {
  onProgress?: (progress: number) => void;
}

/**
 * Generate a complete moodboard PDF
 */
export async function generateMoodboardPDF(
  board: Board,
  items: BoardItem[],
  sections: Section[],
  options?: PDFGeneratorOptions
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let progress = 0;
  const updateProgress = (value: number) => {
    progress = value;
    options?.onProgress?.(progress);
  };

  // Title Page
  addTitlePage(doc, board);
  updateProgress(10);

  // Extract all colors from all images
  const allColors: Color[] = [];
  items.forEach(item => {
    if (item.palette) {
      allColors.push(...item.palette);
    }
  });
  
  const uniqueColors = Array.from(
    new Map(allColors.map(c => [c.hex, c])).values()
  );

  // Color Palette Page
  if (uniqueColors.length > 0) {
    doc.addPage();
    addColorPalette(doc, uniqueColors);
    updateProgress(20);
  }

  // Image Pages (inspiration images, not location)
  const inspirationImages = items.filter(
    item => item.type === 'image' && item.src && (item.section || 'general') !== 'location'
  );
  
  if (inspirationImages.length > 0) {
    await addImages(doc, inspirationImages, 'Mood & Inspiration', updateProgress, 20, 50);
  }

  // Checklist Page
  const checklistItems = items
    .filter(item => item.type === 'checklist' && item.checklistItems && item.checklistItems.length > 0)
    .flatMap(item => item.checklistItems || [])
    .sort((a, b) => a.order - b.order);

  if (checklistItems.length > 0) {
    doc.addPage();
    addChecklist(doc, checklistItems);
    updateProgress(60);
  }

  // Timeline Page
  const timelineItems = items
    .filter(item => item.type === 'timeline' && item.timelineItems && item.timelineItems.length > 0)
    .flatMap(item => item.timelineItems || [])
    .sort((a, b) => a.order - b.order);

  if (timelineItems.length > 0) {
    doc.addPage();
    addTimeline(doc, timelineItems, board.shootingDuration);
    updateProgress(70);
  }

  // Notes Pages
  const noteItems = items.filter(item => item.type === 'note' && item.text);
  if (noteItems.length > 0) {
    doc.addPage();
    addNotes(doc, noteItems, sections);
    updateProgress(80);
  }

  // Location Images
  const locationImages = items.filter(
    item => item.type === 'image' && item.src && (item.section || 'general') === 'location'
  );

  if (locationImages.length > 0) {
    await addImages(doc, locationImages, 'Locations', updateProgress, 80, 90);
  }

  updateProgress(100);

  // Generate filename and save
  const filename = generateFilename(board);
  doc.save(filename);
}

/**
 * Generate filename for the PDF
 */
function generateFilename(board: Board): string {
  const sanitizedTitle = sanitizeFilename(board.title);
  const date = formatDate(board.updatedAt || board.createdAt);
  return `Moodboard_${sanitizedTitle}_${date}.pdf`;
}

/**
 * Add title page
 */
function addTitlePage(doc: jsPDF, board: Board): void {
  const centerX = PAGE_WIDTH / 2;
  
  // Title
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(board.title, centerX, 100, { align: 'center' });

  // Welcome text
  if (board.welcomeText) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(board.welcomeText, CONTENT_WIDTH - 40);
    doc.text(lines, centerX, 120, { align: 'center' });
  }

  // Shooting duration
  if (board.shootingDuration) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dauer: ${board.shootingDuration}`, centerX, 160, { align: 'center' });
  }

  // Creation date
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  const dateStr = formatDateGerman(board.updatedAt || board.createdAt);
  doc.text(`Erstellt am ${dateStr}`, centerX, 180, { align: 'center' });

  // Footer: Branding
  if (board.brandingEnabled) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('by Mark Tietz Fotografie', centerX, PAGE_HEIGHT - 30, { align: 'center' });
  }

  // Reset colors
  doc.setTextColor(0, 0, 0);
}

/**
 * Add color palette page
 */
function addColorPalette(doc: jsPDF, colors: Color[]): void {
  const centerX = PAGE_WIDTH / 2;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Farbpalette', centerX, 40, { align: 'center' });

  // Display up to 7 colors
  const displayColors = colors.slice(0, 7);
  const colorWidth = 24;
  const colorHeight = 40;
  const totalWidth = displayColors.length * colorWidth;
  const startX = centerX - (totalWidth / 2);
  let currentX = startX;
  const startY = 70;

  displayColors.forEach((color) => {
    const [r, g, b] = hexToRgb(color.hex);
    
    // Draw color rectangle
    doc.setFillColor(r, g, b);
    doc.rect(currentX, startY, colorWidth, colorHeight, 'F');
    
    // Draw border
    doc.setDrawColor(200, 200, 200);
    doc.rect(currentX, startY, colorWidth, colorHeight, 'S');
    
    // Draw HEX value below
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(color.hex, currentX + (colorWidth / 2), startY + colorHeight + 8, { align: 'center' });
    
    currentX += colorWidth;
  });
}

/**
 * Add images in 2x2 grid layout
 */
async function addImages(
  doc: jsPDF,
  imageItems: BoardItem[],
  sectionTitle: string,
  updateProgress: (value: number) => void,
  progressStart: number,
  progressEnd: number
): Promise<void> {
  if (imageItems.length === 0) return;

  doc.addPage();
  
  // Section title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(sectionTitle, PAGE_WIDTH / 2, 30, { align: 'center' });

  const imagesPerPage = 4; // 2x2 grid
  const imageSize = 80; // mm
  const gap = 10;
  const gridStartX = MARGIN;
  const gridStartY = 50;

  let currentPage = 0;
  let imagesOnCurrentPage = 0;

  for (let i = 0; i < imageItems.length; i++) {
    const item = imageItems[i];
    if (!item.src) continue;

    // Calculate position in 2x2 grid
    const col = imagesOnCurrentPage % 2;
    const row = Math.floor(imagesOnCurrentPage / 2) % 2;

    const x = gridStartX + col * (imageSize + gap);
    const y = gridStartY + row * (imageSize + gap);

    try {
      // Add image
      doc.addImage(item.src, 'JPEG', x, y, imageSize, imageSize);

      // Add border
      doc.setDrawColor(220, 220, 220);
      doc.rect(x, y, imageSize, imageSize, 'S');

      // Add label if exists
      if (item.meta?.label) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const labelLines = doc.splitTextToSize(item.meta.label, imageSize - 4);
        doc.text(labelLines[0], x + (imageSize / 2), y + imageSize + 5, { align: 'center' });
      }

      imagesOnCurrentPage++;

      // Check if we need a new page
      if (imagesOnCurrentPage >= imagesPerPage && i < imageItems.length - 1) {
        doc.addPage();
        imagesOnCurrentPage = 0;
        currentPage++;
        
        // Add section title on new page
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(sectionTitle, PAGE_WIDTH / 2, 30, { align: 'center' });
      }

      // Update progress
      const progress = progressStart + ((i + 1) / imageItems.length) * (progressEnd - progressStart);
      updateProgress(Math.floor(progress));
    } catch (error) {
      console.error('Failed to add image to PDF:', error);
      // Continue with next image
    }
  }

  doc.setTextColor(0, 0, 0);
}

/**
 * Add checklist page
 */
function addChecklist(doc: jsPDF, checklistItems: any[]): void {
  const centerX = PAGE_WIDTH / 2;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ Checkliste', centerX, 30, { align: 'center' });

  let y = 50;
  const lineHeight = 10;
  const checkboxSize = 5;

  checklistItems.forEach((item) => {
    // Check if we need a new page
    if (y > PAGE_HEIGHT - MARGIN - 20) {
      doc.addPage();
      y = MARGIN;
    }

    const x = MARGIN + 5;

    // Draw checkbox
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.rect(x, y - 4, checkboxSize, checkboxSize);

    // Draw checkmark if checked
    if (item.checked) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('✓', x + 0.5, y + 0.8);
    }

    // Draw text
    doc.setFont('helvetica', item.checked ? 'normal' : 'normal');
    doc.setFontSize(11);
    doc.setTextColor(item.checked ? 128 : 0, item.checked ? 128 : 0, item.checked ? 128 : 0);
    
    const textLines = doc.splitTextToSize(item.text, CONTENT_WIDTH - 20);
    doc.text(textLines, x + checkboxSize + 5, y);

    y += lineHeight + (textLines.length - 1) * 5;
  });

  doc.setTextColor(0, 0, 0);
}

/**
 * Add timeline page
 */
function addTimeline(doc: jsPDF, timelineItems: any[], shootingDuration?: string): void {
  const centerX = PAGE_WIDTH / 2;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('⏱️ Tagesablauf', centerX, 30, { align: 'center' });

  // Shooting duration
  if (shootingDuration) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Dauer: ${shootingDuration}`, centerX, 42, { align: 'center' });
  }

  doc.setTextColor(0, 0, 0);

  // Create table data
  const tableData = timelineItems.map(item => {
    const icon = getTimeIcon(item.time);
    return [
      `${icon} ${item.time}`,
      item.location,
      item.description || '-'
    ];
  });

  // Use autoTable for professional table layout
  autoTable(doc, {
    startY: 55,
    head: [['Zeit', 'Location', 'Beschreibung']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [218, 165, 32],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [44, 36, 22],
    },
    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },
    margin: { left: MARGIN, right: MARGIN },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 50 },
      2: { cellWidth: 'auto' },
    },
  });
}

/**
 * Add notes pages
 */
function addNotes(doc: jsPDF, noteItems: BoardItem[], sections: Section[]): void {
  const centerX = PAGE_WIDTH / 2;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('📝 Notizen', centerX, 30, { align: 'center' });

  let y = 50;
  const lineHeight = 7;

  noteItems.forEach((item) => {
    // Get section info
    const section = sections.find(s => s.id === item.section);
    const sectionTitle = section?.title || 'Allgemein';

    // Check if we need a new page
    if (y > PAGE_HEIGHT - MARGIN - 40) {
      doc.addPage();
      y = MARGIN;
    }

    // Section header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(184, 134, 11);
    doc.text(`${section?.icon || '📌'} ${sectionTitle}`, MARGIN, y);
    y += 10;

    // Note text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const noteLines = doc.splitTextToSize(item.text || '', CONTENT_WIDTH - 10);
    doc.text(noteLines, MARGIN + 5, y);
    
    y += noteLines.length * lineHeight + 15;
  });

  doc.setTextColor(0, 0, 0);
}

