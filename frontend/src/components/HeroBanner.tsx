import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  ChevronLeft,
  ChevronRight,
  Lock,
  Play,
  Pause,
} from 'lucide-react';
import { CategoryId } from '../types';
import {
  getStoredSiteBanners,
  getHeroAutoplayEnabled,
  setHeroAutoplayEnabled,
  getActiveHeroSlideIndex,
  setActiveHeroSlideIndex,
} from '../data/siteBanners';
import { loadPersistentBanners } from '../data/bannerStorage';

interface HeroBannerProps {
  onSelectCategory: (category: CategoryId) => void;
  onOpenClubModal?: () => void;
  onApplyCoupon?: (code: string) => void;
}

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  category: CategoryId;
  ctaText: string;
  couponCode: string;
  discountBadge: string;
  userImage: string;
  fallbackImage: string;
  accentColor: string;
  themeHue: string;
  objectPosition?: 'center' | 'top' | 'bottom';
  fitMode?: 'cover' | 'contain';
}

const buildHeroSlides = (fallbackSlides: BannerSlide[]): BannerSlide[] => {
  try {
    const siteBanners = getStoredSiteBanners();
    const heroSiteBanners = siteBanners.filter((b) => b.group === 'hero');

    if (heroSiteBanners && heroSiteBanners.length > 0) {
      // Direct 1:1 match with hero banners configured in the Admin Dashboard
      const accentPalettes = [
        { accent: 'from-amber-500 to-yellow-400', hue: 'amber' },
        { accent: 'from-rose-500 to-pink-400', hue: 'rose' },
        { accent: 'from-sky-500 to-cyan-400', hue: 'sky' },
        { accent: 'from-purple-500 to-indigo-400', hue: 'purple' },
        { accent: 'from-emerald-500 to-teal-400', hue: 'emerald' },
      ];

      return heroSiteBanners.map((b, idx) => {
        const palette = accentPalettes[idx % accentPalettes.length];
        return {
          id: b.id,
          badge: b.badge,
          title: b.title,
          highlight: b.underText ? b.underText.slice(0, 50) : '',
          description: b.underText,
          category: (b.buttonLink as CategoryId) || 'baby-toddler',
          ctaText: (b.buttonText || 'Shop Now').replace(' →', ''),
          couponCode: b.couponCode || 'PUPPY20',
          discountBadge: b.discountTag || 'FLAT 40% OFF',
          userImage: b.imageUrl,
          fallbackImage: b.imageUrl,
          accentColor: palette.accent,
          themeHue: palette.hue,
          objectPosition: b.objectPosition || 'center',
          fitMode: b.fitMode || 'cover',
        };
      });
    }
  } catch (err) {
    console.error('Error building hero slides:', err);
  }
  return fallbackSlides;
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
}) => {
  const [autoPlay, setAutoPlay] = useState<boolean>(() => getHeroAutoplayEnabled());
  const [currentSlide, setCurrentSlide] = useState<number>(() => getActiveHeroSlideIndex());
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const fallbackSlides: BannerSlide[] = [
    {
      id: 'stylish-kids-hero',
      badge: 'LITTLE FASHION, BIG HAPPINESS',
      title: 'Everything for Your Little Ones',
      highlight: 'Baby Essentials, Kids Fashion & Toys',
      description:
        'Baby Essentials, Kids Fashion, Toys & Games, Feeding & Care, Gifts & More designed for non-stop comfort and joy.',
      category: 'baby-toddler',
      ctaText: 'Shop Now',
      couponCode: 'VORAECLAT20',
      discountBadge: 'LITTLE THINGS, BIG DREAMS',
      userImage: '/hero-everything-little-ones.png',
      fallbackImage: '/hero-everything-little-ones.png',
      accentColor: 'from-amber-500 to-yellow-400',
      themeHue: 'amber',
      objectPosition: 'center',
      fitMode: 'contain',
    },
    {
      id: 'playful-kidswear',
      badge: 'JOYFUL ADVENTURES • NEW COLLECTION',
      title: 'Playful Kidswear',
      highlight: 'Play, Explore, Grow',
      description:
        'Engineered for joyful childhood adventures: ultra-soft organic stretch cottons, durable reinforced knees, and vibrant breathable fits designed for non-stop playground fun.',
      category: 'baby-toddler',
      ctaText: 'Shop Playful Outfits',
      couponCode: 'PLAYGROW20',
      discountBadge: 'FLAT 40% OFF',
      userImage:
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
      fallbackImage:
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
      accentColor: 'from-rose-500 to-pink-400',
      themeHue: 'rose',
      objectPosition: 'center',
      fitMode: 'cover',
    },
    {
      id: 'big-happiness-sale',
      badge: 'MEGA CARNIVAL SALE • SPECIAL EVENT',
      title: 'Little Fashion,',
      highlight: 'Big Happiness Sale',
      description:
        'Celebrate every precious childhood milestone with twirling party dresses, sparkling ethnic festive coordinates, handsome boys formal sets, and celebration shoes.',
      category: 'festive-ethnic',
      ctaText: 'Explore Festive Sale',
      couponCode: 'PUPPYFEST',
      discountBadge: 'UP TO 60% OFF',
      userImage:
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
      fallbackImage:
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
      accentColor: 'from-sky-500 to-cyan-400',
      themeHue: 'sky',
      objectPosition: 'center',
      fitMode: 'cover',
    },
    {
      id: 'little-trends-smiles',
      badge: 'TRENDING FASHION • SIBLING EDITS',
      title: 'Little Trends,',
      highlight: 'Big Smiles Everyday',
      description:
        'Runway-inspired toddler style made comfy: cool denim coordinates, pastel knit cardigans, oversized vintage tees, and adorable matching sibling lounge sets.',
      category: 'girl-fashion',
      ctaText: 'Discover Trends',
      couponCode: 'SMILES15',
      discountBadge: 'STARTING ₹299',
      userImage:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
      fallbackImage:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
      accentColor: 'from-purple-500 to-indigo-400',
      themeHue: 'purple',
      objectPosition: 'center',
      fitMode: 'cover',
    },
  ];

  const [slides, setSlides] = useState<BannerSlide[]>(() => buildHeroSlides(fallbackSlides));

  // Asynchronously warm up from IndexedDB on initial mount to restore ultra-sharp custom photos
  useEffect(() => {
    loadPersistentBanners()
      .then((stored) => {
        if (stored && stored.length > 0) {
          setSlides(buildHeroSlides(fallbackSlides));
        }
      })
      .catch(() => {});
  }, []);

  // Listen to custom events, storage, and broadcast channel for live banner updates
  useEffect(() => {
    const handleUpdate = () => {
      setSlides(buildHeroSlides(fallbackSlides));
    };

    const handleAutoplayChange = (e: any) => {
      setAutoPlay(e.detail ?? false);
    };

    const handleActiveSlideChange = (e: any) => {
      const detail = e.detail;
      if (typeof detail === 'number') {
        setCurrentSlide(detail);
      } else if (detail && typeof detail.index === 'number') {
        setCurrentSlide(detail.index);
      } else if (detail && detail.heroId) {
        const foundIdx = slides.findIndex((s) => s.id === detail.heroId);
        if (foundIdx !== -1) setCurrentSlide(foundIdx);
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('site_banners_updated', handleUpdate);
    window.addEventListener('ad_campaigns_updated', handleUpdate);
    window.addEventListener('hero_banners_synced', handleUpdate);
    window.addEventListener('hero_autoplay_changed', handleAutoplayChange);
    window.addEventListener('hero_active_slide_changed', handleActiveSlideChange);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('puppy_shame_banners_sync');
        bc.onmessage = () => handleUpdate();
      }
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('site_banners_updated', handleUpdate);
      window.removeEventListener('ad_campaigns_updated', handleUpdate);
      window.removeEventListener('hero_banners_synced', handleUpdate);
      window.removeEventListener('hero_autoplay_changed', handleAutoplayChange);
      window.removeEventListener('hero_active_slide_changed', handleActiveSlideChange);
      bc?.close();
    };
  }, [slides]);

  const currentSlidesList = slides.length > 0 ? slides : fallbackSlides;
  const totalSlides = currentSlidesList.length;

  // Ensure currentSlide stays within bounds
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
      setActiveHeroSlideIndex(0);
    }
  }, [totalSlides, currentSlide]);

  // Slideshow auto-advance: ONLY runs if autoPlay is explicitly turned ON by the user/admin!
  // By default, autoPlay is FALSE (STABLE MODE): images do NOT change without user permission!
  useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % totalSlides;
        const targetSlide = currentSlidesList[next];
        setActiveHeroSlideIndex(next, targetSlide?.id);
        return next;
      });
    }, 5500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, isPaused, totalSlides, currentSlidesList]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrevSlide = () => {
    const next = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    setCurrentSlide(next);
    const targetSlide = currentSlidesList[next];
    setActiveHeroSlideIndex(next, targetSlide?.id);
  };

  const handleNextSlide = () => {
    const next = (currentSlide + 1) % totalSlides;
    setCurrentSlide(next);
    const targetSlide = currentSlidesList[next];
    setActiveHeroSlideIndex(next, targetSlide?.id);
  };

  const handleSelectDot = (idx: number) => {
    setCurrentSlide(idx);
    const targetSlide = currentSlidesList[idx];
    setActiveHeroSlideIndex(idx, targetSlide?.id);
  };

  const handleToggleAutoPlay = () => {
    const next = !autoPlay;
    setAutoPlay(next);
    setHeroAutoplayEnabled(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNextSlide();
    } else if (diff < -40) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

  const activeSlide = currentSlidesList[currentSlide] || currentSlidesList[0];

  return (
    <div className="w-full">
      {/* 1. Full-bleed Hero Banner Image Slideshow - Ultra-HD Sharpness & Zero Blur Artifacts */}
      <div
        className="hero-slider relative w-full overflow-hidden bg-slate-950 select-none cursor-pointer group"
        onClick={() => onSelectCategory(activeSlide.category)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Responsive Slides */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {currentSlidesList.map((slide, idx) => {
            const isCurrent = currentSlide === idx;
            const imgSrc = slide.userImage;
            const isCover = slide.fitMode === 'cover';

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
                  transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'opacity',
                }}
              >
                {/* Ambient Soft Glow Backdrop to seamlessly blend non-standard aspect ratios */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl opacity-40 scale-105 pointer-events-none"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                />

                <img
                  src={imgSrc}
                  alt={`${slide.title} ${slide.highlight}`}
                  className={`hero-slide-img w-full h-full select-none ${
                    isCover ? 'object-cover' : 'object-contain'
                  } relative z-10`}
                  style={{
                    objectPosition: slide.objectPosition || 'center',
                    imageRendering: '-webkit-optimize-contrast',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  fetchPriority={isCurrent ? 'high' : 'low'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== slide.fallbackImage && slide.fallbackImage) {
                      img.src = slide.fallbackImage;
                    } else if (img.src !== '/hero-everything-little-ones.png') {
                      img.src = '/hero-everything-little-ones.png';
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows (Left & Right - Desktop & Tablet) */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              aria-label="Previous Banner Image"
              className="hidden sm:flex absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md shadow-xl border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              aria-label="Next Banner Image"
              className="hidden sm:flex absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md shadow-xl border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </>
        )}

        {/* Minimal Clean Slide Dots & Stable Indicator at Bottom Center */}
        <div className="absolute bottom-1.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2.5 bg-black/60 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-xl">
          {totalSlides > 1 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {currentSlidesList.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDot(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? 'w-4 sm:w-8 h-1 sm:h-2 bg-amber-400 shadow-sm'
                      : 'w-1 sm:w-2 h-1 sm:h-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* User Permission Stable / Auto-Slide Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleAutoPlay();
            }}
            className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
              !autoPlay
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs hover:bg-amber-300'
                : 'bg-white/15 text-white/90 border-white/20 hover:bg-white/25'
            }`}
            title={
              !autoPlay
                ? 'Hero image is STABLE (locked). It will not change without your permission. Click if you want to turn on auto-slide.'
                : 'Slideshow is auto-changing. Click to lock hero image in stable mode.'
            }
          >
            {!autoPlay ? (
              <>
                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950 shrink-0" />
                <span>Stable</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Auto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Value Guarantees Strip below the Hero Banner - Compact 3-Column on Mobile */}
      <div className="bg-white border-b border-slate-200 py-2 sm:py-3.5 px-2.5 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-1.5 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">100% Baby-Safe</h4>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium">GOTS Organic &amp; Tested</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Express Delivery</h4>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium">Across 15,000+ PINs</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate">30-Day Returns</h4>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium">Instant refund credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
