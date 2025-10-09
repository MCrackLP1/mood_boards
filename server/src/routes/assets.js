/**
 * Library Assets API Routes
 */

import express from 'express';
import { db } from '../database.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// GET all assets (optionally filtered by folder)
router.get('/', (req, res) => {
  try {
    const { folderId } = req.query;
    
    let assets;
    if (folderId) {
      assets = db.prepare('SELECT * FROM library_assets WHERE folderId = ? ORDER BY uploadedAt DESC').all(folderId);
    } else {
      assets = db.prepare('SELECT * FROM library_assets ORDER BY uploadedAt DESC').all();
    }
    
    res.json(assets);
  } catch (error) {
    console.error('Error loading assets:', error);
    res.status(500).json({ error: 'Failed to load assets' });
  }
});

// GET single asset
router.get('/:id', (req, res) => {
  try {
    const asset = db.prepare('SELECT * FROM library_assets WHERE id = ?').get(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    console.error('Error loading asset:', error);
    res.status(500).json({ error: 'Failed to load asset' });
  }
});

// POST create asset (with base64 data)
router.post('/', (req, res) => {
  try {
    const { folderId, name, src, palette, width, height, fileSize } = req.body;
    
    const asset = {
      id: nanoid(),
      folderId: folderId || 'uncategorized',
      name: name || 'Unbenannt',
      src, // Base64 data URL
      palette: palette ? JSON.stringify(palette) : null,
      width: width || null,
      height: height || null,
      fileSize: fileSize || null,
      uploadedAt: Date.now()
    };

    db.prepare(`
      INSERT INTO library_assets (id, folderId, name, src, palette, width, height, fileSize, uploadedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      asset.id,
      asset.folderId,
      asset.name,
      asset.src,
      asset.palette,
      asset.width,
      asset.height,
      asset.fileSize,
      asset.uploadedAt
    );

    // Parse palette back to object for response
    const response = { ...asset };
    if (response.palette) {
      response.palette = JSON.parse(response.palette);
    }

    res.json(response);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// PUT move asset to different folder
router.put('/:id/move', (req, res) => {
  try {
    const { folderId } = req.body;
    
    db.prepare('UPDATE library_assets SET folderId = ? WHERE id = ?').run(folderId, req.params.id);
    
    const asset = db.prepare('SELECT * FROM library_assets WHERE id = ?').get(req.params.id);
    if (asset.palette) {
      asset.palette = JSON.parse(asset.palette);
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Error moving asset:', error);
    res.status(500).json({ error: 'Failed to move asset' });
  }
});

// DELETE asset
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM library_assets WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;

