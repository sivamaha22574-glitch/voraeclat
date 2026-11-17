import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directory exists in backend public folder
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * @desc    Upload & optimize an image (Banners, Products, Branding)
 * @route   POST /api/upload
 * @access  Public / Admin
 */
router.post('/', async (req, res) => {
  try {
    const { image, target = 'img', name } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, message: 'Image data URL is required' });
    }

    let buffer;
    if (image.startsWith('data:')) {
      const parts = image.split(';base64,');
      if (parts.length !== 2) {
        return res.status(400).json({ success: false, message: 'Invalid data URL format' });
      }
      buffer = Buffer.from(parts[1], 'base64');
    } else {
      // Raw base64 string
      buffer = Buffer.from(image, 'base64');
    }

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ success: false, message: 'Empty image payload' });
    }

    // Determine target dimensions & quality
    const isHeroOrBanner = target.includes('banner') || target.includes('hero');
    const maxDim = isHeroOrBanner ? 2560 : 1200;
    const quality = isHeroOrBanner ? 88 : 84;

    const safeTarget = target.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'img';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const filename = `${safeTarget}-${timestamp}-${randomSuffix}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    let outputInfo;
    try {
      outputInfo = await sharp(buffer)
        .rotate() // auto-orient based on EXIF
        .resize({
          width: maxDim,
          height: maxDim,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 4 })
        .toFile(outputPath);
    } catch (sharpError) {
      console.warn('Sharp optimization warning, writing raw buffer fallback:', sharpError.message);
      fs.writeFileSync(outputPath, buffer);
      outputInfo = { width: 0, height: 0, size: buffer.length };
    }

    const publicUrl = `/uploads/${filename}`;
    console.log(`[Image Uploaded]: ${publicUrl} (${Math.round((outputInfo.size || buffer.length) / 1024)} KB)`);

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename,
      width: outputInfo.width,
      height: outputInfo.height,
      size: outputInfo.size,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Upload processing failed' });
  }
});

export default router;
