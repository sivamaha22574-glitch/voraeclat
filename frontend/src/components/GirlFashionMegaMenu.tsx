import React from 'react';
import { Sparkles, ArrowRight, X, Flame, Crown, Tag } from 'lucide-react';

interface GirlFashionMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (
    item: string,
    type: 'category' | 'collection' | 'accessory' | 'footwear' | 'age' | 'price' | 'brand'
  ) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const GIRL_FASHION_CATEGORIES = [
  {
    title: 'Dresses & Frocks',
    badge: 'Popular',
    items: [
      'Casual / A-Line Day Dresses',
      'Party & Birthday Frocks',
      'Maxi & Sundresses',
      'Shirt & Tiered Dresses',
      'Pinafores',
      'Tutu & Tulle Dresses',
    ],
  },
  {
    title: 'Tops & Blouses',
    badge: 'Trending',
    items: [
      'Graphic T-Shirts',
      'Basic Crew Necks',
      'Peplum & Ruffle Tops',
      'Blouses',
      'Crop Tops',
      'Sleeveless Tops',
    ],
  },
  {
    title: 'Skirts & Bottoms',
    badge: null,
    items: [
      'Skirts',
      'Shorts',
      'Jeans',
      'Leggings & Jeggings',
      'Culottes & Palazzos',
      'Joggers & Sweatpants',
    ],
  },
  {
    title: 'Sets & Jumpsuits',
    badge: 'New',
    items: [
      'Co-ord Sets',
      'Rompers',
      'Jumpsuits',
      'Denim Overalls',
    ],
  },
  {
    title: 'Ethnic Wear',
    badge: 'Festive 🔥',
    items: [
      'Lehengas & Cholis',
      'Anarkali & Kurta Sets',
      'Sharara & Gharara Sets',
      'Salwar Kameez',
      'Pattu Pavadai',
    ],
  },
  {
    title: 'Outerwear',
    badge: null,
    items: [
      'Cardigans & Sweaters',
      'Denim Jackets',
      'Hoodies & Sweatshirts',
      'Puffer Coats',
      'Faux Fur Jackets',
    ],
  },
  {
    title: 'Sleep & Active',
    badge: null,
    items: [
      'Nightdresses',
      'Cotton Pajama Sets',
      'Dancewear',
      'Swimsuits',
    ],
  },
];

const AGE_PILLS = [
  { label: '0-3M', value: '0-3 Months' },
  { label: '3-6M', value: '3-6 Months' },
  { label: '6-12M', value: '6-12 Months' },
  { label: '1-2Y', value: '12-18 Months' },
  { label: '2-4Y', value: '2 to 4 Years' },
  { label: '4-6Y', value: '4 to 6 Years' },
  { label: '6-8Y', value: '6 to 8 Years' },
  { label: '8-12Y', value: '8+ Years' },
];

const PRICE_TIERS = [
  'All Under ₹299',
  'All Under ₹499',
  'All Under ₹799',
  'All Under ₹999',
];

export const GirlFashionMegaMenu: React.FC<GirlFashionMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 z-50 mega-menu-glass border-b-2 border-rose-400 shadow-2xl animate-in fade-in slide-in-from-top-1 transition-all duration-200 max-h-[85vh] overflow-y-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header bar of Girl Fashion Mega Menu */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-300/40">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2
              className="text-sm font-['Plus_Jakarta_Sans'] uppercase tracking-wider flex items-center gap-1.5"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <span style={{ fontWeight: 'bold', color: '#000000' }}>GIRL FASHION</span>
              <span className="text-slate-500 font-medium">•</span>
              <span className="text-rose-700 font-black">MULTI-COLUMN CURATED MEGA MENU</span>
            </h2>
            <span className="text-[11px] bg-rose-100/90 text-rose-950 border border-rose-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Crown className="w-3 h-3 text-rose-600" />
              Ages 0 - 14 Years
            </span>
            <span className="text-[11px] bg-amber-100/90 text-amber-950 border border-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Diwali &amp; Party Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectItem('all', 'category');
                onClose();
              }}
              className="text-xs font-black text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Girl Fashion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-black p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Column Grid representing the 7 Girl Fashion Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-3 text-[13px]">
          {GIRL_FASHION_CATEGORIES.map((categoryGroup, index) => (
            <div
              key={categoryGroup.title}
              className={`space-y-2.5 ${
                index < GIRL_FASHION_CATEGORIES.length - 1
                  ? 'lg:border-r lg:border-slate-300/50 lg:pr-3'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-rose-300/80">
                <h3
                  className="uppercase text-[11px] tracking-wider truncate"
                  style={{ fontWeight: 'bold', color: '#000000' }}
                >
                  {categoryGroup.title}
                </h3>
                {categoryGroup.badge && (
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full shrink-0 ${
                      categoryGroup.badge.includes('🔥')
                        ? 'bg-amber-200/90 text-amber-950 border border-amber-400'
                        : categoryGroup.badge === 'Popular'
                        ? 'bg-rose-200/90 text-rose-950 border border-rose-300'
                        : 'bg-emerald-200/90 text-emerald-950 border border-emerald-300'
                    }`}
                  >
                    {categoryGroup.badge}
                  </span>
                )}
              </div>

              <ul className="space-y-1">
                {categoryGroup.items.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectItem(item, 'category');
                        onClose();
                      }}
                      className="mega-menu-link-rose text-left block w-full py-0.5 text-xs truncate cursor-pointer hover:translate-x-1 transition-all"
                      style={{ fontWeight: 'bold', color: '#000000' }}
                      title={item}
                    >
                      <span style={{ fontWeight: 'bold', color: '#000000' }}>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Quick Age Filter Chips, Price Tiers & Promotional Feature */}
        <div className="mt-5 pt-3.5 border-t border-rose-300/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/40 backdrop-blur-md p-2.5 rounded-xl border border-rose-200/80 shadow-xs">
          {/* Shop by Age Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <Crown className="w-3 h-3 text-rose-600" />
              <span>Shop Age:</span>
            </span>
            {AGE_PILLS.map((age) => (
              <button
                key={age.label}
                type="button"
                onClick={() => {
                  onSelectItem(age.value, 'age');
                  onClose();
                }}
                className="px-2 py-0.5 text-[11px] bg-white/90 hover:bg-rose-500 hover:text-white rounded-md border border-rose-300 transition-all cursor-pointer shadow-2xs"
                style={{ fontWeight: 'bold', color: '#000000' }}
              >
                {age.label}
              </button>
            ))}
          </div>

          {/* Quick Price Deals */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <Tag className="w-3 h-3 text-rose-600" />
              <span>Budget:</span>
            </span>
            {PRICE_TIERS.map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => {
                  onSelectItem(pr, 'price');
                  onClose();
                }}
                className="px-2 py-0.5 text-[11px] bg-white/90 hover:bg-amber-400 hover:text-black rounded-md border border-amber-300 transition-all cursor-pointer shadow-2xs"
                style={{ fontWeight: 'bold', color: '#000000' }}
              >
                {pr}
              </button>
            ))}
          </div>

          {/* Festive Collection CTA Pill */}
          <button
            type="button"
            onClick={() => {
              onSelectItem('Diwali 2026 Collection', 'collection');
              onClose();
            }}
            className="px-3 py-1 bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-black rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>FESTIVE TWIRL COLLECTION →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
