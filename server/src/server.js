/**
 * Moodboard Backend Server
 * Simple Express server for local network / home server deployment
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { initDatabase } from './database.js';
import boardRoutes from './routes/boards.js';
import itemRoutes from './routes/items.js';
import assetRoutes from './routes/assets.js';
import folderRoutes from './routes/folders.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Ensure data directories exist
const dataDir = join(__dirname, '../data');
const uploadsDir = join(dataDir, 'uploads');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

// Middleware
// CORS - Erlaube Zugriff von überall (für Internet-Zugriff und Vercel)
const corsOptions = {
  origin: function (origin, callback) {
    // Erlaube alle Origins (für Development und Production)
    // In Production könntest du hier spezifische Domains erlauben
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // For base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Initialize database
initDatabase();

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/folders', folderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Moodboard Server is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Moodboard Server gestartet!              ║
╟────────────────────────────────────────────╢
║   Port: ${PORT}                               ║
║   Lokale URL: http://localhost:${PORT}        ║
║   Netzwerk: http://<deine-server-ip>:${PORT}  ║
╚════════════════════════════════════════════╝
  `);
});

