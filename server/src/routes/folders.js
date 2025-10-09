/**
 * Library Folders API Routes
 */

import express from 'express';
import { db } from '../database.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// GET all folders
router.get('/', (req, res) => {
  try {
    const folders = db.prepare('SELECT * FROM library_folders ORDER BY `order`').all();
    res.json(folders);
  } catch (error) {
    console.error('Error loading folders:', error);
    res.status(500).json({ error: 'Failed to load folders' });
  }
});

// POST create folder
router.post('/', (req, res) => {
  try {
    const { name, icon } = req.body;
    
    // Get max order
    const maxOrder = db.prepare('SELECT MAX(`order`) as maxOrder FROM library_folders').get();
    const order = (maxOrder?.maxOrder ?? -1) + 1;

    const folder = {
      id: nanoid(),
      name: name || 'Neuer Ordner',
      icon: icon || '📁',
      order,
      createdAt: Date.now()
    };

    db.prepare(`
      INSERT INTO library_folders (id, name, icon, \`order\`, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(folder.id, folder.name, folder.icon, folder.order, folder.createdAt);

    res.json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// PUT update folder
router.put('/:id', (req, res) => {
  try {
    const { name, icon, order } = req.body;
    
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (order !== undefined) {
      updates.push('`order` = ?');
      values.push(order);
    }

    values.push(req.params.id);
    
    db.prepare(`UPDATE library_folders SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const folder = db.prepare('SELECT * FROM library_folders WHERE id = ?').get(req.params.id);
    res.json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// DELETE folder
router.delete('/:id', (req, res) => {
  try {
    // Prevent deleting the default folder
    if (req.params.id === 'uncategorized') {
      return res.status(400).json({ error: 'Cannot delete default folder' });
    }

    // Move assets to uncategorized folder
    db.prepare('UPDATE library_assets SET folderId = ? WHERE folderId = ?')
      .run('uncategorized', req.params.id);

    // Delete folder
    db.prepare('DELETE FROM library_folders WHERE id = ?').run(req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

export default router;

