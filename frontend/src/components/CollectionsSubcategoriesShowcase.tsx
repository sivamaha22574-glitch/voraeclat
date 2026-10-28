import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Crown,
  ShieldCheck,
  Check,
  Flame,
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface CollectionsSubcategoriesShowcaseProps {
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  onSelectSubCategory?: (subCategory: string) => void;
  selectedSubCategory?: string | null;
}

export interface CollectionSubcategoryItem {
  id: string;
  name: string;
  tagline: string;
  badge: 'TRENDING' | 'CLUB CHOICE' | 'BEST SELLER' | 'LIMITED EDITION';
  categoryPill: string;
  sampleProduct: Product;
}

export const CollectionsSubcategoriesShowcase: React.FC<
  CollectionsSubcategoriesShowcaseProps
> = ({ onAddToCart, onQuickView, onSelectSubCategory, selectedSubCategory }) => {
  const [filterSub, setFilterSub] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedSubCategory && selectedSubCategory !== 'all') {
      const match = collectionSubcategoriesList.find(
        (u) =>
          u.name.toLowerCase() === selectedSubCategory.toLowerCase() ||
          selectedSubCategory.toLowerCase().includes(u.name.toLowerCase()) ||
          u.name.toLowerCase().includes(selectedSubCategory.toLowerCase())
      );
      if (match) {
        setFilterSub(match.name);
      }
    } else if (selectedSubCategory === 'all' || !selectedSubCategory) {
      setFilterSub('all');
    }
  }, [selectedSubCategory]);

  // Find sample product by id or fallback subcategory
  const getSample = (id: string, fallbackSub: string): Product => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) return found;
    const fallback = PRODUCTS.find(
      (p) =>
        p.subCategory.toLowerCase().includes(fallbackSub.toLowerCase()) ||
        fallbackSub.toLowerCase().includes(p.subCategory.toLowerCase())
    );
    return fallback || PRODUCTS[0];
  };

  const collectionSubcategoriesList: CollectionSubcategoryItem[] = [
    {
      id: 'sub-diwali-2026',
      name: 'Diwali 2026 Collection',
      tagline: 'Royal Zari Silk Kurtas & Twirling Lehengas',
      badge: 'TRENDING',
      categoryPill: 'DIWALI 2026',
      sampleProduct: getSample('ps-col-diwali', 'Diwali 2026 Collection'),
    },
    {
      id: 'sub-navratri-utsav',
      name: 'Navratri Utsav',
      tagline: 'Mirror-Work Folk Chaniya Cholis & Garba Kurtas',
      badge: 'BEST SELLER',
      categoryPill: 'NAVRATRI UTSAV',
      sampleProduct: getSample('ps-col-navratri', 'Navratri Utsav'),
    },
    {
      id: 'sub-halloween-col',
      name: 'Halloween Collection',
      tagline: 'Spooky & Cute Velvet Pumpkin Rompers & Costumes',
      badge: 'TRENDING',
      categoryPill: 'HALLOWEEN',
      sampleProduct: getSample('ps-col-halloween', 'Halloween Collection'),
    },
    {
      id: 'sub-rainwear-col',
      name: 'Rainwear Collection',
      tagline: '100% Waterproof Hooded Raincoats & Puddle Suits',
      badge: 'CLUB CHOICE',
      categoryPill: 'RAINWEAR',
      sampleProduct: getSample('ps-col-rainwear', 'Rainwear Collection'),
    },
    {
      id: 'sub-multipacks-col',
      name: 'Multi-packs',
      tagline: 'Bio-Washed Combed Cotton Value Packs of 5',
      badge: 'BEST SELLER',
      categoryPill: 'MULTI-PACKS',
      sampleProduct: getSample('ps-col-multipacks', 'Multi-packs'),
    },
    {
      id: 'sub-bestsellers-col',
      name: 'Bestsellers',
      tagline: 'Oxford Cotton Shirt & Suspender Bowtie Set',
      badge: 'TRENDING',
      categoryPill: 'BESTSELLERS',
      sampleProduct: getSample('ps-col-bestsellers', 'Bestsellers'),
    },
    {
      id: 'sub-babyessentials-col',
      name: 'Baby Essentials',
      tagline: 'Ultra-Soft Organic Side-Snap Kimono Rompers & Beanies',
      badge: 'CLUB CHOICE',
      categoryPill: 'BABY ESSENTIALS',
      sampleProduct: getSample('ps-col-babyessentials', 'Baby Essentials'),
    },
  ];

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    onAddToCart(product, defaultSize);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const displayedList =
    filterSub === 'all'
      ? collectionSubcategoriesList
      : collectionSubcategoriesList.filter((item) => item.name === filterSub);

  return (
    <section className="mb-10">
      {/* Top Header & Subcategory Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 font-black text-xs">
              7 Special Edits
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              Verified Quality • Instant Bag Add
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Curated Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Handpicked seasonal and festive wardrobes with verified parent reviews, authentic photo previews, and one-click bag add.
          </p>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setFilterSub('all');
              if (onSelectSubCategory) onSelectSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterSub === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/50 backdrop-blur-xs text-slate-700 hover:bg-amber-50/80 border border-slate-200/80'
            }`}
          >
            All Collections (7)
          </button>
          {collectionSubcategoriesList.map((sub) => {
            const isActive = filterSub === sub.name;
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => {
                  setFilterSub(sub.name);
                  if (onSelectSubCategory) onSelectSubCategory(sub.name);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/50 backdrop-blur-xs text-slate-700 hover:bg-amber-50/80 border border-slate-200/80'
                }`}
              >
                {sub.name.includes('Diwali') && (
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500 shrink-0" />
                )}
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Collection Cards replicating the exact Reference Image */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {displayedList.map((item) => {
          const product = item.sampleProduct;
          const isWishlisted = !!wishlist[product.id];
          const isAdded = !!addedIds[product.id];

          return (
            <div
              key={item.id}
              onClick={() => onQuickView(product)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Card Image Area with Badges & Wishlist */}
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <img
                  src={
                    product.imageUrl ||
                    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=85'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Top-Left Pill Badge matching screenshot */}
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1 z-10">
                  <span
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs ${
                      item.badge === 'TRENDING'
                        ? 'bg-sky-100/95 text-sky-800 border border-sky-200'
                        : item.badge === 'CLUB CHOICE'
                        ? 'bg-amber-100/95 text-amber-900 border border-amber-300'
                        : 'bg-rose-100/95 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Top-Right Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-1.5 sm:p-2 rounded-full shadow-md transition-all z-10 cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:bg-white'
                  }`}
                  aria-label="Add to Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Card Details Area */}
              <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1 sm:space-y-1.5">
                  {/* Brand & Subcategory pill tag */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 truncate max-w-[55%]">
                      {product.brand}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold uppercase border border-amber-300/80 bg-amber-50/70 text-amber-900 shrink-0 truncate max-w-[45%]">
                      {item.categoryPill}
                    </span>
                  </div>

                  {/* Product Title / Description */}
                  <h3
                    className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  {/* Rating with Parent Reviews count */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] sm:text-xs font-black text-amber-900">
                      <span>{product.rating.toFixed(1)}</span>
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-amber-500" />
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                      ({product.reviewCount} parents)
                    </span>
                  </div>
                </div>

                {/* Price & Club Box Area */}
                <div className="space-y-1.5 sm:space-y-2 pt-1 border-t border-slate-100">
                  {/* Pricing line */}
                  <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-slate-950">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-[10px] sm:text-xs font-black text-rose-600">
                      {product.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Club Price Pill / Box matching screenshot */}
                  <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-950 truncate">
                    <div className="flex items-center gap-1 shrink-0">
                      <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                      <span>Club:</span>
                    </div>
                    <span className="font-black text-amber-900 truncate">
                      ₹{product.clubPrice}
                    </span>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`w-full py-2 sm:py-2.5 rounded-xl font-black text-[11px] sm:text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer uppercase tracking-wider ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-amber-400 hover:bg-amber-500 active:scale-98 text-slate-950 hover:shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
