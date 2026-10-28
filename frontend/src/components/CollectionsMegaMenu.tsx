import React from 'react';
import { Sparkles, ArrowRight, X, Flame, ShieldCheck, Heart, Star, Crown } from 'lucide-react';

interface CollectionsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollection: (collectionName: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface CuratedCollectionItem {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  badgeStyle: string;
  borderColor: string;
  bgGradient: string;
  subItems: string[];
}

export const CURATED_COLLECTIONS: CuratedCollectionItem[] = [
  {
    id: 'diwali-2026',
    name: 'Diwali 2026 Collection',
    tagline: 'Royal Zari Silk Kurtas & Twirling Lehengas',
    badge: 'NEW 🔥',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
    borderColor: 'border-amber-200',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    subItems: [
      'Zari Silk Kurtas',
      'Twirling Lehengas',
      'Dhoti & Angrakha Sets',
      'Embroidered Sherwanis',
      'Festive Footwear',
    ],
  },
  {
    id: 'navratri-utsav',
    name: 'Navratri Utsav',
    tagline: 'Mirror-Work Folk Chaniya Cholis & Garba Kurtas',
    badge: 'FESTIVE',
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-300',
    borderColor: 'border-rose-200',
    bgGradient: 'from-rose-500/10 to-pink-500/5',
    subItems: [
      'Mirror-Work Chaniya Cholis',
      'Folk Garba Kurtas',
      'Kediyu & Dhoti Sets',
      'Oxidized Kids Jewelry',
      'Dandiya Accessories',
    ],
  },
  {
    id: 'halloween-collection',
    name: 'Halloween Collection',
    tagline: 'Spooky & Cute Velvet Pumpkin Rompers & Costumes',
    badge: 'TRENDING',
    badgeStyle: 'bg-purple-100 text-purple-900 border-purple-300',
    borderColor: 'border-purple-200',
    bgGradient: 'from-purple-500/10 to-orange-500/5',
    subItems: [
      'Pumpkin Velvet Rompers',
      'Little Witch Dresses',
      'Superhero Costumes',
      'Glow-in-the-Dark Tees',
      'Bat Wing Capes',
    ],
  },
  {
    id: 'rainwear-collection',
    name: 'Rainwear Collection',
    tagline: '100% Waterproof Hooded Raincoats & Puddle Suits',
    badge: 'MONSOON',
    badgeStyle: 'bg-sky-100 text-sky-900 border-sky-300',
    borderColor: 'border-sky-200',
    bgGradient: 'from-sky-500/10 to-cyan-500/5',
    subItems: [
      'Hooded Raincoats',
      'Waterproof Puddle Suits',
      'Gumboots & Rain Boots',
      'Character Umbrellas',
      'Windproof Jackets',
    ],
  },
  {
    id: 'multi-packs',
    name: 'Multi-packs',
    tagline: 'Bio-Washed Combed Cotton Value Packs of 5',
    badge: 'BEST SELLER',
    badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    borderColor: 'border-emerald-200',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    subItems: [
      'Pack of 5 Rompers',
      '3-Pack Graphic Tees',
      'Cotton Jhablas Sets',
      'Socks & Booties Packs',
      'Daily Wear Vests',
    ],
  },
  {
    id: 'bestsellers',
    name: 'Bestsellers',
    tagline: 'Top-Rated Outfits & Award-Winning Essentials',
    badge: '4.9★ RATED',
    badgeStyle: 'bg-amber-100 text-amber-950 border-amber-300',
    borderColor: 'border-amber-200',
    bgGradient: 'from-amber-500/10 to-yellow-500/5',
    subItems: [
      'Birthday Twirl Frocks',
      'Shirt & Suspender Sets',
      'Explorer Dungarees',
      'Muslin Swaddles',
      'Award-Winning Toys',
    ],
  },
  {
    id: 'baby-essentials',
    name: 'Baby Essentials',
    tagline: 'Ultra-Soft Organic Newborn & Nursery Necessities',
    badge: '0-24M CLUB',
    badgeStyle: 'bg-rose-100 text-rose-900 border-rose-300',
    borderColor: 'border-rose-200',
    bgGradient: 'from-rose-500/10 to-amber-500/5',
    subItems: [
      'Side-Snap Kimono Rompers',
      'Scratch Mittens & Caps',
      'Bamboo Tape Diapers',
      'Anti-Colic Bottles',
      'Organic Bath Care',
    ],
  },
];

export const CollectionsMegaMenu: React.FC<CollectionsMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCollection,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 z-50 mega-menu-glass border-b-2 border-amber-400 shadow-2xl animate-in fade-in slide-in-from-top-1 transition-all duration-200 max-h-[85vh] overflow-y-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header bar of Collections Mega Menu */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-300/40">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2
              className="text-sm font-['Plus_Jakarta_Sans'] uppercase tracking-wider flex items-center gap-1.5"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <span style={{ fontWeight: 'bold', color: '#000000' }}>SHOP BY COLLECTION</span>
              <span className="text-slate-500 font-medium">•</span>
              <span className="text-amber-700 font-black">7 CURATED SEASONAL &amp; FESTIVE EDITS</span>
            </h2>
            <span className="text-[11px] bg-amber-100/90 text-amber-950 border border-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Festive, Seasonal &amp; Value Packs
            </span>
            <span className="text-[11px] bg-emerald-100/90 text-emerald-950 border border-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              100% Parent Approved
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectCollection('all');
                onClose();
              }}
              className="text-xs font-black text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Collections</span>
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

        {/* 7-Column Grid representing the 7 Curated Collections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-3 text-[13px]">
          {CURATED_COLLECTIONS.map((col, index) => (
            <div
              key={col.id}
              className={`space-y-2.5 flex flex-col justify-between ${
                index < CURATED_COLLECTIONS.length - 1
                  ? 'lg:border-r lg:border-slate-300/50 lg:pr-3'
                  : ''
              }`}
            >
              <div className="space-y-2">
                {/* Collection Title & Badge */}
                <div className="pb-1.5 border-b border-amber-300/80">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border shrink-0 ${col.badgeStyle}`}
                    >
                      {col.badge}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCollection(col.name);
                      onClose();
                    }}
                    className="uppercase text-[11px] tracking-wider text-left block w-full truncate transition-colors cursor-pointer hover:text-amber-600"
                    style={{ fontWeight: 'bold', color: '#000000' }}
                    title={col.name}
                  >
                    {col.name}
                  </button>
                </div>

                {/* Subitems */}
                <ul className="space-y-1">
                  {col.subItems.map((subItem) => (
                    <li key={subItem}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCollection(subItem);
                          onClose();
                        }}
                        className="mega-menu-link text-left block w-full py-0.5 text-xs truncate cursor-pointer hover:translate-x-1 transition-all"
                        style={{ fontWeight: 'bold', color: '#000000' }}
                        title={subItem}
                      >
                        <span style={{ fontWeight: 'bold', color: '#000000' }}>{subItem}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Card Action Button */}
              <button
                type="button"
                onClick={() => {
                  onSelectCollection(col.name);
                  onClose();
                }}
                className="mt-2 w-full py-1.5 px-2 bg-white/80 hover:bg-amber-400 hover:text-black text-[11px] rounded-lg border border-slate-300/70 hover:border-amber-300 transition-all text-center cursor-pointer truncate shadow-2xs"
                style={{ fontWeight: 'bold', color: '#000000' }}
              >
                Shop {col.name.split(' ')[0]} →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Curated Quick Action Pills */}
        <div className="mt-5 pt-3.5 border-t border-amber-300/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/40 backdrop-blur-md p-2.5 rounded-xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <Crown className="w-3 h-3 text-amber-700" />
              <span>Festive &amp; Seasonal:</span>
            </span>
            {['Diwali 2026 Collection', 'Navratri Utsav', 'Halloween Collection', 'Rainwear Collection'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onSelectCollection(name);
                  onClose();
                }}
                className="px-2.5 py-0.5 text-[11px] bg-white/90 hover:bg-amber-400 hover:text-black rounded-md border border-amber-300 transition-all cursor-pointer shadow-2xs"
                style={{ fontWeight: 'bold', color: '#000000' }}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1"
              style={{ fontWeight: 'bold', color: '#000000' }}
            >
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Packs &amp; Essentials:</span>
            </span>
            {['Multi-packs', 'Bestsellers', 'Baby Essentials'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onSelectCollection(name);
                  onClose();
                }}
                className="px-2.5 py-0.5 text-[11px] bg-white/90 hover:bg-emerald-500 hover:text-white rounded-md border border-emerald-300 transition-all cursor-pointer shadow-2xs"
                style={{ fontWeight: 'bold', color: '#000000' }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
