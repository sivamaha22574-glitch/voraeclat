import { Banner } from '../models/Banner.js';
import { defaultBanners } from '../data/seedProducts.js';
import { isDbConnected } from '../config/db.js';

let inMemoryBanners = [...defaultBanners];

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res) => {
  try {
    const { group, location } = req.query;

    if (isDbConnected) {
      try {
        const filter = { active: true };
        if (group) filter.group = group;
        if (location) filter.location = location;

        const banners = await Banner.find(filter).sort({ orderIndex: 1, createdAt: -1 });
        if (banners && banners.length > 0) {
          return res.json({ success: true, count: banners.length, data: banners });
        }
      } catch (e) {
        // fallback
      }
    }

    let filtered = [...inMemoryBanners];
    if (group) filtered = filtered.filter(b => b.group === group);
    if (location) filtered = filtered.filter(b => b.location === location);

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new banner or bulk sync banners
// @route   POST /api/banners
// @access  Public / Admin
export const createBanner = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      if (isDbConnected) {
        for (const b of req.body) {
          const id = b.customId || b.id;
          await Banner.findOneAndUpdate(
            { $or: [{ customId: id }, ...(id && id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])] },
            b,
            { upsert: true, new: true }
          );
        }
      }
      inMemoryBanners = req.body;
      return res.status(201).json({ success: true, count: req.body.length });
    }

    if (isDbConnected) {
      const banner = await Banner.create(req.body);
      return res.status(201).json({ success: true, data: banner });
    }
    const newBanner = { ...req.body, id: `banner-${Date.now()}` };
    inMemoryBanners.push(newBanner);
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
      if (banner) return res.json({ success: true, data: banner });
    }
    const idx = inMemoryBanners.findIndex(b => b.customId === id || b.id === id);
    if (idx !== -1) {
      inMemoryBanners[idx] = { ...inMemoryBanners[idx], ...req.body };
      return res.json({ success: true, data: inMemoryBanners[idx] });
    }
    res.status(404).json({ success: false, message: 'Banner not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      await Banner.findByIdAndDelete(id);
    }
    inMemoryBanners = inMemoryBanners.filter(b => b.customId !== id && b.id !== id);
    res.json({ success: true, message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
