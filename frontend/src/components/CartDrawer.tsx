import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Crown,
  Tag,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types';
import { ProductIllustration } from './ProductIllustration';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  appliedCoupon: string;
  couponDiscount: number;
  onApplyCoupon: (code: string) => boolean | Promise<boolean>;
  onRemoveCoupon: () => void;
  isClubMember: boolean;
  onOpenClubModal: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  isClubMember,
  onOpenClubModal,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const rawTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const productDiscount = originalTotal - rawTotal;

  // Club savings
  const clubSavings = isClubMember
    ? items.reduce((sum, item) => sum + (item.product.price - item.product.clubPrice) * item.quantity, 0)
    : 0;

  const freeShippingThreshold = 499;
  const isFreeShipping = rawTotal >= freeShippingThreshold || (isClubMember && items.length > 0);
  const shippingFee = isFreeShipping || items.length === 0 ? 0 : 49;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - rawTotal);

  const finalTotal = Math.max(0, rawTotal - clubSavings - couponDiscount + shippingFee);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const ok = await onApplyCoupon(couponInput.trim().toUpperCase());
    if (!ok) {
      setCouponError('Invalid coupon code. Try WELCOME10, PUPPYFIRST or NEWBORN');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="font-extrabold text-slate-900 text-base">
              My Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/60 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked FREE Express Delivery!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} more for Free Delivery</span>
                <span>₹{rawTotal.toLocaleString('en-IN')} / ₹{freeShippingThreshold}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (rawTotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your shopping bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our curated collection of organic clothes, diapers, feeding gear, and toys.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                className="py-4 first:pt-0 last:pb-0 flex gap-3 sm:gap-4"
              >
                {/* Visual Thumbnail */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-slate-100 rounded-xl border border-slate-200 shrink-0 overflow-hidden relative flex items-center justify-center shadow-2xs">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-2 w-full h-full flex items-center justify-center bg-slate-50">
                      <ProductIllustration
                        type={item.product.imageIllustration}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Size: <span className="font-semibold text-slate-700">{item.selectedSize}</span> &bull; Color:{' '}
                      <span className="font-semibold text-slate-700">{item.selectedColor.name}</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-black font-mono text-slate-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-[11px] text-slate-400 line-through font-mono">
                          ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Module */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Coupon Code Engine */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code (e.g. PUPPYFIRST)"
                  className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-slate-300 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-mono"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}

            {appliedCoupon && (
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                <span className="font-semibold">
                  Coupon <strong>{appliedCoupon}</strong> Applied (-₹{couponDiscount.toLocaleString('en-IN')})
                </span>
                <button onClick={onRemoveCoupon} className="text-emerald-950 font-bold hover:underline">
                  Remove
                </button>
              </div>
            )}

            {/* Club Upsell if not member */}
            {!isClubMember && (
              <button
                onClick={onOpenClubModal}
                className="w-full p-2.5 rounded-xl bg-linear-to-r from-amber-100 to-yellow-100 border border-amber-300 text-left flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Join Voraeclat Club &amp; save extra ₹200+ today</span>
                </div>
                <span className="font-bold text-amber-800 underline">Join &rarr;</span>
              </button>
            )}

            {/* Price Line Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Bag Total (MRP)</span>
                <span className="font-mono tabular-nums">₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount</span>
                <span className="font-mono tabular-nums">-₹{productDiscount.toLocaleString('en-IN')}</span>
              </div>
              {clubSavings > 0 && (
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Voraeclat Club Member Discount</span>
                  <span className="font-mono tabular-nums">-₹{clubSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
