/**
 * Color extraction from images using Canvas API
 * Extracts dominant colors using a simple color quantization algorithm
 */

import { Color } from '@/types';

interface ColorBucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

/**
 * Extract dominant colors from an image
 * @param imageUrl - Image source (data URL, blob URL, or regular URL)
 * @param colorCount - Number of colors to extract (default: 6)
 * @returns Promise resolving to array of dominant colors
 */
export async function extractColors(imageUrl: string, colorCount = 6): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const colors = processImage(img, colorCount);
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

function processImage(img: HTMLImageElement, colorCount: number): Color[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context not available');
  
  // Downscale for performance (max 200x200)
  const scale = Math.min(200 / img.width, 200 / img.height, 1);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Quantize colors into buckets
  const buckets = quantizeColors(pixels, 16); // 16x16x16 color space
  
  // Get top N colors
  const sortedBuckets = buckets
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount);
  
  // Calculate total count for score normalization
  const totalCount = sortedBuckets.reduce((sum, b) => sum + b.count, 0);
  
  // Convert to Color format
  return sortedBuckets.map(bucket => ({
    hex: rgbToHex(bucket.r, bucket.g, bucket.b),
    rgb: [bucket.r, bucket.g, bucket.b] as [number, number, number],
    score: bucket.count / totalCount,
  }));
}

function quantizeColors(pixels: Uint8ClampedArray, bucketSize: number): ColorBucket[] {
  const bucketMap = new Map<string, ColorBucket>();
  
  // Quantize each pixel into buckets
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Quantize to bucket
    const qr = Math.floor(r / bucketSize) * bucketSize;
    const qg = Math.floor(g / bucketSize) * bucketSize;
    const qb = Math.floor(b / bucketSize) * bucketSize;
    
    const key = `${qr},${qg},${qb}`;
    
    const existing = bucketMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      bucketMap.set(key, { r: qr, g: qg, b: qb, count: 1 });
    }
  }
  
  return Array.from(bucketMap.values());
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calculate color similarity (0-1, where 1 is identical)
 * Uses Euclidean distance in RGB space
 */
export function colorSimilarity(color1: Color, color2: Color): number {
  const [r1, g1, b1] = color1.rgb;
  const [r2, g2, b2] = color2.rgb;
  
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
  
  // Normalize to 0-1 (max distance in RGB space is ~441)
  return 1 - Math.min(distance / 441, 1);
}

/**
 * Check if an item's palette contains a similar color
 * @param palette - Item's color palette
 * @param targetColor - Color to compare against
 * @param threshold - Similarity threshold (0-1, default: 0.7)
 */
export function hasSimilarColor(
  palette: Color[] | undefined,
  targetColor: Color,
  threshold = 0.7
): boolean {
  if (!palette) return false;
  
  return palette.some(color => colorSimilarity(color, targetColor) >= threshold);
}


