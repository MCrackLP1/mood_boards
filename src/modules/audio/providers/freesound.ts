/**
 * Freesound.org Audio Provider
 * https://freesound.org/docs/api/
 * Requires VITE_AUDIO_FREESOUND_KEY environment variable
 */

import { BaseAudioProvider } from './base';
import { AudioSearchOptions, AudioResult } from '@/types';

export class FreesoundAudioProvider extends BaseAudioProvider {
  name = 'Freesound';
  
  protected getApiKey(): string | undefined {
    return import.meta.env.VITE_AUDIO_FREESOUND_KEY;
  }
  
  async search(query: string, options: AudioSearchOptions = {}): Promise<AudioResult[]> {
    if (!this.isConfigured()) {
      console.warn('Freesound API key not configured');
      return [];
    }
    
    const params = new URLSearchParams({
      query,
      token: this.getApiKey()!,
      page_size: String(options.limit || 10),
      fields: 'id,name,duration,previews,license,username',
    });
    
    try {
      const response = await fetch(`https://freesound.org/apiv2/search/text/?${params}`);
      if (!response.ok) throw new Error('Freesound API error');
      
      const data = await response.json();
      
      return data.results?.map((result: any) => ({
        id: String(result.id),
        title: result.name,
        duration: result.duration || 0,
        previewUrl: result.previews?.['preview-lq-mp3'] || result.previews?.['preview-hq-mp3'],
        license: result.license,
        author: result.username || 'Unknown',
      })) || [];
    } catch (error) {
      console.error('Freesound search error:', error);
      return [];
    }
  }
  
  async getStreamUrl(id: string): Promise<string> {
    // Freesound requires fetching sound details
    if (!this.isConfigured()) throw new Error('Freesound API key not configured');
    
    const response = await fetch(
      `https://freesound.org/apiv2/sounds/${id}/?token=${this.getApiKey()}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch sound details');
    
    const data = await response.json();
    return data.previews?.['preview-hq-mp3'] || data.previews?.['preview-lq-mp3'];
  }
}

