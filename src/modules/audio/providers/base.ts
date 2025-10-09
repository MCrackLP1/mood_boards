/**
 * Audio provider interface
 * Abstraction for different audio sources (Pixabay, Freesound, etc.)
 */

import { AudioProvider, AudioSearchOptions, AudioResult } from '@/types';

export abstract class BaseAudioProvider implements AudioProvider {
  abstract name: string;
  
  abstract search(query: string, options?: AudioSearchOptions): Promise<AudioResult[]>;
  abstract getStreamUrl(id: string): Promise<string>;
  
  protected getApiKey(): string | undefined {
    return undefined; // Override in subclasses
  }
  
  protected isConfigured(): boolean {
    return !!this.getApiKey();
  }
}


