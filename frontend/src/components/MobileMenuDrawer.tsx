import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Crown,
  Building2,
  Phone,
  Palette,
  Heart,
  ShoppingBag,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CategoryId } from '../types';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectSubCategory?: (cat: CategoryId, sub: string) => void;
  onOpenClubModal: () => void;
  onOpenFranchise?: () => void;
  onOpenContact?: () => void;
  onOpenThemeModal?: () => void;
  onOpenAdmin?: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  deliveryPincode: string;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectSubCategory,
  onOpenClubModal,
  onOpenFranchise,
  onOpenContact,
  onOpenThemeModal,
  onOpenAdmin,
  onOpenWishlist,
  onOpenCart,
  deliveryPincode,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('boy');

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleSubClick = (cat: CategoryId, sub: string) => {
    if (onSelectSubCategory) {
      onSelectSubCategory(cat, sub);
    } else {
      onSelectCategory(cat);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex sm:hidden animate-in fade-in duration-200">
      <div className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-black tracking-tight text-amber-300">
              HAY!
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              &bull; Voraeclat
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliver to Pincode Strip */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              Deliver to: <strong>{deliveryPincode}</strong>
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Express
          </span>
        </div>

        {/* Menu Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-sm">
          {/* 1. Festive & Ethnic (Kurta Sets, Lehengas) */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('ethnic')}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🪔</span>
                <span>Festive &amp; Ethnic (Kurta Sets)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection === 'ethnic' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'ethnic' && (
              <div className="bg-slate-50 px-6 py-2 space-y-1.5 text-xs text-slate-700">
                {[
                  'Kurta Sets',
                  'Frocks & Dresses',
                  'Sets & Suits',
                  'Ethnic Wear',
                  'Party Wear',
                  'Diwali 2026 Collection',
                  'Navratri Utsav',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubClick('festive-ethnic', item)}
                    className="w-full text-left py-1.5 hover:text-amber-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Boy Fashion */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('boy')}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👦</span>
                <span>Boy Fashion (0–14Y)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection === 'boy' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'boy' && (
              <div className="bg-slate-50 px-6 py-2 space-y-1.5 text-xs text-slate-700">
                {[
                  'T-shirts & Polos',
                  'Shirts',
                  'Sets & Suits',
                  'Ethnic Wear',
                  'Jeans & Trousers',
                  'Pajamas & Trackpants',
                  'Party Wear',
                  'Footwear & Sneakers',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubClick('boy-fashion', item)}
                    className="w-full text-left py-1.5 hover:text-amber-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Girl Fashion */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('girl')}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👧</span>
                <span>Girl Fashion (0–14Y)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection === 'girl' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'girl' && (
              <div className="bg-slate-50 px-6 py-2 space-y-1.5 text-xs text-slate-700">
                {[
                  'Dresses & Frocks',
                  'Festive Frocks',
                  'Lehenga Sets',
                  'Kurta Sets',
                  'Ethnic Wear',
                  'Tops & T-shirts',
                  'Jeans & Jeggings',
                  'Footwear & Ballerinas',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubClick('girl-fashion', item)}
                    className="w-full text-left py-1.5 hover:text-rose-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Baby Essentials (0-24M) */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('baby')}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👶</span>
                <span>Baby Essentials (0–24M)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection === 'baby' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'baby' && (
              <div className="bg-slate-50 px-6 py-2 space-y-1.5 text-xs text-slate-700">
                {[
                  'Newborn & Preemie',
                  'Onesies & Rompers',
                  'Jhablas & Vests Set',
                  'Diapers & Wipes',
                  'Feeding & Nursing',
                  'Bath & Skin Care',
                  'Booties & Scratch Mittens',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubClick('baby-toddler', item)}
                    className="w-full text-left py-1.5 hover:text-emerald-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Curated Collections (7) */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Curated Collections</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection === 'collections' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSection === 'collections' && (
              <div className="bg-slate-50 px-6 py-2 space-y-1.5 text-xs text-slate-700">
                {[
                  'Diwali 2026 Collection',
                  'Navratri Utsav',
                  'Halloween Collection',
                  'Rainwear Collection',
                  'Multi-packs',
                  'Bestsellers',
                  'Baby Essentials',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === 'Baby Essentials') {
                        handleSubClick('baby-toddler', 'Baby Essentials');
                      } else {
                        handleSubClick('festive-ethnic', item);
                      }
                    }}
                    className="w-full text-left py-1.5 hover:text-amber-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Direct Category Links */}
          <div className="p-3 space-y-1">
            <button
              onClick={() => {
                onSelectCategory('toys-learning');
                onClose();
              }}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800"
            >
              <span>🧸 Toys &amp; Games</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('diapering');
                onClose();
              }}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800"
            >
              <span>🍼 Diapers &amp; Wipes</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('nursery-gear');
                onClose();
              }}
              className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800"
            >
              <span>🚼 Cribs, Strollers &amp; Gear</span>
            </button>
          </div>
        </div>

        {/* Footer Utilities */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
          <button
            onClick={() => {
              onOpenClubModal();
              onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Crown className="w-4 h-4 text-slate-950" />
            <span>Join Voraeclat Club VIP (Extra 10% OFF)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {onOpenFranchise && (
              <button
                onClick={() => {
                  onOpenFranchise();
                  onClose();
                }}
                className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Franchise</span>
              </button>
            )}

            {onOpenContact && (
              <button
                onClick={() => {
                  onOpenContact();
                  onClose();
                }}
                className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Contact Us</span>
              </button>
            )}
          </div>

          {onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="w-full py-2 bg-slate-900 text-amber-300 hover:bg-slate-800 rounded-lg border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin &amp; Ad Dashboard</span>
            </button>
          )}

          {onOpenThemeModal && (
            <button
              onClick={() => {
                onOpenThemeModal();
                onClose();
              }}
              className="w-full py-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Change Website Theme</span>
            </button>
          )}

          <div className="text-[11px] text-slate-400 text-center pt-1">
            Helpline: <strong>1800-VORAE-CARE</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
