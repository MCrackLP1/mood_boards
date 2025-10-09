/**
 * Board Sections
 * Structured layout with defined areas
 */

export type SectionType = 'inspiration' | 'location' | 'general';

export interface Section {
  id: SectionType;
  title: string;
  description: string;
  icon: string;
}

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'inspiration',
    title: 'Beispielbilder',
    description: 'Inspiration & Referenzen für das Shooting',
    icon: '✨',
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Ort, Setting & Atmosphäre',
    icon: '📍',
  },
  {
    id: 'general',
    title: 'Allgemein',
    description: 'Weitere Bilder & Notizen',
    icon: '📋',
  },
];

