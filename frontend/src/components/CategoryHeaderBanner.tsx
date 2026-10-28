import React from 'react';
import { ChevronRight, Layers, ShieldCheck, Tag } from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryHeaderBannerProps {
  activeCategory: CategoryId;
  categoryName: string;
  itemCount: number;
  deliveryPincode: string;
  onBackToHome?: () => void;
  subCategories: string[];
  selectedSubCategories: string[];
  onToggleSubCategory: (sub: string) => void;
}

export const CategoryHeaderBanner: React.FC<CategoryHeaderBannerProps> = ({
  activeCategory,
  categoryName,
  itemCount,
  deliveryPincode,
  onBackToHome,
  subCategories,
  selectedSubCategories,
  onToggleSubCategory,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav className="flex items-center gap-1.5 text-slate-500 font-medium">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="hover:text-amber-600 transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
          )}
          {onBackToHome && <ChevronRight className="w-3 h-3 text-slate-400" />}
          <span className="text-slate-400">Category Menu</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
            {categoryName}
          </span>
        </nav>
      </div>

      {/* Category Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
              <Layers className="w-3 h-3" />
              <span>Category Menu Wise View</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              {categoryName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Showing exclusive verified collections for <strong className="text-amber-300">{categoryName}</strong>.
              Tested for infant & child safety, skin-gentle certified fabrics with express delivery to <strong>{deliveryPincode}</strong>.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-xl sm:text-2xl font-black text-amber-300">
                {itemCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Products Available
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Safe</span>
            </div>
          </div>
        </div>

        {/* Subcategory Pills Quick Filter */}
        {subCategories.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Quick Sub-Category Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  subCategories.forEach((sub) => {
                    if (selectedSubCategories.includes(sub)) {
                      onToggleSubCategory(sub);
                    }
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubCategories.length === 0
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                All Subcategories
              </button>

              {subCategories.map((sub) => {
                const isSelected = selectedSubCategories.includes(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => onToggleSubCategory(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    <span>{sub}</span>
                    {isSelected && <span className="ml-1 text-[10px] font-black">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
