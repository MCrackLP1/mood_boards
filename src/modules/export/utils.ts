/**
 * Helper utilities for PDF generation
 */

/**
 * Convert HEX color to RGB array
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Sanitize filename by removing special characters
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9äöüß\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date as readable German string
 */
export function formatDateGerman(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Get time-based icon emoji
 */
export function getTimeIcon(time: string): string {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour >= 5 && hour < 9) return '🌅'; // Early morning
  if (hour >= 9 && hour < 12) return '☀️'; // Morning
  if (hour >= 12 && hour < 17) return '🌤️'; // Afternoon
  if (hour >= 17 && hour < 20) return '🌆'; // Evening
  if (hour >= 20 || hour < 5) return '🌙'; // Night
  
  return '⏰'; // Default
}

/**
 * Wrap text to fit within a specific width
 * Returns array of lines
 */
export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  // Simplified text wrapping - in real implementation, would use jsPDF's splitTextToSize
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Approximate character width (varies by font)
  const charWidth = fontSize * 0.5;
  const maxChars = Math.floor(maxWidth / charWidth);
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.length > 0 ? lines : [''];
}

/**
 * Calculate image dimensions to fit within bounds while maintaining aspect ratio
 */
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  return { width, height };
}

/**
 * Extract image dimensions from base64 data
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64;
  });
}

