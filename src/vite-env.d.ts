/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUDIO_PIXABAY_KEY?: string;
  readonly VITE_AUDIO_FREESOUND_KEY?: string;
  readonly VITE_PUBLIC_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

