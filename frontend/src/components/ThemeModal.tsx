import React, { useState } from 'react';
import {
  Palette,
  X,
  Check,
  Sparkles,
  Sun,
  Moon,
  Flame,
  Heart,
  Droplets,
  Flower2,
  Gift,
  PartyPopper,
  Calendar,
} from 'lucide-react';
import { BgTheme } from './Header';

export interface ThemeOption {
  id: BgTheme;
  name: string;
  category: 'festival' | 'everyday';
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  swatches: string[];
  bgPreviewClass: string;
  cardPreviewClass: string;
  accentClass: string;
  icon: React.ReactNode;
}

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BgTheme;
  onSelectTheme: (theme: BgTheme) => void;
}

export const THEME_OPTIONS: ThemeOption[] = [
  // ---------------- FESTIVAL THEMES ----------------
  {
    id: 'feb14-valentine',
    name: "Feb 14 Valentine's Day ❤️",
    category: 'festival',
    badge: 'Feb 14 Special',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    tagline: 'Romantic crimson roses, sweetheart pink & candy love',
    description:
      'Passionate celebratory Valentine theme with soft ruby blush, red hearts, rose gold banners, and joyful sweetheart kidswear ambiance.',
    swatches: ['#fff1f2', '#f43f5e', '#be123c', '#881337'],
    bgPreviewClass: 'bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200',
    cardPreviewClass: 'bg-white border-rose-300 text-rose-950',
    accentClass: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold',
    icon: <Heart className="w-5 h-5 text-rose-600 fill-rose-100" />,
  },
  {
    id: 'tamil-newyear',
    name: 'Tamil New Year (புத்தாண்டு) 🌾',
    category: 'festival',
    badge: 'Puthandu Utsav',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
    tagline: 'Kanchipuram silk gold, turmeric yellow & mango leaf green',
    description:
      'Traditional auspicious Tamil festive atmosphere with vibrant silk gold, mango leaf toran green, kolam motifs, and temple heritage tones.',
    swatches: ['#fefce8', '#facc15', '#16a34a', '#854d0e'],
    bgPreviewClass: 'bg-gradient-to-br from-amber-100 via-yellow-100 to-emerald-100',
    cardPreviewClass: 'bg-[#fffdf5] border-amber-400 text-amber-950',
    accentClass: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold',
    icon: <Sun className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 'newyear-gala',
    name: 'New Year 2026 Celebration 🎆',
    category: 'festival',
    badge: 'New Year 2026',
    badgeColor: 'bg-indigo-900 text-amber-300 border-amber-400/40 font-bold',
    tagline: 'Midnight royal navy, champagne confetti & golden sparklers',
    description:
      'Electrifying midnight celebration theme with deep starry navy, sparkling champagne confetti, gold metallic accents, and festive countdown spirit.',
    swatches: ['#0f172a', '#1e3a8a', '#facc15', '#e2e8f0'],
    bgPreviewClass: 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900',
    cardPreviewClass: 'bg-slate-900/90 border-blue-800 text-amber-100',
    accentClass: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold',
    icon: <PartyPopper className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'pongal-harvest',
    name: 'Pongal / Sankranti Harvest 🍯',
    category: 'festival',
    badge: 'Harvest Festival',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    tagline: 'Sugarcane emerald, golden grain yellow & terracotta pot bronze',
    description:
      'Joyous harvest celebration with sugarcane hues, fresh milk kolam accents, clay pot terracotta warmth, and sweet Pongal abundance.',
    swatches: ['#f0fdf4', '#15803d', '#f59e0b', '#9a3412'],
    bgPreviewClass: 'bg-gradient-to-br from-emerald-50 via-yellow-50 to-amber-50',
    cardPreviewClass: 'bg-white border-emerald-300 text-emerald-950',
    accentClass: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold',
    icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'festive-gold',
    name: 'Diwali 2026 Festive Glow 🪔',
    category: 'festival',
    badge: 'Diwali Edition',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    tagline: 'Golden champagne warmth with glittering diyas & festive maroon',
    description:
      'Celebratory traditional Indian festive atmosphere with glowing diya warmth, warm ivory surfaces, and rich gold-maroon elegance.',
    swatches: ['#fffbf0', '#fef3c7', '#d97706', '#991b1b'],
    bgPreviewClass: 'bg-gradient-to-br from-amber-50 via-amber-100/60 to-rose-50',
    cardPreviewClass: 'bg-[#fffdf9] border-amber-300 text-amber-950',
    accentClass: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold',
    icon: <Flame className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 'navratri-utsav',
    name: 'Navratri & Dussehra Utsav 🪘',
    category: 'festival',
    badge: 'Dandiya Special',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300 font-bold',
    tagline: '9-color Garba radiance, peacock blue, magenta & mirrorwork glow',
    description:
      'Vibrant celebration with nine festive hues, royal peacock turquoise, energetic magenta pink, and festive Dandiya dance vitality.',
    swatches: ['#fdf4ff', '#c026d3', '#0891b2', '#ea580c'],
    bgPreviewClass: 'bg-gradient-to-br from-fuchsia-100 via-pink-100 to-amber-100',
    cardPreviewClass: 'bg-white border-fuchsia-300 text-purple-950',
    accentClass: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold',
    icon: <Sparkles className="w-5 h-5 text-fuchsia-600" />,
  },
  {
    id: 'christmas-winter',
    name: 'Christmas & Winter Holiday 🎄',
    category: 'festival',
    badge: 'Holiday Cheer',
    badgeColor: 'bg-red-100 text-red-900 border-red-300 font-bold',
    tagline: 'Festive holly red, evergreen pine, candy cane & snowy joy',
    description:
      'Magical holiday spirit with cozy crimson reds, spruce evergreen, candy cane stripes, golden jingle bells, and snowy wonder.',
    swatches: ['#fef2f2', '#dc2626', '#166534', '#facc15'],
    bgPreviewClass: 'bg-gradient-to-br from-red-100 via-emerald-50 to-slate-100',
    cardPreviewClass: 'bg-white border-red-300 text-red-950',
    accentClass: 'bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold',
    icon: <Gift className="w-5 h-5 text-red-600" />,
  },

  // ---------------- EVERYDAY & COLORS ----------------
  {
    id: 'clean-slate',
    name: 'Clean Slate (Default)',
    category: 'everyday',
    badge: 'Modern Pure',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    tagline: 'Crisp white & airy light slate aesthetic',
    description:
      'Classic high-contrast e-commerce look with crisp white cards, neutral slate backgrounds, and warm amber gold badges.',
    swatches: ['#ffffff', '#f1f5f9', '#f59e0b', '#0f172a'],
    bgPreviewClass: 'bg-slate-100',
    cardPreviewClass: 'bg-white border-slate-200 text-slate-900',
    accentClass: 'bg-amber-400 text-slate-950',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush & Peach',
    category: 'everyday',
    badge: 'Pastel Charm',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    tagline: 'Gentle strawberry milk & whimsical sweet pastels',
    description:
      'Delightful, tender pastel aesthetic with soft blush hues, gentle rose borders, and cozy nursery sweetness.',
    swatches: ['#fff1f2', '#ffe4e6', '#fb7185', '#e11d48'],
    bgPreviewClass: 'bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50',
    cardPreviewClass: 'bg-white border-rose-200 text-rose-950',
    accentClass: 'bg-rose-500 text-white font-bold',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze & Mint',
    category: 'everyday',
    badge: 'Cool Aqua',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300 font-bold',
    tagline: 'Cool seafoam mint & refreshing crystal cyan',
    description:
      'Vibrant seaside freshness with soothing mint undertones, aqua highlights, and crisp airy contrast.',
    swatches: ['#f0fdfa', '#ccfbf1', '#14b8a6', '#0f766e'],
    bgPreviewClass: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50',
    cardPreviewClass: 'bg-white border-teal-200 text-teal-950',
    accentClass: 'bg-teal-600 text-white font-bold',
    icon: <Droplets className="w-5 h-5 text-teal-500" />,
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    category: 'everyday',
    badge: 'Royal Lilac',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    tagline: 'Whimsical boutique flair with soft royal lilac',
    description:
      'Chic royal elegance with soothing lavender tints, delicate purple badges, and dreamy fairytale ambiance.',
    swatches: ['#faf5ff', '#f3e8ff', '#a855f7', '#6b21a8'],
    bgPreviewClass: 'bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50',
    cardPreviewClass: 'bg-white border-purple-200 text-purple-950',
    accentClass: 'bg-purple-600 text-white font-bold',
    icon: <Flower2 className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 'modern-dark',
    name: 'Midnight Luxe (Dark)',
    category: 'everyday',
    badge: 'Dark Mode 🌙',
    badgeColor: 'bg-slate-800 text-amber-300 border-slate-700 font-bold',
    tagline: 'High contrast starry night & sleek obsidian surfaces',
    description:
      'Ultra-modern dark theme with deep onyx backgrounds, slate cards, vibrant gold accents, and easy-on-the-eyes nighttime contrast.',
    swatches: ['#090d16', '#1e293b', '#f59e0b', '#ffffff'],
    bgPreviewClass: 'bg-slate-900',
    cardPreviewClass: 'bg-slate-800 border-slate-700 text-slate-100',
    accentClass: 'bg-amber-400 text-slate-950 font-bold',
    icon: <Moon className="w-5 h-5 text-indigo-400" />,
  },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'festival' | 'everyday'>('festival');

  if (!isOpen) return null;

  const filteredThemes = THEME_OPTIONS.filter((t) => {
    if (activeTab === 'all') return true;
    return t.category === activeTab;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Palette className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Festival & Overall Website Themes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select special festival ambiances (Feb 14 Valentine, Tamil New Year, New Year 2026, Pongal, Diwali) or classic everyday store styles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('festival')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'festival'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>🎉 Festival Themes (7)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('everyday')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'everyday'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-slate-700" />
            <span>✨ Everyday Styles (5)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>All Themes (12)</span>
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
          {filteredThemes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 ring-3 ring-amber-200/60 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                }`}
              >
                {/* Active Indicator Chip */}
                {isSelected && (
                  <span className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Active Theme
                  </span>
                )}

                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                        {theme.icon}
                      </div>
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {theme.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${theme.badgeColor}`}
                    >
                      {theme.badge}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs font-medium text-slate-600 mb-3">{theme.tagline}</p>

                  {/* Miniature Visual Mockup */}
                  <div
                    className={`rounded-xl p-2.5 border border-slate-200/70 mb-3 ${theme.bgPreviewClass}`}
                  >
                    <div
                      className={`rounded-lg p-2 border shadow-xs flex items-center justify-between text-[11px] font-semibold ${theme.cardPreviewClass}`}
                    >
                      <span>Festive Kids Wear</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${theme.accentClass}`}>
                        ₹899
                      </span>
                    </div>
                  </div>

                  {/* Swatches Bar */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                      Palette:
                    </span>
                    {theme.swatches.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    {isSelected ? 'Applied to store' : 'Click to apply theme'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTheme(theme.id);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Apply'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Festival theme changes whole-site colors, banners & ambience.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
