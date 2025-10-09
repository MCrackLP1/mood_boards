/**
 * Board API Routes
 */

import express from 'express';
import { db } from '../database.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// GET all boards
router.get('/', (req, res) => {
  try {
    const boards = db.prepare('SELECT * FROM boards ORDER BY createdAt DESC').all();
    res.json(boards);
  } catch (error) {
    console.error('Error loading boards:', error);
    res.status(500).json({ error: 'Failed to load boards' });
  }
});

// GET single board
router.get('/:id', (req, res) => {
  try {
    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json(board);
  } catch (error) {
    console.error('Error loading board:', error);
    res.status(500).json({ error: 'Failed to load board' });
  }
});

// POST create board
router.post('/', (req, res) => {
  try {
    const { title } = req.body;
    const board = {
      id: nanoid(),
      title: title || 'Neues Moodboard',
      welcomeText: `Willkommen zu ${title || 'Neues Moodboard'}`,
      brandingEnabled: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    db.prepare(`
      INSERT INTO boards (id, title, welcomeText, brandingEnabled, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(board.id, board.title, board.welcomeText, board.brandingEnabled, board.createdAt, board.updatedAt);

    res.json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// PUT update board
router.put('/:id', (req, res) => {
  try {
    const { title, welcomeText, brandingEnabled } = req.body;
    const updatedAt = Date.now();

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (welcomeText !== undefined) {
      updates.push('welcomeText = ?');
      values.push(welcomeText);
    }
    if (brandingEnabled !== undefined) {
      updates.push('brandingEnabled = ?');
      values.push(brandingEnabled ? 1 : 0);
    }

    updates.push('updatedAt = ?');
    values.push(updatedAt);
    values.push(req.params.id);

    db.prepare(`UPDATE boards SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
    res.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// DELETE board
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM boards WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

// POST duplicate board
router.post('/:id/duplicate', (req, res) => {
  try {
    const original = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
    if (!original) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const newBoard = {
      id: nanoid(),
      title: `${original.title} (Kopie)`,
      welcomeText: original.welcomeText,
      brandingEnabled: original.brandingEnabled,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    db.prepare(`
      INSERT INTO boards (id, title, welcomeText, brandingEnabled, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(newBoard.id, newBoard.title, newBoard.welcomeText, newBoard.brandingEnabled, newBoard.createdAt, newBoard.updatedAt);

    // Duplicate items
    const items = db.prepare('SELECT * FROM items WHERE boardId = ?').all(req.params.id);
    const insertItem = db.prepare(`
      INSERT INTO items (id, boardId, type, src, caption, section, \`order\`, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(
        nanoid(),
        newBoard.id,
        item.type,
        item.src,
        item.caption,
        item.section,
        item.order,
        Date.now()
      );
    }

    res.json(newBoard);
  } catch (error) {
    console.error('Error duplicating board:', error);
    res.status(500).json({ error: 'Failed to duplicate board' });
  }
});

export default router;

