/**
 * Board Sections
 * Structured layout with defined areas
 * Now supports custom user-defined sections
 */

import { Section } from './index';

export type SectionType = 'inspiration' | 'location' | 'general';

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'inspiration',
    title: 'Beispielbilder',
    description: 'Inspiration & Referenzen für das Shooting',
    icon: '✨',
    isCustom: false,
    order: 0,
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Ort, Setting & Atmosphäre',
    icon: '📍',
    isCustom: false,
    order: 1,
  },
  {
    id: 'general',
    title: 'Allgemein',
    description: 'Weitere Bilder & Notizen',
    icon: '📋',
    isCustom: false,
    order: 2,
  },
];


