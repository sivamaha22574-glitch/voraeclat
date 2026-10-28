import { SiteBanner, INITIAL_SITE_BANNERS, setCachedSiteBanners } from './siteBanners';
import { AdCampaign, INITIAL_AD_CAMPAIGNS } from './adCampaigns';
import {
  fetchPuppyBannersFromSupabase,
  upsertPuppyBannerToSupabase,
  upsertPuppyAdCampaignToSupabase,
} from '../lib/supabase';

const DB_NAME = 'puppy_shame_persistence_v2';
const STORE_BANNERS = 'site_banners';
const STORE_HERO = 'hero_slides';
const LOCAL_STORAGE_KEY = 'puppy_shame_site_banners';
const LOCAL_STORAGE_ADS = 'puppy_shame_ad_campaigns';

let dbPromise: Promise<IDBDatabase | null> | null = null;
let broadcastChannel: BroadcastChannel | null = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('puppy_shame_banners_sync');
  }
} catch {
  // ignore
}

/**
 * Open IndexedDB with automatic schema migration
 */
function getDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 2);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_BANNERS)) {
            db.createObjectStore(STORE_BANNERS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_HERO)) {
            db.createObjectStore(STORE_HERO, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to LocalStorage');
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

/**
 * Persist site banners to both local cache (IndexedDB + LocalStorage) and Supabase (Cloud Backend)
 */
export async function savePersistentBanners(banners: SiteBanner[]): Promise<void> {
  // 1. Update in-memory cache immediately
  setCachedSiteBanners(banners);

  // 2. Save complete high-definition images to IndexedDB (no 5MB quota ceiling)
  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction([STORE_BANNERS, STORE_HERO], 'readwrite');
      const bannerStore = tx.objectStore(STORE_BANNERS);
      const heroStore = tx.objectStore(STORE_HERO);
      bannerStore.clear();
      heroStore.clear();
      banners.forEach((b) => {
        bannerStore.put(b);
        if (b.group === 'hero') {
          heroStore.put(b);
        }
      });
    }
  } catch (err) {
    console.warn('IndexedDB save warning:', err);
  }

  // 3. Save to LocalStorage with quota protection
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(banners));
  } catch (quotaErr) {
    console.warn('LocalStorage quota reached. Keeping high-res images in IndexedDB:', quotaErr);
    try {
      const safeBanners = banners.map((b) => {
        if (b.imageUrl && b.imageUrl.startsWith('data:') && b.imageUrl.length > 80000) {
          return { ...b, hasIdbImage: true };
        }
        return b;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeBanners));
    } catch {
      // Ignore if localStorage is completely full
    }
  }

  // 4. Dispatch window events and broadcast to other tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('site_banners_updated'));
    window.dispatchEvent(new CustomEvent('hero_banners_synced', { detail: banners }));
    broadcastChannel?.postMessage({ type: 'BANNERS_UPDATED', count: banners.length });
  }

  // 5. Sync asynchronously to Supabase backend
  Promise.all(
    banners.map((b, idx) => upsertPuppyBannerToSupabase(b, idx))
  ).catch((err) => console.warn('Supabase banner sync error:', err));
}

/**
 * Load site banners from IndexedDB / LocalStorage / Supabase
 * Prioritizes local IndexedDB data so user customizations are NEVER overwritten by stale defaults!
 */
export async function loadPersistentBanners(): Promise<SiteBanner[]> {
  // 1. Try loading from IndexedDB FIRST (reliable unlimited local storage)
  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction(STORE_BANNERS, 'readonly');
      const store = tx.objectStore(STORE_BANNERS);
      const req = store.getAll();
      const idbBanners = await new Promise<SiteBanner[]>((resolve) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      if (idbBanners && idbBanners.length > 0) {
        setCachedSiteBanners(idbBanners);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(idbBanners));
        } catch {
          // ignore quota
        }
        return idbBanners;
      }
    }
  } catch (err) {
    console.warn('IndexedDB load warning:', err);
  }

  // 2. Try loading from LocalStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SiteBanner[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCachedSiteBanners(parsed);
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // 3. Fallback to Supabase cloud if local store is uninitialized
  try {
    const remoteBanners = await fetchPuppyBannersFromSupabase();
    if (remoteBanners && remoteBanners.length > 0) {
      setCachedSiteBanners(remoteBanners);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteBanners));
      } catch {
        // ignore
      }
      return remoteBanners;
    }
  } catch (err) {
    console.warn('Supabase banners load notice:', err);
  }

  setCachedSiteBanners(INITIAL_SITE_BANNERS);
  return INITIAL_SITE_BANNERS;
}

/**
 * Synchronize Hero Banners across SiteBanners and AdCampaigns
 * Ensures when an admin edits a hero banner anywhere in the dashboard,
 * both systems remain 100% in sync without shadowing or losing data.
 */
export async function syncHeroSlideUpdate(updatedHeroBanner: SiteBanner): Promise<void> {
  // 1. Update site banners
  const currentBanners = await loadPersistentBanners();
  const existsInBanners = currentBanners.some((b) => b.id === updatedHeroBanner.id);
  const newBanners = existsInBanners
    ? currentBanners.map((b) => (b.id === updatedHeroBanner.id ? updatedHeroBanner : b))
    : [...currentBanners, updatedHeroBanner];

  await savePersistentBanners(newBanners);

  // 2. Mirror into AdCampaigns of type 'hero_banner'
  try {
    const rawAds = localStorage.getItem(LOCAL_STORAGE_ADS);
    const campaigns: AdCampaign[] = rawAds ? JSON.parse(rawAds) : INITIAL_AD_CAMPAIGNS;
    const campaignId = updatedHeroBanner.id.startsWith('banner-')
      ? updatedHeroBanner.id.replace('banner-', 'ad-')
      : `ad-${updatedHeroBanner.id}`;

    const existsInAds = campaigns.some((c) => c.id === campaignId || c.title === updatedHeroBanner.title);
    let updatedCampaigns: AdCampaign[];

    if (existsInAds) {
      updatedCampaigns = campaigns.map((c) => {
        if (c.id === campaignId || c.title === updatedHeroBanner.title) {
          return {
            ...c,
            title: updatedHeroBanner.title,
            imageUrl: updatedHeroBanner.imageUrl,
            badge: updatedHeroBanner.badge,
            ctaText: updatedHeroBanner.buttonText.replace(' →', ''),
            discountBadge: updatedHeroBanner.discountTag || c.discountBadge,
            couponCode: updatedHeroBanner.couponCode || c.couponCode,
          };
        }
        return c;
      });
    } else {
      const newCampaign: AdCampaign = {
        id: campaignId,
        name: updatedHeroBanner.name,
        type: 'hero_banner',
        badge: updatedHeroBanner.badge,
        title: updatedHeroBanner.title,
        highlight: updatedHeroBanner.underText.slice(0, 60),
        description: updatedHeroBanner.underText,
        category: (updatedHeroBanner.buttonLink as any) || 'baby-toddler',
        ctaText: updatedHeroBanner.buttonText.replace(' →', ''),
        couponCode: updatedHeroBanner.couponCode || 'PUPPY20',
        discountBadge: updatedHeroBanner.discountTag || 'SPECIAL OFFER',
        imageUrl: updatedHeroBanner.imageUrl,
        accentColor: updatedHeroBanner.accentColor || 'from-amber-500 to-yellow-400',
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
        priority: 1,
      };
      updatedCampaigns = [newCampaign, ...campaigns];
    }

    localStorage.setItem(LOCAL_STORAGE_ADS, JSON.stringify(updatedCampaigns));
    Promise.all(updatedCampaigns.map((c) => upsertPuppyAdCampaignToSupabase(c))).catch(console.warn);
    window.dispatchEvent(new Event('ad_campaigns_updated'));
  } catch (err) {
    console.warn('AdCampaign sync error:', err);
  }
}
