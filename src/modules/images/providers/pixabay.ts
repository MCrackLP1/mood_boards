/**
 * Pixabay Image Provider
 * https://pixabay.com/api/docs/
 * Requires VITE_IMAGE_PIXABAY_KEY environment variable
 */

import { BaseImageProvider, ImageSearchOptions, ImageSearchResult } from './base';

export class PixabayImageProvider extends BaseImageProvider {
  name = 'Pixabay';
  
  protected getApiKey(): string | undefined {
    return import.meta.env.VITE_IMAGE_PIXABAY_KEY;
  }
  
  async search(options: ImageSearchOptions): Promise<ImageSearchResult[]> {
    if (!this.isConfigured()) {
      console.warn('Pixabay API key not configured');
      return [];
    }
    
    const params = new URLSearchParams({
      key: this.getApiKey()!,
      q: options.query,
      page: String(options.page || 1),
      per_page: String(options.perPage || 20),
      image_type: 'photo',
    });
    
    try {
      const response = await fetch(`https://pixabay.com/api/?${params}`);
      
      if (!response.ok) throw new Error('Pixabay API error');
      
      const data = await response.json();
      
      return data.hits?.map((image: any) => ({
        id: String(image.id),
        url: image.largeImageURL,
        thumbnailUrl: image.previewURL,
        photographer: image.user,
        source: 'Pixabay',
        downloadUrl: image.largeImageURL,
        width: image.imageWidth,
        height: image.imageHeight,
        alt: image.tags,
      })) || [];
    } catch (error) {
      console.error('Pixabay search error:', error);
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


