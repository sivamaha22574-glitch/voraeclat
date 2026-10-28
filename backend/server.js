import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, isDbConnected } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Interactive Backend Dashboard & API Explorer
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Voraeclat - MERN Backend Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
  <header class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🧸</span>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Voraeclat MERN Backend</h1>
          <p class="text-xs text-amber-100 font-medium">MVC Architecture • Node.js • Express • MongoDB • Port 5000</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="/admin" class="px-4 py-2.5 bg-slate-900 text-amber-300 font-bold rounded-xl shadow-md hover:bg-slate-800 transition flex items-center gap-2 text-sm border border-slate-700">
          <span>🛡️ Backend Admin Panel (/admin)</span>
        </a>
        <a href="http://localhost:3001" target="_blank" class="px-5 py-2.5 bg-white text-orange-600 font-bold rounded-xl shadow-md hover:bg-amber-50 transition flex items-center gap-2 text-sm">
          <span>🛍️ View Storefront</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-8 space-y-8">
    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Server Status</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Active
          </span>
        </div>
        <div class="text-2xl font-extrabold text-slate-900">Port 5000</div>
        <p class="text-xs text-slate-500 mt-1">Express API router listening</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Database Engine</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDbConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
            ${isDbConnected ? 'MongoDB Connected' : 'Hybrid In-Memory'}
          </span>
        </div>
        <div class="text-2xl font-extrabold text-slate-900">Mongoose Models</div>
        <p class="text-xs text-slate-500 mt-1">7 schemas under <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-700">backend/models/</code></p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend Connection</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            Reverse Proxy
          </span>
        </div>
        <div class="text-2xl font-extrabold text-slate-900">Port 3001</div>
        <p class="text-xs text-slate-500 mt-1">Vite proxies <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/api/*</code> to Backend</p>
      </div>
    </div>

    <!-- Interactive API Explorer -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">⚡ Interactive API Explorer</h2>
          <p class="text-xs text-slate-500">Test live REST endpoints directly from this dashboard</p>
        </div>
      </div>
      <div class="p-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <button onclick="testApi('/api/health')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition">GET /api/health</button>
          <button onclick="testApi('/api/products')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 transition">GET /api/products</button>
          <button onclick="testApi('/api/products/ps-101')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 transition">GET /api/products/ps-101</button>
          <button onclick="testApi('/api/banners')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 transition">GET /api/banners</button>
          <button onclick="testApi('/api/coupons')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 transition">GET /api/coupons</button>
          <button onclick="testApi('/api/orders')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 transition">GET /api/orders</button>
        </div>
        <div class="relative">
          <div class="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono">
            <span id="endpointLabel">Response: GET /api/health</span>
            <span id="statusCode" class="text-emerald-400 font-bold">200 OK</span>
          </div>
          <pre id="outputBox" class="bg-slate-900 text-emerald-400 p-4 rounded-b-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">Click any API button above to inspect live data...</pre>
        </div>
      </div>
    </div>

    <!-- Database Models Architecture -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-1">🗄️ Database Models (under <code class="text-orange-600">backend/models/</code>)</h2>
      <p class="text-xs text-slate-500 mb-6">Mongoose schemas governing data structure and validation</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>👕</span> <span>Product</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">name, brand, categoryId, price, clubPrice, sizes, colors, reviews</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>📦</span> <span>Order</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">orderId, items, deliveryAddress, totalAmount, status, trackingNumber</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>👤</span> <span>User</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">name, email, mobile, password (bcrypt), isClubMember, role</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🖼️</span> <span>Banner</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">group, badge, title, underText, imageUrl, buttonLink, accentColor</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🤝</span> <span>FranchiseLead</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">leadId, fullName, phone, city, investmentBudget, carpetArea, status</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🏷️</span> <span>Coupon</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">code, discountType, discountValue, minCartValue, validUntil</p>
        </div>

        <div class="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>✉️</span> <span>ContactMessage</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">name, email, phone, subject, message, isRead</p>
        </div>
      </div>
    </div>
  </main>

  <script>
    async function testApi(url) {
      document.getElementById('endpointLabel').innerText = 'Testing ' + url + '...';
      try {
        const start = Date.now();
        const res = await fetch(url);
        const data = await res.json();
        const elapsed = Date.now() - start;
        document.getElementById('endpointLabel').innerText = 'Response: ' + url + ' (' + elapsed + 'ms)';
        document.getElementById('statusCode').innerText = res.status + ' ' + (res.ok ? 'OK' : 'ERR');
        document.getElementById('statusCode').className = res.ok ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
        document.getElementById('outputBox').innerText = JSON.stringify(data, null, 2);
      } catch (e) {
        document.getElementById('endpointLabel').innerText = 'Failed: ' + url;
        document.getElementById('statusCode').innerText = 'Network Error';
        document.getElementById('statusCode').className = 'text-red-400 font-bold';
        document.getElementById('outputBox').innerText = 'Error: ' + e.message;
      }
    }
    // Run initial test on load
    testApi('/api/health');
  </script>
</body>
</html>`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Voraeclat MERN Backend',
    port: process.env.PORT || 5000,
    database: isDbConnected ? 'MongoDB Connected' : 'Hybrid In-Memory (MongoDB URI optional in backend/.env)',
    timestamp: new Date().toISOString()
  });
});

// API Routes (MVC Architecture)
app.use('/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Voraeclat Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Dashboard] http://localhost:${PORT}`);
});
