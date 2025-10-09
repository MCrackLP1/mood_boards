/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Audio Providers
  readonly VITE_AUDIO_PIXABAY_KEY?: string;
  readonly VITE_AUDIO_FREESOUND_KEY?: string;
  
  // Image Search Providers
  readonly VITE_IMAGE_UNSPLASH_KEY?: string;
  readonly VITE_IMAGE_PEXELS_KEY?: string;
  readonly VITE_IMAGE_PIXABAY_KEY?: string;
  
  // App Config
  readonly VITE_PUBLIC_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

