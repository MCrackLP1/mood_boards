/**
 * Image upload and processing utilities
 * Handles file conversion to data URLs with optional compression
 */

import { extractColors } from './colorExtraction';
import { Color } from '@/types';

export interface ProcessedImage {
  dataUrl: string;
  palette: Color[];
  width: number;
  height: number;
}

/**
 * Process uploaded image file
 * Converts to data URL and extracts color palette
 */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image.');
  }
  
  // Read file as data URL
  const dataUrl = await readFileAsDataURL(file);
  
  // Load image to get dimensions
  const img = await loadImage(dataUrl);
  
  // Extract color palette
  const palette = await extractColors(dataUrl);
  
  return {
    dataUrl,
    palette,
    width: img.width,
    height: img.height,
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Get preview image from board items
 * Returns the first image item's data URL or undefined
 */
export function getBoardPreviewImage(items: any[]): string | undefined {
  const firstImage = items.find(item => item.type === 'image' && item.src);
  return firstImage?.src;
}

