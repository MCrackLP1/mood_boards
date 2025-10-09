/**
 * Vercel Serverless Function: Pinterest Proxy
 * Resolves Pinterest URLs and fetches oEmbed data without CORS issues
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL parameter is required' });
    return;
  }

  try {
    let resolvedUrl = url;

    // If it's a pin.it short URL, resolve it first
    if (url.includes('pin.it')) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
        });
        resolvedUrl = response.url; // Get the final URL after redirects
        console.log(`Resolved ${url} to ${resolvedUrl}`);
      } catch (error) {
        console.error('Failed to resolve short URL:', error);
        // Try using the original URL with oEmbed directly
        resolvedUrl = url;
      }
    }

    // Try Pinterest oEmbed API with both resolved and original URL
    const urlsToTry = [resolvedUrl];
    if (resolvedUrl !== url) {
      urlsToTry.push(url); // Also try original if different
    }

    for (const tryUrl of urlsToTry) {
      try {
        const oembedUrl = `https://www.pinterest.com/oembed/?url=${encodeURIComponent(tryUrl)}&format=json`;
        const oembedResponse = await fetch(oembedUrl);

        if (oembedResponse.ok) {
          const data = await oembedResponse.json();
          
          // Enhance with higher quality image if available
          if (data.thumbnail_url) {
            let imageUrl = data.thumbnail_url;
            
            // Try to get higher quality version
            imageUrl = imageUrl.replace('/236x/', '/originals/');
            imageUrl = imageUrl.replace('/474x/', '/originals/');
            imageUrl = imageUrl.replace('/564x/', '/originals/');
            imageUrl = imageUrl.replace('/736x/', '/originals/');
            
            data.high_quality_image = imageUrl;
          }

          res.status(200).json({
            success: true,
            data,
          });
          return;
        }
      } catch (oembedError) {
        console.error(`oEmbed failed for ${tryUrl}:`, oembedError);
        continue;
      }
    }

    // If oEmbed fails, try to fetch the page and extract metadata
    try {
      const pageResponse = await fetch(resolvedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await pageResponse.text();

      // Extract Open Graph metadata
      const ogImage = extractMetaTag(html, 'og:image');
      const ogTitle = extractMetaTag(html, 'og:title');
      const ogDescription = extractMetaTag(html, 'og:description');

      if (ogImage) {
        res.status(200).json({
          success: true,
          data: {
            thumbnail_url: ogImage,
            high_quality_image: ogImage.replace('/236x/', '/originals/').replace('/564x/', '/originals/').replace('/736x/', '/originals/'),
            title: ogTitle || '',
            author_name: ogDescription || '',
          },
        });
        return;
      }
    } catch (pageError) {
      console.error('Page fetch failed:', pageError);
    }

    res.status(404).json({ 
      success: false,
      error: 'Could not extract Pinterest image from any method' 
    });

  } catch (error) {
    console.error('Pinterest proxy error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
}

/**
 * Extract meta tag content from HTML
 */
function extractMetaTag(html, property) {
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

