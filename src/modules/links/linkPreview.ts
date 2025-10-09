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

/**
 * Extracts direct image URL from Pinterest URL
 */
export async function extractPinterestImage(url: string): Promise<string | null> {
  try {
    // Check if it's already a direct pinimg URL
    if (url.includes('pinimg.com')) {
      return url;
    }

    // Try to fetch the Pinterest page and extract the image
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const html = data.contents;

    // Look for various Pinterest image patterns
    // Method 1: og:image meta tag (usually high quality)
    const ogImage = extractMetaTag(html, 'og:image');
    if (ogImage && (ogImage.includes('pinimg.com') || ogImage.includes('pinterest'))) {
      return ogImage;
    }

    // Method 2: Look for direct image URLs in the HTML
    const imageRegex = /https?:\/\/i\.pinimg\.com\/originals\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const matches = html.match(imageRegex);
    if (matches && matches.length > 0) {
      return matches[0];
    }

    // Method 3: Look for 736x URLs (medium quality)
    const mediumRegex = /https?:\/\/i\.pinimg\.com\/736x\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const mediumMatches = html.match(mediumRegex);
    if (mediumMatches && mediumMatches.length > 0) {
      return mediumMatches[0];
    }

    return null;
  } catch (error) {
    console.error('Failed to extract Pinterest image:', error);
    return null;
  }
}

/**
 * Check if URL is a Pinterest URL
 */
export function isPinterestUrl(url: string): boolean {
  return url.includes('pinterest.com') || url.includes('pinimg.com');
}

