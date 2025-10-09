/**
 * Image provider interface
 * Abstraction for different image search sources
 */

export interface ImageSearchResult {
  id: string;
  url: string; // High-res URL
  thumbnailUrl: string; // Preview URL
  photographer?: string;
  source: string; // Provider name
  downloadUrl?: string; // Direct download link
  width: number;
  height: number;
  alt?: string;
}

export interface ImageSearchOptions {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
}

export abstract class BaseImageProvider {
  abstract name: string;
  
  abstract search(options: ImageSearchOptions): Promise<ImageSearchResult[]>;
  abstract downloadImage(result: ImageSearchResult): Promise<string>; // Returns data URL
  
  protected getApiKey(): string | undefined {
    return undefined;
  }
  
  protected isConfigured(): boolean {
    return !!this.getApiKey();
  }
}

