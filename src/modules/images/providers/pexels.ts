/**
 * Pexels Image Provider
 * https://www.pexels.com/api/
 * Requires VITE_IMAGE_PEXELS_KEY environment variable
 */

import { BaseImageProvider, ImageSearchOptions, ImageSearchResult } from './base';

export class PexelsImageProvider extends BaseImageProvider {
  name = 'Pexels';
  
  protected getApiKey(): string | undefined {
    return import.meta.env.VITE_IMAGE_PEXELS_KEY;
  }
  
  async search(options: ImageSearchOptions): Promise<ImageSearchResult[]> {
    if (!this.isConfigured()) {
      console.warn('Pexels API key not configured');
      return [];
    }
    
    const params = new URLSearchParams({
      query: options.query,
      page: String(options.page || 1),
      per_page: String(options.perPage || 20),
      ...(options.orientation && { orientation: options.orientation }),
    });
    
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?${params}`,
        {
          headers: {
            Authorization: this.getApiKey()!,
          },
        }
      );
      
      if (!response.ok) throw new Error('Pexels API error');
      
      const data = await response.json();
      
      return data.photos?.map((photo: any) => ({
        id: String(photo.id),
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        photographer: photo.photographer,
        source: 'Pexels',
        downloadUrl: photo.src.original,
        width: photo.width,
        height: photo.height,
        alt: photo.alt,
      })) || [];
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }
  
  async downloadImage(result: ImageSearchResult): Promise<string> {
    const response = await fetch(result.url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

