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
 * Fetches link preview using CORS proxies with fallback
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  // Basic validation
  if (!url || !url.startsWith('http')) {
    throw new Error('Invalid URL');
  }

  const domain = extractDomain(url);

  // Try multiple CORS proxies with fallback
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        console.warn(`Proxy ${proxyUrl} returned ${response.status}`);
        continue;
      }

      const html = await response.text();

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
      console.warn(`Proxy ${proxyUrl} failed:`, error);
      continue;
    }
  }

  console.error('All proxies failed for link preview');
  
  // Return fallback preview
  return {
    title: domain,
    description: url,
    image: getFallbackIcon(domain),
    domain,
  };
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
    'pin.it': '📌',
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
  
  if (domain.includes('pinterest') || domain.includes('pin.it')) return 'Pinterest';
  if (domain.includes('instagram')) return 'Instagram';
  if (domain.includes('youtube')) return 'YouTube';
  if (domain.includes('vimeo')) return 'Vimeo';
  if (domain.includes('twitter') || domain.includes('x.com')) return 'Twitter/X';
  if (domain.includes('facebook')) return 'Facebook';
  
  return null;
}

/**
 * Extracts direct image URL from Pinterest URL using oEmbed API
 */
export async function extractPinterestImage(url: string): Promise<string | null> {
  try {
    // Check if it's already a direct pinimg URL
    if (url.includes('pinimg.com')) {
      return url;
    }

    // Resolve shortened pin.it URLs first
    let resolvedUrl = url;
    if (url.includes('pin.it')) {
      // Try to expand the shortened URL by using the oEmbed API
      resolvedUrl = url; // We'll use it as-is, oEmbed handles it
    }

    // Method 1: Use Pinterest's official oEmbed API (no CORS issues!)
    try {
      const oembedUrl = `https://www.pinterest.com/oembed/?url=${encodeURIComponent(resolvedUrl)}&format=json`;
      const oembedResponse = await fetch(oembedUrl);
      
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        
        // The oEmbed response contains thumbnail_url with the image
        if (oembedData.thumbnail_url) {
          // Try to get higher quality version
          let imageUrl = oembedData.thumbnail_url;
          
          // Replace smaller sizes with originals for better quality
          imageUrl = imageUrl.replace('/236x/', '/originals/');
          imageUrl = imageUrl.replace('/474x/', '/originals/');
          imageUrl = imageUrl.replace('/564x/', '/originals/');
          imageUrl = imageUrl.replace('/736x/', '/originals/');
          
          return imageUrl;
        }
      }
    } catch (oembedError) {
      console.warn('oEmbed API failed, trying alternative methods:', oembedError);
    }

    // Method 2: Try alternative CORS proxies
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(resolvedUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(resolvedUrl)}`,
    ];

    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) continue;

        const html = await response.text();

        // Look for og:image meta tag
        const ogImage = extractMetaTag(html, 'og:image');
        if (ogImage && (ogImage.includes('pinimg.com') || ogImage.includes('pinterest'))) {
          return ogImage;
        }

        // Look for direct image URLs
        const imageRegex = /https?:\/\/i\.pinimg\.com\/originals\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
        const matches = html.match(imageRegex);
        if (matches && matches.length > 0) {
          return matches[0];
        }

        // Look for 736x URLs (medium quality)
        const mediumRegex = /https?:\/\/i\.pinimg\.com\/736x\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
        const mediumMatches = html.match(mediumRegex);
        if (mediumMatches && mediumMatches.length > 0) {
          return mediumMatches[0];
        }
      } catch (proxyError) {
        console.warn(`Proxy ${proxyUrl} failed:`, proxyError);
        continue;
      }
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
  return url.includes('pinterest.com') || url.includes('pinimg.com') || url.includes('pin.it');
}

/**
 * Check if URL is a Pinterest Board (collection of pins)
 */
export function isPinterestBoard(url: string): boolean {
  // Pinterest board URLs look like: pinterest.com/username/boardname/
  const boardPattern = /pinterest\.com\/[^/]+\/[^/]+\/?$/;
  return boardPattern.test(url);
}

/**
 * Extracts all image URLs from a Pinterest Board
 * Note: Pinterest Board extraction is limited due to Pinterest's protection against scraping
 */
export async function extractPinterestBoardImages(url: string): Promise<string[]> {
  try {
    // Try alternative CORS proxies with fallback
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    ];

    for (const proxyUrl of proxies) {
      try {
        console.log(`Trying to fetch board with proxy...`);
        const response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(10000) // 10 second timeout for boards
        });
        
        if (!response.ok) {
          console.warn(`Proxy returned ${response.status}`);
          continue;
        }

        const html = await response.text();

        // Extract all Pinterest image URLs from the board page
        const imageUrls: Set<string> = new Set();

        // Method 1: Find all pinimg.com URLs in the HTML
        const originalRegex = /https?:\/\/i\.pinimg\.com\/originals\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
        const originalMatches = html.match(originalRegex);
        if (originalMatches) {
          originalMatches.forEach((url: string) => imageUrls.add(url));
        }

        // Method 2: Find 736x URLs (medium quality)
        const mediumRegex = /https?:\/\/i\.pinimg\.com\/736x\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
        const mediumMatches = html.match(mediumRegex);
        if (mediumMatches) {
          mediumMatches.forEach((url: string) => {
            // Try originals first, but keep 736x as fallback
            imageUrls.add(url);
          });
        }

        // Method 3: Look for 564x URLs (smaller quality) as fallback
        const smallRegex = /https?:\/\/i\.pinimg\.com\/564x\/[^"'\s]+\.(jpg|jpeg|png|gif|webp)/gi;
        const smallMatches = html.match(smallRegex);
        if (smallMatches) {
          smallMatches.forEach((url: string) => imageUrls.add(url));
        }

        // If we found images, return them
        if (imageUrls.size > 0) {
          // Limit to reasonable number of images (max 30 to avoid overwhelming)
          const uniqueUrls = Array.from(imageUrls).slice(0, 30);
          console.log(`Found ${uniqueUrls.length} images in Pinterest board`);
          return uniqueUrls;
        }
      } catch (proxyError) {
        console.warn(`Proxy failed:`, proxyError);
        continue;
      }
    }

    console.warn('All proxies failed to extract board images');
    return [];
  } catch (error) {
    console.error('Failed to extract Pinterest board images:', error);
    return [];
  }
}

