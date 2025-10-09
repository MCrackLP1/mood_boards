/**
 * SQLite Database Setup
 * Simple file-based database - no installation needed
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../data/moodboard.db');

export const db = new Database(dbPath);

export function initDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      welcomeText TEXT,
      brandingEnabled INTEGER DEFAULT 1,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      boardId TEXT NOT NULL,
      type TEXT NOT NULL,
      src TEXT,
      caption TEXT,
      section TEXT DEFAULT 'general',
      \`order\` INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (boardId) REFERENCES boards(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS library_folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '📁',
      \`order\` INTEGER NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS library_assets (
      id TEXT PRIMARY KEY,
      folderId TEXT NOT NULL,
      name TEXT NOT NULL,
      src TEXT NOT NULL,
      palette TEXT,
      width INTEGER,
      height INTEGER,
      fileSize INTEGER,
      uploadedAt INTEGER NOT NULL,
      FOREIGN KEY (folderId) REFERENCES library_folders(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_items_boardId ON items(boardId);
    CREATE INDEX IF NOT EXISTS idx_items_order ON items(\`order\`);
    CREATE INDEX IF NOT EXISTS idx_assets_folderId ON library_assets(folderId);
  `);

  // Create default folder if not exists
  const defaultFolder = db.prepare('SELECT id FROM library_folders WHERE id = ?').get('uncategorized');
  if (!defaultFolder) {
    db.prepare(`
      INSERT INTO library_folders (id, name, icon, \`order\`, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run('uncategorized', 'Nicht kategorisiert', '📁', 999, Date.now());
  }

  console.log('✓ Datenbank initialisiert:', dbPath);
}

