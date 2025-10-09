/**
 * Pixabay Audio Provider
 * https://pixabay.com/api/docs/#api_search_audio
 * Requires VITE_AUDIO_PIXABAY_KEY environment variable
 */

import { BaseAudioProvider } from './base';
import { AudioSearchOptions, AudioResult } from '@/types';

export class PixabayAudioProvider extends BaseAudioProvider {
  name = 'Pixabay';
  
  protected getApiKey(): string | undefined {
    return import.meta.env.VITE_AUDIO_PIXABAY_KEY;
  }
  
  async search(query: string, options: AudioSearchOptions = {}): Promise<AudioResult[]> {
    if (!this.isConfigured()) {
      console.warn('Pixabay API key not configured');
      return [];
    }
    
    const params = new URLSearchParams({
      key: this.getApiKey()!,
      q: query,
      per_page: String(options.limit || 10),
    });
    
    try {
      const response = await fetch(`https://pixabay.com/api/audio/?${params}`);
      if (!response.ok) throw new Error('Pixabay API error');
      
      const data = await response.json();
      
      return data.hits?.map((hit: any) => ({
        id: String(hit.id),
        title: hit.name || hit.tags,
        duration: hit.duration || 0,
        previewUrl: hit.preview_url || hit.url,
        license: 'CC0',
        author: hit.user || 'Unknown',
      })) || [];
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  }
  
  async getStreamUrl(id: string): Promise<string> {
    // Pixabay provides direct URLs, so we just return a placeholder
    // In practice, you'd fetch the full audio URL from the API
    return `https://cdn.pixabay.com/audio/${id}.mp3`;
  }
}


