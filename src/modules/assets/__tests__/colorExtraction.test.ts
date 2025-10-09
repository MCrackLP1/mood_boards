/**
 * Tests for color extraction utilities
 */

import { describe, it, expect } from 'vitest';
import { colorSimilarity, hasSimilarColor } from '../colorExtraction';
import { Color } from '@/types';

describe('colorSimilarity', () => {
  it('should return 1 for identical colors', () => {
    const color1: Color = { hex: '#ff0000', rgb: [255, 0, 0], score: 1 };
    const color2: Color = { hex: '#ff0000', rgb: [255, 0, 0], score: 1 };
    
    expect(colorSimilarity(color1, color2)).toBe(1);
  });
  
  it('should return 0 for very different colors', () => {
    const black: Color = { hex: '#000000', rgb: [0, 0, 0], score: 1 };
    const white: Color = { hex: '#ffffff', rgb: [255, 255, 255], score: 1 };
    
    const similarity = colorSimilarity(black, white);
    expect(similarity).toBeLessThan(0.1);
  });
  
  it('should return high similarity for similar colors', () => {
    const red1: Color = { hex: '#ff0000', rgb: [255, 0, 0], score: 1 };
    const red2: Color = { hex: '#fe0101', rgb: [254, 1, 1], score: 1 };
    
    const similarity = colorSimilarity(red1, red2);
    expect(similarity).toBeGreaterThan(0.95);
  });
});

describe('hasSimilarColor', () => {
  it('should return true when palette contains similar color', () => {
    const palette: Color[] = [
      { hex: '#ff0000', rgb: [255, 0, 0], score: 0.5 },
      { hex: '#00ff00', rgb: [0, 255, 0], score: 0.3 },
    ];
    
    const targetColor: Color = { hex: '#fe0101', rgb: [254, 1, 1], score: 1 };
    
    expect(hasSimilarColor(palette, targetColor, 0.7)).toBe(true);
  });
  
  it('should return false when palette has no similar colors', () => {
    const palette: Color[] = [
      { hex: '#0000ff', rgb: [0, 0, 255], score: 0.5 },
    ];
    
    const targetColor: Color = { hex: '#ff0000', rgb: [255, 0, 0], score: 1 };
    
    expect(hasSimilarColor(palette, targetColor, 0.7)).toBe(false);
  });
  
  it('should return false when palette is undefined', () => {
    const targetColor: Color = { hex: '#ff0000', rgb: [255, 0, 0], score: 1 };
    
    expect(hasSimilarColor(undefined, targetColor)).toBe(false);
  });
});

