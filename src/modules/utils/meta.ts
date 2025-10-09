/**
 * Dynamic meta tags management for SEO
 */

export interface MetaTags {
  title?: string;
  description?: string;
  image?: string;
}

/**
 * Update document meta tags
 */
export function updateMetaTags({ title, description, image }: MetaTags) {
  // Update title
  if (title) {
    document.title = title;
    updateOrCreateMetaTag('og:title', title);
    updateOrCreateMetaTag('twitter:title', title);
  }
  
  // Update description
  if (description) {
    updateOrCreateMetaTag('description', description);
    updateOrCreateMetaTag('og:description', description);
    updateOrCreateMetaTag('twitter:description', description);
  }
  
  // Update image
  if (image) {
    updateOrCreateMetaTag('og:image', image);
    updateOrCreateMetaTag('twitter:image', image);
  }
}

function updateOrCreateMetaTag(property: string, content: string) {
  // Try og: property first
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  // Fallback to name attribute
  if (!meta) {
    meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }
  
  if (meta) {
    meta.content = content;
  } else {
    // Create new meta tag
    const newMeta = document.createElement('meta');
    
    // Use property for og: tags, name for others
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      newMeta.setAttribute('property', property);
    } else {
      newMeta.setAttribute('name', property);
    }
    
    newMeta.content = content;
    document.head.appendChild(newMeta);
  }
}

