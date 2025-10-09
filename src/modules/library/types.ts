/**
 * Asset Library types
 */

import { Color } from '@/types';

export interface LibraryAsset {
  id: string;
  name: string;
  src: string; // Data URL
  thumbnailSrc?: string; // Optional smaller version
  palette?: Color[];
  width: number;
  height: number;
  fileSize: number; // In bytes
  uploadedAt: number;
  tags?: string[]; // For future search/filter
}

