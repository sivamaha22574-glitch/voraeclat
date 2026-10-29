import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  MousePointerClick,
  Eye,
  DollarSign,
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Tag,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Search,
  Filter,
  RefreshCw,
  RotateCcw,
  Clock,
  ArrowUpRight,
  Sliders,
  Check,
  Upload,
  Camera,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Facebook,
  Instagram,
  Share2,
  Globe,
  Activity,
  Link,
  Radio,
  Zap,
  Heart,
  MessageCircle,
  Bookmark,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import {
  AdCampaign,
  AdType,
  PromoCoupon,
  getStoredAdCampaigns,
  saveStoredAdCampaigns,
  getStoredCoupons,
  saveStoredCoupons,
  INITIAL_AD_CAMPAIGNS,
  INITIAL_PROMO_COUPONS,
  SocialMediaConnection,
  getStoredSocialConnection,
  saveStoredSocialConnection,
} from '../../data/adCampaigns';
import {
  SiteBanner,
  INITIAL_SITE_BANNERS,
  getStoredSiteBanners,
  saveStoredSiteBanners,
  compressAndLoadImage,
  getHeroAutoplayEnabled,
  setHeroAutoplayEnabled,
  getActiveHeroSlideIndex,
  setActiveHeroSlideIndex,
} from '../../data/siteBanners';
import { syncHeroSlideUpdate } from '../../data/bannerStorage';
import { CategoryId } from '../../types';

interface AdDashboardTabProps {
  onNotify: (message: string) => void;
  onPreviewStoreWithFilter?: (category: CategoryId) => void;
}

const BANNER_IMAGE_PRESETS = [
  {
    name: 'Stylish Kids Wear (Hero 2026 - Production)',
    url: '/hero-stylish-kids.jpg',
  },
  {
    name: 'Sunflower Lookbook Dress',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=92',
  },
  {
    name: 'Festive Mojaris / Footwear',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2000&q=92',
  },
  {
    name: 'Girls Party Celebration',
    url: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=2400&q=92',
  },
  {
    name: 'Boys Denim Dungarees & Guitar',
    url: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=2400&q=92',
  },
  {
    name: 'Golden Party Wear Fairy Frock',
    url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=2400&q=92',
  },
  {
    name: 'Playful Toddler Romper (Hero 2.5K)',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Diwali Festive Sherwani (Hero 2.5K)',
    url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Sibling Trendy Knits (Hero 2.5K)',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
  },
];

const STORE_CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'baby-toddler', label: 'Baby & Toddler (0-2 Yrs)' },
  { id: 'girl-fashion', label: 'Girls Fashion' },
  { id: 'boy-fashion', label: 'Boys Fashion' },
  { id: 'festive-ethnic', label: 'Festive & Ethnic Wear' },
  { id: 'footwear-accessories', label: 'Footwear & Accessories' },
  { id: 'toys-learning', label: 'Toys & Learning' },
  { id: 'nursery-gear', label: 'Baby Gear & Nursery' },
  { id: 'moms-maternity', label: 'Moms & Maternity' },
  { id: 'all', label: 'All Collections' },
];

const SAMPLE_IMAGE_PRESETS = [
  {
    name: 'Stylish Kids Wear (Hero 2026 - Production)',
    url: '/hero-stylish-kids.jpg',
  },
  {
    name: 'Joyful Toddler Playground (2.5K)',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Diwali Festive Kids Ethnic (2.5K)',
    url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Sister & Brother Sibling Trend (2.5K)',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Botanical Organic Romper (2.5K)',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Pure Zari Pattu Pavadai Splendor (2.5K)',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2560&q=95',
  },
  {
    name: 'Royal Sherwani & Brocade Jacket (2.5K)',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=2560&q=95',
  },
];

const ACCENT_PRESETS = [
  { label: 'Amber Gold', value: 'from-amber-500 to-yellow-400', theme: 'amber' },
  { label: 'Rose Pink', value: 'from-rose-500 to-pink-400', theme: 'rose' },
  { label: 'Sky Cyan', value: 'from-sky-500 to-cyan-400', theme: 'sky' },
  { label: 'Emerald Mint', value: 'from-emerald-500 to-teal-400', theme: 'emerald' },
  { label: 'Purple Dream', value: 'from-purple-600 to-indigo-500', theme: 'purple' },
  { label: 'Midnight Blue', value: 'from-slate-900 to-blue-900', theme: 'slate' },
];

export const AdDashboardTab: React.FC<AdDashboardTabProps> = ({ onNotify }) => {
  const [activeView, setActiveView] = useState<'banners' | 'campaigns' | 'coupons' | 'social'>('banners');
  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>(() => getStoredSiteBanners());
  const [bannerFilterGroup, setBannerFilterGroup] = useState<string>('all');
  const [bannerSearchQuery, setBannerSearchQuery] = useState('');
  const [editingBanner, setEditingBanner] = useState<SiteBanner | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Hero Stability & Display Mode State (Always Stable - Auto-rotation removed)
  const [heroAutoplay, setHeroAutoplay] = useState<boolean>(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(() => getActiveHeroSlideIndex());

  const handleToggleHeroAutoplay = (_enabled: boolean) => {
    setHeroAutoplay(false);
    setHeroAutoplayEnabled(false);
    onNotify('Hero image is permanently locked in STABLE mode. Auto-change is disabled.');
  };

  const handleSetPrimaryHeroSlide = (heroId: string, idx: number) => {
    setActiveHeroIndex(idx);
    setActiveHeroSlideIndex(idx, heroId);
    const updated = siteBanners.map((b) => {
      if (b.group === 'hero') {
        return { ...b, isActive: b.id === heroId };
      }
      return b;
    });
    setSiteBanners(updated);
    saveStoredSiteBanners(updated);
    onNotify(`Hero Slide #${idx + 1} locked as the active stable storefront image!`);
  };

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => getStoredAdCampaigns());
  const [coupons, setCoupons] = useState<PromoCoupon[]>(() => getStoredCoupons());
  const [activeFilterType, setActiveFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewCampaignId, setPreviewCampaignId] = useState<string>(() => campaigns[0]?.id || '');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<AdCampaign> | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<PromoCoupon>>({
    code: '',
    title: '',
    discountType: 'percent',
    discountValue: 15,
    minCartValue: 999,
    expiry: '31 Dec 2026',
    status: 'active',
    maxUses: 1000,
  });

  // Social Media Connection State (Facebook & Instagram / Meta Ads)
  const [socialConn, setSocialConn] = useState<SocialMediaConnection>(() => getStoredSocialConnection());
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [socialPreviewFormat, setSocialPreviewFormat] = useState<'feed' | 'story'>('feed');
  const [selectedSocialCampaignId, setSelectedSocialCampaignId] = useState<string>(() => campaigns[0]?.id || '');
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);
  const [pixelTestState, setPixelTestState] = useState<'idle' | 'testing' | 'success'>('idle');
  const [isEditingSocialSettings, setIsEditingSocialSettings] = useState(false);
  const [editingSocialData, setEditingSocialData] = useState<SocialMediaConnection>(() => getStoredSocialConnection());
  const [simulatedLikes, setSimulatedLikes] = useState<number>(4892);
  const [isLikedSimulated, setIsLikedSimulated] = useState<boolean>(false);

  // Multi-tab and background IndexedDB sync listener
  useEffect(() => {
    const handleStorageSync = () => {
      setSiteBanners(getStoredSiteBanners());
      setCampaigns(getStoredAdCampaigns());
      setSocialConn(getStoredSocialConnection());
      setHeroAutoplay(getHeroAutoplayEnabled());
      setActiveHeroIndex(getActiveHeroSlideIndex());
    };
    window.addEventListener('site_banners_updated', handleStorageSync);
    window.addEventListener('hero_banners_synced', handleStorageSync);
    window.addEventListener('ad_campaigns_updated', handleStorageSync);
    window.addEventListener('social_connection_updated', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('site_banners_updated', handleStorageSync);
      window.removeEventListener('hero_banners_synced', handleStorageSync);
      window.removeEventListener('ad_campaigns_updated', handleStorageSync);
      window.removeEventListener('social_connection_updated', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const selectedPreviewCampaign = campaigns.find((c) => c.id === previewCampaignId) || campaigns[0];

  // Aggregated Marketing KPIs
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : '0';
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  const handleToggleStatus = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: nextStatus as 'active' | 'paused' };
      }
      return c;
    });
    setCampaigns(updated);
    saveStoredAdCampaigns(updated);
    const toggled = updated.find((c) => c.id === id);
    onNotify(`Campaign "${toggled?.name}" is now ${toggled?.status.toUpperCase()}`);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this ad campaign?')) {
      const updated = campaigns.filter((c) => c.id !== id);
      setCampaigns(updated);
      saveStoredAdCampaigns(updated);
      if (previewCampaignId === id && updated.length > 0) {
        setPreviewCampaignId(updated[0].id);
      }
      onNotify('Campaign deleted successfully');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCampaign({
      id: `ad-${Date.now()}`,
      name: 'New Festive Banner 2026',
      type: 'hero_banner',
      badge: 'LIMITED TIME • SPECIAL OFFER',
      title: 'New Season Style',
      highlight: 'Pure Joy for Little Ones',
      description: 'Crafted with premium breathable organic cottons and joyful festive hues.',
      category: 'festive-ethnic',
      ctaText: 'Shop New Collection',
      couponCode: 'PUPPY20',
      discountBadge: 'FLAT 30% OFF',
      imageUrl: SAMPLE_IMAGE_PRESETS[0].url,
      accentColor: 'from-amber-500 to-yellow-400',
      themeHue: 'amber',
      status: 'active',
      startDate: 'Today',
      endDate: '30 Days Later',
      budget: 50000,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      priority: campaigns.length + 1,
    });
    setIsEditingModalOpen(true);
  };

  const handleOpenEditModal = (camp: AdCampaign) => {
    setEditingCampaign({ ...camp });
    setIsEditingModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.name) return;

    const exists = campaigns.some((c) => c.id === editingCampaign.id);
    let updated: AdCampaign[];
    if (exists) {
      updated = campaigns.map((c) =>
        c.id === editingCampaign.id ? ({ ...c, ...editingCampaign } as AdCampaign) : c
      );
      onNotify(`Campaign "${editingCampaign.name}" updated!`);
    } else {
      updated = [editingCampaign as AdCampaign, ...campaigns];
      onNotify(`New campaign "${editingCampaign.name}" launched!`);
    }
    setCampaigns(updated);
    saveStoredAdCampaigns(updated);

    // If campaign is a hero banner, directly mirror into siteBanners hero slides
    if (editingCampaign.type === 'hero_banner') {
      syncHeroSlideUpdate({
        id: editingCampaign.id || `banner-${Date.now()}`,
        name: editingCampaign.name || 'Hero Slide',
        location: 'Homepage Hero Carousel',
        title: editingCampaign.title || editingCampaign.name || '',
        underText: editingCampaign.description || editingCampaign.highlight || '',
        imageUrl: editingCampaign.imageUrl || '',
        badge: editingCampaign.badge || 'Featured',
        buttonText: editingCampaign.ctaText || 'Shop Now',
        buttonLink: editingCampaign.category,
        couponCode: editingCampaign.couponCode,
        group: 'hero',
      });
      setSiteBanners(getStoredSiteBanners());
    }

    setPreviewCampaignId(editingCampaign.id || updated[0].id);
    setIsEditingModalOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset ad campaigns to default sample data?')) {
      setCampaigns(INITIAL_AD_CAMPAIGNS);
      saveStoredAdCampaigns(INITIAL_AD_CAMPAIGNS);
      setCoupons(INITIAL_PROMO_COUPONS);
      saveStoredCoupons(INITIAL_PROMO_COUPONS);
      setPreviewCampaignId(INITIAL_AD_CAMPAIGNS[0].id);
      onNotify('Ad campaigns reset to default state');
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const cleanCode = newCoupon.code.trim().toUpperCase();
    const existingIdx = coupons.findIndex((c) => c.code === cleanCode);
    let updated: PromoCoupon[];
    if (existingIdx > -1) {
      updated = coupons.map((c) => (c.code === cleanCode ? ({ ...c, ...newCoupon } as PromoCoupon) : c));
      onNotify(`Coupon ${cleanCode} updated!`);
    } else {
      const created: PromoCoupon = {
        code: cleanCode,
        title: newCoupon.title || 'Special Promotion Code',
        discountType: newCoupon.discountType || 'percent',
        discountValue: Number(newCoupon.discountValue) || 10,
        minCartValue: Number(newCoupon.minCartValue) || 499,
        expiry: newCoupon.expiry || '31 Dec 2026',
        status: 'active',
        usageCount: 0,
        maxUses: Number(newCoupon.maxUses) || 1000,
      };
      updated = [created, ...coupons];
      onNotify(`Coupon ${cleanCode} created and activated!`);
    }
    setCoupons(updated);
    saveStoredCoupons(updated);
    setIsCouponModalOpen(false);
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map((c) => {
      if (c.code === code) {
        return {
          ...c,
          status: (c.status === 'active' ? 'disabled' : 'active') as 'active' | 'disabled',
        };
      }
      return c;
    });
    setCoupons(updated);
    saveStoredCoupons(updated);
    onNotify(`Coupon status updated`);
  };

  // Social Media (Facebook & Instagram) Actions
  const handleToggleFacebook = () => {
    const updated = { ...socialConn, facebookConnected: !socialConn.facebookConnected };
    setSocialConn(updated);
    saveStoredSocialConnection(updated);
    onNotify(updated.facebookConnected ? '✓ Facebook Page & Ad Account connected!' : 'Facebook connection paused.');
  };

  const handleToggleInstagram = () => {
    const updated = { ...socialConn, instagramConnected: !socialConn.instagramConnected };
    setSocialConn(updated);
    saveStoredSocialConnection(updated);
    onNotify(updated.instagramConnected ? '✓ Instagram Business Profile & Shopping connected!' : 'Instagram connection paused.');
  };

  const handleTogglePlacement = (key: keyof SocialMediaConnection['placements']) => {
    const updated: SocialMediaConnection = {
      ...socialConn,
      placements: {
        ...socialConn.placements,
        [key]: !socialConn.placements[key],
      },
    };
    setSocialConn(updated);
    saveStoredSocialConnection(updated);
    onNotify(`Social placement "${String(key)}" ${updated.placements[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSyncCatalogWithMeta = () => {
    setIsSyncingCatalog(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const updated: SocialMediaConnection = {
        ...socialConn,
        lastSyncedAt: timeStr,
        syncedProductsCount: 24,
      };
      setSocialConn(updated);
      saveStoredSocialConnection(updated);
      setIsSyncingCatalog(false);
      onNotify('✓ 24 store products successfully synced with Meta Commerce Manager & Instagram Shop!');
    }, 1200);
  };

  const handleTestPixelEvent = () => {
    setPixelTestState('testing');
    setTimeout(() => {
      setPixelTestState('success');
      onNotify(`✓ Meta Pixel #${socialConn.metaPixelId}: Test event received successfully (Match quality: 99.8%)`);
      setTimeout(() => setPixelTestState('idle'), 4000);
    }, 900);
  };

  const handleOpenEditSocialSettings = () => {
    setEditingSocialData({ ...socialConn });
    setIsEditingSocialSettings(true);
  };

  const handleSaveSocialSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSocialConn(editingSocialData);
    saveStoredSocialConnection(editingSocialData);
    setIsEditingSocialSettings(false);
    onNotify('✓ Meta Social Connection details updated successfully!');
  };

  const handleToggleSimulatedLike = () => {
    if (isLikedSimulated) {
      setSimulatedLikes((prev) => prev - 1);
      setIsLikedSimulated(false);
    } else {
      setSimulatedLikes((prev) => prev + 1);
      setIsLikedSimulated(true);
    }
  };

  const handleOpenEditBanner = (banner: SiteBanner) => {
    setEditingBanner({ ...banner });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const updated = siteBanners.map((b) => (b.id === editingBanner.id ? editingBanner : b));
    setSiteBanners(updated);
    saveStoredSiteBanners(updated);

    if (editingBanner.group === 'hero') {
      syncHeroSlideUpdate(editingBanner);
    }

    setIsBannerModalOpen(false);
    onNotify(`Banner "${editingBanner.title}" updated and synced to the storefront!`);
  };

  const handleQuickBannerImageUpload = (bannerId: string, file: File) => {
    const target = siteBanners.find((b) => b.id === bannerId);
    const isHero = target?.group === 'hero';
    compressAndLoadImage(
      file,
      (dataUrl, info) => {
        const updated = siteBanners.map((b) => (b.id === bannerId ? { ...b, imageUrl: dataUrl } : b));
        setSiteBanners(updated);
        saveStoredSiteBanners(updated);

        const updatedBanner = updated.find((b) => b.id === bannerId);
        if (updatedBanner && updatedBanner.group === 'hero') {
          syncHeroSlideUpdate(updatedBanner);
          // Immediately set & lock this uploaded slide as the active storefront hero image
          const heroSlides = updated.filter((b) => b.group === 'hero');
          const slideIdx = heroSlides.findIndex((b) => b.id === bannerId);
          if (slideIdx !== -1) {
            handleSetPrimaryHeroSlide(bannerId, slideIdx);
          }
        }

        onNotify(
          `Hero photo updated & locked as stable storefront image (${info?.width}×${info?.height}px ${info?.format?.replace('image/', '').toUpperCase()})!`
        );
      },
      {
        isHero,
        maxDim: isHero ? 1920 : 1600,
        quality: 0.85,
      }
    );
  };

  const handleMoveHeroSlide = (id: string, direction: 'up' | 'down') => {
    const heroOnly = siteBanners.filter((b) => b.group === 'hero');
    const otherBanners = siteBanners.filter((b) => b.group !== 'hero');
    const index = heroOnly.findIndex((b) => b.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroOnly.length) return;

    const reordered = [...heroOnly];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const reorderedWithNames = reordered.map((slide, idx) => ({
      ...slide,
      name: `Hero Slide #${idx + 1}`,
      location: `Homepage Hero Slide #${idx + 1}`,
    }));

    const combined = [...reorderedWithNames, ...otherBanners];
    setSiteBanners(combined);
    saveStoredSiteBanners(combined);

    reorderedWithNames.forEach((slide) => {
      syncHeroSlideUpdate(slide);
    });

    onNotify(`Hero slide moved ${direction === 'up' ? 'earlier' : 'later'} in rotation!`);
  };

  const handleDeleteHeroBanner = (id: string) => {
    const heroOnly = siteBanners.filter((b) => b.group === 'hero');
    if (heroOnly.length <= 1) {
      onNotify('At least one hero slide is required for the storefront.');
      return;
    }
    if (!confirm('Are you sure you want to remove this hero slide from the homepage rotation?')) return;

    const updated = siteBanners.filter((b) => b.id !== id);
    setSiteBanners(updated);
    saveStoredSiteBanners(updated);
    onNotify('Hero slide removed from homepage rotation.');
  };

  const handleAddNewHeroBanner = () => {
    const heroOnly = siteBanners.filter((b) => b.group === 'hero');
    if (heroOnly.length >= 5) {
      onNotify('Maximum of 5 hero slides allowed for the storefront. Please edit or remove an existing slide.');
      return;
    }
    const nextNum = heroOnly.length + 1;
    const newHeroSlide: SiteBanner = {
      id: `banner-hero-${Date.now()}`,
      name: `Hero Slide #${nextNum}`,
      group: 'hero',
      location: `Homepage Hero Slide #${nextNum}`,
      title: 'New Kids Wear & Celebration Styles 2026',
      underText: 'Comfort for their play. Style for every day. Dresses, T-Shirts, Sets & Party Wear.',
      badge: 'NEW COLLECTION • 2026',
      buttonText: 'Shop Collection →',
      buttonLink: 'girl-fashion',
      priceTag: '₹999',
      originalPriceTag: '₹1,499',
      discountTag: '35% OFF',
      couponCode: 'PUPPY20',
      imageUrl: '/hero-stylish-kids.jpg',
      fitMode: 'cover',
      objectPosition: 'center',
    };

    const updated = [newHeroSlide, ...siteBanners];
    setSiteBanners(updated);
    saveStoredSiteBanners(updated);
    syncHeroSlideUpdate(newHeroSlide);
    onNotify(`Hero Slide #${nextNum} added to rotation and synced to storefront!`);
  };

  const handleResetSiteBanners = () => {
    if (confirm('Reset all website banners to factory default titles, under-texts, and photos?')) {
      setSiteBanners(INITIAL_SITE_BANNERS);
      saveStoredSiteBanners(INITIAL_SITE_BANNERS);
      onNotify('All website banners restored to factory defaults!');
    }
  };

  const filteredSiteBanners = siteBanners.filter((b) => {
    if (bannerFilterGroup !== 'all' && b.group !== bannerFilterGroup) return false;
    if (bannerSearchQuery.trim()) {
      const q = bannerSearchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.underText.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCampaigns = campaigns.filter((c) => {
    if (activeFilterType !== 'all' && c.type !== activeFilterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.highlight.toLowerCase().includes(q) ||
        c.couponCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advertising & Campaign Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ad Dashboard & Marketing Hub</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Directly update Title, Under-Text, and Photos for all storefront promotional banners, manage Hero carousels, and track high-converting customer campaigns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={activeView === 'banners' ? handleResetSiteBanners : handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600/60 cursor-pointer"
            title="Reset to default data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{activeView === 'banners' ? 'Reset Banners' : 'Reset Demo Ads'}</span>
          </button>
          <button
            onClick={() => setActiveView('coupons')}
            className="px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-indigo-400/40"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promo Coupons ({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveView('social')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Connection (FB & IG)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Ad Campaign</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Navigation Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveView('banners')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'banners'
              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Website Banners (Title, Subtext & Image Edit)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-white font-mono font-bold">
            {siteBanners.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('campaigns')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'campaigns'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ad Campaigns & Placements</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-mono font-bold">
            {campaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'coupons'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Coupons & Codes</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-mono font-bold">
            {coupons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('social')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'social'
              ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-md ring-2 ring-pink-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          }`}
        >
          <Share2 className={`w-4 h-4 ${activeView === 'social' ? 'text-white' : 'text-pink-500'}`} />
          <span>Social Media (Facebook & Instagram)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Meta Live</span>
          </span>
        </button>
      </div>

      {/* 1. STOREFRONT BANNERS VIEW (TITLE, UNDER-TEXT & IMAGE CHANGE) */}
      {activeView === 'banners' && (
        <div className="space-y-6">
          {/* Guide Header Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 p-5 rounded-3xl border border-amber-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
                  <LayoutTemplate className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  All Promotional Banners & Lookbook Promos
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Live Storefront Sync
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                Customize the <strong>Headline Title</strong>, <strong>Banner Under-Text</strong> (subtitle / description), and <strong>Banner Image</strong> (upload device photo or paste URL) for all 4 key storefront banners shown in screenshots and hero sliders.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetSiteBanners}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>

          {/* Dedicated Homepage Hero Slideshow Rotation & Direct Order Control Panel */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-700/60 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      Homepage Hero Slideshow Rotation &amp; Direct Order
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      IndexedDB Safe Persistence Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                    Control slide order with Move Earlier / Later (▲ / ▼), swap high-res photos, or add/remove slides. Changes instantly persist to storefront without browser 5MB quota errors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddNewHeroBanner}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Hero Slide</span>
                </button>
              </div>
            </div>

            {/* Hero Stability / Auto-Advance Mode Switch */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    !heroAutoplay ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {!heroAutoplay ? <Lock className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white">Hero Slideshow Mode</h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        !heroAutoplay
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      }`}
                    >
                      {!heroAutoplay ? '🔒 STABLE (Fixed)' : '▶ Auto-Rotating (5.5s)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Hero image is locked in STABLE mode. Storefront displays your selected active image statically with zero automatic changes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-md bg-amber-400 text-slate-950 border border-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>Mode: STABLE (Locked)</span>
                </div>
              </div>
            </div>

            {/* Hero Slides Reorder & Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {siteBanners
                .filter((b) => b.group === 'hero')
                .map((hero, index, heroArr) => {
                  const isActiveOnStorefront = activeHeroIndex === index || hero.isActive === true;
                  return (
                    <div
                      key={hero.id}
                      className={`bg-slate-800/80 rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-md ${
                        isActiveOnStorefront
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-indigo-700/40 hover:border-amber-400/60'
                      }`}
                    >
                      {/* Slide Priority Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs">
                            <span>Slide #{index + 1}</span>
                            {isActiveOnStorefront && (
                              <span className="text-[9px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold ml-1">
                                ACTIVE
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {hero.id.startsWith('banner-hero-stylish') ? '★ Stylish Kids Banner' : hero.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveHeroSlide(hero.id, 'up')}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              index === 0
                                ? 'opacity-30 border-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white'
                            }`}
                            title="Move Slide Earlier (Higher Display Priority)"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === heroArr.length - 1}
                            onClick={() => handleMoveHeroSlide(hero.id, 'down')}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              index === heroArr.length - 1
                                ? 'opacity-30 border-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white'
                            }`}
                            title="Move Slide Later"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {heroArr.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteHeroBanner(hero.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition-colors cursor-pointer ml-1"
                              title="Remove this hero slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Thumbnail with Overlay Swap */}
                      <div className="relative aspect-16/7 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                        <img
                          src={hero.imageUrl}
                          alt={hero.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          style={{ objectPosition: hero.objectPosition || 'center' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                            {hero.badge}
                          </span>
                          <label className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all shadow-md">
                            <Camera className="w-3 h-3" />
                            <span>Swap Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleQuickBannerImageUpload(hero.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Text Details */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white line-clamp-1">{hero.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{hero.underText}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryHeroSlide(hero.id, index)}
                          className={`py-2 px-2.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            isActiveOnStorefront
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                              : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 border-slate-600'
                          }`}
                          title="Lock this slide as the visible storefront hero image"
                        >
                          {isActiveOnStorefront ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>Active Now</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Set Active</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditBanner(hero)}
                          className="py-2 px-2.5 rounded-xl bg-slate-700/90 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-600/70"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Group Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All Banners (${siteBanners.length})` },
                { id: 'spotlight', label: '⭐ Trending Spotlight' },
                { id: 'promotional', label: '👡 Footwear & Party Wear' },
                { id: 'shop_by_style', label: '🌸 Shop by Style (Her & Him)' },
                { id: 'hero', label: '🎠 Hero Rotating Slider' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setBannerFilterGroup(grp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bannerFilterGroup === grp.id
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search banner title or text..."
                value={bannerSearchQuery}
                onChange={(e) => setBannerSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-300"
              />
            </div>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSiteBanners.map((banner) => {
              return (
                <div
                  key={banner.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400/80 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Location Bar */}
                  <div className="p-4 pb-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/70">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider truncate">
                        {banner.location}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 shrink-0">
                      {banner.group === 'spotlight'
                        ? 'Spotlight'
                        : banner.group === 'shop_by_style'
                        ? 'Style Card'
                        : banner.group === 'hero'
                        ? 'Hero Slide'
                        : 'Promo'}
                    </span>
                  </div>

                  {/* Banner Image Preview Container */}
                  <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                        {banner.badge}
                      </span>
                    </div>

                    {/* Quick Image Upload Button overlay */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <label className="px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-xs border border-white/20 shadow-md transition-all">
                        <Camera className="w-3.5 h-3.5 text-amber-300" />
                        <span>Swap Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleQuickBannerImageUpload(banner.id, file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Text & Content Info */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Banner Headline Title */}
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                          Banner Headline Title
                        </div>
                        <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
                          {banner.title}
                        </h4>
                      </div>

                      {/* Banner Under-Text (Description) */}
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <span>Banner Under-Text / Description:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
                          "{banner.underText}"
                        </p>
                      </div>

                      {/* Tags row */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        {banner.priceTag && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono font-bold">
                            {banner.priceTag} {banner.originalPriceTag && <span className="line-through text-slate-400 font-normal">({banner.originalPriceTag})</span>}
                          </span>
                        )}
                        {banner.discountTag && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-bold">
                            {banner.discountTag}
                          </span>
                        )}
                        {banner.couponCode && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-mono font-bold">
                            Code: {banner.couponCode}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md font-semibold truncate max-w-[150px]">
                          CTA: {banner.buttonText}
                        </span>
                      </div>
                    </div>

                    {/* Edit Action Button */}
                    <button
                      onClick={() => handleOpenEditBanner(banner)}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Title, Under-Text & Image</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AD CAMPAIGNS & METRICS VIEW */}
      {activeView === 'campaigns' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* High-Level Ad Performance KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {totalImpressions.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ad Clicks</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {totalClicks.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+12.6% traffic gain</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average CTR</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">{overallCtr}%</div>
          <div className="text-[11px] text-slate-500 font-medium">Industry bench: 2.5%</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ad Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{(totalRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold">
            <span>ROAS: {roas}x return</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live Status</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {activeCount} <span className="text-xs font-semibold text-slate-400">/ {campaigns.length} Active</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Storefront Sync Live</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Campaign List & Right Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Campaign Management Table & Cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Placements' },
                { id: 'hero_banner', label: 'Hero Carousel' },
                { id: 'festive_promo', label: 'Festive Takeovers' },
                { id: 'announcement_bar', label: 'Top Tickers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeFilterType === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns & codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-300"
              />
            </div>
          </div>

          {/* Campaign Items List */}
          <div className="space-y-3.5">
            {filteredCampaigns.map((camp) => {
              const isSelected = camp.id === previewCampaignId;
              const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0';
              return (
                <div
                  key={camp.id}
                  onClick={() => setPreviewCampaignId(camp.id)}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Priority & Status Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            camp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {camp.status}
                      </span>

                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                        {camp.type === 'hero_banner'
                          ? 'Hero Carousel Slide'
                          : camp.type === 'festive_promo'
                          ? 'Festive Showcase'
                          : 'Announcement Bar'}
                      </span>

                      {camp.couponCode && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold px-2 py-0.5 rounded-md">
                          Code: {camp.couponCode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Active/Pause Switch */}
                      <button
                        onClick={() => handleToggleStatus(camp.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          camp.status === 'active'
                            ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={camp.status === 'active' ? 'Pause this ad campaign' : 'Activate this ad campaign'}
                      >
                        {camp.status === 'active' ? (
                          <>
                            <Pause className="w-3 h-3 text-slate-600" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-white" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEditModal(camp)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Campaign Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Body Details */}
                  <div className="pt-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                        {camp.imageUrl ? (
                          <img
                            src={camp.imageUrl}
                            alt={camp.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Tag className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-600 tracking-wide">
                          {camp.badge || 'PROMOTIONAL AD'}
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {camp.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                          {(camp as any).headline ? `${(camp as any).headline}: ` : ''}
                          {camp.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats Pill Matrix */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 w-full md:w-auto justify-around md:justify-start">
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Impressions</div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {camp.impressions.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Clicks</div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {camp.clicks.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">CTR</div>
                        <div className="text-xs font-black text-emerald-600">{ctr}%</div>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Revenue</div>
                        <div className="text-xs font-black text-slate-900">
                          ₹{(camp.revenue / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCampaigns.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No campaigns found for this filter</h4>
                <p className="text-xs text-slate-400">Try switching placement tabs or adjusting search query.</p>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Create New Campaign
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Interactive Ad Visual Preview Mockup */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Live Ad Preview</h3>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {selectedPreviewCampaign ? (
              <div className="space-y-3">
                {/* Simulated Device Frame */}
                <div
                  className={`transition-all duration-300 mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl relative ${
                    previewDevice === 'mobile' ? 'max-w-[280px]' : 'w-full'
                  }`}
                >
                  {/* Mock Browser Top bar */}
                  <div className="bg-slate-900 px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-mono ml-2 truncate">
                      voraeclat.com/deals
                    </span>
                  </div>

                  {/* Render simulated Hero Slide / Promo Banner */}
                  <div className="relative min-h-[220px] bg-slate-900 text-white overflow-hidden p-4 sm:p-5 flex flex-col justify-between">
                    {/* Background Image with Gradient Overlay */}
                    {selectedPreviewCampaign.imageUrl && (
                      <img
                        src={selectedPreviewCampaign.imageUrl}
                        alt={selectedPreviewCampaign.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />
                    )}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${selectedPreviewCampaign.accentColor || 'from-slate-950 via-slate-900 to-transparent'} opacity-85`}
                    />

                    {/* Content inside preview */}
                    <div className="relative z-10 space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {selectedPreviewCampaign.badge || 'SPECIAL EVENT'}
                      </div>

                      <h4 className="text-base sm:text-lg font-black leading-tight text-white">
                        {selectedPreviewCampaign.title}{' '}
                        <span className="text-amber-300 block">{selectedPreviewCampaign.highlight}</span>
                      </h4>

                      <p className="text-[10px] text-slate-200 line-clamp-2 leading-relaxed">
                        {selectedPreviewCampaign.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-3 flex items-center justify-between gap-2 border-t border-white/10 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono">
                          {selectedPreviewCampaign.couponCode || 'PUPPYFIRST'}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold">
                          {selectedPreviewCampaign.discountBadge || 'FLAT 40% OFF'}
                        </span>
                      </div>

                      <button className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-md">
                        {selectedPreviewCampaign.ctaText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campaign Quick Analytics Summary */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Selected Campaign:</span>
                    <strong className="text-white truncate max-w-[180px]">{selectedPreviewCampaign.name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Target Category:</span>
                    <span className="text-amber-400 uppercase font-mono text-[11px]">
                      {selectedPreviewCampaign.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Campaign Budget:</span>
                    <span className="text-slate-100 font-bold">
                      ₹{selectedPreviewCampaign.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Current Spend:</span>
                    <span className="text-slate-100 font-bold">
                      ₹{selectedPreviewCampaign.spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Generated Revenue:</span>
                    <span className="text-emerald-400 font-black">
                      ₹{selectedPreviewCampaign.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
        </div>
      )}

      {/* 3. PROMO COUPONS VIEW */}
      {activeView === 'coupons' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Store Discount System</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Promo Coupons & Offers</h3>
              <p className="text-xs text-slate-500">
                Manage live promotional checkout coupon codes, discounts, usage limits, and minimum cart amounts.
              </p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-lg text-sm tracking-wide">
                    {c.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      c.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`} on orders above ₹{c.minCartValue}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <span>Used {c.usageCount} / {c.maxUses} times</span>
                  <button
                    onClick={() => handleToggleCoupon(c.code)}
                    className={`font-bold hover:underline cursor-pointer ${
                      c.status === 'active' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {c.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOCIAL MEDIA ADS & CONNECTION VIEW (FACEBOOK & INSTAGRAM) */}
      {activeView === 'social' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Meta Hub Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Meta Business Suite &bull; Social Ads</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active &amp; Syncing</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Ad Account: {socialConn.facebookAdAccountId}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Facebook &amp; Instagram Advertising &amp; Shopping Channel
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Seamlessly broadcast store ad campaigns, sync 24 certified baby products directly to Facebook Shop &amp; Instagram Reels, configure Meta Pixel tracking, and manage parenting audience growth.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSyncCatalogWithMeta}
                disabled={isSyncingCatalog}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCatalog ? 'animate-spin' : ''}`} />
                <span>{isSyncingCatalog ? 'Syncing Catalog...' : 'Sync Catalog with Meta'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEditSocialSettings}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/20 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure Accounts</span>
              </button>
            </div>
          </div>

          {/* Social Performance KPI Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Instagram Followers</div>
                <div className="text-2xl font-black text-slate-900">{socialConn.stats.instagramFollowers}</div>
                <div className="text-[10px] text-emerald-600 font-bold">+14.2% this month</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Facebook className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facebook Community</div>
                <div className="text-2xl font-black text-slate-900">{socialConn.stats.facebookFollowers}</div>
                <div className="text-[10px] text-emerald-600 font-bold">+8.6% engagement</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekly Social Reach</div>
                <div className="text-2xl font-black text-slate-900">{socialConn.stats.weeklySocialReach}</div>
                <div className="text-[10px] text-slate-400 font-medium">Parents &amp; Families</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Meta Blended ROAS</div>
                <div className="text-2xl font-black text-slate-900">{socialConn.stats.socialRoas}</div>
                <div className="text-[10px] text-emerald-600 font-bold">High profitability</div>
              </div>
            </div>
          </div>

          {/* Connected Channels Cards (Facebook & Instagram) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Page & Ad Account Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Facebook className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-base">{socialConn.facebookPageName}</h4>
                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                      </div>
                      <p className="text-xs text-slate-500 font-mono">ID: {socialConn.facebookAdAccountId}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      socialConn.facebookConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        socialConn.facebookConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    <span>{socialConn.facebookConnected ? 'Connected' : 'Paused'}</span>
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Page URL:</span>
                    <a
                      href={socialConn.facebookPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{socialConn.facebookPageUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Active Placements:</span>
                    <span className="font-bold text-slate-800">
                      {[
                        socialConn.placements.facebookFeed && 'Feed',
                        socialConn.placements.facebookMarketplace && 'Marketplace',
                      ]
                        .filter(Boolean)
                        .join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Audience Community:</span>
                    <span className="font-bold text-slate-800">{socialConn.stats.facebookFollowers} Active Parents</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleToggleFacebook}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    socialConn.facebookConnected
                      ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {socialConn.facebookConnected ? 'Pause Connection' : 'Connect Facebook'}
                </button>
                <a
                  href={socialConn.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Instagram Profile & Shopping Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-pink-400 transition-all flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-base">{socialConn.instagramHandle}</h4>
                        <CheckCircle2 className="w-4 h-4 text-pink-500 fill-pink-500 text-white" />
                      </div>
                      <p className="text-xs text-slate-500">Instagram Shopping &bull; Approved</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      socialConn.instagramConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        socialConn.instagramConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    <span>{socialConn.instagramConnected ? 'Connected' : 'Paused'}</span>
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Profile URL:</span>
                    <a
                      href={socialConn.instagramProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{socialConn.instagramProfileUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Active Formats:</span>
                    <span className="font-bold text-slate-800">
                      {[
                        socialConn.placements.instagramFeed && 'Feed',
                        socialConn.placements.instagramReels && 'Reels',
                        socialConn.placements.instagramStories && 'Stories',
                      ]
                        .filter(Boolean)
                        .join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Follower Base:</span>
                    <span className="font-bold text-slate-800">{socialConn.stats.instagramFollowers} Parents &amp; Stylists</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleToggleInstagram}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    socialConn.instagramConnected
                      ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white shadow-sm'
                  }`}
                >
                  {socialConn.instagramConnected ? 'Pause Connection' : 'Connect Instagram'}
                </button>
                <a
                  href={socialConn.instagramProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Social Ad Placements & Meta Pixel Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Social Ad Placements Matrix */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Social Ad Placements</h4>
                    <p className="text-[11px] text-slate-500">Toggle active ad distribution channels</p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Meta Automated
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'instagramFeed' as const,
                    label: 'Instagram Feed Posts',
                    icon: Instagram,
                    desc: 'Square & portrait photo promotions with direct Shop Now badge',
                  },
                  {
                    key: 'instagramReels' as const,
                    label: 'Instagram Reels Video Ads',
                    icon: Play,
                    desc: 'Full-screen 9:16 vertical video & sound-on lookbook reels',
                  },
                  {
                    key: 'instagramStories' as const,
                    label: 'Instagram Stories Ads',
                    icon: Smartphone,
                    desc: 'Swipe-up interactive story cards with limited-time coupons',
                  },
                  {
                    key: 'facebookFeed' as const,
                    label: 'Facebook Desktop & Mobile Feed',
                    icon: Facebook,
                    desc: 'Primary parental newsfeed ads with direct coupon links',
                  },
                  {
                    key: 'facebookMarketplace' as const,
                    label: 'Facebook Marketplace & Groups',
                    icon: Layers,
                    desc: 'Discovery shopping surface for expecting & new parents',
                  },
                ].map((placement) => {
                  const Icon = placement.icon;
                  const isChecked = socialConn.placements[placement.key];
                  return (
                    <label
                      key={placement.key}
                      onClick={() => handleTogglePlacement(placement.key)}
                      className={`flex items-start justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{placement.label}</div>
                          <div className="text-[11px] text-slate-500">{placement.desc}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 mt-1 rounded text-amber-500 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Right 6 cols: Meta Pixel & Conversions API */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Meta Pixel &amp; Tracking Diagnostics</h4>
                    <p className="text-[11px] text-slate-500">Real-time conversion tracking &amp; match rate</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Healthy &bull; 99.8%
                </span>
              </div>

              {/* Pixel ID card */}
              <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Meta Pixel ID</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(socialConn.metaPixelId);
                      onNotify('Pixel ID copied to clipboard!');
                    }}
                    className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="text-lg font-mono font-black tracking-widest text-amber-300">
                  {socialConn.metaPixelId}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Conversions API (CAPI) active with first-party cookie deduplication</span>
                </div>
              </div>

              {/* Event Health Checklist */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Event Telemetry
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { event: 'PageView', status: 'Live', time: '1s ago' },
                    { event: 'ViewContent', status: 'Live', time: '12s ago' },
                    { event: 'AddToCart', status: 'Live', time: '45s ago' },
                    { event: 'InitiateCheckout', status: 'Live', time: '2m ago' },
                    { event: 'Purchase', status: 'Live', time: '5m ago' },
                    { event: 'Search', status: 'Live', time: '8s ago' },
                  ].map((ev) => (
                    <div
                      key={ev.event}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-bold text-slate-800">{ev.event}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Pixel Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestPixelEvent}
                  disabled={pixelTestState === 'testing'}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                    pixelTestState === 'success'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {pixelTestState === 'testing'
                      ? 'Dispatching Meta Test Event...'
                      : pixelTestState === 'success'
                      ? '✓ Test Event Verified by Meta Server!'
                      : 'Dispatch Live Test Event to Meta Pixel'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Ad Preview (Instagram Feed & Facebook Post Simulator) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-pink-50 text-slate-900 text-xs font-black uppercase tracking-wider mb-1 border border-pink-200">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Live Social Ad Simulator</span>
                </div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">
                  Instant Instagram &amp; Facebook Feed Mockup
                </h4>
                <p className="text-xs text-slate-500">
                  Preview how any active promotional campaign renders directly on mobile parents feeds with direct purchase CTAs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Select campaign */}
                <select
                  value={selectedSocialCampaignId}
                  onChange={(e) => setSelectedSocialCampaignId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.badge || 'PROMO'})
                    </option>
                  ))}
                </select>

                {/* Toggle Platform: Instagram vs Facebook */}
                <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSocialPlatform('instagram')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      socialPlatform === 'instagram'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPlatform('facebook')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      socialPlatform === 'facebook'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Phone Mockup */}
            {(() => {
              const activeCampaign =
                campaigns.find((c) => c.id === selectedSocialCampaignId) || campaigns[0] || INITIAL_AD_CAMPAIGNS[0];

              return (
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
                  {/* The Simulated Phone Frame */}
                  <div className="w-full max-w-sm bg-slate-950 rounded-[40px] p-3 shadow-2xl ring-1 ring-slate-800">
                    <div className="bg-white rounded-[32px] overflow-hidden flex flex-col border border-slate-100">
                      {/* Top Phone Status Bar */}
                      <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-900 bg-slate-50">
                        <span>9:41</span>
                        <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto -mt-1"></div>
                        <div className="flex items-center gap-1">
                          <span>5G</span>
                          <span className="w-4 h-2 rounded-xs border border-slate-900 inline-block"></span>
                        </div>
                      </div>

                      {/* Social Post Content */}
                      {socialPlatform === 'instagram' ? (
                        /* INSTAGRAM FEED SIMULATION */
                        <div className="flex flex-col bg-white">
                          {/* Profile Header */}
                          <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden font-black text-[9px] text-slate-900">
                                  VE
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-slate-900">voraeclat_kids</span>
                                  <CheckCircle2 className="w-3 h-3 text-pink-500 fill-pink-500 text-white" />
                                </div>
                                <div className="text-[10px] text-slate-400 leading-tight">Sponsored &bull; Paid partnership</div>
                              </div>
                            </div>
                            <span className="text-slate-400 font-bold tracking-widest text-xs">&bull;&bull;&bull;</span>
                          </div>

                          {/* Ad Image / Video */}
                          <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                            <img
                              src={activeCampaign.imageUrl}
                              alt={activeCampaign.name}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/hero-stylish-kids.jpg';
                              }}
                            />
                            {/* Eyebrow badge tag */}
                            <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                              {activeCampaign.badge || 'NEW ARRIVAL'}
                            </span>
                            {/* Discount badge */}
                            <span className="absolute bottom-3 right-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md">
                              {activeCampaign.discountBadge || 'FLAT 40% OFF'}
                            </span>
                          </div>

                          {/* Instagram Shop Now CTA Bar */}
                          <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 flex items-center justify-between text-slate-950">
                            <div className="flex items-center gap-1.5">
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="text-xs font-black uppercase tracking-wider">
                                {activeCampaign.ctaText || 'Shop Now'}
                              </span>
                            </div>
                            <span className="text-xs font-bold">&rsaquo;</span>
                          </div>

                          {/* Action Icons: Like, Comment, Share, Bookmark */}
                          <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={handleToggleSimulatedLike}
                                className="cursor-pointer transition-transform active:scale-125"
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    isLikedSimulated ? 'fill-rose-500 text-rose-500' : 'text-slate-800'
                                  }`}
                                />
                              </button>
                              <MessageCircle className="w-5 h-5 text-slate-800" />
                              <Share2 className="w-5 h-5 text-slate-800" />
                            </div>
                            <Bookmark className="w-5 h-5 text-slate-800" />
                          </div>

                          {/* Likes & Caption */}
                          <div className="px-3.5 pb-3 text-xs space-y-1">
                            <div className="font-extrabold text-slate-900">{simulatedLikes.toLocaleString()} likes</div>
                            <div className="text-slate-800 text-[11px] leading-tight">
                              <strong className="font-bold text-slate-950 mr-1.5">voraeclat_kids</strong>
                              <span>{activeCampaign.highlight || activeCampaign.title}</span> &bull;{' '}
                              <span>{activeCampaign.description}</span>
                            </div>
                            <div className="text-[10px] text-blue-600 font-medium">
                              #voraeclat #kidswear #parenting #organickids
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* FACEBOOK FEED SIMULATION */
                        <div className="flex flex-col bg-white">
                          {/* Facebook Page Header */}
                          <div className="p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                                <Facebook className="w-5 h-5 fill-current" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-black text-slate-900">{socialConn.facebookPageName}</span>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <span>Sponsored &bull;</span>
                                  <Globe className="w-2.5 h-2.5" />
                                </div>
                              </div>
                            </div>
                            <span className="text-slate-400 font-bold">&bull;&bull;&bull;</span>
                          </div>

                          {/* Primary Headline */}
                          <div className="px-3.5 pb-2 text-xs text-slate-800 font-medium leading-relaxed">
                            {activeCampaign.highlight || activeCampaign.description} Use code{' '}
                            <span className="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {activeCampaign.couponCode || 'PUPPY20'}
                            </span>{' '}
                            for extra savings!
                          </div>

                          {/* Image */}
                          <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                            <img
                              src={activeCampaign.imageUrl}
                              alt={activeCampaign.name}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/hero-stylish-kids.jpg';
                              }}
                            />
                            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                              {activeCampaign.discountBadge || 'FLAT 40% OFF'}
                            </span>
                          </div>

                          {/* Facebook URL Card */}
                          <div className="p-3 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                            <div className="min-w-0 pr-2">
                              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                                voraeclat.com
                              </div>
                              <div className="text-xs font-black text-slate-900 truncate">
                                {activeCampaign.title || activeCampaign.name}
                              </div>
                            </div>
                            <span className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold shrink-0">
                              {activeCampaign.ctaText || 'Shop Now'}
                            </span>
                          </div>

                          {/* Reactions bar */}
                          <div className="px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                                👍
                              </span>
                              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                                ❤️
                              </span>
                              <span>1.2K parents</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span>84 comments</span>
                              <span>&bull;</span>
                              <span>32 shares</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Ad Campaign Specs & Direct Social Launch */}
                  <div className="flex-1 max-w-lg space-y-4">
                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Campaign Diagnostics
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {activeCampaign.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">{activeCampaign.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{activeCampaign.description}</p>

                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Coupon Code:</span>
                          <div className="font-black text-slate-900">{activeCampaign.couponCode || 'PUPPYFIRST'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Target Category:</span>
                          <div className="font-black text-slate-900 capitalize">
                            {activeCampaign.category.replace('-', ' ')}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Estimated Social Reach:</span>
                          <div className="font-black text-emerald-600">
                            {activeCampaign.impressions.toLocaleString()} views
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">CTR on Social:</span>
                          <div className="font-black text-slate-900">
                            {((activeCampaign.clicks / (activeCampaign.impressions || 1)) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-pink-50 border border-pink-200/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Share2 className="w-4 h-4 text-pink-600 shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">
                          Publish updates directly to Instagram &amp; Facebook feeds
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onNotify(`✓ "${activeCampaign.name}" synced and pushed to Instagram & Facebook ad queues!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        Push to Social
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Social Media Settings Configuration Modal */}
      {isEditingSocialSettings && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 text-white">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Configure Social Media Connections</h3>
                  <p className="text-xs text-slate-500">Facebook Page, Instagram Profile &amp; Meta Pixel credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingSocialSettings(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSocialSettingsSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600 fill-current" />
                  <span>Facebook Page Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSocialData.facebookPageName}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, facebookPageName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingSocialData.facebookPageUrl}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, facebookPageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Facebook Ad Account ID</label>
                <input
                  type="text"
                  required
                  value={editingSocialData.facebookAdAccountId}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, facebookAdAccountId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Profile Handle</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSocialData.instagramHandle}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, instagramHandle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-pink-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingSocialData.instagramProfileUrl}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, instagramProfileUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-pink-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Meta Pixel ID (Tracking &amp; CAPI)</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSocialData.metaPixelId}
                  onChange={(e) =>
                    setEditingSocialData({ ...editingSocialData, metaPixelId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-400 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingSocialSettings(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-black shadow-md cursor-pointer"
                >
                  Save Social Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Create & Edit Modal */}
      {isEditingModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {campaigns.some((c) => c.id === editingCampaign.id) ? 'Edit Ad Campaign' : 'Create New Ad Campaign'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure banner copy, target category, promo codes, and visual theme.
                </p>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Internal Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.name || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                    placeholder="e.g. Diwali Mega Fest 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ad Placement Type</label>
                  <select
                    value={editingCampaign.type || 'hero_banner'}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, type: e.target.value as AdType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="hero_banner">Hero Carousel Slide</option>
                    <option value="festive_promo">Festive Showcase Banner</option>
                    <option value="announcement_bar">Top Announcement Bar</option>
                    <option value="flash_deal">Flash Deal Spotlight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    value={editingCampaign.badge || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, badge: e.target.value })}
                    placeholder="e.g. JOYFUL ADVENTURES • NEW COLLECTION"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Discount Tag / Badge</label>
                  <input
                    type="text"
                    value={editingCampaign.discountBadge || ''}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, discountBadge: e.target.value })
                    }
                    placeholder="e.g. FLAT 40% OFF or UP TO 60% OFF"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Title Headline</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.title || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                    placeholder="e.g. Playful Kidswear,"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Highlight Text (Colored)</label>
                  <input
                    type="text"
                    value={editingCampaign.highlight || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, highlight: e.target.value })}
                    placeholder="e.g. Play, Explore, Grow"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Promotional Subtitle</label>
                <textarea
                  rows={2}
                  value={editingCampaign.description || ''}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, description: e.target.value })
                  }
                  placeholder="Engineered for joyful childhood adventures..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Store Category</label>
                  <select
                    value={editingCampaign.category || 'all'}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        category: e.target.value as CategoryId,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="all">All Storefront</option>
                    <option value="festive-ethnic">Festive & Ethnic</option>
                    <option value="boy-fashion">Boy Fashion</option>
                    <option value="girl-fashion">Girl Fashion</option>
                    <option value="baby-toddler">Baby & Toddler (0-24M)</option>
                    <option value="casual-wear">Casual & Daily</option>
                    <option value="toys-learning">Toys & Learning</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Linked Coupon Code</label>
                  <input
                    type="text"
                    value={editingCampaign.couponCode || ''}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        couponCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. PUPPYFEST"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingCampaign.ctaText || 'Shop Collection'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image URL & Quick Presets */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">High-Res Image Photography URL</label>
                <input
                  type="url"
                  value={editingCampaign.imageUrl || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Presets:</span>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => setEditingCampaign({ ...editingCampaign, imageUrl: preset.url })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-[10px] text-slate-700 hover:text-amber-900 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Presets */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Color Gradient Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCENT_PRESETS.map((p) => {
                    const isSelected = editingCampaign.accentColor === p.value;
                    return (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() =>
                          setEditingCampaign({
                            ...editingCampaign,
                            accentColor: p.value,
                            themeHue: p.theme,
                          })
                        }
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white font-bold'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${p.value} shrink-0`} />
                        <span className="text-[11px] truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black transition-colors shadow-md cursor-pointer"
                >
                  Save & Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Coupons Management Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Promotional Discount Coupons</h3>
                <p className="text-xs text-slate-500">
                  Manage storewide promo codes, coupon limits, and customer discount triggers.
                </p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Existing Coupons Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Store Promo Codes
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                {coupons.map((c) => (
                  <div key={c.code} className="p-3.5 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 bg-amber-100 px-2 py-0.5 rounded-md text-xs">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-slate-600 font-medium">{c.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`} on
                        orders above ₹{c.minCartValue} &bull; Used {c.usageCount} times
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleCoupon(c.code)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        c.status === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {c.status === 'active' ? 'Deactivate' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Coupon Form */}
            <form onSubmit={handleSaveCoupon} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Add New Promo Coupon</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH30"
                    value={newCoupon.code || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg uppercase font-mono font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue || 15}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Min Cart Spend (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minCartValue || 999}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minCartValue: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  + Add Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Website Banner Edit Modal */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    <span>{editingBanner.location}</span>
                  </div>
                  {editingBanner.group === 'hero' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Hero Direct Sync &amp; IndexedDB Safe
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Edit Banner: {editingBanner.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Update Title, Under-Text (Description / Subtitle), and Banner Photography with live storefront sync.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBanner} className="space-y-5 text-xs">
              {/* 1. Banner Headline Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Banner Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. Sunflower Sapphire Floral Shirt Collar A-Line Dress"
                  className="w-full px-4 py-2.5 text-sm sm:text-base font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* 2. Banner Under-Text (Description / Subtitle) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Banner Under-Text / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBanner.underText}
                  onChange={(e) => setEditingBanner({ ...editingBanner, underText: e.target.value })}
                  placeholder="e.g. Pure Viscose fabric with statement sunflower placement print, classic shirt collar, 3/4th sleeves..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200 leading-relaxed"
                />
              </div>

              {/* 3. Image Change Option (Device Upload + URL + Presets + Ultra-HD Clarity Controls) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Banner Image &amp; Ultra-HD Quality Controls *
                    </label>
                  </div>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Ultra-HD 2.5K Canvas Clarity Engine Active
                  </span>
                </div>

                {/* Aspect Ratio & Clarity Pro-Tip */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clarity &amp; Aspect Ratio Guidelines for Hero Banners:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5.5">
                    For maximum sharpness on Retina, 4K, and 1080p desktop monitors, use wide landscape photos (e.g. <strong>1920×640</strong> or <strong>2560×800</strong>, ~21:9 or 16:6). Uploads are automatically processed with multi-step bicubic downsampling and encoded in crisp <strong>WebP (94% quality)</strong> to eliminate blur.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: Device File Upload */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Option A: Upload Device Photo (Phone / PC)
                    </span>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/50 cursor-pointer transition-all text-center group">
                      <Upload className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-black text-slate-800">Click to Browse High-Res Photo</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP (Ultra-HD 2560px Preserved)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressAndLoadImage(
                              file,
                              (dataUrl, info) => {
                                setEditingBanner({ ...editingBanner, imageUrl: dataUrl });
                                onNotify(
                                  `Photo loaded with Ultra-HD clarity (${info?.width}×${info?.height}px ${info?.format?.replace('image/', '').toUpperCase()})!`
                                );
                              },
                              {
                                isHero: editingBanner.group === 'hero',
                                maxDim: editingBanner.group === 'hero' ? 2560 : 1800,
                                quality: 0.94,
                              }
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Option B: Direct Image URL */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Option B: Direct Photo URL
                    </span>
                    <input
                      type="url"
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-400"
                    />

                    {/* 1-Click HD URL Booster */}
                    {editingBanner.imageUrl && editingBanner.imageUrl.includes('images.unsplash.com') && (
                      <button
                        type="button"
                        onClick={() => {
                          const upgraded = editingBanner.imageUrl.replace(/w=\d+(&q=\d+)?/, 'w=2560&q=95');
                          setEditingBanner({ ...editingBanner, imageUrl: upgraded });
                          onNotify('Image URL upgraded to 2.5K Ultra-HD resolution (w=2560&q=95)!');
                        }}
                        className="mt-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Boost URL to 2.5K Ultra-HD (2560px)</span>
                      </button>
                    )}

                    {/* Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Or Pick Curated 2.5K Ultra-HD Preset:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {BANNER_IMAGE_PRESETS.slice(0, 6).map((p) => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setEditingBanner({ ...editingBanner, imageUrl: p.url })}
                            className="px-2 py-0.5 bg-white hover:bg-amber-100 text-[10px] font-semibold rounded-md border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Framing & Position Controls (Prevents Zoom Crop Blur) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Focal Alignment (Subject Focus)
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'center', label: 'Center' },
                        { id: 'top', label: 'Top (Faces)' },
                        { id: 'bottom', label: 'Bottom' },
                      ].map((pos) => {
                        const isSelected = (editingBanner.objectPosition || 'center') === pos.id;
                        return (
                          <button
                            type="button"
                            key={pos.id}
                            onClick={() =>
                              setEditingBanner({
                                ...editingBanner,
                                objectPosition: pos.id as 'center' | 'top' | 'bottom',
                              })
                            }
                            className={`py-1 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {pos.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Display Fit Mode
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'cover', label: 'Full Bleed (Cover)' },
                        { id: 'contain', label: 'Contain (No Crop)' },
                      ].map((fit) => {
                        const isSelected = (editingBanner.fitMode || 'cover') === fit.id;
                        return (
                          <button
                            type="button"
                            key={fit.id}
                            onClick={() =>
                              setEditingBanner({
                                ...editingBanner,
                                fitMode: fit.id as 'cover' | 'contain',
                              })
                            }
                            className={`py-1 px-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {fit.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Current Image Loaded Thumbnail & Details */}
                <div className="flex items-center gap-3 pt-3 border-t border-amber-200/60 bg-white/70 p-3 rounded-xl border border-amber-100">
                  <img
                    src={editingBanner.imageUrl}
                    alt="Loaded Banner Preview"
                    className="w-20 h-14 object-cover rounded-xl border-2 border-amber-400 shadow-xs shrink-0"
                    style={{
                      objectPosition: editingBanner.objectPosition || 'center',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="text-[11px] text-slate-600 truncate flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">Current Image Attached</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">
                        Ultra-HD Ready
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{editingBanner.imageUrl}</div>
                    <div className="text-[10px] text-amber-800 font-semibold">
                      Alignment: {editingBanner.objectPosition || 'center'} • Fit: {editingBanner.fitMode || 'cover'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Extra Banner Customizations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    value={editingBanner.badge}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                    placeholder="e.g. ★ TRENDING SPOTLIGHT"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.buttonText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    placeholder="e.g. Shop Footwear →"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Category Link</label>
                  <select
                    value={editingBanner.buttonLink || 'girl-fashion'}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, buttonLink: e.target.value as CategoryId })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                  >
                    {STORE_CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Special Tags (Pricing / Coupon) if applicable */}
              {(editingBanner.priceTag !== undefined || editingBanner.couponCode !== undefined) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {editingBanner.priceTag !== undefined && (
                    <>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Selling Price Tag</label>
                        <input
                          type="text"
                          value={editingBanner.priceTag || ''}
                          onChange={(e) => setEditingBanner({ ...editingBanner, priceTag: e.target.value })}
                          placeholder="e.g. ₹1,199"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Original Price Tag</label>
                        <input
                          type="text"
                          value={editingBanner.originalPriceTag || ''}
                          onChange={(e) =>
                            setEditingBanner({ ...editingBanner, originalPriceTag: e.target.value })
                          }
                          placeholder="e.g. ₹1,499"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                    </>
                  )}

                  {editingBanner.couponCode !== undefined && (
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Promo Coupon Code</label>
                      <input
                        type="text"
                        value={editingBanner.couponCode || ''}
                        onChange={(e) =>
                          setEditingBanner({ ...editingBanner, couponCode: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. FESTIVE65"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono font-bold focus:bg-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 6. Live Storefront Banner Simulation Preview */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Live Storefront Simulation Preview:
                </span>
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700 shadow-lg">
                  <div className="space-y-2 z-10 max-w-md">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      {editingBanner.badge}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {editingBanner.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {editingBanner.underText}
                    </p>
                    <div className="pt-1">
                      <span className="px-4 py-1.5 rounded-xl bg-white text-slate-950 font-black text-xs inline-block">
                        {editingBanner.buttonText}
                      </span>
                    </div>
                  </div>

                  <div className="w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden border-2 border-white/40 shrink-0 shadow-md">
                    <img
                      src={editingBanner.imageUrl}
                      alt={editingBanner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Banner Changes & Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
