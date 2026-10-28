import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductIllustration } from './ProductIllustration';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onMoveToBag: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToBag,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-extrabold text-slate-900 text-base">
              My Saved Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No saved items yet</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Tap the heart icon on any product to save it here for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3">
                <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 shrink-0 overflow-hidden relative flex items-center justify-center shadow-2xs">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-2 w-full h-full flex items-center justify-center bg-slate-50">
                      <ProductIllustration type={item.imageIllustration} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveFromWishlist(item)}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">{item.brand}</div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-black font-mono text-slate-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[11px] text-slate-400 line-through font-mono">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onMoveToBag(item)}
                      className="w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                wishlist.forEach((p) => onMoveToBag(p));
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Move All to Shopping Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
