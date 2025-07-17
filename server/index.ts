import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '../client/dist')));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});