import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import cors from 'cors';

// Load environment variables first
dotenv.config();

const { Pool } = pkg;
const PgSession = ConnectPgSimple(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Database setup with proper error handling
let pool;
let db;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  db = drizzle(pool);

  // Test database connection
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ Error connecting to database:', err.message);
      console.log('🔄 Continuing with mock data...');
    } else {
      console.log('✅ Database connected successfully');
      release();
    }
  });
} catch (error) {
  console.error('❌ Database setup error:', error.message);
  console.log('🔄 Continuing with mock data...');
}

// Export db for routes
export { db };

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with fallback
if (pool) {
  try {
    app.use(session({
      store: new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'fallback-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }));
  } catch (sessionError) {
    console.log('⚠️ Session store error, using memory store');
    app.use(session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }));
  }
}

// Import API routes
import fishingZonesRouter from './routes/fishing-zones.js';
import catchReportsRouter from './routes/catch-reports.js';
import routesRouter from './routes/routes.js';
import weatherRouter from './routes/weather.js';
import predictionsRouter from './routes/predictions.js';
import heatmapRouter from './routes/heatmap.js';
import chatRouter from './routes/chat.js';

// API Routes
app.use('/api/fishing-zones', fishingZonesRouter);
app.use('/api/catch-reports', catchReportsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/heatmap', heatmapRouter);
app.use('/api/chat', chatRouter);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: pool ? 'connected' : 'mock',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '../client/dist/index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
} else {
  // Development mode - serve Vite dev server
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.redirect('http://localhost:5173');
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.PGDATABASE || 'mock'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🌐 Frontend: http://localhost:5173`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    if (pool) pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    if (pool) pool.end();
    process.exit(0);
  });
});