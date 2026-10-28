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

// Connect to MongoDB
connectDB().then(() => {
  startSupabaseAutoSync();
});

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

// Health check endpoint
app.get('/api/health', (req, res) => {
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

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Voraeclat Backend] Live on port ${PORT}`);
  console.log(`[Admin Portal] Direct access at: http://localhost:${PORT}/#admin`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Notice] Port ${PORT} was already in use. Please restart your terminal or kill the old process.`);
    process.exit(1);
  }
});
