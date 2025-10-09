/**
 * Board Items API Routes
 */

import express from 'express';
import { db } from '../database.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// GET items for a board
router.get('/board/:boardId', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items WHERE boardId = ? ORDER BY `order`').all(req.params.boardId);
    res.json(items);
  } catch (error) {
    console.error('Error loading items:', error);
    res.status(500).json({ error: 'Failed to load items' });
  }
});

// POST create item
router.post('/', (req, res) => {
  try {
    const { boardId, type, src, caption, section } = req.body;
    
    // Get max order for this board
    const maxOrder = db.prepare('SELECT MAX(`order`) as maxOrder FROM items WHERE boardId = ?').get(boardId);
    const order = (maxOrder?.maxOrder ?? -1) + 1;

    const item = {
      id: nanoid(),
      boardId,
      type,
      src: src || null,
      caption: caption || null,
      section: section || 'general',
      order,
      createdAt: Date.now()
    };

    db.prepare(`
      INSERT INTO items (id, boardId, type, src, caption, section, \`order\`, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(item.id, item.boardId, item.type, item.src, item.caption, item.section, item.order, item.createdAt);

    // Update board timestamp
    db.prepare('UPDATE boards SET updatedAt = ? WHERE id = ?').run(Date.now(), boardId);

    res.json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
router.put('/:id', (req, res) => {
  try {
    const { type, src, caption, section, order } = req.body;
    
    const updates = [];
    const values = [];

    if (type !== undefined) {
      updates.push('type = ?');
      values.push(type);
    }
    if (src !== undefined) {
      updates.push('src = ?');
      values.push(src);
    }
    if (caption !== undefined) {
      updates.push('caption = ?');
      values.push(caption);
    }
    if (section !== undefined) {
      updates.push('section = ?');
      values.push(section);
    }
    if (order !== undefined) {
      updates.push('`order` = ?');
      values.push(order);
    }

    values.push(req.params.id);
    
    db.prepare(`UPDATE items SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    // Update board timestamp
    const item = db.prepare('SELECT boardId FROM items WHERE id = ?').get(req.params.id);
    if (item) {
      db.prepare('UPDATE boards SET updatedAt = ? WHERE id = ?').run(Date.now(), item.boardId);
    }

    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT boardId FROM items WHERE id = ?').get(req.params.id);
    
    db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
    
    // Update board timestamp
    if (item) {
      db.prepare('UPDATE boards SET updatedAt = ? WHERE id = ?').run(Date.now(), item.boardId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;

