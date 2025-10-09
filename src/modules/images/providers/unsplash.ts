/**
 * Unsplash Image Provider
 * https://unsplash.com/developers
 * Requires VITE_IMAGE_UNSPLASH_KEY environment variable
 */

import { BaseImageProvider, ImageSearchOptions, ImageSearchResult } from './base';

export class UnsplashImageProvider extends BaseImageProvider {
  name = 'Unsplash';
  
  protected getApiKey(): string | undefined {
    return import.meta.env.VITE_IMAGE_UNSPLASH_KEY;
  }
  
  async search(options: ImageSearchOptions): Promise<ImageSearchResult[]> {
    if (!this.isConfigured()) {
      console.warn('Unsplash API key not configured');
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
        `https://api.unsplash.com/search/photos?${params}`,
        {
          headers: {
            Authorization: `Client-ID ${this.getApiKey()}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Unsplash API error');
      
      const data = await response.json();
      
      return data.results?.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.thumb,
        photographer: photo.user?.name,
        source: 'Unsplash',
        downloadUrl: photo.links.download,
        width: photo.width,
        height: photo.height,
        alt: photo.alt_description || photo.description,
      })) || [];
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }
  
  async downloadImage(result: ImageSearchResult): Promise<string> {
    // Fetch image and convert to data URL
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


