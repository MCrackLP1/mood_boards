/**
 * Seed data for demo/testing purposes
 */

import { db } from './db';
import { Board, BoardItem } from '@/types';
import { nanoid } from '@/modules/utils/id';

// Demo image (1x1 colored pixels as data URLs for demo)
const DEMO_IMAGES = {
  red: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  blue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==',
  green: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+fAQADhQGAM8+6nQAAAABJRU5ErkJggg==',
};

/**
 * Seed database with demo board
 * Call this from browser console: `import { seedDemo } from '@/modules/database/seed'`
 */
export async function seedDemo() {
  console.log('🌱 Seeding demo data...');
  
  // Check if demo board already exists
  const existing = await db.boards
    .filter(b => b.title === 'Demo Moodboard')
    .first();
  
  if (existing) {
    console.log('ℹ️ Demo board already exists');
    return existing.id;
  }
  
  // Create demo board
  const boardId = nanoid();
  const board: Board = {
    id: boardId,
    title: 'Demo Moodboard',
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now(),
    welcomeText: 'Willkommen zum Demo-Moodboard! ✨',
    brandingEnabled: true,
  };
  
  await db.boards.add(board);
  console.log('✅ Created demo board:', board.id);
  
  // Create demo items
  const items: BoardItem[] = [
    {
      id: nanoid(),
      boardId,
      type: 'image',
      order: 0,
      createdAt: Date.now(),
      src: DEMO_IMAGES.red,
      palette: [
        { hex: '#ff0000', rgb: [255, 0, 0], score: 0.8 },
        { hex: '#cc0000', rgb: [204, 0, 0], score: 0.2 },
      ],
      meta: {
        label: 'Warme Töne',
      },
    },
    {
      id: nanoid(),
      boardId,
      type: 'image',
      order: 1,
      createdAt: Date.now(),
      src: DEMO_IMAGES.blue,
      palette: [
        { hex: '#0000ff', rgb: [0, 0, 255], score: 0.7 },
        { hex: '#0000cc', rgb: [0, 0, 204], score: 0.3 },
      ],
      meta: {
        label: 'Kühle Töne',
      },
    },
    {
      id: nanoid(),
      boardId,
      type: 'image',
      order: 2,
      createdAt: Date.now(),
      src: DEMO_IMAGES.green,
      palette: [
        { hex: '#00ff00', rgb: [0, 255, 0], score: 0.6 },
        { hex: '#00cc00', rgb: [0, 204, 0], score: 0.4 },
      ],
      meta: {
        label: 'Naturtöne',
      },
    },
  ];
  
  await db.items.bulkAdd(items);
  console.log(`✅ Created ${items.length} demo items`);
  
  console.log('🎉 Demo data seeded successfully!');
  console.log(`   Board ID: ${boardId}`);
  console.log(`   Visit: #/board/${boardId}`);
  
  return boardId;
}

/**
 * Clear all data from database
 */
export async function clearAllData() {
  const confirmed = confirm('⚠️ Alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden!');
  
  if (!confirmed) {
    console.log('❌ Abgebrochen');
    return;
  }
  
  await db.items.clear();
  await db.boards.clear();
  
  console.log('🗑️ Alle Daten gelöscht');
}


