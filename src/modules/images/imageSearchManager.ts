/**
 * Image search manager
 * Coordinates multiple image providers
 */

import { BaseImageProvider, ImageSearchOptions, ImageSearchResult } from './providers/base';
import { UnsplashImageProvider } from './providers/unsplash';
import { PexelsImageProvider } from './providers/pexels';
import { PixabayImageProvider } from './providers/pixabay';

class ImageSearchManager {
  private providers: BaseImageProvider[] = [];
  
  constructor() {
    // Register providers
    this.providers = [
      new UnsplashImageProvider(),
      new PexelsImageProvider(),
      new PixabayImageProvider(),
    ];
  }
  
  /**
   * Search images across all configured providers
   */
  async search(options: ImageSearchOptions): Promise<ImageSearchResult[]> {
    const results: ImageSearchResult[] = [];
    
    // Search all providers in parallel
    const promises = this.providers.map(provider => 
      provider.search(options).catch(err => {
        console.error(`Error from ${provider.name}:`, err);
        return [];
      })
    );
    
    const allResults = await Promise.all(promises);
    
    // Combine results from all providers
    allResults.forEach(providerResults => {
      results.push(...providerResults);
    });
    
    return results;
  }
  
  /**
   * Download image and convert to data URL
   */
  async downloadImage(result: ImageSearchResult): Promise<string> {
    const provider = this.providers.find(p => p.name === result.source);
    
    if (!provider) {
      throw new Error(`Provider ${result.source} not found`);
    }
    
    return provider.downloadImage(result);
  }
  
  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): string[] {
    return this.providers.map(p => p.name);
  }
}

export const imageSearchManager = new ImageSearchManager();


