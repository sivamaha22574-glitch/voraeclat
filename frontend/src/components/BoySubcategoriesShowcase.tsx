import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface BoySubcategoriesShowcaseProps {
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
  onSelectSubCategory?: (subCategory: string) => void;
  selectedSubCategory?: string | null;
}

export interface BoySubcategoryItem {
  id: string;
  name: string;
  age: string;
  badge: string;
  sampleProduct: Product;
}

export const BoySubcategoriesShowcase: React.FC<BoySubcategoriesShowcaseProps> = ({
  onAddToCart,
  onQuickView,
  onSelectSubCategory,
  selectedSubCategory,
}) => {
  const [filterSub, setFilterSub] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedSubCategory && selectedSubCategory !== 'all') {
      const match = uniqueSubcategories.find(
        (u) => u.toLowerCase() === selectedSubCategory.toLowerCase()
      );
      if (match) {
        setFilterSub(match);
      }
    } else if (selectedSubCategory === 'all' || !selectedSubCategory) {
      setFilterSub('all');
    }
  }, [selectedSubCategory]);

  // Find sample product by id or subCategory
  const getSample = (id: string, fallbackSub: string): Product => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) return found;
    const fallback = PRODUCTS.find(
      (p) => p.categoryId === 'boy-fashion' && p.subCategory.toLowerCase() === fallbackSub.toLowerCase()
    );
    return fallback || PRODUCTS[0];
  };

  const boySubcategoriesList: BoySubcategoryItem[] = [
    {
      id: 'sub-festive',
      name: 'Festive & Kurta Sets',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-festive', 'Festive & Kurta Sets'),
    },
    {
      id: 'sub-suits',
      name: 'Sets & Suits',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-124', 'Sets & Suits'), // Doodle Poodle Dinosaur Graphic Tee & French Terry Shorts Set from screenshot!
    },
    {
      id: 'sub-suits-2',
      name: 'Sets & Suits',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-122', 'Sets & Suits'), // Primo Gino Boy's Oxford Cotton Shirt & Suspender Bowtie Set from screenshot!
    },
    {
      id: 'sub-suits-3',
      name: 'Sets & Suits',
      age: '0-14Y',
      badge: 'CLUB CHOICE',
      sampleProduct: getSample('ps-126', 'Sets & Suits'), // ToffyHouse Cozy Cable Knit Winter Sweater & Jogger Set from screenshot!
    },
    {
      id: 'sub-polos',
      name: 'T-Shirts & Polos',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-polos', 'T-Shirts & Polos'),
    },
    {
      id: 'sub-shirts',
      name: 'Shirts',
      age: '0-14Y',
      badge: 'CLUB CHOICE',
      sampleProduct: getSample('ps-boy-shirts', 'Shirts'),
    },
    {
      id: 'sub-jeans',
      name: 'Jeans & Trousers',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-jeans', 'Jeans & Trousers'),
    },
    {
      id: 'sub-trackpants',
      name: 'Pajamas & Trackpants',
      age: '0-14Y',
      badge: 'BEST SELLER',
      sampleProduct: getSample('ps-boy-trackpants', 'Pajamas & Trackpants'),
    },
    {
      id: 'sub-jackets',
      name: 'Sweatshirts & Jackets',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-jackets', 'Sweatshirts & Jackets'),
    },
    {
      id: 'sub-party',
      name: 'Party Wear',
      age: '0-14Y',
      badge: 'CLUB CHOICE',
      sampleProduct: getSample('ps-boy-party', 'Party Wear'),
    },
    {
      id: 'sub-nightwear',
      name: 'Nightwear',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-nightwear', 'Nightwear'),
    },
    {
      id: 'sub-footwear',
      name: 'Footwear & Sneakers',
      age: '0-14Y',
      badge: 'TRENDING',
      sampleProduct: getSample('ps-boy-footwear', 'Footwear & Sneakers'),
    },
  ];

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    onAddToCart(product, defaultSize);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const uniqueSubcategories = [
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
  ];

  const displayedList =
    filterSub === 'all'
      ? boySubcategoriesList
      : boySubcategoriesList.filter((item) => item.name === filterSub);

  return (
    <section className="mb-10">
      {/* Top Header & Subcategory Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boy Subcategories</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 font-black text-xs">
              0-14Y
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Quality • Direct Purchase
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Boy Subcategories (0–14Y)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete collection with authentic photography, ratings, price breakdown, and instant bag purchase.
          </p>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
          <button
            type="button"
            onClick={() => {
              setFilterSub('all');
              if (onSelectSubCategory) onSelectSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterSub === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-white/50 backdrop-blur-xs text-slate-700 hover:bg-amber-50/80 border border-slate-200/80'
            }`}
          >
            All Subcategories (0-14Y)
          </button>
          {uniqueSubcategories.map((subName) => (
            <button
              key={subName}
              type="button"
              onClick={() => {
                setFilterSub(subName);
                if (onSelectSubCategory) onSelectSubCategory(subName);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterSub === subName
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'bg-white/50 backdrop-blur-xs text-slate-600 hover:bg-amber-50/80 border border-slate-200/80'
              }`}
            >
              {subName}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards Exactly Matching User Reference Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {displayedList.map((sub, index) => {
          const product = sub.sampleProduct;
          const isWish = !!wishlist[product.id];
          const isAdded = !!addedIds[product.id];

          return (
            <div
              key={`${sub.id}-${index}`}
              className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Container with 3:4 portrait ratio for full-size cover display */}
              <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden flex items-center justify-center group/img">
                <div
                  onClick={() => onQuickView(product)}
                  className="cursor-pointer w-full h-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle Quick View / Full Size Preview Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-900 font-extrabold text-xs shadow-md backdrop-blur-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Full View • Quick Look</span>
                    </span>
                  </div>
                </div>

                {/* Top-Left Pill Badge matching exact reference screenshot */}
                <span className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 text-[9px] sm:text-[11px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs text-sky-800 bg-sky-100/95 backdrop-blur-xs truncate max-w-[70%]">
                  {sub.badge || product.tag || 'TRENDING'}
                </span>

                {/* Top-Right Wishlist Button matching exact circular translucent button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    isWish
                      ? 'bg-rose-50 text-rose-600 shadow-sm'
                      : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:bg-white'
                  }`}
                  title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWish ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Card Content matching exact reference view */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  {/* Row 1: Brand (left) & Subcategory (right) */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <span className="truncate text-slate-500 font-extrabold max-w-[55%]">{product.brand}</span>
                    <span className="shrink-0 text-[9px] sm:text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded border border-amber-200/60 truncate max-w-[45%]">
                      {sub.name}
                    </span>
                  </div>

                  {/* Row 2: Product Name (bold, 2-line clamped) */}
                  <h3
                    onClick={() => onQuickView(product)}
                    className="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors leading-snug mb-1.5 sm:mb-2"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  {/* Row 3: Rating (amber pill with star) & Parents review count */}
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 mb-2 sm:mb-3">
                    <div className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold text-[10px] sm:text-xs border border-amber-200">
                      <span>{product.rating}</span>
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500 inline" />
                    </div>
                    <span className="text-slate-400 text-[10px] sm:text-xs font-normal truncate">
                      ({product.reviewCount} parents)
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA Zone (without horizontal divider, exactly like screenshot) */}
                <div>
                  {/* Row 4: Pricing */}
                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                    <span className="text-base sm:text-xl font-black text-slate-950">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-extrabold text-rose-600">
                      {product.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Row 5: Club Price Box */}
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-amber-900 bg-amber-50/80 border border-amber-200/90 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 mb-2 sm:mb-3 truncate">
                    <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium shrink-0">Club:</span>
                    <strong className="font-bold text-slate-950 truncate">
                      ₹{product.clubPrice.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  {/* Row 6: Add to Bag Golden Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`w-full py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-slate-950'
                    }`}
                  >
                    <ShoppingBag className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isAdded ? 'text-white' : 'text-slate-950'}`} />
                    <span>{isAdded ? 'Added ✓' : 'Add to Bag'}</span>
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
