import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Palette,
  Check,
  ChevronDown,
  X,
  RotateCcw,
} from 'lucide-react';

interface DiwaliCollectionBannerProps {
  onSelectCategoryFilter: (subCategory: string) => void;
  activeFilter?: string;
  onShopNow: () => void;
}

export interface BannerTheme {
  id: string;
  name: string;
  badge: string;
  bgGradient: string;
  borderColor: string;
  glow1: string;
  glow2: string;
  textColor: string;
  headlineGradient: string;
  swatchColors: [string, string, string];
}

const BANNER_THEMES: BannerTheme[] = [
  {
    id: 'royal-maroon',
    name: 'Royal Maroon & Gold',
    badge: 'Classic Diwali',
    bgGradient: 'bg-gradient-to-br from-[#4a0413] via-[#750e2b] to-[#2b020c]',
    borderColor: 'border-amber-400/50',
    glow1: 'bg-amber-500/20',
    glow2: 'bg-rose-500/25',
    textColor: 'text-amber-200',
    headlineGradient: 'from-amber-200 via-amber-100 to-amber-400',
    swatchColors: ['#4a0413', '#750e2b', '#fbbf24'],
  },
  {
    id: 'midnight-gold',
    name: 'Imperial Midnight & Gold',
    badge: 'Night Lights',
    bgGradient: 'bg-gradient-to-br from-[#0c1222] via-[#1a233a] to-[#080d1a]',
    borderColor: 'border-amber-300/50',
    glow1: 'bg-amber-400/25',
    glow2: 'bg-indigo-500/30',
    textColor: 'text-amber-300',
    headlineGradient: 'from-amber-200 via-yellow-100 to-amber-300',
    swatchColors: ['#0c1222', '#1a233a', '#f59e0b'],
  },
  {
    id: 'emerald-gold',
    name: 'Peacock Emerald & Gold',
    badge: 'Regal Silk',
    bgGradient: 'bg-gradient-to-br from-[#062c22] via-[#0b4837] to-[#041a14]',
    borderColor: 'border-emerald-400/50',
    glow1: 'bg-emerald-400/20',
    glow2: 'bg-amber-400/20',
    textColor: 'text-emerald-200',
    headlineGradient: 'from-amber-100 via-emerald-100 to-amber-300',
    swatchColors: ['#062c22', '#0b4837', '#10b981'],
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber & Diya Glow',
    badge: 'Auspicious Glow',
    bgGradient: 'bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#290e02]',
    borderColor: 'border-amber-500/60',
    glow1: 'bg-yellow-400/25',
    glow2: 'bg-orange-500/30',
    textColor: 'text-amber-200',
    headlineGradient: 'from-yellow-100 via-amber-100 to-yellow-300',
    swatchColors: ['#451a03', '#78350f', '#f59e0b'],
  },
  {
    id: 'royal-purple',
    name: 'Velvet Purple & Zari',
    badge: 'Royal Brocade',
    bgGradient: 'bg-gradient-to-br from-[#2e0847] via-[#4c126e] to-[#1c032d]',
    borderColor: 'border-purple-300/50',
    glow1: 'bg-purple-400/25',
    glow2: 'bg-amber-400/20',
    textColor: 'text-purple-200',
    headlineGradient: 'from-amber-200 via-purple-100 to-amber-300',
    swatchColors: ['#2e0847', '#4c126e', '#d946ef'],
  },
  {
    id: 'festive-dark',
    name: 'Festive Starry Noir',
    badge: 'Illuminated',
    bgGradient: 'bg-gradient-to-br from-[#12131a] via-[#1f1d2b] to-[#0a0a0f]',
    borderColor: 'border-amber-400/60',
    glow1: 'bg-amber-500/30',
    glow2: 'bg-rose-500/20',
    textColor: 'text-amber-200',
    headlineGradient: 'from-amber-200 via-yellow-100 to-amber-400',
    swatchColors: ['#12131a', '#1f1d2b', '#fbbf24'],
  },
];

export const DiwaliCollectionBanner: React.FC<DiwaliCollectionBannerProps> = ({
  onSelectCategoryFilter,
  activeFilter,
  onShopNow,
}) => {
  // Diwali 2026 Date (Sunday, November 8, 2026 - IST +05:30)
  const targetDate = new Date('2026-11-08T00:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [showCountdown] = useState<boolean>(true);

  // Background Theme & Pattern State
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('diwali_banner_theme') || 'royal-maroon';
  });
  const [activePattern, setActivePattern] = useState<'rangoli' | 'sparkles' | 'diyas' | 'none'>('rangoli');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const activeTheme =
    BANNER_THEMES.find((t) => t.id === selectedThemeId) || BANNER_THEMES[0];

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    localStorage.setItem('diwali_banner_theme', themeId);
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const festiveCategories = [
    { id: 'Festive Frocks', label: 'Festive Frocks', icon: '👗' },
    { id: 'Ethnic Wear', label: 'Ethnic Wear', icon: '✨' },
    { id: 'Lehenga Sets', label: 'Lehenga Sets', icon: '🥻' },
    { id: 'Kurta Sets', label: 'Kurta Sets', icon: '🌸' },
    { id: 'Party Wear', label: 'Party Wear', icon: '👑' },
    { id: 'Festive Accessories', label: 'Festive Accessories', icon: '📿' },
    { id: 'Ethnic Footwear', label: 'Ethnic Footwear', icon: '👡' },
  ];

  return (
    <div
      className={`relative mb-8 rounded-3xl overflow-hidden shadow-2xl border-2 transition-all duration-500 text-white ${activeTheme.borderColor} ${activeTheme.bgGradient}`}
    >
      {/* Decorative Traditional Indian Rangoli & Diya Patterns */}
      {activePattern === 'rangoli' && (
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]" />
      )}
      {activePattern === 'sparkles' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fef08a_1.5px,transparent_1.5px)] [background-size:26px_26px]" />
      )}
      {activePattern === 'diyas' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_2px,transparent_2px)] [background-size:34px_34px]" />
      )}

      {/* Subtle warm golden ambient glow with theme colors */}
      <div
        className={`absolute -top-24 -left-24 w-96 h-96 ${activeTheme.glow1} rounded-full blur-3xl pointer-events-none transition-colors duration-500`}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-96 h-96 ${activeTheme.glow2} rounded-full blur-3xl pointer-events-none transition-colors duration-500`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Banner Body */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/* Top Header Bar with Badges & Change Background Theme Picker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>DIWALI 2026 • EXCLUSIVE LAUNCH</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Pure Silk, Chanderi &amp; Brocade
            </span>
          </div>

          {/* Change Background Option Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(!isThemeModalOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-amber-200 hover:text-white border border-amber-400/50 text-xs font-bold transition-all shadow-lg cursor-pointer group hover:scale-105 active:scale-95"
              title="Change Background Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Change Background</span>
              <span className="text-[10px] text-amber-300/80 font-normal hidden sm:inline">
                ({activeTheme.name})
              </span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isThemeModalOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Change Background Dropdown / Palette Panel */}
            {isThemeModalOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-amber-400/60 z-50 text-white animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Choose Festive Background
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsThemeModalOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 mb-3">
                  Select your favorite festive palette. Changes apply immediately to the hero banner.
                </p>

                {/* Theme Palette Cards */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {BANNER_THEMES.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-300 shadow-md'
                            : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-300/40'
                        }`}
                      >
                        {/* 3-color swatch gradient preview */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex -space-x-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                              style={{ backgroundColor: theme.swatchColors[0] }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                              style={{ backgroundColor: theme.swatchColors[1] }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                              style={{ backgroundColor: theme.swatchColors[2] }}
                            />
                          </div>
                          {isSelected && (
                            <span className="ml-auto text-amber-300 text-xs">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-extrabold text-white truncate">
                          {theme.name}
                        </div>
                        <div className="text-[10px] text-amber-300/80 truncate">
                          {theme.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Pattern Selector Options */}
                <div className="pt-3 border-t border-amber-400/20">
                  <div className="text-[11px] font-bold text-amber-300 mb-2 flex items-center justify-between">
                    <span>Background Pattern:</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectTheme('royal-maroon');
                        setActivePattern('rangoli');
                      }}
                      className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Default</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'rangoli', label: 'Rangoli' },
                      { id: 'sparkles', label: 'Sparkles' },
                      { id: 'diyas', label: 'Diyas' },
                      { id: 'none', label: 'Minimal' },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => setActivePattern(pat.id as any)}
                        className={`py-1 px-1.5 text-[10px] font-bold rounded-lg text-center cursor-pointer transition-colors ${
                          activePattern === pat.id
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-white/10 hover:bg-white/20 text-slate-300'
                        }`}
                      >
                        {pat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA Content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Headline & Subtitle */}
            <div className="space-y-2">
              <h1
                className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif text-transparent bg-clip-text bg-gradient-to-r ${activeTheme.headlineGradient} drop-shadow-xs`}
              >
                Diwali 2026 Collection
              </h1>
              <p className="text-base sm:text-xl font-medium text-amber-100/90 tracking-wide font-sans max-w-xl">
                Celebrate Every Little Moment in Style
              </p>
            </div>

            <p className="text-xs sm:text-sm text-cream/80 max-w-xl leading-relaxed text-slate-200">
              Immerse your little princess in the grandeur of Deepavali. Featuring handcrafted zari
              lehengas, twirl-ready festive frocks, zari kurtas, embroidered juttis, and floral hair
              accessories in auspicious gold, vermilion maroon, and royal cream.
            </p>

            {/* CTA Button & Highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onShopNow}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>SHOP DIWALI COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Breathable Cotton Linings</span>
              </div>
            </div>

            {/* Diwali 2026 Live Countdown (Configured for IST Sunday Nov 8, 2026) */}
            {showCountdown && (
              <div className="pt-3 border-t border-amber-300/20">
                <div className="flex items-center justify-between mb-2 max-w-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diwali 2026 Auspicious Countdown</span>
                  </div>
                  <span className="text-[10px] text-amber-200/70 font-mono">
                    IST (Asia/Kolkata)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 max-w-md">
                  <div className="bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-xl p-2 text-center shadow-inner">
                    <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {timeLeft.days}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-100/70 tracking-wider">
                      Days
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-xl p-2 text-center shadow-inner">
                    <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-100/70 tracking-wider">
                      Hours
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-xl p-2 text-center shadow-inner">
                    <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-100/70 tracking-wider">
                      Mins
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-xl p-2 text-center shadow-inner">
                    <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-100/70 tracking-wider">
                      Secs
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Visual Image Showcase with Traditional Festive Children Attire */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black/30 group">
              {/* Children wearing traditional festive outfits */}
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=900&q=80"
                alt="Children wearing traditional Indian festive outfits for Diwali"
                className="w-full h-72 sm:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Decorative Diya Stamp Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-400/60 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-amber-300 shadow-lg">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>Festive Shubh Deepavali</span>
              </div>

              {/* Festive Offer Overlay Pill */}
              <div className="absolute bottom-3 left-3 right-3 bg-linear-to-r from-amber-950/90 via-maroon-950/90 to-amber-950/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase">
                    Diwali Early Bird Offer
                  </div>
                  <div className="text-xs font-black text-white">
                    Flat 50% OFF + Extra 15% Club Cash
                  </div>
                </div>
                <div className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  DIWALI26
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories Filter Strip */}
        <div className="mt-8 pt-6 border-t border-amber-400/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Diwali Product Categories
            </span>
            <span className="text-[11px] text-amber-100/70">
              Click to filter collection instantly
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {festiveCategories.map((cat) => {
              const isSelected = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-200 scale-105 font-black'
                      : 'bg-black/40 hover:bg-black/60 text-amber-100 border border-amber-400/30 hover:border-amber-400'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
