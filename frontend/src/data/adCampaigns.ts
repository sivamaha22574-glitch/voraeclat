import { CategoryId } from '../types';
import {
  upsertPuppyAdCampaignToSupabase,
  upsertPuppyCouponToSupabase,
  savePuppySiteContent,
} from '../lib/supabase';

export type AdType = 'hero_banner' | 'festive_promo' | 'announcement_bar' | 'flash_deal' | 'category_spotlight';

export interface AdCampaign {
  id: string;
  name: string;
  type: AdType;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  category: CategoryId;
  ctaText: string;
  couponCode: string;
  discountBadge: string;
  imageUrl: string;
  accentColor: string; // e.g. "from-amber-500 to-yellow-400"
  themeHue: string;
  status: 'active' | 'paused' | 'scheduled';
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  priority: number;
}

export interface PromoCoupon {
  code: string;
  title: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minCartValue: number;
  expiry: string;
  status: 'active' | 'expired' | 'disabled';
  usageCount: number;
  maxUses: number;
}

export interface SocialMediaConnection {
  facebookConnected: boolean;
  instagramConnected: boolean;
  facebookPageName: string;
  facebookPageUrl: string;
  facebookAdAccountId: string;
  instagramHandle: string;
  instagramProfileUrl: string;
  metaPixelId: string;
  conversionsApiEnabled: boolean;
  autoSyncCatalog: boolean;
  placements: {
    instagramFeed: boolean;
    instagramReels: boolean;
    instagramStories: boolean;
    facebookFeed: boolean;
    facebookMarketplace: boolean;
  };
  lastSyncedAt: string;
  syncedProductsCount: number;
  stats: {
    instagramFollowers: string;
    facebookFollowers: string;
    weeklySocialReach: string;
    socialRoas: string;
  };
}

export const INITIAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad-stylish-kids-banner',
    name: 'Stylish Kids Wear 2026 Collection',
    type: 'hero_banner',
    badge: 'NEW COLLECTION • STYLISH KIDS WEAR',
    title: 'Stylish Kids Wear',
    highlight: 'Comfort for their play. Style for every day.',
    description:
      'Dresses, T-Shirts, Sets, Party Wear crafted with breathable organic cottons and joyful all-day playground comfort.',
    category: 'baby-toddler',
    ctaText: 'Shop Now',
    couponCode: 'PLAYGROW20',
    discountBadge: 'FLAT 40% OFF',
    imageUrl: '/hero-stylish-kids.jpg',
    accentColor: 'from-amber-500 to-yellow-400',
    themeHue: 'amber',
    status: 'active',
    startDate: '01 Oct 2026',
    endDate: '31 Dec 2026',
    budget: 85000,
    spend: 52400,
    impressions: 62000,
    clicks: 4890,
    conversions: 540,
    revenue: 580000,
    priority: 1,
  },
  {
    id: 'ad-playful-kidswear',
    name: 'Joyful Childhood Adventures 2026',
    type: 'hero_banner',
    badge: 'JOYFUL ADVENTURES • NEW COLLECTION',
    title: 'Playful Kidswear',
    highlight: 'Play, Explore, Grow',
    description:
      'Engineered for joyful childhood adventures: ultra-soft organic stretch cottons, durable reinforced knees, and vibrant breathable fits designed for non-stop playground fun.',
    category: 'baby-toddler',
    ctaText: 'Shop Playful Outfits',
    couponCode: 'PLAYGROW20',
    discountBadge: 'FLAT 40% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2560&q=95',
    accentColor: 'from-amber-500 to-yellow-400',
    themeHue: 'amber',
    status: 'active',
    startDate: '01 Oct 2026',
    endDate: '31 Oct 2026',
    budget: 65000,
    spend: 48200,
    impressions: 48500,
    clicks: 3420,
    conversions: 412,
    revenue: 428000,
    priority: 1,
  },
  {
    id: 'ad-big-happiness-sale',
    name: 'Diwali & Festive Carnival Mega Sale',
    type: 'hero_banner',
    badge: 'MEGA CARNIVAL SALE • SPECIAL EVENT',
    title: 'Little Fashion,',
    highlight: 'Big Happiness Sale',
    description:
      'Celebrate every precious childhood milestone with twirling party dresses, sparkling ethnic festive coordinates, handsome boys formal sets, and celebration shoes.',
    category: 'festive-ethnic',
    ctaText: 'Explore Festive Sale',
    couponCode: 'PUPPYFEST',
    discountBadge: 'UP TO 60% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=2560&q=95',
    accentColor: 'from-rose-500 to-pink-400',
    themeHue: 'rose',
    status: 'active',
    startDate: '05 Oct 2026',
    endDate: '05 Nov 2026',
    budget: 95000,
    spend: 78900,
    impressions: 72400,
    clicks: 5890,
    conversions: 684,
    revenue: 812500,
    priority: 2,
  },
  {
    id: 'ad-little-trends-smiles',
    name: 'Little Trends & Sibling Coordinates',
    type: 'hero_banner',
    badge: 'TRENDING FASHION • SIBLING EDITS',
    title: 'Little Trends,',
    highlight: 'Big Smiles Everyday',
    description:
      'Runway-inspired toddler style made comfy: cool denim coordinates, pastel knit cardigans, oversized vintage tees, and adorable matching sibling lounge sets.',
    category: 'girl-fashion',
    ctaText: 'Discover Trends',
    couponCode: 'SMILES15',
    discountBadge: 'STARTING ₹299',
    imageUrl:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2560&q=95',
    accentColor: 'from-sky-500 to-cyan-400',
    themeHue: 'sky',
    status: 'active',
    startDate: '10 Oct 2026',
    endDate: '15 Nov 2026',
    budget: 45000,
    spend: 31200,
    impressions: 39100,
    clicks: 2510,
    conversions: 298,
    revenue: 334000,
    priority: 3,
  },
  {
    id: 'ad-stylish-garden-banner',
    name: 'Botanical Garden Party Collection',
    type: 'hero_banner',
    badge: 'BOTANICAL EDIT • SPRING & SUMMER',
    title: 'Stylish Kids Wear:',
    highlight: 'Garden Party Edit',
    description:
      'Breezy natural linen pinafores, soft floral rompers, botanical print sets, and sun-safe hats crafted especially for sunny picnic afternoons and garden strolls.',
    category: 'casual-wear',
    ctaText: 'Shop Garden Edit',
    couponCode: 'GARDEN35',
    discountBadge: 'FLAT 35% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85',
    accentColor: 'from-emerald-500 to-teal-400',
    themeHue: 'emerald',
    status: 'paused',
    startDate: '15 Sep 2026',
    endDate: '10 Oct 2026',
    budget: 35000,
    spend: 35000,
    impressions: 24200,
    clicks: 1680,
    conversions: 182,
    revenue: 198000,
    priority: 4,
  },
  {
    id: 'ad-diwali-grand-utsav',
    name: 'Diwali 2026 Royal Heritage Utsav',
    type: 'festive_promo',
    badge: 'HERITAGE DIWALI SPECIAL',
    title: 'Pure Zari & Silk Splendor',
    highlight: 'Royal Festive Edit',
    description:
      'Celebrate Diwali in true imperial glory with handcrafted banarasi brocade sherwanis, kanchipuram silk pattu pavadais, and embellished dhoti kurta sets.',
    category: 'festive-ethnic',
    ctaText: 'Shop Diwali Grand Utsav',
    couponCode: 'DIWALI2026',
    discountBadge: 'FLAT 50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
    accentColor: 'from-amber-600 via-rose-700 to-yellow-500',
    themeHue: 'amber',
    status: 'active',
    startDate: '01 Oct 2026',
    endDate: '01 Nov 2026',
    budget: 120000,
    spend: 89400,
    impressions: 89000,
    clicks: 7420,
    conversions: 892,
    revenue: 1245000,
    priority: 1,
  },
  {
    id: 'ad-top-strip-welcome',
    name: 'Global Welcome Ticker Promo',
    type: 'announcement_bar',
    badge: 'NEW CUSTOMER WELCOME',
    title: 'First Order Extra 10% OFF',
    highlight: 'Code: WELCOME10',
    description:
      'Welcome to Voraeclat! Get an extra 10% instant discount on your baby first order with free doorstep delivery.',
    category: 'all',
    ctaText: 'Claim Code',
    couponCode: 'WELCOME10',
    discountBadge: 'EXTRA 10% OFF',
    imageUrl: '',
    accentColor: 'from-slate-900 to-amber-950',
    themeHue: 'slate',
    status: 'active',
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    budget: 20000,
    spend: 12000,
    impressions: 142000,
    clicks: 8900,
    conversions: 1420,
    revenue: 690000,
    priority: 1,
  },
];

export const INITIAL_PROMO_COUPONS: PromoCoupon[] = [
  {
    code: 'PUPPYFIRST',
    title: 'First Customer Welcome Offer',
    discountType: 'percent',
    discountValue: 15,
    minCartValue: 999,
    expiry: '31 Dec 2026',
    status: 'active',
    usageCount: 1420,
    maxUses: 5000,
  },
  {
    code: 'WELCOME10',
    title: 'Mobile Login Welcome Discount',
    discountType: 'percent',
    discountValue: 10,
    minCartValue: 499,
    expiry: '31 Dec 2026',
    status: 'active',
    usageCount: 892,
    maxUses: 10000,
  },
  {
    code: 'CLUB10',
    title: 'VIP Voraeclat Club Exclusive Perks',
    discountType: 'percent',
    discountValue: 20,
    minCartValue: 1499,
    expiry: '31 Dec 2026',
    status: 'active',
    usageCount: 650,
    maxUses: 2000,
  },
  {
    code: 'NEWBORN',
    title: 'Hospital Hamper & Romper Bundle',
    discountType: 'flat',
    discountValue: 300,
    minCartValue: 1999,
    expiry: '15 Nov 2026',
    status: 'active',
    usageCount: 310,
    maxUses: 1000,
  },
  {
    code: 'FESTIVE50',
    title: 'Diwali Festive Mega Saving',
    discountType: 'percent',
    discountValue: 25,
    minCartValue: 2999,
    expiry: '05 Nov 2026',
    status: 'active',
    usageCount: 780,
    maxUses: 2500,
  },
];

const STORAGE_KEY_ADS = 'puppy_shame_ad_campaigns';
const STORAGE_KEY_COUPONS = 'puppy_shame_promo_coupons';

export const getStoredAdCampaigns = (): AdCampaign[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let hasUpgraded = false;
        const map = new Map((parsed as AdCampaign[]).map((c) => [c.id, c]));
        INITIAL_AD_CAMPAIGNS.forEach((initC) => {
          if (!map.has(initC.id)) {
            map.set(initC.id, initC);
            hasUpgraded = true;
          }
        });
        const upgraded = Array.from(map.values()).map((c) => {
          if (c.imageUrl && c.imageUrl.includes('images.unsplash.com') && (c.imageUrl.includes('w=1600') || c.imageUrl.includes('w=800') || c.imageUrl.includes('w=1200'))) {
            hasUpgraded = true;
            return {
              ...c,
              imageUrl: c.imageUrl.replace(/w=\d+(&q=\d+)?/, 'w=2560&q=95'),
            };
          }
          return c;
        });
        if (hasUpgraded) {
          try {
            localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(upgraded));
          } catch {
            // ignore
          }
        }
        return upgraded;
      }
    }
  } catch {
    // fallback
  }
  try {
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(INITIAL_AD_CAMPAIGNS));
  } catch {
    // ignore
  }
  return INITIAL_AD_CAMPAIGNS;
};

export const saveStoredAdCampaigns = (campaigns: AdCampaign[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(campaigns));
    Promise.all(campaigns.map((c) => upsertPuppyAdCampaignToSupabase(c))).catch(console.warn);
  } catch {
    // ignore
  }
};

export const getStoredCoupons = (): PromoCoupon[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  try {
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(INITIAL_PROMO_COUPONS));
  } catch {
    // ignore
  }
  return INITIAL_PROMO_COUPONS;
};

export const saveStoredCoupons = (coupons: PromoCoupon[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
    Promise.all(coupons.map((cp) => upsertPuppyCouponToSupabase(cp))).catch(console.warn);
  } catch {
    // ignore
  }
};

export const INITIAL_SOCIAL_CONNECTION: SocialMediaConnection = {
  facebookConnected: true,
  instagramConnected: true,
  facebookPageName: 'Voraeclat India Official',
  facebookPageUrl: 'https://facebook.com/voraeclatofficial',
  facebookAdAccountId: 'act_4920194820149',
  instagramHandle: '@voraeclat_kids',
  instagramProfileUrl: 'https://instagram.com/voraeclat_kids',
  metaPixelId: '984210948201493',
  conversionsApiEnabled: true,
  autoSyncCatalog: true,
  placements: {
    instagramFeed: true,
    instagramReels: true,
    instagramStories: true,
    facebookFeed: true,
    facebookMarketplace: true,
  },
  lastSyncedAt: 'Today at 12:45 PM',
  syncedProductsCount: 24,
  stats: {
    instagramFollowers: '245K',
    facebookFollowers: '120K',
    weeklySocialReach: '1.4M',
    socialRoas: '4.8x',
  },
};

const STORAGE_KEY_SOCIAL = 'puppy_shame_social_connection';

export const getStoredSocialConnection = (): SocialMediaConnection => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOCIAL);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...INITIAL_SOCIAL_CONNECTION,
          ...parsed,
          placements: {
            ...INITIAL_SOCIAL_CONNECTION.placements,
            ...(parsed.placements || {}),
          },
          stats: {
            ...INITIAL_SOCIAL_CONNECTION.stats,
            ...(parsed.stats || {}),
          },
        };
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_SOCIAL_CONNECTION;
};

export const saveStoredSocialConnection = (connection: SocialMediaConnection): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SOCIAL, JSON.stringify(connection));
    savePuppySiteContent('social_media_connection', connection, 'Facebook & Instagram Integration Settings').catch(console.warn);
    window.dispatchEvent(new Event('social_connection_updated'));
  } catch {
    // ignore
  }
};
