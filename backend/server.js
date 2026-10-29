import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, isDbConnected } from './config/db.js';
import { startSupabaseAutoSync } from './services/supabaseAutoSync.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adRoutes from './routes/adRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB & Initialize Real-time Auto-Sync Bridge
connectDB();
startSupabaseAutoSync();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -------------------------------------------------------------
// 1. API ROUTES (MERN MVC Architecture)
// -------------------------------------------------------------
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ads', adRoutes);

// Health check endpoint (serves JSON to API clients, redirects browsers to the real website)
app.get(['/api/health', '/api'], (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html') && !req.xhr) {
    return res.redirect('/');
  }
  res.json({
    status: 'OK',
    server: 'Voraeclat MERN Backend',
    port: process.env.PORT || 5000,
    database: isDbConnected ? 'MongoDB Connected' : 'Hybrid In-Memory (MongoDB URI in backend/.env)',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 2. SERVE THE REAL VISUAL FRONTEND & ADMIN PORTAL
// -------------------------------------------------------------
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Route directly to the Real Executive Admin Portal
app.get('/admin', (req, res) => {
  res.redirect('/#admin');
});

// Single Page Application (SPA) fallback: serve real index.html for all other routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error Handling Middleware for APIs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = (port, retries = 5) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`[Voraeclat Backend] Live on port ${port}`);
    console.log(`[Admin Portal] Direct access at: http://localhost:${port}/#admin`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (retries > 0) {
        console.warn(`[Notice]: Port ${port} is releasing. Retrying in 1s (${retries} attempts left)...`);
        setTimeout(() => startServer(port, retries - 1), 1000);
      } else {
        console.error(`[Notice]: Port ${port} was already in use. Please restart your terminal.`);
        process.exit(1);
      }
    } else {
      console.error('[Server Error]:', err);
    }
  });
};

startServer(PORT);
