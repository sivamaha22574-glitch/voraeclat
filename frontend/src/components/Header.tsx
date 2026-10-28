import React, { useState, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Crown,
  MapPin,
  ClipboardList,
  Sparkles,
  ChevronDown,
  X,
  ShieldCheck,
  Home,
  Building2,
  Phone,
  Layers,
  Check,
  Palette,
  User,
  Package,
  Menu,
} from 'lucide-react';
import { VoraeclatLogo } from './VoraeclatLogo';
import { BoyFashionMegaMenu } from './BoyFashionMegaMenu';
import { GirlFashionMegaMenu } from './GirlFashionMegaMenu';
import { CollectionsMegaMenu } from './CollectionsMegaMenu';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { CategoryId, CustomerUser } from '../types';

export type BgTheme =
  | 'clean-slate'
  | 'festive-gold'
  | 'feb14-valentine'
  | 'tamil-newyear'
  | 'newyear-gala'
  | 'pongal-harvest'
  | 'navratri-utsav'
  | 'christmas-winter'
  | 'rose-blush'
  | 'ocean-breeze'
  | 'lavender-dream'
  | 'modern-dark';

export const getThemeDisplayName = (theme: BgTheme = 'clean-slate'): string => {
  switch (theme) {
    case 'feb14-valentine':
      return 'Feb 14 Valentine ❤️';
    case 'tamil-newyear':
      return 'Tamil New Year 🌾';
    case 'newyear-gala':
      return 'New Year 2026 🎆';
    case 'pongal-harvest':
      return 'Pongal Harvest 🍯';
    case 'festive-gold':
      return 'Diwali Glow 🪔';
    case 'navratri-utsav':
      return 'Navratri Utsav 🪘';
    case 'christmas-winter':
      return 'Christmas & Holiday 🎄';
    case 'rose-blush':
      return 'Rose Blush 🌸';
    case 'ocean-breeze':
      return 'Ocean Mint 🌊';
    case 'lavender-dream':
      return 'Lavender Dream 💜';
    case 'modern-dark':
      return 'Midnight Luxe 🌙';
    case 'clean-slate':
    default:
      return 'Clean Slate ☀️';
  }
};

export const getFestiveAnnouncement = (theme: BgTheme = 'clean-slate'): { text: string; bg: string } | null => {
  switch (theme) {
    case 'feb14-valentine':
      return {
        text: '❤️ FEB 14 VALENTINE SPECIAL: Celebrate Little Loves with Extra 15% OFF on Twirl Frocks & Red Sets! Code: FEB14LOVE',
        bg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white',
      };
    case 'tamil-newyear':
      return {
        text: '🌾 இனிய தமிழ் புத்தாண்டு நல்வாழ்த்துகள்! Happy Tamil New Year: Traditional Pattu Pavadai, Kurta Dhoti Sets & Silk Splendor!',
        bg: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-emerald-700 text-white',
      };
    case 'newyear-gala':
      return {
        text: '🎆 HAPPY NEW YEAR 2026: Ring in the New Year with Spectacular Sparkler Party Wear & Midnight Savings! Code: NEWYEAR2026',
        bg: 'bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 text-amber-200 border-b border-amber-400/40',
      };
    case 'pongal-harvest':
      return {
        text: '🍯 பொங்கலோ பொங்கல்! Happy Pongal & Makar Sankranti: Traditional Harvest Silk Pavadai, Dhotis & Sweet Celebrations!',
        bg: 'bg-gradient-to-r from-emerald-700 via-green-600 to-amber-600 text-white',
      };
    case 'festive-gold':
      return {
        text: '🪔 DIWALI 2026 COLLECTION: Celebrate Every Little Moment in Style with Premium Festive Wear & Diyas Ambiance!',
        bg: 'bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white',
      };
    case 'christmas-winter':
      return {
        text: '🎄 MERRY CHRISTMAS & HAPPY HOLIDAYS: Cozy Warm Sweaters, Festive Red Frocks & Holiday Party Outfits for Kids!',
        bg: 'bg-gradient-to-r from-red-700 via-red-600 to-emerald-800 text-white',
      };
    case 'navratri-utsav':
      return {
        text: '🪘 NAVRATRI & DUSSEHRA UTSAV: Vibrant 9-Color Chaniya Cholis, Kediyu Sets & Dandiya Ready Fits!',
        bg: 'bg-gradient-to-r from-fuchsia-700 via-purple-700 to-orange-600 text-white',
      };
    default:
      return null;
  }
};

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenClubModal: () => void;
  onOpenParentingHub: () => void;
  onOpenFranchise?: () => void;
  onOpenContact?: () => void;
  onOpenHome?: () => void;
  onOpenAdmin?: () => void;
  currentPage?: 'home' | 'shop' | 'contact' | 'franchise' | 'admin';
  deliveryPincode: string;
  onChangePincode: (pin: string) => void;
  isClubMember: boolean;
  onSelectBoyFashionItem?: (item: string, type: string) => void;
  onSelectGirlFashionItem?: (
    item: string,
    type: 'category' | 'collection' | 'accessory' | 'footwear' | 'age' | 'price' | 'brand'
  ) => void;
  selectedSubCategory?: string | null;
  onSelectSubCategory?: (category: CategoryId, subCategory: string) => void;
  currentBgTheme?: BgTheme;
  onChangeBgTheme?: (theme: BgTheme) => void;
  onOpenThemeModal?: () => void;
  customer?: CustomerUser | null;
  onOpenCustomerLogin: () => void;
  onOpenCustomerAccount: () => void;
  ordersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  cartTotal,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenClubModal,
  onOpenParentingHub,
  onOpenFranchise,
  onOpenContact,
  onOpenHome,
  onOpenAdmin,
  currentPage = 'home',
  deliveryPincode,
  onChangePincode,
  isClubMember,
  onSelectBoyFashionItem,
  onSelectGirlFashionItem,
  selectedSubCategory,
  onSelectSubCategory,
  currentBgTheme = 'clean-slate',
  onChangeBgTheme,
  onOpenThemeModal,
  customer = null,
  onOpenCustomerLogin,
  onOpenCustomerAccount,
  ordersCount = 0,
}) => {
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pinInput, setPinInput] = useState(deliveryPincode);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isBoyFashionMenuOpen, setIsBoyFashionMenuOpen] = useState(false);
  const [isGirlFashionMenuOpen, setIsGirlFashionMenuOpen] = useState(false);
  const [isCollectionsMenuOpen, setIsCollectionsMenuOpen] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const closeMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenMegaMenu = (menu: 'girl' | 'boy' | 'collections') => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    if (menu === 'girl') {
      setIsGirlFashionMenuOpen(true);
      setIsBoyFashionMenuOpen(false);
      setIsCollectionsMenuOpen(false);
    } else if (menu === 'boy') {
      setIsBoyFashionMenuOpen(true);
      setIsGirlFashionMenuOpen(false);
      setIsCollectionsMenuOpen(false);
    } else if (menu === 'collections') {
      setIsCollectionsMenuOpen(true);
      setIsGirlFashionMenuOpen(false);
      setIsBoyFashionMenuOpen(false);
    }
  };

  const handleCloseMegaMenuWithDelay = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
    }
    closeMenuTimeoutRef.current = setTimeout(() => {
      setIsGirlFashionMenuOpen(false);
      setIsBoyFashionMenuOpen(false);
      setIsCollectionsMenuOpen(false);
    }, 200);
  };

  const handleKeepMegaMenuOpen = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  };

  const categoriesList: { id: CategoryId; label: string }[] = [
    { id: 'festive-ethnic', label: 'Festive & Ethnic' },
    { id: 'boy-fashion', label: 'Boy Fashion' },
    { id: 'girl-fashion', label: 'Girl Fashion' },
    { id: 'baby-toddler', label: 'Baby (0-24M)' },
    { id: 'casual-wear', label: 'Casual & Daily' },
    { id: 'footwear-accessories', label: 'Footwear' },
    { id: 'toys-learning', label: 'Toys & Games' },
    { id: 'diapering', label: 'Diapers & Wipes' },
    { id: 'feeding', label: 'Feeding & Nursing' },
    { id: 'bath-skin', label: 'Bath & Skin Care' },
    { id: 'nursery-gear', label: 'Cribs & Strollers' },
    { id: 'books-library', label: 'Books & Library' },
    { id: 'health-safety', label: 'Health & Safety' },
    { id: 'moms-maternity', label: 'Moms & Maternity' },
  ];

  const categoryGroups = [
    {
      name: 'Kids Fashion & Footwear',
      icon: '👕',
      items: [
        { id: 'festive-ethnic' as CategoryId, label: 'Festive & Ethnic' },
        { id: 'boy-fashion' as CategoryId, label: 'Boy Fashion' },
        { id: 'girl-fashion' as CategoryId, label: 'Girl Fashion' },
        { id: 'baby-toddler' as CategoryId, label: 'Baby & Toddler (0-24M)' },
        { id: 'casual-wear' as CategoryId, label: 'Casual & Daily Wear' },
        { id: 'footwear-accessories' as CategoryId, label: 'Footwear & Shoes' },
      ],
    },
    {
      name: 'Baby Daily Care & Feeding',
      icon: '🍼',
      items: [
        { id: 'diapering' as CategoryId, label: 'Diapers & Wipes' },
        { id: 'feeding' as CategoryId, label: 'Feeding & Nursing' },
        { id: 'bath-skin' as CategoryId, label: 'Bath & Skin Care' },
        { id: 'health-safety' as CategoryId, label: 'Health & Safety' },
      ],
    },
    {
      name: 'Play, Gear & Nursery',
      icon: '🧸',
      items: [
        { id: 'toys-learning' as CategoryId, label: 'Toys & Games' },
        { id: 'nursery-gear' as CategoryId, label: 'Cribs & Strollers' },
        { id: 'books-library' as CategoryId, label: 'Books & Learning' },
        { id: 'moms-maternity' as CategoryId, label: 'Moms & Maternity' },
      ],
    },
  ];

  const popularSearches = [
    'Organic baby rompers',
    'Bamboo tape diapers',
    'Glass anti-colic feeding bottle',
    'Wooden convertible crib',
    'Cabin travel stroller',
    'Girls birthday twirl dress',
  ];

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim()) {
      onChangePincode(pinInput.trim());
      setShowPincodeModal(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 shadow-xs border-b transition-colors duration-200 ${
        currentBgTheme === 'modern-dark'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : currentBgTheme === 'newyear-gala'
          ? 'bg-[#0f172a] border-blue-900 text-amber-100'
          : currentBgTheme === 'feb14-valentine'
          ? 'bg-[#fff5f7] border-rose-200 text-rose-950'
          : currentBgTheme === 'tamil-newyear'
          ? 'bg-[#fefce8] border-amber-300 text-amber-950'
          : currentBgTheme === 'pongal-harvest'
          ? 'bg-[#f0fdf4] border-emerald-200 text-emerald-950'
          : currentBgTheme === 'christmas-winter'
          ? 'bg-[#fef2f2] border-red-200 text-red-950'
          : currentBgTheme === 'navratri-utsav'
          ? 'bg-[#fdf4ff] border-fuchsia-200 text-purple-950'
          : currentBgTheme === 'festive-gold'
          ? 'bg-[#fffdfa] border-amber-200/60 text-amber-950'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-8">
          {/* Brand Logo & Quick Delivery Location */}
          <div className="shrink-0 flex items-center gap-1.5 sm:gap-4 min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="sm:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            <button
              onClick={() => {
                if (onOpenHome) {
                  onOpenHome();
                } else {
                  onSelectCategory('festive-ethnic');
                }
              }}
              className="cursor-pointer text-left focus:outline-hidden shrink-0"
              title="Voraeclat Home"
            >
              <VoraeclatLogo size="md" showSubtitle={false} />
            </button>

            {/* Delivery Location Selector */}
            <button
              onClick={() => setShowPincodeModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer text-xs"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-[11px] text-slate-500">Deliver to: <strong className="text-slate-900 font-semibold">{deliveryPincode}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Desktop Search Bar with Instant Autocomplete */}
          <div className="hidden md:block flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for baby clothes, diapers, strollers, toys..."
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 pl-11 pr-24 py-2.5 rounded-full border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="absolute right-2 px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-full text-xs pointer-events-none">
                Search
              </div>
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && !searchQuery && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Popular Searches on Voraeclat</span>
                  <button onClick={() => setIsSearchFocused(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        onSearchChange(term);
                        setIsSearchFocused(false);
                      }}
                      className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-lg transition-colors text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* OVERALL THEME CHANGE BUTTON (Desktop) */}
            {onOpenThemeModal && (
              <button
                type="button"
                onClick={onOpenThemeModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-full font-black text-xs transition-all shadow-xs hover:shadow-md cursor-pointer border border-amber-500/40 shrink-0"
                title="Change Overall Website Theme"
              >
                <Palette className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="tracking-wide">OVERALL THEME</span>
              </button>
            )}

            {/* Voraeclat Club Toggle */}
            <button
              onClick={onOpenClubModal}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isClubMember
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isClubMember ? 'VIP Member' : 'Join Voraeclat Club'}</span>
            </button>

            {/* Customer Login / Orders Button */}
            <button
              type="button"
              onClick={() => {
                if (customer && customer.isLoggedIn) {
                  onOpenCustomerAccount();
                } else {
                  onOpenCustomerLogin();
                }
              }}
              className={`relative inline-flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                customer?.isLoggedIn
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-slate-950 border-slate-200'
              }`}
              title={
                customer?.isLoggedIn
                  ? `Logged in as ${customer.name || customer.mobile}. Click to view Order History & Details.`
                  : 'Customer Login with Mail ID & Mobile to view Orders'
              }
            >
              <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-700 shrink-0" />
              <span className="hidden sm:inline sm:ml-1">
                {customer?.isLoggedIn
                  ? customer.name
                    ? customer.name.split(' ')[0]
                    : 'Account'
                  : 'Login'}
              </span>
              {customer?.isLoggedIn && ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:ml-1 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.2 rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
              {!customer?.isLoggedIn && (
                <span className="hidden xl:inline ml-1 text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                  10% OFF
                </span>
              )}
            </button>

            {/* Admin Portal & Ad Dashboard Quick Access Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`inline-flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border shrink-0 ${
                  currentPage === 'admin'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border-slate-700 shadow-2xs'
                }`}
                title="Open Executive Admin Portal & Ad Dashboard"
              >
                <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span className="hidden sm:inline sm:ml-1">Admin</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1.5 sm:p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag (Cart) - High Priority on Mobile */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer shrink-0"
              title="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[9px] sm:text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {cartCount > 0 ? `₹${cartTotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
              <span className="sm:hidden font-black text-[11px]">
                {cartCount > 0 ? `₹${cartTotal > 999 ? `${(cartTotal / 1000).toFixed(1)}k` : cartTotal}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dedicated Full-Width Search Bar */}
      <div className="md:hidden px-3.5 pb-2.5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search baby clothes, diapers, toys..."
            className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 pl-10 pr-20 py-2 rounded-full border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-xs font-medium transition-all outline-hidden shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="absolute right-1.5 px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded-full text-[11px] pointer-events-none">
            Search
          </div>
        </div>

        {/* Mobile Autocomplete Dropdown */}
        {isSearchFocused && !searchQuery && (
          <div
            className="mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 text-slate-800"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Popular Searches</span>
              <button onClick={() => setIsSearchFocused(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    onSearchChange(term);
                    setIsSearchFocused(false);
                  }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-md transition-colors text-left"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation Strip with Sleek Subcategory Dropdown Menus */}
      <nav
        className={`px-3 sm:px-6 lg:px-8 relative shadow-2xs z-30 transition-colors duration-200 ${
          currentBgTheme === 'modern-dark'
            ? 'bg-slate-900 border-t border-slate-800 text-slate-100'
            : currentBgTheme === 'newyear-gala'
            ? 'bg-[#0f1d3f] border-t border-blue-900/80 text-amber-100'
            : currentBgTheme === 'feb14-valentine'
            ? 'bg-[#ffe4e9] border-t border-rose-300 text-rose-950'
            : currentBgTheme === 'tamil-newyear'
            ? 'bg-[#fef9c3] border-t border-amber-300 text-amber-950'
            : currentBgTheme === 'pongal-harvest'
            ? 'bg-[#dcfce7] border-t border-emerald-300 text-emerald-950'
            : currentBgTheme === 'christmas-winter'
            ? 'bg-[#fee2e2] border-t border-red-300 text-red-950'
            : currentBgTheme === 'navratri-utsav'
            ? 'bg-[#fae8ff] border-t border-fuchsia-300 text-purple-950'
            : currentBgTheme === 'festive-gold'
            ? 'bg-[#fef9ee] border-t border-amber-200/70 text-amber-950'
            : currentBgTheme === 'rose-blush'
            ? 'bg-[#fff5f6] border-t border-rose-200/70 text-rose-950'
            : currentBgTheme === 'ocean-breeze'
            ? 'bg-[#f0fdfa] border-t border-teal-200/70 text-teal-950'
            : currentBgTheme === 'lavender-dream'
            ? 'bg-[#faf5ff] border-t border-purple-200/70 text-purple-950'
            : 'bg-slate-50 border-t border-slate-200 text-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap shrink-0">
            {/* 1. Home */}
            <button
              type="button"
              onClick={onOpenHome}
              onMouseEnter={() => {
                setActiveDropdown(null);
                setIsGirlFashionMenuOpen(false);
                setIsBoyFashionMenuOpen(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-900 hover:bg-white hover:text-black'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-slate-900" />
              <span>HOME</span>
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

            {/* 3. GIRL FASHION Multi-Column Mega Menu Tab */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => handleOpenMegaMenu('girl')}
              onMouseLeave={handleCloseMegaMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('girl-fashion');
                  setIsGirlFashionMenuOpen((prev) => !prev);
                  setIsBoyFashionMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  (currentPage === 'shop' && activeCategory === 'girl-fashion') || isGirlFashionMenuOpen
                    ? 'bg-rose-500 text-white font-black shadow-xs'
                    : 'text-slate-900 hover:bg-white hover:text-black'
                }`}
              >
                <span>GIRL FASHION</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isGirlFashionMenuOpen ? 'rotate-180 text-white' : 'text-slate-600'
                  }`}
                />
              </button>
            </div>

            {/* 4. BOY FASHION Multi-Column Mega Menu Tab */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => handleOpenMegaMenu('boy')}
              onMouseLeave={handleCloseMegaMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('boy-fashion');
                  setIsBoyFashionMenuOpen((prev) => !prev);
                  setIsGirlFashionMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  (currentPage === 'shop' && activeCategory === 'boy-fashion') || isBoyFashionMenuOpen
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-900 hover:bg-white hover:text-black'
                }`}
              >
                <span>BOY FASHION</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isBoyFashionMenuOpen ? 'rotate-180 text-slate-950' : 'text-slate-600'
                  }`}
                />
              </button>
            </div>

            {/* 5. SHOP BY COLLECTION Multi-Column Mega Menu Tab */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => handleOpenMegaMenu('collections')}
              onMouseLeave={handleCloseMegaMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('festive-ethnic');
                  setIsCollectionsMenuOpen((prev) => !prev);
                  setIsGirlFashionMenuOpen(false);
                  setIsBoyFashionMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  (currentPage === 'shop' && activeCategory === 'festive-ethnic') || isCollectionsMenuOpen
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-900 hover:bg-white hover:text-black'
                }`}
              >
                <span>SHOP BY COLLECTION</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCollectionsMenuOpen ? 'rotate-180 text-slate-950' : 'text-slate-600'
                  }`}
                />
              </button>
            </div>

            {/* 6. BABY (0-24M) with vertical dropdown */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => {
                setActiveDropdown('baby-toddler');
                setIsGirlFashionMenuOpen(false);
                setIsBoyFashionMenuOpen(false);
                setIsCollectionsMenuOpen(false);
              }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('baby-toddler');
                  setActiveDropdown(activeDropdown === 'baby-toddler' ? null : 'baby-toddler');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  currentPage === 'shop' && activeCategory === 'baby-toddler'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-900 hover:bg-white hover:text-black'
                }`}
              >
                <span>BABY (0-24M)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {activeDropdown === 'baby-toddler' && (
                <div
                  className="absolute top-full left-0 mt-0.5 w-60 mega-menu-glass rounded-b-xl shadow-2xl border border-emerald-300/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 border-b border-emerald-200/40 flex items-center justify-between">
                    <span>Baby Essentials</span>
                    <span className="text-emerald-700 font-black">0-24M</span>
                  </div>
                  {[
                    'Newborn & Preemie',
                    'Onesies & Rompers',
                    'Jhablas & Vests Set',
                    'Diapers & Wipes',
                    'Feeding & Nursing',
                    'Bath & Skin Care',
                    'Booties & Scratch Mittens',
                  ].map((subName) => {
                    const isSelected = selectedSubCategory === subName;
                    return (
                      <button
                        key={subName}
                        type="button"
                        onClick={() => {
                          if (onSelectSubCategory) {
                            onSelectSubCategory('baby-toddler', subName);
                          } else {
                            onSelectCategory('baby-toddler');
                          }
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer mega-menu-link ${
                          isSelected
                            ? 'bg-emerald-100/80 text-emerald-950 font-black border-l-3 border-emerald-500 pl-3.5'
                            : 'hover:bg-emerald-50/50 hover:text-emerald-700'
                        }`}
                        style={{ fontWeight: 'bold', color: '#000000' }}
                      >
                        <span className="truncate" style={{ fontWeight: 'bold', color: '#000000' }}>{subName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-emerald-200/40 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory('baby-toddler');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-100/50 hover:underline flex items-center justify-between cursor-pointer"
                    >
                      <span>View All Baby Essentials</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

            {/* 7. Franchise Enquiry */}
            {onOpenFranchise && (
              <button
                type="button"
                onClick={onOpenFranchise}
                onMouseEnter={() => {
                  setActiveDropdown(null);
                  setIsGirlFashionMenuOpen(false);
                  setIsBoyFashionMenuOpen(false);
                  setIsCollectionsMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  currentPage === 'franchise'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100 hover:text-amber-950'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>FRANCHISE ENQUIRY</span>
              </button>
            )}

            {/* 8. Contact Us */}
            {onOpenContact && (
              <button
                type="button"
                onClick={onOpenContact}
                onMouseEnter={() => {
                  setActiveDropdown(null);
                  setIsGirlFashionMenuOpen(false);
                  setIsBoyFashionMenuOpen(false);
                  setIsCollectionsMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  currentPage === 'contact'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100 hover:text-cyan-950'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>CONTACT US</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

            {/* 9. Customer Orders / Account */}
            <button
              type="button"
              onClick={() => {
                if (customer && customer.isLoggedIn) {
                  onOpenCustomerAccount();
                } else {
                  onOpenCustomerLogin();
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                customer?.isLoggedIn
                  ? 'text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 shadow-2xs'
                  : 'text-slate-900 bg-white/90 hover:bg-amber-100 hover:text-amber-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>{customer?.isLoggedIn ? 'MY ORDERS' : 'ORDERS / LOGIN'}</span>
              {customer?.isLoggedIn && ordersCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px] font-black">
                  {ordersCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold">
                  10% OFF
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Subtle backdrop overlay for open mega menus */}
        {(isBoyFashionMenuOpen || isGirlFashionMenuOpen || isCollectionsMenuOpen) && (
          <div
            className="fixed inset-0 top-[110px] bg-slate-950/20 backdrop-blur-xs z-40 transition-opacity duration-200 cursor-pointer"
            onClick={() => {
              setIsBoyFashionMenuOpen(false);
              setIsGirlFashionMenuOpen(false);
              setIsCollectionsMenuOpen(false);
            }}
          />
        )}

        {/* Boy Fashion Multi-Column Mega Menu */}
        <BoyFashionMegaMenu
          isOpen={isBoyFashionMenuOpen}
          onClose={() => setIsBoyFashionMenuOpen(false)}
          onMouseEnter={handleKeepMegaMenuOpen}
          onMouseLeave={handleCloseMegaMenuWithDelay}
          onSelectItem={(item, type) => {
            setIsBoyFashionMenuOpen(false);
            if (onSelectBoyFashionItem) {
              onSelectBoyFashionItem(item, type);
            } else {
              onSelectCategory('boy-fashion');
            }
          }}
        />

        {/* Girl Fashion Multi-Column Mega Menu */}
        <GirlFashionMegaMenu
          isOpen={isGirlFashionMenuOpen}
          onClose={() => setIsGirlFashionMenuOpen(false)}
          onMouseEnter={handleKeepMegaMenuOpen}
          onMouseLeave={handleCloseMegaMenuWithDelay}
          onSelectItem={(item, type) => {
            setIsGirlFashionMenuOpen(false);
            if (onSelectGirlFashionItem) {
              onSelectGirlFashionItem(item, type);
            } else {
              onSelectCategory('girl-fashion');
            }
          }}
        />

        {/* Curated Collections Multi-Column Mega Menu */}
        <CollectionsMegaMenu
          isOpen={isCollectionsMenuOpen}
          onClose={() => setIsCollectionsMenuOpen(false)}
          onMouseEnter={handleKeepMegaMenuOpen}
          onMouseLeave={handleCloseMegaMenuWithDelay}
          onSelectCollection={(colName) => {
            setIsCollectionsMenuOpen(false);
            if (colName === 'all') {
              onSelectCategory('festive-ethnic');
            } else if (colName.includes('Diwali')) {
              if (onSelectSubCategory) {
                onSelectSubCategory('festive-ethnic', 'Diwali 2026 Collection');
              } else {
                onSelectCategory('festive-ethnic');
              }
            } else {
              if (onSelectSubCategory) {
                onSelectSubCategory('festive-ethnic', colName);
              } else {
                onSelectCategory('festive-ethnic');
              }
            }
          }}
        />
      </nav>

      {/* Pincode Change Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">Select Delivery Location</h3>
              </div>
              <button onClick={() => setShowPincodeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your 6-digit Indian PIN Code to check express delivery availability, shipping rates, and Cash on Delivery.
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="e.g. 400001 (Mumbai) or 110001 (Delhi)"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
                autoFocus
              />
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPincodeModal(false)}
                  className="flex-1 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                >
                  Apply Pincode
                </button>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Contactless & Sanitized deliveries available everywhere</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          setIsMobileDrawerOpen(false);
        }}
        onSelectSubCategory={(cat, sub) => {
          if (onSelectSubCategory) onSelectSubCategory(cat, sub);
          setIsMobileDrawerOpen(false);
        }}
        onOpenClubModal={() => {
          onOpenClubModal();
          setIsMobileDrawerOpen(false);
        }}
        onOpenFranchise={
          onOpenFranchise
            ? () => {
                onOpenFranchise();
                setIsMobileDrawerOpen(false);
              }
            : undefined
        }
        onOpenContact={
          onOpenContact
            ? () => {
                onOpenContact();
                setIsMobileDrawerOpen(false);
              }
            : undefined
        }
        onOpenThemeModal={
          onOpenThemeModal
            ? () => {
                onOpenThemeModal();
                setIsMobileDrawerOpen(false);
              }
            : undefined
        }
        onOpenAdmin={
          onOpenAdmin
            ? () => {
                onOpenAdmin();
                setIsMobileDrawerOpen(false);
              }
            : undefined
        }
        onOpenWishlist={() => {
          onOpenWishlist();
          setIsMobileDrawerOpen(false);
        }}
        onOpenCart={() => {
          onOpenCart();
          setIsMobileDrawerOpen(false);
        }}
        deliveryPincode={deliveryPincode}
      />
    </header>
  );
};
