# Voraeclat - MERN Stack Architecture

Voraeclat is a premier baby, kids, and maternity shopping web platform refactored into a scalable **MERN (MongoDB, Express, React, Node.js)** stack following the **MVC (Model-View-Controller)** pattern.

---

## 📁 Project Architecture & Folder Structure

```
kids/
├── backend/                       # Express.js REST API & MongoDB Database
│   ├── config/                    # Database & server configurations
│   │   └── db.js                  # Mongoose MongoDB connection
│   ├── controllers/               # Business logic & request handlers (Controllers)
│   │   ├── productController.js   # Product querying, filters, reviews
│   │   ├── orderController.js     # Orders checkout & tracking
│   │   ├── userController.js      # Customer authentication & profiles
│   │   ├── bannerController.js    # Spotlight & hero banners
│   │   ├── leadController.js      # Franchise partner applications
│   │   ├── couponController.js    # Promo discounts & verification
│   │   └── contactController.js   # Customer contact inquiries
│   ├── models/                    # Mongoose Database Schemas (Models)
│   │   ├── Product.js             # Products, ratings, sizes, colors
│   │   ├── Order.js               # Orders, items, address, statuses
│   │   ├── User.js                # Users, mobile auth, club membership
│   │   ├── Banner.js              # Site banners & hero carousel items
│   │   ├── FranchiseLead.js       # Franchise investment leads
│   │   ├── Coupon.js              # Discount coupons & promo codes
│   │   └── ContactMessage.js      # Support & contact messages
│   ├── routes/                    # API route endpoints (View/Router mapping)
│   │   ├── productRoutes.js       # /api/products
│   │   ├── orderRoutes.js         # /api/orders
│   │   ├── userRoutes.js          # /api/users
│   │   ├── bannerRoutes.js        # /api/banners
│   │   ├── leadRoutes.js          # /api/leads
│   │   ├── couponRoutes.js        # /api/coupons
│   │   └── contactRoutes.js       # /api/contact
│   ├── middleware/                # Custom Express middlewares
│   │   ├── authMiddleware.js      # JWT token authentication & Admin guard
│   │   └── errorMiddleware.js     # 404 & Centralized error handler
│   ├── seeder/                    # Database initial seed script
│   │   └── seedData.js            # Pre-populates sample catalog & banners
│   ├── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json               # Backend dependencies (Express, Mongoose, etc.)
│   └── server.js                  # Express server entry point
│
├── frontend/                      # React 19 + TypeScript + Vite Single Page App (View)
│   ├── src/
│   │   ├── api/                   # Dedicated API client connecting to Express backend
│   │   │   └── api.ts             # Modular fetch calls to /api/*
│   │   ├── components/            # UI Components (Header, Hero, ProductCard, Modals...)
│   │   ├── data/                  # Static assets & catalog references
│   │   ├── lib/                   # Utility helpers
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── App.tsx                # Main Application container
│   │   ├── main.tsx               # React DOM entry
│   │   └── index.css              # Tailwind styling
│   ├── public/                    # Static public assets
│   ├── vite.config.ts             # Vite configuration with /api reverse proxy
│   └── package.json               # Frontend dependencies
│
└── package.json                   # Root workspace scripts to run both simultaneously
```

---

## 🚀 Running the MERN Stack Application

### 1. Run Both (Frontend + Backend Concurrently)
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:3000` (or `3001`)

### 2. Run Individually
- **Run Backend only:**
  ```bash
  npm run dev:backend
  ```
- **Run Frontend only:**
  ```bash
  npm run dev:frontend
  ```

### 3. Seed Database with Initial Data
To populate MongoDB with products, banners, and coupons:
```bash
npm run seed
```

