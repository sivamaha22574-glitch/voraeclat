import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Crown,
  Heart,
  ChevronDown,
  X,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Check,
  Palette,
  Home,
  ShoppingBag,
  User,
  Package,
} from 'lucide-react';
import { Product, CategoryId, AgeGroup, Gender, CartItem, CustomerUser, CustomerOrder } from './types';
import { PRODUCTS, getStoredProducts, saveStoredProducts } from './data/products';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PuppyClubModal } from './components/PuppyClubModal';
import { ParentingHubModal } from './components/ParentingHubModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerLoginModal } from './components/CustomerLoginModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import {
  getStoredCustomer,
  saveStoredCustomer,
  getStoredOrders,
  appendCustomerOrder,
} from './data/sampleOrders';
import { Footer } from './components/Footer';
import { FilterSidebar, FilterValues } from './components/FilterSidebar';
import { FranchisePartnerPage } from './components/FranchisePartnerPage';
import { CategoryHeaderBanner } from './components/CategoryHeaderBanner';
import { HomePage } from './components/HomePage';
import { ContactPage } from './components/ContactPage';
import { DiwaliCollectionBanner } from './components/DiwaliCollectionBanner';
import { BoySubcategoriesShowcase } from './components/BoySubcategoriesShowcase';
import { GirlSubcategoriesShowcase } from './components/GirlSubcategoriesShowcase';
import { BabySubcategoriesShowcase } from './components/BabySubcategoriesShowcase';
import { CollectionsSubcategoriesShowcase } from './components/CollectionsSubcategoriesShowcase';
import { BgTheme, getThemeDisplayName } from './components/Header';
import { ThemeModal } from './components/ThemeModal';
import { AdminPortal } from './components/admin/AdminPortal';
import {
  fetchPuppyOrdersFromSupabase,
  insertPuppyOrderToSupabase,
  updatePuppyOrderStatusInSupabase,
  fetchPuppyProductsFromSupabase,
  upsertPuppyProductToSupabase,
  fetchPuppyCouponsFromSupabase,
  validatePuppyCouponInSupabase,
  upsertPuppyCustomerToSupabase,
} from './lib/supabase';
import { PromoCoupon } from './data/adCampaigns';
import { loadPersistentBanners } from './data/bannerStorage';

export const CURATED_COLLECTIONS_SUBCATEGORIES = [
  'Diwali 2026 Collection',
  'Navratri Utsav',
  'Halloween Collection',
  'Rainwear Collection',
  'Multi-packs',
  'Bestsellers',
  'Baby Essentials',
];

const STORAGE_KEY_CART = 'puppy_shame_cart_items';
const STORAGE_KEY_WISHLIST = 'puppy_shame_wishlist_items';

export default function App() {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'contact' | 'franchise' | 'admin'>('home');
  const [bgTheme, setBgTheme] = useState<BgTheme>(() => {
    try {
      const saved = localStorage.getItem('puppy_overall_theme') as BgTheme;
      const validThemes: BgTheme[] = [
        'clean-slate',
        'festive-gold',
        'feb14-valentine',
        'tamil-newyear',
        'newyear-gala',
        'pongal-harvest',
        'navratri-utsav',
        'christmas-winter',
        'rose-blush',
        'ocean-breeze',
        'lavender-dream',
        'modern-dark',
      ];
      if (saved && validThemes.includes(saved)) {
        return saved;
      }
    } catch {
      // ignore in iframe
    }
    return 'clean-slate';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Hash Routing Listener for Admin Portal & Direct Links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash.startsWith('#admin') ||
        hash.startsWith('#dashboard') ||
        hash.startsWith('#ads') ||
        hash.startsWith('#ad-dashboard') ||
        hash.startsWith('#campaigns')
      ) {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home') {
        setCurrentPage('home');
      } else if (hash === '#franchise') {
        setCurrentPage('franchise');
      } else if (hash === '#contact') {
        setCurrentPage('contact');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Warm up and sync site banners from IndexedDB on initial boot
  useEffect(() => {
    loadPersistentBanners().catch(console.warn);
  }, []);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('festive-ethnic');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('all');
  const [selectedGender, setSelectedGender] = useState<Gender>('all');
  const [clubOnly, setClubOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating' | 'discount'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deliveryPincode, setDeliveryPincode] = useState<string>('400001');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);

  // Advanced FirstCry Filter Sidebar State
  const [sidebarFilters, setSidebarFilters] = useState<FilterValues>({
    genders: [],
    ages: [],
    categories: [],
    subCategories: [],
    brands: [],
    colors: [],
    minPrice: 0,
    maxPrice: 15000,
    minRating: 0,
    minDiscount: 0,
    discountRanges: [],
    clubOnly: false,
  });

  // Dynamic Product Catalog State (persisted across admin additions & edits)
  const [allProducts, setAllProducts] = useState<Product[]>(() => getStoredProducts());

  // Keep catalog synced across windows and tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'puppy_shame_custom_products') {
        const stored = getStoredProducts();
        if (stored && stored.length > 0) {
          setAllProducts(stored);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // E-commerce Functional State (starts empty - items are only added on user action)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isClubMember, setIsClubMember] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist user-added cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }, [cartItems]);

  // Persist user-saved wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to storage:', e);
    }
  }, [wishlist]);

  // Modal / Drawer visibility
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState<boolean>(false);
  const [isParentingHubOpen, setIsParentingHubOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Customer Login & Order History State
  const [customer, setCustomer] = useState<CustomerUser | null>(() => getStoredCustomer());
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => getStoredOrders());
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState<boolean>(false);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState<boolean>(false);
  const [customerLoginIntent, setCustomerLoginIntent] = useState<'orders' | 'general' | 'checkout'>('general');

  const [activeCoupons, setActiveCoupons] = useState<PromoCoupon[]>([]);
  const [appliedCouponDetails, setAppliedCouponDetails] = useState<PromoCoupon | null>(null);

  // Sync with live Supabase database on mount: Products, Orders, Coupons
  useEffect(() => {
    // 1. Fetch live product catalog from Supabase
    fetchPuppyProductsFromSupabase().then((remoteProducts) => {
      if (remoteProducts && remoteProducts.length > 0) {
        setAllProducts(remoteProducts);
        saveStoredProducts(remoteProducts);
      }
    });

    // 2. Fetch live customer orders from Supabase
    fetchPuppyOrdersFromSupabase().then((remoteOrders) => {
      if (remoteOrders) {
        setCustomerOrders(remoteOrders);
        try {
          localStorage.setItem('voraeclat_customer_orders', JSON.stringify(remoteOrders));
          localStorage.removeItem('puppy_shame_customer_orders');
        } catch {
          // ignore
        }
      }
    });

    // 3. Fetch live active coupons from Supabase
    fetchPuppyCouponsFromSupabase().then((coupons) => {
      if (coupons && coupons.length > 0) {
        setActiveCoupons(coupons);
      }
    });
  }, []);

  const handleOpenCustomerLogin = (intent: 'orders' | 'general' | 'checkout' = 'general') => {
    setCustomerLoginIntent(intent);
    setIsCustomerLoginOpen(true);
  };

  const handleOpenAccountOrOrders = () => {
    if (customer && customer.isLoggedIn) {
      setIsCustomerAccountOpen(true);
    } else {
      setCustomerLoginIntent('orders');
      setIsCustomerLoginOpen(true);
      showToast('Please log in with your Mail ID & Mobile number to check orders');
    }
  };

  const handleLoginSuccess = (user: CustomerUser) => {
    setCustomer(user);
    saveStoredCustomer(user);
    upsertPuppyCustomerToSupabase(user).catch(console.warn);
    showToast(`Welcome ${user.name || user.mobile}! 10% OFF code WELCOME10 unlocked ✨`);
    if (customerLoginIntent === 'orders') {
      setIsCustomerAccountOpen(true);
    }
  };

  const handleLogoutCustomer = () => {
    saveStoredCustomer(null);
    setCustomer(null);
    setIsCustomerAccountOpen(false);
    showToast('Logged out successfully.');
  };

  const handleUpdateCustomer = (updated: CustomerUser) => {
    setCustomer(updated);
    saveStoredCustomer(updated);
    upsertPuppyCustomerToSupabase(updated).catch(console.warn);
    showToast('Profile and address updated successfully!');
  };

  const handleOrderPlaced = (newOrder: CustomerOrder) => {
    const updated = appendCustomerOrder(newOrder);
    setCustomerOrders(updated);
    showToast(`Order #${newOrder.orderId} placed! Tracking details generated.`);
    // Asynchronously sync to Supabase puppy_orders
    insertPuppyOrderToSupabase(newOrder).catch((err) => {
      console.warn('Failed to sync placed order to Supabase:', err);
    });
  };

  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      const foundProduct = allProducts.find((p) => p.id === item.productId) || allProducts[0] || PRODUCTS[0];
      handleAddToCart(
        foundProduct,
        item.size,
        foundProduct.colors.find((c) => c.name === item.color) || foundProduct.colors[0]
      );
    });
    setIsCustomerAccountOpen(false);
    setIsCartOpen(true);
    showToast(`Added items from Order #${order.orderId} to your bag!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: { name: string; hex: string }
  ) => {
    const finalSize =
      size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const finalColor =
      color ||
      (product.colors && product.colors.length > 0
        ? product.colors[0]
        : { name: 'Standard', hex: '#1E293B' });

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === finalSize &&
          i.selectedColor.name === finalColor.name
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [
        ...prev,
        { product, quantity: 1, selectedSize: finalSize, selectedColor: finalColor },
      ];
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to bag!`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from shopping bag');
  };

  const handleToggleWishlist = (product: Product) => {
    const isSaved = wishlist.some((p) => p.id === product.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Removed from saved wishlist');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to your wishlist! ❤️');
    }
  };

  const handleMoveWishlistToBag = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'Standard', product.colors[0]);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Coupon Engine: Validates against live Supabase backend
  const handleApplyCoupon = async (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return false;

    try {
      const result = await validatePuppyCouponInSupabase(normalized, rawCartTotal);
      if (result.valid) {
        setAppliedCoupon(normalized);
        if (result.coupon) setAppliedCouponDetails(result.coupon);
        showToast(result.message);
        return true;
      } else {
        // Fallback for offline or fast responses
        if (normalized === 'WELCOME10' || normalized === 'PUPPYFIRST' || normalized === 'CLUB10' || normalized === 'NEWBORN' || normalized === 'FESTIVE50') {
          setAppliedCoupon(normalized);
          showToast(`Coupon ${normalized} applied!`);
          return true;
        }
        showToast(result.message || 'Invalid coupon code');
        return false;
      }
    } catch {
      setAppliedCoupon(normalized);
      showToast(`Coupon ${normalized} applied!`);
      return true;
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setAppliedCouponDetails(null);
    showToast('Coupon removed');
  };

  const rawCartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCouponDetails) {
      if (appliedCouponDetails.discountType === 'percent') {
        return Math.round((rawCartTotal * appliedCouponDetails.discountValue) / 100);
      }
      return Math.min(rawCartTotal, appliedCouponDetails.discountValue);
    }
    // Instant fallback values
    if (appliedCoupon === 'WELCOME10') return Math.round(rawCartTotal * 0.1);
    if (appliedCoupon === 'PUPPYFIRST') return Math.round(rawCartTotal * 0.15);
    if (appliedCoupon === 'CLUB10') return Math.round(rawCartTotal * 0.2);
    if (appliedCoupon === 'NEWBORN') return Math.min(rawCartTotal, 300);
    if (appliedCoupon === 'FESTIVE50') return Math.round(rawCartTotal * 0.25);
    return 0;
  }, [appliedCoupon, appliedCouponDetails, rawCartTotal]);

  const handleJoinClub = (planId: string) => {
    setIsClubMember(true);
    setIsClubModalOpen(false);
    showToast('🎉 Congratulations! You are now a VIP Voraeclat Club Member!');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Top Bar Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'festive-ethnic') {
          // Shop by Collection curated mode: include festive-ethnic products OR any product matching the 7 curated collections
          const isCuratedMatch =
            product.categoryId === 'festive-ethnic' ||
            CURATED_COLLECTIONS_SUBCATEGORIES.some(
              (col) =>
                product.subCategory.toLowerCase() === col.toLowerCase() ||
                product.name.toLowerCase().includes(col.toLowerCase()) ||
                (col === 'Multi-packs' && (product.subCategory.toLowerCase().includes('pack') || product.name.toLowerCase().includes('pack'))) ||
                (col === 'Halloween Collection' && (product.subCategory.toLowerCase().includes('halloween') || product.name.toLowerCase().includes('pumpkin'))) ||
                (col === 'Rainwear Collection' && (product.subCategory.toLowerCase().includes('rain') || product.name.toLowerCase().includes('waterproof'))) ||
                (col === 'Bestsellers' && (product.subCategory.toLowerCase().includes('bestseller') || product.tag === 'Best Seller')) ||
                (col === 'Baby Essentials' && (product.subCategory.toLowerCase().includes('baby essentials') || ['baby-toddler', 'diapering', 'feeding', 'bath-skin'].includes(product.categoryId)))
            );
          if (!isCuratedMatch) {
            return false;
          }
        } else if (product.categoryId !== activeCategory) {
          return false;
        }
      }

      // 2. SubCategories filter from sidebar & quick pills
      if (sidebarFilters.subCategories.length > 0) {
        const matchesSub = sidebarFilters.subCategories.some((sub) => {
          const subLower = sub.toLowerCase();
          const pSubLower = product.subCategory.toLowerCase();
          const pNameLower = product.name.toLowerCase();
          const pDescLower = product.description.toLowerCase();

          // Direct exact or substring match
          if (pSubLower === subLower || pSubLower.includes(subLower) || subLower.includes(pSubLower)) {
            return true;
          }

          // Curated collections specific rules
          if (subLower.includes('diwali')) {
            return (
              pSubLower.includes('diwali') ||
              pNameLower.includes('diwali') ||
              pDescLower.includes('diwali') ||
              product.categoryId === 'festive-ethnic'
            );
          }
          if (subLower.includes('navratri')) {
            return (
              pSubLower.includes('navratri') ||
              pNameLower.includes('navratri') ||
              pDescLower.includes('navratri') ||
              pNameLower.includes('chaniya') ||
              pNameLower.includes('garba')
            );
          }
          if (subLower.includes('halloween')) {
            return (
              pSubLower.includes('halloween') ||
              pNameLower.includes('halloween') ||
              pDescLower.includes('halloween') ||
              pNameLower.includes('pumpkin')
            );
          }
          if (subLower.includes('rainwear')) {
            return (
              pSubLower.includes('rainwear') ||
              pNameLower.includes('rain') ||
              pDescLower.includes('waterproof') ||
              pDescLower.includes('raincoat')
            );
          }
          if (subLower.includes('multi-pack')) {
            return (
              pSubLower.includes('multi-pack') ||
              pNameLower.includes('pack') ||
              pDescLower.includes('pack of 5') ||
              pDescLower.includes('pack')
            );
          }
          if (subLower.includes('bestseller')) {
            return (
              pSubLower.includes('bestseller') ||
              product.tag === 'Best Seller' ||
              product.rating >= 4.8
            );
          }
          if (subLower.includes('baby essentials')) {
            return (
              pSubLower.includes('baby essentials') ||
              ['baby-toddler', 'diapering', 'feeding', 'bath-skin'].includes(product.categoryId)
            );
          }

          // Subitem word / token matching
          const tokens = subLower.split(/[\s/&,-]+/).filter((t) => t.length > 2);
          if (
            tokens.length > 0 &&
            tokens.some(
              (t) =>
                pNameLower.includes(t) ||
                pDescLower.includes(t) ||
                pSubLower.includes(t)
            )
          ) {
            return true;
          }

          return (
            product.categoryName.toLowerCase().includes(subLower) ||
            pNameLower.includes(subLower)
          );
        });
        if (!matchesSub) return false;
      }

      // 3. Age filter (from Top ShopByAge OR Sidebar multi-select)
      if (selectedAge !== 'all' && !product.ageGroup.includes(selectedAge) && !product.ageGroup.includes('all')) {
        return false;
      }
      if (sidebarFilters.ages.length > 0) {
        const matchesAge = product.ageGroup.some(
          (a) => sidebarFilters.ages.includes(a) || a === 'all'
        );
        if (!matchesAge) return false;
      }

      // 4. Gender filter (from Top OR Sidebar)
      if (selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'unisex') {
        return false;
      }
      if (sidebarFilters.genders.length > 0) {
        if (!sidebarFilters.genders.includes(product.gender as any) && product.gender !== 'unisex') {
          return false;
        }
      }

      // 5. Brands filter from sidebar
      if (sidebarFilters.brands.length > 0) {
        const matchesBrand = sidebarFilters.brands.some(
          (b) =>
            product.brand.toLowerCase().includes(b.toLowerCase()) ||
            b.toLowerCase().includes(product.brand.toLowerCase())
        );
        if (!matchesBrand) return false;
      }

      // 6. Colors filter from sidebar
      if (sidebarFilters.colors.length > 0) {
        const matchesColor = product.colors.some((col) =>
          sidebarFilters.colors.some((sc) => {
            const scLower = sc.toLowerCase();
            const colLower = col.name.toLowerCase();
            if (colLower.includes(scLower) || scLower.includes(colLower)) return true;
            if (sc === 'Blue' && (colLower.includes('navy') || colLower.includes('denim') || colLower.includes('sky'))) return true;
            if (sc === 'Pink' && (colLower.includes('rose') || colLower.includes('blush') || colLower.includes('rani'))) return true;
            if (sc === 'Yellow' && (colLower.includes('oat') || colLower.includes('gold') || colLower.includes('buttercup') || colLower.includes('lemon'))) return true;
            if (sc === 'Green' && (colLower.includes('mint') || colLower.includes('sage') || colLower.includes('olive') || colLower.includes('emerald'))) return true;
            if (sc === 'White' && (colLower.includes('cream') || colLower.includes('cloud') || colLower.includes('pure'))) return true;
            if (sc.includes('Red') && (colLower.includes('maroon') || colLower.includes('red') || colLower.includes('coral'))) return true;
            if (sc.includes('Orange') && (colLower.includes('amber') || colLower.includes('safari') || colLower.includes('beech') || colLower.includes('mustard') || colLower.includes('sand'))) return true;
            if (sc.includes('Purple') && (colLower.includes('lilac') || colLower.includes('purple'))) return true;
            if (sc.includes('Black') && (colLower.includes('black') || colLower.includes('charcoal') || colLower.includes('graphite'))) return true;
            return false;
          })
        );
        if (!matchesColor) return false;
      }

      // 7. Club only filter
      if ((clubOnly || sidebarFilters.clubOnly) && product.tag !== 'Club Choice' && product.clubPrice >= product.price) {
        return false;
      }

      // 8. Price filter
      const effectiveMaxPrice = Math.min(maxPrice, sidebarFilters.maxPrice);
      if (product.price > effectiveMaxPrice) {
        return false;
      }
      if (sidebarFilters.minPrice > 0 && product.price < sidebarFilters.minPrice) {
        return false;
      }

      // 9. Discount filter
      if (sidebarFilters.minDiscount > 0 && product.discountPercent < sidebarFilters.minDiscount) {
        return false;
      }
      if (sidebarFilters.discountRanges && sidebarFilters.discountRanges.length > 0) {
        const matchesRange = sidebarFilters.discountRanges.some((rangeId) => {
          if (rangeId === '10-30') return product.discountPercent >= 10 && product.discountPercent <= 30;
          if (rangeId === '30-50') return product.discountPercent > 30 && product.discountPercent <= 50;
          if (rangeId === '50-70') return product.discountPercent > 50 && product.discountPercent <= 70;
          if (rangeId === '70-above') return product.discountPercent > 70;
          return false;
        });
        if (!matchesRange) return false;
      }

      // 10. Rating filter
      const effectiveMinRating = Math.max(minRating, sidebarFilters.minRating);
      if (effectiveMinRating > 0 && product.rating < effectiveMinRating) {
        return false;
      }

      // 11. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        const matchesSub = product.subCategory.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSub && !matchesDesc) {
          const tokens = q.split(/[\s/&,-]+/).filter((t) => t.length > 2);
          const hasTokenMatch = tokens.length > 0 && tokens.some(
            (token) =>
              product.name.toLowerCase().includes(token) ||
              product.subCategory.toLowerCase().includes(token) ||
              product.description.toLowerCase().includes(token)
          );
          if (!hasTokenMatch) return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return b.reviewCount - a.reviewCount; // popular default
    });
  }, [activeCategory, selectedAge, selectedGender, clubOnly, maxPrice, minRating, sortBy, searchQuery, sidebarFilters, allProducts]);

  const categoryNamesMap: Record<string, string> = {
    'festive-ethnic': 'Shop By Collection • Curated Edits',
    'boy-fashion': 'Boy Fashion',
    'girl-fashion': 'Girl Fashion',
    'baby-toddler': 'Baby & Toddler (0-24M)',
    'casual-wear': 'Casual & Daily',
    'footwear-accessories': 'Footwear & Accessories',
    'toys-learning': 'Toys & Games',
    'diapering': 'Diapers & Wipes',
    'feeding': 'Feeding & Nursing',
    'bath-skin': 'Bath & Skin Care',
    'nursery-gear': 'Cribs & Strollers',
    'books-library': 'Books & Library',
    'health-safety': 'Health & Safety',
    'moms-maternity': 'Moms & Maternity',
  };

  const hasActiveFilters =
    selectedAge !== 'all' ||
    selectedGender !== 'all' ||
    clubOnly ||
    maxPrice < 15000 ||
    minRating > 0 ||
    searchQuery !== '' ||
    sidebarFilters.genders.length > 0 ||
    sidebarFilters.ages.length > 0 ||
    sidebarFilters.subCategories.length > 0 ||
    sidebarFilters.brands.length > 0 ||
    sidebarFilters.colors.length > 0 ||
    sidebarFilters.maxPrice < 15000 ||
    sidebarFilters.minPrice > 0 ||
    sidebarFilters.minDiscount > 0 ||
    (sidebarFilters.discountRanges && sidebarFilters.discountRanges.length > 0) ||
    sidebarFilters.minRating > 0 ||
    sidebarFilters.clubOnly;

  const activeCategoryName = useMemo(() => {
    if (searchQuery.trim()) return `Search Results for "${searchQuery}"`;
    if (activeCategory === 'festive-ethnic') return 'Shop By Collection • Curated Edits';
    const found = allProducts.find((p) => p.categoryId === activeCategory);
    if (found) return found.categoryName;
    return categoryNamesMap[activeCategory] || 'Category Collection';
  }, [activeCategory, searchQuery, allProducts]);

  const activeCategorySubCategories = useMemo(() => {
    if (activeCategory === 'festive-ethnic') {
      return CURATED_COLLECTIONS_SUBCATEGORIES;
    }
    return Array.from(
      new Set(allProducts.filter((p) => p.categoryId === activeCategory).map((p) => p.subCategory))
    ).filter(Boolean);
  }, [activeCategory, allProducts]);

  const handleToggleSubCategory = (sub: string) => {
    setSidebarFilters((prev) => {
      const exists = prev.subCategories.includes(sub);
      return {
        ...prev,
        subCategories: exists
          ? prev.subCategories.filter((s) => s !== sub)
          : [...prev.subCategories, sub],
      };
    });
  };

  const handleSelectBoyFashionItem = (item: string, type: string) => {
    setSelectedGender('boy');
    setActiveCategory('boy-fashion');
    setCurrentPage('shop');

    if (type === 'price') {
      const match = item.match(/\d+/);
      if (match) {
        setMaxPrice(parseInt(match[0], 10));
      }
      setSelectedSubCategory(null);
      setSearchQuery('');
      showToast(`Showing Boy Fashion under ₹${match ? match[0] : item}`);
    } else if (type === 'age') {
      if (item.includes('0-3') || item.includes('New Born') || item.includes('Preemie')) {
        setSelectedAge('0-3M');
      } else if (item.includes('3-6')) {
        setSelectedAge('3-6M');
      } else if (item.includes('6-9') || item.includes('9-12')) {
        setSelectedAge('6-12M');
      } else if (item.includes('12-18') || item.includes('18-24')) {
        setSelectedAge('1-2Y');
      } else if (item.includes('2 to 4')) {
        setSelectedAge('2-4Y');
      } else if (item.includes('4 to 6')) {
        setSelectedAge('4-6Y');
      } else if (item.includes('6 to 8')) {
        setSelectedAge('6-8Y');
      } else if (item.includes('8+')) {
        setSelectedAge('8+Y');
      }
      setSelectedSubCategory(null);
      setSearchQuery('');
      showToast(`Filtered Boy Fashion for age: ${item}`);
    } else if (type === 'footwear') {
      setActiveCategory('footwear-accessories');
      setSelectedSubCategory(item);
      setSearchQuery(item);
      showToast(`Showing Boy Footwear: ${item}`);
    } else if (type === 'collection') {
      if (item === 'Baby Essentials') {
        setActiveCategory('baby-toddler');
        setSelectedGender('unisex');
        setSelectedSubCategory('Baby Essentials');
        setSearchQuery('');
        showToast('Showing Baby Essentials (0-24M)');
      } else if (item.includes('Diwali')) {
        setActiveCategory('festive-ethnic');
        setSelectedSubCategory('Diwali 2026 Collection');
        setSearchQuery('Diwali');
        showToast('Showing Diwali 2026 Collection');
      } else {
        setSelectedSubCategory(item);
        setSearchQuery(item);
        showToast(`Showing Collection: ${item}`);
      }
    } else {
      // category / subcategory
      if (item === 'all') {
        setSelectedSubCategory(null);
        setSearchQuery('');
        setSidebarFilters((prev) => ({ ...prev, subCategories: [] }));
        showToast('Showing All Boy Fashion');
      } else {
        setSelectedSubCategory(item);
        setSearchQuery(item);
        showToast(`Showing Boy Fashion: ${item}`);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGirlFashionItem = (
    item: string,
    type: 'category' | 'collection' | 'accessory' | 'footwear' | 'age' | 'price' | 'brand'
  ) => {
    setSelectedGender('girl');
    setActiveCategory('girl-fashion');
    setCurrentPage('shop');

    if (type === 'price') {
      const match = item.match(/\d+/);
      if (match) {
        setMaxPrice(parseInt(match[0], 10));
      }
      setSelectedSubCategory(null);
      setSearchQuery('');
      showToast(`Showing Girl Fashion under ₹${match ? match[0] : item}`);
    } else if (type === 'age') {
      if (item.includes('0-3') || item.includes('New Born') || item.includes('Preemie')) {
        setSelectedAge('0-3M');
      } else if (item.includes('3-6')) {
        setSelectedAge('3-6M');
      } else if (item.includes('6-9') || item.includes('9-12')) {
        setSelectedAge('6-12M');
      } else if (item.includes('12-18') || item.includes('18-24')) {
        setSelectedAge('1-2Y');
      } else if (item.includes('2 to 4')) {
        setSelectedAge('2-4Y');
      } else if (item.includes('4 to 6')) {
        setSelectedAge('4-6Y');
      } else if (item.includes('6 to 8')) {
        setSelectedAge('6-8Y');
      } else if (item.includes('8+')) {
        setSelectedAge('8+Y');
      }
      setSelectedSubCategory(null);
      setSearchQuery('');
      showToast(`Filtered Girl Fashion for age: ${item}`);
    } else if (type === 'footwear') {
      setActiveCategory('footwear-accessories');
      setSelectedSubCategory(item);
      setSearchQuery(item);
      showToast(`Showing Girl Footwear: ${item}`);
    } else if (type === 'collection') {
      if (item === 'Baby Essentials') {
        setActiveCategory('baby-toddler');
        setSelectedGender('unisex');
        setSelectedSubCategory('Baby Essentials');
        setSearchQuery('');
        showToast('Showing Baby Essentials (0-24M)');
      } else if (item.includes('Diwali')) {
        setActiveCategory('festive-ethnic');
        setSelectedSubCategory('Diwali 2026 Collection');
        setSearchQuery('Diwali');
        showToast('Showing Diwali 2026 Collection');
      } else {
        setSelectedSubCategory(item);
        setSearchQuery(item);
        showToast(`Showing Collection: ${item}`);
      }
    } else {
      if (item === 'all') {
        setSelectedSubCategory(null);
        setSearchQuery('');
        setSidebarFilters((prev) => ({ ...prev, subCategories: [] }));
        showToast('Showing All Girl Fashion');
      } else {
        setSelectedSubCategory(item);
        setSearchQuery(item);
        showToast(`Showing Girl Fashion: ${item}`);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubCategory = (category: CategoryId, subCategory: string) => {
    setActiveCategory(category);
    setCurrentPage('shop');

    if (category === 'girl-fashion') {
      setSelectedGender('girl');
    } else if (category === 'boy-fashion') {
      setSelectedGender('boy');
    }

    if (subCategory === 'all' || subCategory.startsWith('View All')) {
      setSelectedSubCategory(null);
      setSidebarFilters((prev) => ({ ...prev, subCategories: [] }));
      setSearchQuery('');
      showToast(`Showing all ${categoryNamesMap[category] || 'products'}`);
    } else {
      setSelectedSubCategory(subCategory);
      setSidebarFilters((prev) => ({ ...prev, subCategories: [subCategory] }));
      setSearchQuery('');
      showToast(`Selected subcategory: ${subCategory}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedAge('all');
    setSelectedGender('all');
    setSelectedSubCategory(null);
    setClubOnly(false);
    setMaxPrice(15000);
    setMinRating(0);
    setSearchQuery('');
    setSidebarFilters({
      genders: [],
      ages: [],
      categories: [],
      subCategories: [],
      brands: [],
      colors: [],
      minPrice: 0,
      maxPrice: 15000,
      minRating: 0,
      minDiscount: 0,
      discountRanges: [],
      clubOnly: false,
    });
    showToast('All filters cleared');
  };

  const handleUpdateTheme = (newTheme: BgTheme) => {
    setBgTheme(newTheme);
    try {
      localStorage.setItem('puppy_overall_theme', newTheme);
    } catch {
      // ignore
    }
    showToast(`Overall theme set to ${getThemeDisplayName(newTheme)}! ✨`);
  };

  // Dynamic Overall Theme Styling Classes across whole site
  const getThemeWrapperClass = () => {
    switch (bgTheme) {
      case 'feb14-valentine':
        return 'bg-gradient-to-b from-[#fff1f4] via-[#ffe4e9] to-[#ffd1dc]/40 text-rose-950 selection:bg-rose-500 selection:text-white';
      case 'tamil-newyear':
        return 'bg-gradient-to-b from-[#fefce8] via-[#fef9c3] to-[#fef08a]/40 text-amber-950 selection:bg-amber-400 selection:text-slate-950';
      case 'newyear-gala':
        return 'bg-gradient-to-b from-[#0b1329] via-[#0f1d3f] to-[#162a56] text-amber-100 selection:bg-yellow-400 selection:text-slate-950';
      case 'pongal-harvest':
        return 'bg-gradient-to-b from-[#f0fdf4] via-[#fefce8] to-[#fef3c7]/60 text-emerald-950 selection:bg-amber-400 selection:text-slate-950';
      case 'christmas-winter':
        return 'bg-gradient-to-b from-[#fef2f2] via-[#fdf4f4] to-[#f0fdf4]/50 text-red-950 selection:bg-red-500 selection:text-white';
      case 'navratri-utsav':
        return 'bg-gradient-to-b from-[#fdf4ff] via-[#fce7f3] to-[#fae8ff]/60 text-purple-950 selection:bg-fuchsia-500 selection:text-white';
      case 'festive-gold':
        return 'bg-gradient-to-b from-[#fffaf0] via-[#fff4e0] to-[#fbf0da] text-amber-950 selection:bg-amber-400 selection:text-slate-950';
      case 'rose-blush':
        return 'bg-gradient-to-b from-[#fff1f2] via-[#fff5f6] to-[#fee2e2]/40 text-slate-900 selection:bg-rose-200 selection:text-rose-950';
      case 'ocean-breeze':
        return 'bg-gradient-to-b from-[#f0fdfa] via-[#f3fdfb] to-[#ccfbf1]/40 text-slate-900 selection:bg-teal-200 selection:text-teal-950';
      case 'lavender-dream':
        return 'bg-gradient-to-b from-[#faf5ff] via-[#fbf7fe] to-[#f3e8ff]/40 text-slate-900 selection:bg-purple-200 selection:text-purple-950';
      case 'modern-dark':
        return 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950';
      case 'clean-slate':
      default:
        return 'bg-slate-50 text-slate-800 selection:bg-amber-100 selection:text-amber-900';
    }
  };

  if (currentPage === 'admin') {
    return (
      <div data-theme="clean-slate" className="min-h-screen">
        <AdminPortal
          onBackToStore={() => {
            setCurrentPage('home');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          orders={customerOrders}
          onUpdateOrders={(updated) => {
            setCustomerOrders(updated);
            try {
              localStorage.setItem('puppy_shame_customer_orders', JSON.stringify(updated));
            } catch {
              // ignore
            }
            // Sync status changes to Supabase puppy_orders
            updated.forEach((ord) => {
              updatePuppyOrderStatusInSupabase(ord.orderId, ord.status);
            });
          }}
          currentCustomer={customer}
          products={allProducts}
          onUpdateProducts={(updated) => {
            setAllProducts(updated);
            saveStoredProducts(updated);
            Promise.all(updated.map((p) => upsertPuppyProductToSupabase(p))).catch(console.warn);
          }}
          onPreviewCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentPage('shop');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div
      data-theme={bgTheme}
      className={`min-h-screen flex flex-col pb-16 md:pb-0 transition-colors duration-300 ${getThemeWrapperClass()}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        cartTotal={rawCartTotal}
        activeCategory={activeCategory}
        currentPage={currentPage}
        currentBgTheme={bgTheme}
        onChangeBgTheme={handleUpdateTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={() => {
          setCurrentPage('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFranchise={() => {
          setCurrentPage('franchise');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setCurrentPage('admin');
          window.location.hash = '#admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) setCurrentPage('shop');
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenClubModal={() => setIsClubModalOpen(true)}
        onOpenParentingHub={() => setIsParentingHubOpen(true)}
        deliveryPincode={deliveryPincode}
        onChangePincode={setDeliveryPincode}
        isClubMember={isClubMember}
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={handleSelectSubCategory}
        onSelectBoyFashionItem={(item, type) => {
          setCurrentPage('shop');
          handleSelectBoyFashionItem(item, type);
        }}
        onSelectGirlFashionItem={(item, type) => {
          setCurrentPage('shop');
          handleSelectGirlFashionItem(item, type);
        }}
        customer={customer}
        onOpenCustomerLogin={() => handleOpenCustomerLogin('general')}
        onOpenCustomerAccount={handleOpenAccountOrOrders}
        ordersCount={customerOrders.length}
      />

      {/* Page Routing: Franchise vs Contact vs Home vs Category Store */}
      {currentPage === 'franchise' ? (
        <FranchisePartnerPage
          onBackToStore={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'contact' ? (
        <ContactPage
          onBackToHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenFranchise={() => {
            setCurrentPage('franchise');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStore={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'home' ? (
        <HomePage
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenClubModal={() => setIsClubModalOpen(true)}
          onApplyCoupon={(code) => {
            handleApplyCoupon(code);
            setIsCartOpen(true);
          }}
          selectedAge={selectedAge}
          onSelectAge={(age) => {
            setSelectedAge(age);
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectGender={(g) => {
            setSelectedGender(g);
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSearchTag={(tag) => {
            setSearchQuery(tag);
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenFranchise={() => {
            setCurrentPage('franchise');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => {
            setCurrentPage('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreShop={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          onSelectSubCategory={(cat, sub) => handleSelectSubCategory(cat, sub)}
        />
      ) : (
        /* =====================================================================
           CATEGORY MENU WISE VIEW: Dedicated Category Products & Filters
           ===================================================================== */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200">
          {/* Diwali 2026 Festive Hero Banner */}
          {(activeCategory === 'girl-fashion' ||
            selectedSubCategory === 'Diwali 2026' ||
            selectedSubCategory?.includes('Diwali') ||
            searchQuery.toLowerCase().includes('diwali')) && (
            <DiwaliCollectionBanner
              activeFilter={selectedSubCategory || searchQuery}
              onSelectCategoryFilter={(filterName) => {
                handleSelectSubCategory('girl-fashion', filterName);
              }}
              onShopNow={() => {
                handleSelectSubCategory('girl-fashion', 'Diwali 2026');
              }}
            />
          )}

          {/* Boy Subcategories (0-14Y) • Showcase & Instant Purchase */}
          {activeCategory !== 'girl-fashion' &&
            (activeCategory === 'boy-fashion' ||
              (selectedGender === 'boy' &&
                selectedSubCategory &&
                [
                  'Festive & Kurta Sets',
                  'Sets & Suits',
                  'T-Shirts & Polos',
                  'Shirts',
                  'Jeans & Trousers',
                  'Pajamas & Trackpants',
                  'Sweatshirts & Jackets',
                  'Party Wear',
                  'Nightwear',
                  'Footwear & Sneakers',
                ].includes(selectedSubCategory))) && (
            <BoySubcategoriesShowcase
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={(subName) => {
                handleSelectSubCategory('boy-fashion', subName);
              }}
            />
          )}

          {/* Girl Subcategories (0-14Y) • Showcase & Instant Purchase */}
          {activeCategory !== 'boy-fashion' &&
            (activeCategory === 'girl-fashion' ||
              (selectedGender === 'girl' &&
                selectedSubCategory &&
                [
                  'Festive Frocks',
                  'Lehenga Sets',
                  'Kurta Sets',
                  'Ethnic Wear',
                  'Dresses & Frocks',
                  'Sets & Suits',
                  'Party Wear',
                  'Tops & T-shirts',
                  'Jeans & Jeggings',
                  'Pajamas & Leggings',
                  'Sweatshirts & SweatJackets',
                  'Nightwear',
                  'Ballerinas',
                  'Ethnic Footwear',
                  'Festive Accessories',
                  'Hair Clips & Rubber Bands',
                  'Jhablas',
                  'Onesies & Rompers',
                ].includes(selectedSubCategory))) && (
            <GirlSubcategoriesShowcase
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={(subName) => {
                handleSelectSubCategory('girl-fashion', subName);
              }}
            />
          )}

          {/* Baby Essentials (0-24M) • Showcase */}
          {activeCategory !== 'boy-fashion' &&
            activeCategory !== 'girl-fashion' &&
            (['baby-toddler', 'diapering', 'feeding', 'bath-skin'].includes(activeCategory) ||
              (selectedSubCategory &&
                [
                  'Baby Essentials',
                  'Newborn & Preemie',
                  'Onesies & Rompers',
                  'Jhablas & Vests Set',
                  'Diapers & Wipes',
                  'Feeding & Nursing',
                  'Bath & Skin Care',
                  'Booties & Scratch Mittens',
                ].includes(selectedSubCategory))) && (
            <BabySubcategoriesShowcase
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={(subName) => {
                handleSelectSubCategory('baby-toddler', subName);
              }}
            />
          )}

          {/* Curated Collections Showcase (Diwali 2026, Navratri, Halloween, Rainwear, Multi-packs, Bestsellers, Baby Essentials) */}
          {(activeCategory === 'festive-ethnic' ||
            (selectedSubCategory &&
              [
                'Diwali 2026 Collection',
                'Navratri Utsav',
                'Halloween Collection',
                'Rainwear Collection',
                'Multi-packs',
                'Bestsellers',
                'Baby Essentials',
              ].includes(selectedSubCategory))) && (
            <CollectionsSubcategoriesShowcase
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={(subName) => {
                handleSelectSubCategory('festive-ethnic', subName);
              }}
            />
          )}

          {/* Prominent Category & Subcategory Header (Style matching HAY! reference) */}
          <div className="text-center py-4 sm:py-6 space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight capitalize">
              {selectedSubCategory
                ? selectedSubCategory
                : searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategoryName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Verified kidswear crafted for safety, playtime durability &amp; all-day comfort
            </p>
          </div>

          {/* Controls Bar replicating hayclothing.in screenshot */}
          <div className="border-t border-b border-slate-200 py-3 mb-6 space-y-3 bg-white/70 backdrop-blur-xs rounded-2xl px-4 sm:px-6 shadow-2xs">
            {/* Top row: [ FILTER ] button, SORT BY, and [2 | 3 | 4] Grid View switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* [ FILTER ] Solid Black Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDesktopFiltersOpen(!isDesktopFiltersOpen);
                    setIsMobileFiltersOpen(true);
                  }}
                  className="px-4 py-2 bg-slate-950 hover:bg-black text-white rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>FILTER</span>
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>

                {/* SORT BY dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-extrabold uppercase text-[11px] tracking-wider hidden sm:inline">
                    SORT BY
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 px-3.5 py-1.5 pr-8 rounded-md text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-2xs uppercase tracking-wide"
                    >
                      <option value="popular">Featured / Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="discount">Biggest Savings</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* OVERALL WEBSITE THEME BUTTON */}
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsThemeModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md text-xs font-bold text-slate-800 cursor-pointer shadow-2xs transition-colors"
                      title="Open Overall Website Theme Customizer"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-500" />
                      <span className="hidden sm:inline">Theme:</span>
                      <span className="font-extrabold text-amber-700">
                        {getThemeDisplayName(bgTheme)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Column Layout Selector (2, 3, 4 columns from screenshot) */}
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <span className="text-[11px] uppercase tracking-wider hidden md:inline text-slate-400 mr-1">
                  View:
                </span>
                <button
                  type="button"
                  onClick={() => setGridColumns(2)}
                  className={`p-1.5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                    gridColumns === 2
                      ? 'border-slate-900 bg-slate-900 text-white font-black'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="2 Columns Grid"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridColumns(3)}
                  className={`p-1.5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                    gridColumns === 3
                      ? 'border-slate-900 bg-slate-900 text-white font-black'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="3 Columns Grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridColumns(4)}
                  className={`hidden sm:flex p-1.5 rounded-md border items-center justify-center cursor-pointer transition-colors ${
                    gridColumns === 4
                      ? 'border-slate-900 bg-slate-900 text-white font-black'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="4 Columns Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Subcategories / Curated Collections Filter Row */}
            {activeCategorySubCategories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
                <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeCategory === 'festive-ethnic' ? 'Collections:' : 'Subcategories:'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectSubCategory(activeCategory, 'all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border backdrop-blur-xs ${
                    !selectedSubCategory
                      ? 'border-amber-500 bg-amber-400 text-slate-950 font-black shadow-2xs'
                      : 'border-slate-300/80 bg-white/50 text-slate-700 hover:border-amber-300 hover:bg-amber-50/70'
                  }`}
                >
                  All {activeCategory === 'festive-ethnic' ? `Collections (${activeCategorySubCategories.length})` : 'Subcategories'}
                </button>
                {activeCategorySubCategories.map((subName) => {
                  const isSelected = selectedSubCategory === subName;
                  return (
                    <button
                      key={subName}
                      type="button"
                      onClick={() => handleSelectSubCategory(activeCategory, subName)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1 backdrop-blur-xs ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-white font-black shadow-2xs'
                          : 'border-slate-300/80 bg-white/50 text-slate-700 hover:border-amber-300 hover:bg-amber-50/70 hover:text-amber-950'
                      }`}
                    >
                      {activeCategory === 'festive-ethnic' && (
                        <Crown className="w-3 h-3 text-amber-300" />
                      )}
                      <span>{subName}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Age / Size filter pills row (matching S, M, L, XL+ in screenshot) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Age:
              </span>
              {[
                { id: 'all', label: 'All Ages' },
                { id: '0-3M', label: '0-3M' },
                { id: '3-6M', label: '3-6M' },
                { id: '6-12M', label: '6-12M' },
                { id: '1-2Y', label: '1-2Y' },
                { id: '2-4Y', label: '2-4Y' },
                { id: '4-6Y', label: '4-6Y' },
                { id: '6-8Y', label: '6-8Y' },
                { id: '8+Y', label: '8+Y' },
              ].map((ageItem) => {
                const isSelected = selectedAge === ageItem.id;
                return (
                  <button
                    key={ageItem.id}
                    type="button"
                    onClick={() => setSelectedAge(ageItem.id as AgeGroup)}
                    className={`min-w-10 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-2xs font-extrabold'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {ageItem.label}
                  </button>
                );
              })}
            </div>

            {/* Active Tags and Product Count (matching ✕ Clear all | ✕ In Stock in screenshot) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}

                {selectedSubCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold border border-amber-300">
                    <span>Subcategory: {selectedSubCategory}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectSubCategory(activeCategory, 'all')}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                  <span>✓ Availability: In stock ({filteredProducts.length})</span>
                </span>
              </div>

              <div className="text-xs font-bold text-slate-500">
                <span>
                  {filteredProducts.length} of {allProducts.length} products
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid Body with Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Desktop Filter Sidebar */}
            {isDesktopFiltersOpen && (
              <aside className="hidden lg:block lg:col-span-3 space-y-6">
                <FilterSidebar
                  filters={sidebarFilters}
                  onChange={setSidebarFilters}
                  onReset={handleResetFilters}
                  allProducts={allProducts}
                  totalFilteredCount={filteredProducts.length}
                />

                {/* Parenting Hub Promo Card */}
                <div className="p-4 rounded-2xl bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-200 text-xs space-y-2 shadow-2xs">
                  <div className="font-extrabold text-cyan-900 text-sm">Hospital Bag Checklist</div>
                  <p className="text-cyan-800 text-[11px] leading-relaxed">
                    Expecting soon? Use our interactive packing guide & baby growth tracker.
                  </p>
                  <button
                    onClick={() => setIsParentingHubOpen(true)}
                    className="font-bold text-cyan-700 underline text-[11px] hover:text-cyan-900 cursor-pointer"
                  >
                    Open Parenting Hub &rarr;
                  </button>
                </div>
              </aside>
            )}

            {/* Product Grid Area */}
            <div className={isDesktopFiltersOpen ? 'lg:col-span-9' : 'lg:col-span-12'}>
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <SlidersHorizontal className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your age group, price ceiling, or clearing the subcategory filter to view more items.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-3 sm:gap-6 ${
                    gridColumns === 2
                      ? 'grid-cols-2'
                      : gridColumns === 4
                      ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.some((p) => p.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onBuyNow={(p) => {
                        handleAddToCart(p, p.sizes[0] || 'Standard', p.colors[0]);
                        setIsCheckoutOpen(true);
                      }}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={() => {
          setCurrentPage('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenClubModal={() => setIsClubModalOpen(true)}
        onOpenParentingHub={() => setIsParentingHubOpen(true)}
        onOpenFranchise={() => {
          setCurrentPage('franchise');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setCurrentPage('admin');
          window.location.hash = '#admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals & Drawers */}
      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <FilterSidebar
              filters={sidebarFilters}
              onChange={setSidebarFilters}
              onReset={handleResetFilters}
              allProducts={allProducts}
              totalFilteredCount={filteredProducts.length}
              isMobile={true}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.some((p) => p.id === quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={(p, sz, clr) => {
          handleAddToCart(p, sz, clr);
          setQuickViewProduct(null);
          setIsCheckoutOpen(true);
        }}
        deliveryPincode={deliveryPincode}
        isClubMember={isClubMember}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        isClubMember={isClubMember}
        onOpenClubModal={() => {
          setIsCartOpen(false);
          setIsClubModalOpen(true);
        }}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToBag={handleMoveWishlistToBag}
      />

      <PuppyClubModal
        isOpen={isClubModalOpen}
        onClose={() => setIsClubModalOpen(false)}
        isClubMember={isClubMember}
        onJoinClub={handleJoinClub}
      />

      <ParentingHubModal
        isOpen={isParentingHubOpen}
        onClose={() => setIsParentingHubOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsParentingHubOpen(false);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        isClubMember={isClubMember}
        deliveryPincode={deliveryPincode}
        onClearCart={() => setCartItems([])}
        customer={customer}
        onOrderPlaced={handleOrderPlaced}
        onOpenOrderHistory={handleOpenAccountOrOrders}
      />

      {/* Customer Mobile Login Modal (Matching Reference UI) */}
      <CustomerLoginModal
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        intentAction={customerLoginIntent}
      />

      {/* Customer Order History & Account Details Modal */}
      <CustomerAccountModal
        isOpen={isCustomerAccountOpen}
        onClose={() => setIsCustomerAccountOpen(false)}
        customer={customer}
        orders={customerOrders}
        onLogout={handleLogoutCustomer}
        onUpdateCustomer={handleUpdateCustomer}
        onReorder={handleReorder}
        onApplyCoupon={(code) => {
          handleApplyCoupon(code);
          showToast(`Coupon ${code} applied successfully!`);
        }}
      />

      {/* Sleek Mobile Bottom Navigation Bar for Native App Feel */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-xl">
        <button
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold cursor-pointer transition-colors ${
            currentPage === 'home' ? 'text-amber-600 font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold cursor-pointer transition-colors ${
            currentPage === 'shop' ? 'text-amber-600 font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </button>

        <button
          onClick={handleOpenAccountOrOrders}
          className={`relative flex flex-col items-center gap-0.5 text-xs font-semibold cursor-pointer transition-colors ${
            customer?.isLoggedIn ? 'text-emerald-700 font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Customer Orders & Account"
        >
          <Package className="w-5 h-5 text-slate-700" />
          <span className="text-[10px]">{customer?.isLoggedIn ? 'Orders' : 'Login'}</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-xs font-semibold text-slate-600 hover:text-rose-600 cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px]">Wishlist</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-xs font-semibold text-slate-600 hover:text-amber-600 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItems.reduce((s, i) => s + i.quantity, 0) > 0 && (
            <span className="absolute -top-1 right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartItems.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
          <span className="text-[10px]">Bag</span>
        </button>

        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-xs font-semibold text-slate-600 hover:text-amber-600 cursor-pointer"
        >
          <Palette className="w-5 h-5 text-amber-500" />
          <span className="text-[10px]">Theme</span>
        </button>
      </nav>

      {/* Overall Website Theme Customizer Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={bgTheme}
        onSelectTheme={handleUpdateTheme}
      />
    </div>
  );
}
