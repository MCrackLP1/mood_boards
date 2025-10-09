/**
 * Link Preview Service
 * Fetches Open Graph metadata for URLs
 */

import { LinkPreview } from '@/types';

/**
 * Extracts domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

/**
 * Fetches link preview using a CORS proxy
 * Uses LinkPreview API (free tier: 60 requests/hour)
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  // Basic validation
  if (!url || !url.startsWith('http')) {
    throw new Error('Invalid URL');
  }

  const domain = extractDomain(url);

  try {
    // Option 1: Use LinkPreview API (requires API key in production)
    // For now, we'll use a simple fetch approach with CORS workaround
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preview');
    }

    const data = await response.json();
    const html = data.contents;

    // Parse Open Graph tags
    const ogTitle = extractMetaTag(html, 'og:title') || extractMetaTag(html, 'twitter:title');
    const ogDescription = extractMetaTag(html, 'og:description') || extractMetaTag(html, 'twitter:description');
    const ogImage = extractMetaTag(html, 'og:image') || extractMetaTag(html, 'twitter:image');
    
    // Fallback to HTML title if no OG title
    const title = ogTitle || extractTitle(html) || domain;
    const description = ogDescription || '';
    const image = ogImage || getFallbackIcon(domain);

    return {
      title,
      description,
      image,
      domain,
    };
  } catch (error) {
    console.error('Failed to fetch link preview:', error);
    
    // Return fallback preview
    return {
      title: domain,
      description: url,
      image: getFallbackIcon(domain),
      domain,
    };
  }
}

/**
 * Extract meta tag content from HTML
 */
function extractMetaTag(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

/**
 * Get fallback icon for known domains
 */
function getFallbackIcon(domain: string): string {
  const icons: Record<string, string> = {
    'pinterest.com': '📌',
    'instagram.com': '📷',
    'youtube.com': '🎥',
    'vimeo.com': '🎬',
    'twitter.com': '🐦',
    'x.com': '🐦',
    'facebook.com': '👥',
  };

  const key = Object.keys(icons).find(k => domain.includes(k));
  return key ? icons[key] : '🔗';
}

/**
 * Checks if URL is from a known social platform
 */
export function detectPlatform(url: string): string | null {
  const domain = extractDomain(url);
  
  if (domain.includes('pinterest')) return 'Pinterest';
  if (domain.includes('instagram')) return 'Instagram';
  if (domain.includes('youtube')) return 'YouTube';
  if (domain.includes('vimeo')) return 'Vimeo';
  if (domain.includes('twitter') || domain.includes('x.com')) return 'Twitter/X';
  if (domain.includes('facebook')) return 'Facebook';
  
  return null;
}

