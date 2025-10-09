/**
 * Audio manager
 * Coordinates multiple audio providers and manages playback
 */

import { AudioProvider, AudioSearchOptions, AudioResult } from '@/types';
import { PixabayAudioProvider } from './providers/pixabay';
import { FreesoundAudioProvider } from './providers/freesound';
import { FallbackAudioProvider } from './providers/fallback';

class AudioManager {
  private providers: AudioProvider[] = [];
  private currentAudio: HTMLAudioElement | null = null;
  
  constructor() {
    // Register providers in order of preference
    this.providers = [
      new PixabayAudioProvider(),
      new FreesoundAudioProvider(),
      new FallbackAudioProvider(),
    ];
  }
  
  /**
   * Search for ambient sounds across all providers
   */
  async searchAmbient(query: string, options?: AudioSearchOptions): Promise<AudioResult[]> {
    const results: AudioResult[] = [];
    
    for (const provider of this.providers) {
      try {
        const providerResults = await provider.search(query, options);
        results.push(...providerResults);
        
        // Stop after first provider with results
        if (providerResults.length > 0) break;
      } catch (error) {
        console.error(`Error searching ${provider.name}:`, error);
      }
    }
    
    return results;
  }
  
  /**
   * Play audio from URL
   * @param url - Audio URL
   * @param volume - Volume (0-1), default 0.2
   */
  play(url: string, volume = 0.2): void {
    this.stop();
    
    this.currentAudio = new Audio(url);
    this.currentAudio.volume = volume;
    this.currentAudio.loop = true;
    this.currentAudio.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  }
  
  /**
   * Stop current audio
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
  
  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }
  
  /**
   * Get current audio element
   */
  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio;
  }
}

export const audioManager = new AudioManager();

