import { Product } from '../models/Product.js';
import { defaultProducts } from '../data/seedProducts.js';
import { isDbConnected } from '../config/db.js';

let inMemoryProducts = [...defaultProducts];

// @desc    Get all products with optional filters (category, search, age, sort)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, ageGroup, gender, sort, limit = 100, page = 1 } = req.query;

    if (isDbConnected) {
      try {
        const filter = {};
        if (category && category !== 'all') filter.categoryId = category;
        if (ageGroup && ageGroup !== 'all') filter.ageGroup = { $in: [ageGroup, 'all'] };
        if (gender && gender !== 'all') filter.gender = { $in: [gender, 'all', 'unisex'] };
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { subCategory: { $regex: search, $options: 'i' } },
            { categoryName: { $regex: search, $options: 'i' } }
          ];
        }

        let query = Product.find(filter);
        if (sort === 'price-low') query = query.sort({ price: 1 });
        else if (sort === 'price-high') query = query.sort({ price: -1 });
        else if (sort === 'rating') query = query.sort({ rating: -1 });
        else if (sort === 'discount') query = query.sort({ discountPercent: -1 });
        else if (sort === 'newest') query = query.sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);
        const products = await query.skip((page - 1) * limit).limit(Number(limit));

        if (products && products.length > 0) {
          return res.json({
            success: true,
            source: 'mongodb',
            count: products.length,
            total,
            data: products
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query failed, falling back to memory store:', dbErr.message);
      }
    }

    // In-Memory Fallback
    let filtered = [...inMemoryProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.categoryId === category);
    }
    if (ageGroup && ageGroup !== 'all') {
      filtered = filtered.filter(p => p.ageGroup?.includes(ageGroup) || p.ageGroup?.includes('all'));
    }
    if (gender && gender !== 'all') {
      filtered = filtered.filter(p => p.gender === gender || p.gender === 'all' || p.gender === 'unisex');
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.categoryName.toLowerCase().includes(s)
      );
    }

    res.json({
      success: true,
      source: isDbConnected ? 'mongodb' : 'in-memory-hybrid',
      count: filtered.length,
      total: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      try {
        let product = await Product.findOne({
          $or: [
            { customId: id },
            ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
          ]
        });
        if (product) return res.json({ success: true, data: product });
      } catch (dbErr) {
        // fallback
      }
    }

    const item = inMemoryProducts.find(p => p.customId === id || p.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product or bulk sync products
// @route   POST /api/products
// @access  Public / Admin
export const createProduct = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      if (isDbConnected) {
        for (const item of req.body) {
          const id = item.customId || item.id;
          await Product.findOneAndUpdate(
            { $or: [{ customId: id }, ...(id && id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])] },
            item,
            { upsert: true, new: true }
          );
        }
      }
      inMemoryProducts = req.body;
      return res.status(201).json({ success: true, count: req.body.length });
    }

    if (isDbConnected) {
      const product = await Product.create(req.body);
      return res.status(201).json({ success: true, data: product });
    }

    const newProd = {
      ...req.body,
      customId: req.body.customId || `ps-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryProducts.push(newProd);
    res.status(201).json({ success: true, data: newProd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      const product = await Product.findOneAndUpdate(
        { $or: [{ customId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])] },
        req.body,
        { new: true, runValidators: true }
      );
      if (product) return res.json({ success: true, data: product });
    }

    const idx = inMemoryProducts.findIndex(p => p.customId === id || p.id === id);
    if (idx !== -1) {
      inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...req.body };
      return res.json({ success: true, data: inMemoryProducts[idx] });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      await Product.findOneAndDelete({
        $or: [{ customId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])]
      });
    }
    inMemoryProducts = inMemoryProducts.filter(p => p.customId !== id && p.id !== id);
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Public
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, rating, title, comment, childAge } = req.body;

    const newReview = {
      author,
      rating: Number(rating),
      title,
      comment,
      childAge,
      date: new Date().toISOString().split('T')[0],
      verifiedBuyer: true
    };

    const prod = inMemoryProducts.find(p => p.customId === id || p.id === id);
    if (prod) {
      prod.reviews = prod.reviews || [];
      prod.reviews.push(newReview);
      prod.reviewCount = prod.reviews.length;
      prod.rating = prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length;
      return res.status(201).json({ success: true, data: prod });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
