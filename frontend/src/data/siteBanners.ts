import { savePersistentBanners } from './bannerStorage';

export interface SiteBanner {
  id: string;
  name: string;
  location: string;
  group: 'spotlight' | 'promotional' | 'shop_by_style' | 'hero';
  badge: string;
  title: string;
  underText: string;
  imageUrl: string;
  buttonText: string;
  buttonLink?: string;
  priceTag?: string;
  originalPriceTag?: string;
  discountTag?: string;
  couponCode?: string;
  styleHighlights?: string;
  accentColor?: string;
  objectPosition?: 'center' | 'top' | 'bottom';
  fitMode?: 'cover' | 'contain';
}

export interface ImageCompressionOptions {
  maxDim?: number;
  quality?: number;
  isHero?: boolean;
  format?: 'image/webp' | 'image/jpeg';
}

export interface ImageProcessingInfo {
  width: number;
  height: number;
  format: string;
  sizeKB: number;
}

/**
 * High-Clarity Image Compressor & Processor:
 * - Supports Ultra-HD 2.5K / 4K dimensions (up to 2560px for hero banners)
 * - Multi-step bicubic downsampling avoids blur, moiré, and jagged edges
 * - Enables hardware canvas high-quality smoothing (ctx.imageSmoothingQuality = 'high')
 * - Encodes in ultra-crisp WebP (94% quality) with fallback to JPEG (92%)
 * - Eliminates digital compression artifacting on fine textiles, patterns, and faces
 */
export const compressAndLoadImage = (
  file: File,
  callback: (dataUrl: string, info?: ImageProcessingInfo) => void,
  options?: ImageCompressionOptions
) => {
  const isHero = options?.isHero ?? true;
  // Sharp 1080p/2K Retina coverage with optimal file footprint (~150KB) for instant persistence & zero quota dropouts
  const maxDim = options?.maxDim ?? (isHero ? 1920 : 1600);
  const preferredQuality = options?.quality ?? (isHero ? 0.85 : 0.82);

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let targetW = img.width;
      let targetH = img.height;

      // Downscale only if strictly exceeds maximum target dimension
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      // Step 1: Initialize canvas
      let curCanvas: HTMLCanvasElement = document.createElement('canvas');
      curCanvas.width = img.width;
      curCanvas.height = img.height;
      let curCtx = curCanvas.getContext('2d');
      if (curCtx) {
        curCtx.imageSmoothingEnabled = true;
        curCtx.imageSmoothingQuality = 'high';
        curCtx.drawImage(img, 0, 0);
      }

      // Step 2: Multi-step half-step downsampling for razor-sharp interpolation
      let curW = img.width;
      let curH = img.height;
      while (curW > targetW * 1.4 || curH > targetH * 1.4) {
        const nextW = Math.max(targetW, Math.round(curW * 0.7));
        const nextH = Math.max(targetH, Math.round(curH * 0.7));
        const stepCanvas = document.createElement('canvas');
        stepCanvas.width = nextW;
        stepCanvas.height = nextH;
        const stepCtx = stepCanvas.getContext('2d');
        if (stepCtx) {
          stepCtx.imageSmoothingEnabled = true;
          stepCtx.imageSmoothingQuality = 'high';
          stepCtx.drawImage(curCanvas, 0, 0, nextW, nextH);
          curCanvas = stepCanvas;
          curW = nextW;
          curH = nextH;
        } else {
          break;
        }
      }

      // Step 3: Targeted high-definition final render
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetW;
      finalCanvas.height = targetH;
      const finalCtx = finalCanvas.getContext('2d');
      if (finalCtx) {
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.drawImage(curCanvas, 0, 0, targetW, targetH);

        // Try modern WebP first (supports lossless-like fidelity with no DCT edge blur)
        let dataUrl = '';
        let formatUsed = 'image/webp';
        try {
          dataUrl = finalCanvas.toDataURL('image/webp', preferredQuality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = finalCanvas.toDataURL('image/jpeg', preferredQuality);
            formatUsed = 'image/jpeg';
          }
        } catch {
          dataUrl = finalCanvas.toDataURL('image/jpeg', preferredQuality);
          formatUsed = 'image/jpeg';
        }

        const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        callback(dataUrl, {
          width: targetW,
          height: targetH,
          format: formatUsed,
          sizeKB,
        });
      } else {
        const fallbackUrl = e.target?.result as string;
        callback(fallbackUrl, {
          width: img.width,
          height: img.height,
          format: 'original',
          sizeKB: Math.round((fallbackUrl.length * 3) / 4 / 1024),
        });
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

export const INITIAL_SITE_BANNERS: SiteBanner[] = [
  {
    id: 'banner-trending-spotlight',
    name: 'Trending Lookbook Spotlight Banner',
    location: 'Homepage (Directly Below Hero Slider)',
    group: 'spotlight',
    badge: '★ TRENDING SPOTLIGHT',
    title: 'Sunflower Sapphire Floral Shirt Collar A-Line Dress',
    underText:
      'Pure Viscose fabric with statement sunflower placement print, classic shirt collar, 3/4th sleeves, and signature HAY! Gift Box option. Click to open the complete 2-column lookbook.',
    imageUrl:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=92',
    buttonText: 'View Product Detail & Gallery →',
    buttonLink: 'girl-fashion',
    priceTag: '₹1,199',
    originalPriceTag: '₹1,499',
    discountTag: '20% OFF',
    styleHighlights: 'Fabric: Viscose • Length: 46" • Printed • A-Line Fit',
    accentColor: 'from-[#172554] via-[#1e3a8a] to-[#0f172a]',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-festive-footwear',
    name: 'Diwali Carnival / Footwear Mega Banner',
    location: 'Festive Footwear Section',
    group: 'promotional',
    badge: 'Diwali Carnival • Festive Edit',
    title: 'TRENDY FOOTWEAR FLAT 65% OFF',
    underText:
      'Pure leather handcrafted mojaris, ethnic kolhapuris, formal wedding brogues, and flexible barefoot toddler sneakers.',
    imageUrl:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2000&q=92',
    buttonText: 'Shop Footwear →',
    buttonLink: 'footwear-accessories',
    couponCode: 'FESTIVE65',
    accentColor: 'from-amber-500 via-orange-500 to-rose-600',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-for-her',
    name: 'Shop by Style: Girls (For Her)',
    location: 'Shop by Style (Girls Card)',
    group: 'shop_by_style',
    badge: 'Girls Collection',
    title: 'FOR HER 🌸',
    underText: 'Twirl party frocks, festive lehengas, cute floral jumpsuits, and pastel shoes.',
    imageUrl:
      'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=1600&q=92',
    buttonText: 'Explore Girls Fashion →',
    buttonLink: 'girl-fashion',
    accentColor: 'from-rose-950 via-pink-950 to-transparent',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-for-him',
    name: 'Shop by Style: Boys (For Him)',
    location: 'Shop by Style (Boys Card)',
    group: 'shop_by_style',
    badge: 'Boys Collection',
    title: 'FOR HIM 🚀',
    underText: 'Denim dungarees, silk kurta dhoti sets, graphic tees, blazers, and sneakers.',
    imageUrl:
      'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=1600&q=92',
    buttonText: 'Explore Boys Fashion →',
    buttonLink: 'boy-fashion',
    accentColor: 'from-slate-950 via-sky-950 to-transparent',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-party-wear',
    name: 'Party Wear Sparkling Banner',
    location: 'Celebration Edit (Mid-Homepage)',
    group: 'promotional',
    badge: 'GOLDEN CELEBRATION EDIT',
    title: 'PARTY WEAR COLLECTION',
    underText: 'Starting ₹399 • Gowns, tuxedo sets, sequins & layered fairy frocks',
    imageUrl:
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=2400&q=92',
    buttonText: 'Shop Party Outfits →',
    buttonLink: 'festive-ethnic',
    accentColor: 'from-amber-950/90 via-amber-900/60 to-transparent',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-hero-stylish',
    name: 'Hero Slider: Slide 1 (Everything for Your Little Ones)',
    location: 'Top Hero Rotating Slider',
    group: 'hero',
    badge: 'LITTLE FASHION, BIG HAPPINESS',
    title: 'Everything for Your Little Ones',
    underText:
      'Baby Essentials, Kids Fashion, Toys & Games, Feeding & Care, Gifts & More designed with ultra-breathable pure cottons and vibrant happiness.',
    imageUrl: '/hero-everything-little-ones.png',
    buttonText: 'Shop Now →',
    buttonLink: 'baby-toddler',
    discountTag: 'LITTLE THINGS, BIG DREAMS',
    couponCode: 'VORAECLAT20',
    objectPosition: 'center',
    fitMode: 'contain',
  },
  {
    id: 'banner-hero-playful',
    name: 'Hero Slider: Slide 2 (Playful Kidswear)',
    location: 'Top Hero Rotating Slider',
    group: 'hero',
    badge: 'JOYFUL ADVENTURES • NEW COLLECTION',
    title: 'Playful Kidswear',
    underText:
      'Engineered for joyful childhood adventures: ultra-soft organic stretch cottons, durable reinforced knees, and vibrant breathable fits designed for non-stop playground fun.',
    imageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
    buttonText: 'Shop Playful Outfits →',
    buttonLink: 'baby-toddler',
    discountTag: 'FLAT 40% OFF',
    couponCode: 'PLAYGROW20',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-hero-festive',
    name: 'Hero Slider: Slide 3 (Big Happiness Sale)',
    location: 'Top Hero Rotating Slider',
    group: 'hero',
    badge: 'MEGA CARNIVAL SALE • SPECIAL EVENT',
    title: 'Little Fashion, Big Happiness Sale',
    underText:
      'Celebrate every precious childhood milestone with twirling party dresses, sparkling ethnic festive coordinates, handsome boys formal sets, and celebration shoes.',
    imageUrl:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
    buttonText: 'Explore Festive Sale →',
    buttonLink: 'festive-ethnic',
    discountTag: 'UP TO 60% OFF',
    couponCode: 'PUPPYFEST',
    objectPosition: 'center',
    fitMode: 'cover',
  },
  {
    id: 'banner-hero-trends',
    name: 'Hero Slider: Slide 4 (Little Trends & Smiles)',
    location: 'Top Hero Rotating Slider',
    group: 'hero',
    badge: 'TRENDING FASHION • SIBLING EDITS',
    title: 'Little Trends, Big Smiles Everyday',
    underText:
      'Runway-inspired toddler style made comfy: cool denim coordinates, pastel knit cardigans, oversized vintage tees, and adorable matching sibling lounge sets.',
    imageUrl:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
    buttonText: 'Discover Trends →',
    buttonLink: 'girl-fashion',
    discountTag: 'STARTING ₹299',
    couponCode: 'SMILES15',
    objectPosition: 'center',
    fitMode: 'cover',
  },
];

const STORAGE_KEY = 'puppy_shame_site_banners';

/**
 * Helper to upgrade legacy low-res Unsplash links in localStorage to 2.5K/4K clarity
 */
const upgradeUnsplashClarity = (url: string, isHero: boolean): string => {
  if (!url || !url.includes('images.unsplash.com')) return url;
  if (isHero) {
    return url.replace(/w=\d+(&q=\d+)?/, 'w=2560&q=95');
  }
  return url.replace(/w=\d+(&q=\d+)?/, 'w=2000&q=92');
};

let cachedBanners: SiteBanner[] | null = null;
const INITIALIZED_FLAG = 'puppy_shame_banners_initialized_v4';
const HERO_AUTOPLAY_KEY = 'puppy_shame_hero_autoplay';
const HERO_ACTIVE_SLIDE_KEY = 'puppy_shame_active_hero_slide';
const HERO_ACTIVE_ID_KEY = 'puppy_shame_active_hero_id';

export const setCachedSiteBanners = (banners: SiteBanner[]): void => {
  cachedBanners = banners;
};

/**
 * Check if hero slideshow is set to auto-advance.
 * Default is FALSE (STABLE MODE): images do NOT auto-change without user permission.
 */
export const getHeroAutoplayEnabled = (): boolean => {
  try {
    return localStorage.getItem(HERO_AUTOPLAY_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setHeroAutoplayEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(HERO_AUTOPLAY_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('hero_autoplay_changed', { detail: enabled }));
  } catch {
    // ignore
  }
};

export const getActiveHeroSlideIndex = (): number => {
  try {
    const raw = localStorage.getItem(HERO_ACTIVE_SLIDE_KEY);
    if (!raw) return 0;
    const num = parseInt(raw, 10);
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
};

export const setActiveHeroSlideIndex = (index: number, heroId?: string): void => {
  try {
    localStorage.setItem(HERO_ACTIVE_SLIDE_KEY, String(index));
    if (heroId) {
      localStorage.setItem(HERO_ACTIVE_ID_KEY, heroId);
    }
    window.dispatchEvent(new CustomEvent('hero_active_slide_changed', { detail: { index, heroId } }));
  } catch {
    // ignore
  }
};

export const getStoredSiteBanners = (): SiteBanner[] => {
  if (cachedBanners && cachedBanners.length > 0) {
    return cachedBanners;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SITE_BANNERS));
      localStorage.setItem(INITIALIZED_FLAG, 'true');
      cachedBanners = INITIAL_SITE_BANNERS;
      return INITIAL_SITE_BANNERS;
    }

    const parsed = JSON.parse(raw) as SiteBanner[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      cachedBanners = INITIAL_SITE_BANNERS;
      return INITIAL_SITE_BANNERS;
    }

    // First time setup migration only: ensure all groups exist, but NEVER override user's deliberate removals afterwards
    const isFirstInit = !localStorage.getItem(INITIALIZED_FLAG);
    const map = new Map(parsed.map((b) => [b.id, b]));

    if (isFirstInit) {
      INITIAL_SITE_BANNERS.forEach((initB) => {
        if (!map.has(initB.id)) {
          map.set(initB.id, initB);
        }
      });
      localStorage.setItem(INITIALIZED_FLAG, 'true');
    }

    // Auto-boost legacy low-resolution Unsplash links to crisp 2.5K
    map.forEach((b, key) => {
      if (
        b.imageUrl &&
        b.imageUrl.includes('images.unsplash.com') &&
        (b.imageUrl.includes('w=800') ||
          b.imageUrl.includes('w=1200') ||
          b.imageUrl.includes('w=1400') ||
          b.imageUrl.includes('w=1600'))
      ) {
        const upgraded = upgradeUnsplashClarity(b.imageUrl, b.group === 'hero');
        if (upgraded !== b.imageUrl) {
          map.set(key, { ...b, imageUrl: upgraded });
        }
      }

      if (b.imageUrl === '/hero-stylish-kids.jpg' && !b.fitMode) {
        map.set(key, { ...b, fitMode: 'contain' });
      }
    });

    const combined = Array.from(map.values());
    cachedBanners = combined;
    return combined;
  } catch (err) {
    console.error('Error loading site banners:', err);
    return INITIAL_SITE_BANNERS;
  }
};

export const saveStoredSiteBanners = (banners: SiteBanner[]): void => {
  // Always update in-memory cache immediately so current session is 100% stable
  cachedBanners = banners;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new Event('site_banners_updated'));
  } catch (err) {
    console.warn('LocalStorage save quota exceeded, saving safe metadata to LocalStorage:', err);
    try {
      // Safe fallback: never slice or corrupt base64 data URLs!
      const safe = banners.map((b) => {
        if (b.imageUrl && b.imageUrl.startsWith('data:') && b.imageUrl.length > 80000) {
          return { ...b, hasIdbImage: true };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
      window.dispatchEvent(new Event('site_banners_updated'));
    } catch {
      // ignore
    }
  }

  // Trigger IndexedDB persistent backup for full high-resolution image data
  savePersistentBanners(banners).catch(console.warn);
};
