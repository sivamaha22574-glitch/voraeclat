import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Phone,
  ShieldCheck,
  Award,
  Crown,
  Heart,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { CategoryId, AgeGroup, Gender, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { getStoredSiteBanners, SiteBanner } from '../data/siteBanners';
import { HeroBanner } from './HeroBanner';
import { ShopByAge } from './ShopByAge';
import { FirstCrySections } from './FirstCrySections';
import { BoySubcategoriesShowcase } from './BoySubcategoriesShowcase';
import { GirlSubcategoriesShowcase } from './GirlSubcategoriesShowcase';
import { BabySubcategoriesShowcase } from './BabySubcategoriesShowcase';
import { CollectionsSubcategoriesShowcase } from './CollectionsSubcategoriesShowcase';

interface HomePageProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenClubModal: () => void;
  onApplyCoupon: (code: string) => void;
  selectedAge: AgeGroup;
  onSelectAge: (age: AgeGroup) => void;
  onSelectGender: (g: Gender) => void;
  onSearchTag: (tag: string) => void;
  onOpenFranchise: () => void;
  onOpenContact: () => void;
  onExploreShop: () => void;
  onAddToCart?: (product: Product, size?: string) => void;
  onQuickView?: (product: Product) => void;
  onSelectSubCategory?: (cat: CategoryId, sub: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCategory,
  onOpenClubModal,
  onApplyCoupon,
  selectedAge,
  onSelectAge,
  onSelectGender,
  onSearchTag,
  onOpenFranchise,
  onOpenContact,
  onExploreShop,
  onAddToCart,
  onQuickView,
  onSelectSubCategory,
}) => {
  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>(() => getStoredSiteBanners());

  React.useEffect(() => {
    const handleUpdate = () => setSiteBanners(getStoredSiteBanners());
    window.addEventListener('site_banners_updated', handleUpdate);
    return () => window.removeEventListener('site_banners_updated', handleUpdate);
  }, []);

  const [fashionGenderTab, setFashionGenderTab] = useState<
    'boy' | 'girl' | 'baby' | 'collections'
  >('boy');
  const categoryPortals: {
    id: CategoryId;
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    gradient: string;
  }[] = [
    {
      id: 'festive-ethnic',
      title: 'Festive & Ethnic',
      subtitle: 'Silk Kurtas, Sherwanis & Lehengas',
      badge: 'Up to 50% OFF',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-amber-500/80 to-rose-600/80',
    },
    {
      id: 'boy-fashion',
      title: 'Boy Fashion',
      subtitle: 'Party Shirts, Dungarees & Denim',
      badge: 'Buy 2 Get 1 Free',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-blue-600/80 to-cyan-700/80',
    },
    {
      id: 'girl-fashion',
      title: 'Girl Fashion',
      subtitle: 'Twirl Frocks, Skirts & Jumpsuits',
      badge: 'Flat 40% OFF',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-rose-500/80 to-purple-600/80',
    },
    {
      id: 'baby-toddler',
      title: 'Baby (0-24M)',
      subtitle: 'Organic Rompers, Sleepsuits & Sets',
      badge: '100% GOTS Pure',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-emerald-600/80 to-teal-700/80',
    },
    {
      id: 'toys-learning',
      title: 'Toys & Games',
      subtitle: 'Montessori Wooden Puzzles & STEAM',
      badge: 'Top Rated',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-amber-600/80 to-orange-600/80',
    },
    {
      id: 'diapering',
      title: 'Diapers & Wipes',
      subtitle: 'Taped Diapers & Pure Water Wipes',
      badge: 'Mega Packs',
      image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-cyan-600/80 to-blue-700/80',
    },
    {
      id: 'nursery-gear',
      title: 'Cribs & Strollers',
      subtitle: 'Convertible Wooden Cots & Buggies',
      badge: 'Crash Tested',
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-indigo-600/80 to-purple-800/80',
    },
    {
      id: 'feeding',
      title: 'Feeding & Nursing',
      subtitle: 'Anti-Colic Glass Bottles & Warmers',
      badge: 'BPA Free',
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=85',
      gradient: 'from-teal-600/80 to-emerald-700/80',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* 1. Dynamic Hero Promotional Banner */}
      <HeroBanner
        onSelectCategory={onSelectCategory}
        onOpenClubModal={onOpenClubModal}
        onApplyCoupon={onApplyCoupon}
      />

      {/* 1.5. Flagship Trending Lookbook Spotlight: Dynamic Banner */}
      {(() => {
        const spotlightBanner =
          siteBanners.find((b) => b.id === 'banner-trending-spotlight') ||
          siteBanners[0];
        if (!spotlightBanner) return null;
        const sunflowerProduct = PRODUCTS.find((p) => p.id === 'ps-sunflower-dress');
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              onClick={() => {
                if (sunflowerProduct && onQuickView) onQuickView(sunflowerProduct);
                else if (spotlightBanner.buttonLink) onSelectCategory(spotlightBanner.buttonLink as CategoryId);
              }}
              className="group relative rounded-3xl bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white p-5 sm:p-8 shadow-xl border border-blue-800/80 overflow-hidden cursor-pointer flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all"
            >
              <div className="space-y-3 z-10 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                    {spotlightBanner.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-sm bg-[#be185d] text-white text-[11px] font-extrabold uppercase tracking-wider">
                    CERTIFIED
                  </span>
                  <span className="text-xs text-rose-300 font-bold uppercase tracking-wider">
                    HURRY, ONLY 9 ITEMS LEFT!
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                  {spotlightBanner.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {spotlightBanner.underText}
                </p>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
                    {spotlightBanner.priceTag || '₹1,199'}
                  </span>
                  {spotlightBanner.originalPriceTag && (
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {spotlightBanner.originalPriceTag}
                    </span>
                  )}
                  {spotlightBanner.discountTag && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/40">
                      {spotlightBanner.discountTag}
                    </span>
                  )}
                  <span className="text-xs text-slate-300">Tax included.</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-amber-400 group-hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
                  >
                    <span>{spotlightBanner.buttonText || 'View Product Detail & Gallery'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                    6-Shot Gallery • Key Highlights • Apply Offers!
                  </span>
                </div>
              </div>

              {/* Right Mini Gallery Preview */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 w-full sm:w-80 shrink-0">
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-slate-800 border border-white/20 shadow-md">
                  <img
                    src={spotlightBanner.imageUrl}
                    alt={spotlightBanner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-[#1a2332] border border-white/20 p-3.5 flex flex-col justify-between text-white shadow-md">
                  <div className="text-xs font-bold text-amber-300">Style Highlights</div>
                  <div className="text-[11px] space-y-1.5 text-slate-300">
                    <div>Fabric: <strong className="text-white">Viscose</strong></div>
                    <div>Length: <strong className="text-white">46"</strong></div>
                    <div>Technique: <strong className="text-white">Printed</strong></div>
                    <div>Contains: <strong className="text-white">Top only</strong></div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold pt-1 border-t border-slate-700/60">
                    A-Line Fit • 3/4th Sleeve
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 2. Shop By Category Portals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse curated premium baby apparel, certified nursery gear, toys and essential care.
            </p>
          </div>

          <button
            onClick={onExploreShop}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryPortals.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative rounded-3xl overflow-hidden aspect-4/5 sm:aspect-3/4 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div
                className={`absolute inset-0 bg-linear-to-t ${cat.gradient} via-slate-900/40 to-transparent transition-opacity`}
              />

              {/* Discount Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-950 font-black text-[10px] sm:text-xs shadow-md">
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10 space-y-1">
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Age Group Selector */}
      <section className="bg-slate-100/70 py-8 border-y border-slate-200">
        <ShopByAge selectedAge={selectedAge} onSelectAge={onSelectAge} />
      </section>

      {/* 3.5 Subcategories Showcase (0-14Y) • Showcase & Direct Purchase for Both Boy & Girl */}
      {onAddToCart && onQuickView && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0">
                Explore:
              </span>
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setFashionGenderTab('boy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    fashionGenderTab === 'boy'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>👦 Boy (0-14Y)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFashionGenderTab('girl')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    fashionGenderTab === 'girl'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>👧 Girl (0-14Y)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFashionGenderTab('baby')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    fashionGenderTab === 'baby'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>👶 Baby (0-24M)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFashionGenderTab('collections')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    fashionGenderTab === 'collections'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  <span>✨ Collections</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onSelectCategory(
                  fashionGenderTab === 'boy'
                    ? 'boy-fashion'
                    : fashionGenderTab === 'girl'
                    ? 'girl-fashion'
                    : fashionGenderTab === 'baby'
                    ? 'baby-toddler'
                    : 'festive-ethnic'
                )
              }
              className="text-xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>
                View All{' '}
                {fashionGenderTab === 'boy'
                  ? 'Boy Fashion'
                  : fashionGenderTab === 'girl'
                  ? 'Girl Fashion'
                  : fashionGenderTab === 'baby'
                  ? 'Baby Essentials'
                  : 'Curated Collections'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {fashionGenderTab === 'boy' ? (
            <BoySubcategoriesShowcase
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectSubCategory={(subName) => {
                if (onSelectSubCategory) {
                  onSelectSubCategory('boy-fashion', subName);
                } else {
                  onSelectCategory('boy-fashion');
                }
              }}
            />
          ) : fashionGenderTab === 'girl' ? (
            <GirlSubcategoriesShowcase
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectSubCategory={(subName) => {
                if (onSelectSubCategory) {
                  onSelectSubCategory('girl-fashion', subName);
                } else {
                  onSelectCategory('girl-fashion');
                }
              }}
            />
          ) : fashionGenderTab === 'baby' ? (
            <BabySubcategoriesShowcase
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectSubCategory={(subName) => {
                if (onSelectSubCategory) {
                  onSelectSubCategory('baby-toddler', subName);
                } else {
                  onSelectCategory('baby-toddler');
                }
              }}
            />
          ) : (
            <CollectionsSubcategoriesShowcase
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectSubCategory={(subName) => {
                if (onSelectSubCategory) {
                  if (subName === 'Baby Essentials') {
                    onSelectSubCategory('baby-toddler', 'Baby Essentials');
                  } else {
                    onSelectSubCategory('festive-ethnic', subName);
                  }
                } else {
                  onSelectCategory(
                    subName === 'Baby Essentials'
                      ? 'baby-toddler'
                      : 'festive-ethnic'
                  );
                }
              }}
            />
          )}
        </section>
      )}

      {/* 4. Curated FirstCry Themed Sections (Festive, Casuals, Boutiques, Brands) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FirstCrySections
          onSelectCategory={onSelectCategory}
          onSelectGender={onSelectGender}
          onApplyCoupon={onApplyCoupon}
          onSearchTag={onSearchTag}
        />
      </section>

      {/* 5. High-Impact Quick Navigation Cards: Franchise Enquiry & Contact Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Franchise Enquiry Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Franchise Partner Program</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Open a Voraeclat Franchise Store
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Partner with Asia&apos;s fastest growing premium baby & kids retail network.
                Assured 35% - 48% annual ROI with complete store design, inventory management, and marketing backing.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-amber-300 font-semibold">
                <span>● FOCO / FOFO Models</span>
                <span>● 800 - 3,000 sq. ft.</span>
                <span>● 14 - 18M Payback</span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenFranchise}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Franchise Enquiry & Applications</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Us & Parent Helpline Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-br from-cyan-950 via-slate-900 to-blue-950 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" />
                <span>24x7 Customer Support</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Have a Question? Contact Us Anytime
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our pediatric-trained parenting support heroes are here for you 24/7.
                Get immediate help with sizing charts, delivery inquiries, easy returns, or gift packaging.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-cyan-300 font-semibold">
                <span>📞 Toll-Free: 1800-VORAE-CARE</span>
                <span>💬 WhatsApp Support</span>
                <span>✉️ care@voraeclat.com</span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open Contact & Support Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
