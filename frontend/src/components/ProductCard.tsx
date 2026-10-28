import React, { useState } from 'react';
import { Star, Heart, Crown, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductIllustration } from './ProductIllustration';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, size?: string, color?: { name: string; hex: string }) => void;
  onQuickView: (p: Product) => void;
  displaySubCategory?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  displaySubCategory,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(
      product,
      product.sizes[0] || 'Standard',
      product.colors[0] || { name: 'Standard', hex: '#1E293B' }
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Image Showcase with 3:4 portrait ratio for full-size cover display */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden flex items-center justify-center group/img">
        {/* Product Visual Illustration / Photo */}
        <div
          onClick={() => onQuickView(product)}
          className="cursor-pointer w-full h-full flex items-center justify-center overflow-hidden"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                // hide broken img so fallback shows
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="p-4 w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <ProductIllustration type={product.imageIllustration} className="w-full h-full max-h-48 object-contain" />
            </div>
          )}

          {/* Subtle Quick View / Full Size Preview Hover Overlay matching reference */}
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-900 font-extrabold text-xs shadow-md backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Full View • Quick Look</span>
            </span>
          </div>
        </div>

        {/* Tag / Badge: pill badge with rounded-full matching exact reference screenshot */}
        <span
          className="absolute top-3 left-3 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs text-sky-800 bg-sky-100/95 backdrop-blur-xs"
        >
          {product.tag || 'TRENDING'}
        </span>

        {/* Wishlist Button: circular white translucent button matching screenshot */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* Card Content matching exact screenshot */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className="truncate text-slate-500 font-extrabold max-w-[90px] sm:max-w-none">{product.brand}</span>
            <span className="shrink-0 text-[9px] sm:text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded border border-amber-200/60 truncate max-w-[80px] sm:max-w-none">
              {displaySubCategory || product.subCategory}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors leading-snug mb-1.5 sm:mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Ratings & Verified Reviews: 4.7 ★ (380 parents) */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-600 mb-2 sm:mb-3 flex-wrap">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold text-[10px] sm:text-xs border border-amber-200">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500 inline" />
            </div>
            <span className="text-slate-400 text-[10px] sm:text-xs font-normal">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing Zone without divider */}
        <div>
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
            <span className="text-base sm:text-xl font-black text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] sm:text-xs font-extrabold text-rose-600">
              {product.discountPercent}% OFF
            </span>
          </div>

          {/* Voraeclat Club Price Tag matching exact rounded bordered box */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-amber-900 bg-amber-50/80 border border-amber-200/90 rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 mb-2 sm:mb-3">
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">Club:</span>
            <strong className="font-bold text-slate-950">
              ₹{product.clubPrice.toLocaleString('en-IN')}
            </strong>
          </div>

          {/* Quick Add to Bag CTA matching golden button */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
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
};
