/**
 * Fallback audio provider
 * Returns empty results when no API keys are configured
 * Can be extended to use local audio files
 */

import { BaseAudioProvider } from './base';
import { AudioSearchOptions, AudioResult } from '@/types';

export class FallbackAudioProvider extends BaseAudioProvider {
  name = 'Fallback';
  
  async search(_query: string, _options?: AudioSearchOptions): Promise<AudioResult[]> {
    // TODO: Could return local audio files here
    return [];
  }
  
  async getStreamUrl(_id: string): Promise<string> {
    // TODO: Could return local audio file path
    return '';
  }
}


