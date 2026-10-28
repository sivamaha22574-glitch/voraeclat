import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Crown,
  Check,
} from 'lucide-react';
import { Product, Gender } from '../types';

export interface FilterValues {
  genders: ('boy' | 'girl' | 'unisex')[];
  ages: string[];
  categories: string[];
  subCategories: string[];
  brands: string[];
  colors: string[];
  maxPrice: number;
  minPrice: number;
  minRating: number;
  minDiscount: number;
  discountRanges?: string[];
  clubOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
  allProducts: Product[];
  totalFilteredCount: number;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AGE_OPTIONS = [
  { label: 'Preemie / Tiny Preemie', value: 'Preemie' },
  { label: 'New Born', value: 'New Born' },
  { label: '0-3 Months', value: '0-3M' },
  { label: '3-6 Months', value: '3-6M' },
  { label: '6-9 Months', value: '6-9M' },
  { label: '9-12 Months', value: '9-12M' },
  { label: '12-18 Months', value: '1-2Y' },
  { label: '18-24 Months', value: '18-24M' },
  { label: '2 to 4 Years', value: '2-4Y' },
  { label: '4 to 6 Years', value: '4-6Y' },
  { label: '6 to 8 Years', value: '6-8Y' },
  { label: '8+ Years', value: '8+Y' },
];

export const POPULAR_SUB_CATEGORIES = [
  'Diwali 2026 Collection',
  'Navratri Utsav',
  'Halloween Collection',
  'Rainwear Collection',
  'Multi-packs',
  'Bestsellers',
  'Baby Essentials',
  'Sets & Suits',
  'Ethnic Wear',
  'Party Wear',
  'Dresses & Frocks',
  'T-Shirts & Tops',
  'Onesies & Rompers',
  'Shirts',
  'Jeans & Trousers',
  'Pajamas & Trackpants',
  'Rompers & Sleepsuits',
  'Pre-Walkers & Booties',
  'Kurta & Dhoti Sets',
  'Chaniya Cholis & Lehengas',
  'Tape Diapers',
  'Feeding Bottles',
  'Cribs & Cots',
  'Strollers & Prams',
  'Baby Wash & Shampoo',
  'Educational & Montessori',
  'Story Books & Rhymes',
  'Childproofing & Protection',
  'Nursing & Feeding Wear',
];

export const POPULAR_BRANDS = [
  'Babyhug',
  'Babyhug Festive',
  'Pine Kids',
  'Pine Kids Casuals',
  'Babyoye',
  'Carter\'s',
  'Kookie Kids',
  'Kookie Kids Festive',
  'Primo Gino',
  'Mark & Mia',
  'Doodle Poodle',
  'Honeyhap',
  'ToffyHouse',
  'Voraeclat Essentials',
  'Little Princess by Voraeclat',
  'Junior Rover',
  'Voraeclat Care',
  'Voraeclat Nurture',
  'Voraeclat Nursery',
  'Voraeclat Gear',
  'Voraeclat Pure',
  'Voraeclat Footwear',
  'Little Genius by Voraeclat',
  'U.S. Polo Assn. Kids',
  'Puma',
  'UCB',
  'Tommy Hilfiger',
];

export const COLOR_OPTIONS = [
  { name: 'Blue', hex: '#3B82F6', aliases: ['Sky Blue', 'French Blue', 'Ocean Denim', 'Sky Mint'] },
  { name: 'Pink', hex: '#EC4899', aliases: ['Blush Rose', 'Rani Pink & Yellow'] },
  { name: 'Yellow', hex: '#FACC15', aliases: ['Sunny Oat', 'Buttercup', 'Mustard Gold', 'Lemon Yellow', 'Mustard Joy'] },
  { name: 'Green', hex: '#10B981', aliases: ['Mint Meadow', 'Olive Green', 'Sage Leaf', 'Sage Green', 'Emerald Green', 'Citronella Green'] },
  { name: 'White', hex: '#FFFFFF', aliases: ['Cloud White', 'Pure White', 'Nordic White'] },
  { name: 'Red & Maroon', hex: '#DC2626', aliases: ['Royal Maroon', 'Coral Red'] },
  { name: 'Orange & Amber', hex: '#F97316', aliases: ['Amber Gold', 'Safari Cream', 'Natural Beech'] },
  { name: 'Purple & Lilac', hex: '#A855F7', aliases: ['Lilac Puppy'] },
  { name: 'Black & Charcoal', hex: '#1F2937', aliases: ['Graphite Black', 'Warm Charcoal'] },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 50%, #10B981 100%)', aliases: ['Rainbow Natural Wood'] },
];

export const DISCOUNT_OPTIONS = [
  { label: '50% and above', value: 50 },
  { label: '40% and above', value: 40 },
  { label: '30% and above', value: 30 },
  { label: '20% and above', value: 20 },
  { label: '10% and above', value: 10 },
];

export const DISCOUNT_RANGE_OPTIONS = [
  { id: '10-30', label: '10% to 30%', min: 10, max: 30 },
  { id: '30-50', label: '30% to 50%', min: 30, max: 50 },
  { id: '50-70', label: '50% to 70%', min: 50, max: 70 },
  { id: '70-above', label: '70% and above', min: 70, max: 100 },
];

export const PRICE_BUCKETS = [
  { label: 'Under ₹299', min: 0, max: 299 },
  { label: '₹300 - ₹499', min: 300, max: 499 },
  { label: '₹500 - ₹999', min: 500, max: 999 },
  { label: '₹1,000 - ₹1,999', min: 1000, max: 1999 },
  { label: '₹2,000 & Above', min: 2000, max: 25000 },
];

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  allProducts,
  totalFilteredCount,
  isMobile = false,
  onCloseMobile,
}: FilterSidebarProps) {
  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gender: true,
    age: true,
    category: true,
    price: true,
    discount: true,
    brand: true,
    color: true,
    rating: true,
    club: true,
  });

  // Search terms inside long filter sections
  const [brandSearch, setBrandSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.genders.length > 0 ||
      filters.ages.length > 0 ||
      filters.subCategories.length > 0 ||
      filters.brands.length > 0 ||
      filters.colors.length > 0 ||
      filters.maxPrice < 15000 ||
      filters.minPrice > 0 ||
      filters.minRating > 0 ||
      filters.minDiscount > 0 ||
      (filters.discountRanges && filters.discountRanges.length > 0) ||
      filters.clubOnly
    );
  }, [filters]);

  // Compute product counts dynamically
  const counts = useMemo(() => {
    const genderCounts: Record<string, number> = { boy: 0, girl: 0, unisex: 0 };
    const ageCounts: Record<string, number> = {};
    const catCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};
    const discountOptionCounts: Record<number, number> = { 50: 0, 40: 0, 30: 0, 20: 0, 10: 0 };
    const discountRangeCounts: Record<string, number> = { '10-30': 0, '30-50': 0, '50-70': 0, '70-above': 0 };

    allProducts.forEach((p) => {
      // Gender count
      if (p.gender === 'boy') genderCounts.boy++;
      else if (p.gender === 'girl') genderCounts.girl++;
      else genderCounts.unisex++;

      // Age count
      p.ageGroup.forEach((age) => {
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      });

      // Subcategory count
      if (p.subCategory) {
        catCounts[p.subCategory] = (catCounts[p.subCategory] || 0) + 1;
      }

      // Brand count
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }

      // Colors count
      p.colors.forEach((c) => {
        colorCounts[c.name] = (colorCounts[c.name] || 0) + 1;
      });

      // Discount minimum counts
      [50, 40, 30, 20, 10].forEach((val) => {
        if (p.discountPercent >= val) {
          discountOptionCounts[val]++;
        }
      });

      // Discount range counts
      if (p.discountPercent >= 10 && p.discountPercent <= 30) discountRangeCounts['10-30']++;
      if (p.discountPercent > 30 && p.discountPercent <= 50) discountRangeCounts['30-50']++;
      if (p.discountPercent > 50 && p.discountPercent <= 70) discountRangeCounts['50-70']++;
      if (p.discountPercent > 70) discountRangeCounts['70-above']++;
    });

    return { genderCounts, ageCounts, catCounts, brandCounts, colorCounts, discountOptionCounts, discountRangeCounts };
  }, [allProducts]);

  // Helper toggle functions
  const handleToggleGender = (gender: 'boy' | 'girl' | 'unisex') => {
    const next = filters.genders.includes(gender)
      ? filters.genders.filter((g) => g !== gender)
      : [...filters.genders, gender];
    onChange({ ...filters, genders: next });
  };

  const handleToggleAge = (age: string) => {
    const next = filters.ages.includes(age)
      ? filters.ages.filter((a) => a !== age)
      : [...filters.ages, age];
    onChange({ ...filters, ages: next });
  };

  const handleToggleCategory = (subCat: string) => {
    const next = filters.subCategories.includes(subCat)
      ? filters.subCategories.filter((c) => c !== subCat)
      : [...filters.subCategories, subCat];
    onChange({ ...filters, subCategories: next });
  };

  const handleToggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const handleToggleColor = (colorName: string) => {
    const next = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onChange({ ...filters, colors: next });
  };

  const handleSelectPriceBucket = (bucket: { min: number; max: number }) => {
    if (filters.minPrice === bucket.min && filters.maxPrice === bucket.max) {
      // Toggle off
      onChange({ ...filters, minPrice: 0, maxPrice: 15000 });
    } else {
      onChange({ ...filters, minPrice: bucket.min, maxPrice: bucket.max });
    }
  };

  const handleToggleDiscount = (disc: number) => {
    onChange({ ...filters, minDiscount: filters.minDiscount === disc ? 0 : disc });
  };

  const handleToggleDiscountRange = (rangeId: string) => {
    const current = filters.discountRanges || [];
    const next = current.includes(rangeId)
      ? current.filter((r) => r !== rangeId)
      : [...current, rangeId];
    onChange({ ...filters, discountRanges: next });
  };

  // Filtered lists for search
  const visibleBrands = useMemo(() => {
    const list = POPULAR_BRANDS.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase())
    );
    return showAllBrands || brandSearch ? list : list.slice(0, 7);
  }, [brandSearch, showAllBrands]);

  const visibleCategories = useMemo(() => {
    const list = POPULAR_SUB_CATEGORIES.filter((c) =>
      c.toLowerCase().includes(categorySearch.toLowerCase())
    );
    return showAllCategories || categorySearch ? list : list.slice(0, 7);
  }, [categorySearch, showAllCategories]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 ${isMobile ? 'p-4' : 'p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin'}`}>
      {/* Filters Header Strip */}
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Filters</h3>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">
                {filters.genders.length +
                  filters.ages.length +
                  filters.subCategories.length +
                  filters.brands.length +
                  filters.colors.length +
                  (filters.maxPrice < 15000 || filters.minPrice > 0 ? 1 : 0) +
                  (filters.minDiscount > 0 ? 1 : 0) +
                  (filters.discountRanges ? filters.discountRanges.length : 0) +
                  (filters.minRating > 0 ? 1 : 0) +
                  (filters.clubOnly ? 1 : 0)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs font-black text-amber-700 hover:text-amber-800 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
            {isMobile && onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips / Pills */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {filters.genders.map((g) => (
              <span
                key={g}
                onClick={() => handleToggleGender(g)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            ))}

            {filters.ages.map((a) => (
              <span
                key={a}
                onClick={() => handleToggleAge(a)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {AGE_OPTIONS.find((opt) => opt.value === a)?.label || a}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            ))}

            {filters.subCategories.map((c) => (
              <span
                key={c}
                onClick={() => handleToggleCategory(c)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {c}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            ))}

            {filters.brands.map((b) => (
              <span
                key={b}
                onClick={() => handleToggleBrand(b)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {b}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            ))}

            {filters.colors.map((clr) => (
              <span
                key={clr}
                onClick={() => handleToggleColor(clr)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {clr}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            ))}

            {(filters.maxPrice < 15000 || filters.minPrice > 0) && (
              <span
                onClick={() => onChange({ ...filters, minPrice: 0, maxPrice: 15000 })}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                ₹{filters.minPrice} - ₹{filters.maxPrice}
                <X className="w-3 h-3 text-amber-700" />
              </span>
            )}

            {filters.minDiscount > 0 && (
              <span
                onClick={() => onChange({ ...filters, minDiscount: 0 })}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {filters.minDiscount}%+ Off
                <X className="w-3 h-3 text-amber-700" />
              </span>
            )}

            {filters.discountRanges && filters.discountRanges.map((rangeId) => {
              const opt = DISCOUNT_RANGE_OPTIONS.find((r) => r.id === rangeId);
              return (
                <span
                  key={rangeId}
                  onClick={() => handleToggleDiscountRange(rangeId)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  {opt ? opt.label : rangeId}
                  <X className="w-3 h-3 text-amber-700" />
                </span>
              );
            })}

            {filters.minRating > 0 && (
              <span
                onClick={() => onChange({ ...filters, minRating: 0 })}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
              >
                {filters.minRating}★ & Up
                <X className="w-3 h-3 text-amber-700" />
              </span>
            )}

            {filters.clubOnly && (
              <span
                onClick={() => onChange({ ...filters, clubOnly: false })}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-200 transition-colors"
              >
                👑 Club Choice Only
                <X className="w-3 h-3 text-amber-800" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* 1. GENDER FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('gender')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Gender</span>
          <div className="flex items-center gap-1.5">
            {filters.genders.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {filters.genders.length}
              </span>
            )}
            {openSections.gender ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.gender && (
          <div className="mt-2.5 space-y-2">
            {[
              { id: 'boy', label: 'Boy', count: counts.genderCounts.boy },
              { id: 'girl', label: 'Girl', count: counts.genderCounts.girl },
              { id: 'unisex', label: 'Unisex', count: counts.genderCounts.unisex },
            ].map((item) => {
              const isChecked = filters.genders.includes(item.id as any);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                      onClick={() => handleToggleGender(item.id as any)}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      onClick={() => handleToggleGender(item.id as any)}
                      className={`${isChecked ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">({item.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. AGE FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('age')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Age</span>
          <div className="flex items-center gap-1.5">
            {filters.ages.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {filters.ages.length}
              </span>
            )}
            {openSections.age ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.age && (
          <div className="mt-2.5 space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
            {AGE_OPTIONS.map((item) => {
              const isChecked = filters.ages.includes(item.value);
              const count = counts.ageCounts[item.value] || 0;
              return (
                <label
                  key={item.value}
                  className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                      onClick={() => handleToggleAge(item.value)}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      onClick={() => handleToggleAge(item.value)}
                      className={`${isChecked ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. CATEGORY / SUB-CATEGORY FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Category / Sub-Category</span>
          <div className="flex items-center gap-1.5">
            {filters.subCategories.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {filters.subCategories.length}
              </span>
            )}
            {openSections.category ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.category && (
          <div className="mt-2.5 space-y-2">
            {/* Search Sub-category */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Category..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
              {visibleCategories.map((subCat) => {
                const isChecked = filters.subCategories.includes(subCat);
                const count = counts.catCounts[subCat] || 0;
                return (
                  <label
                    key={subCat}
                    className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div
                        className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                        onClick={() => handleToggleCategory(subCat)}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        onClick={() => handleToggleCategory(subCat)}
                        className={`truncate ${isChecked ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                      >
                        {subCat}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">({count})</span>
                  </label>
                );
              })}
            </div>

            {POPULAR_SUB_CATEGORIES.length > 7 && !categorySearch && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-1 cursor-pointer"
              >
                {showAllCategories ? '− View Less' : `+ View More (${POPULAR_SUB_CATEGORIES.length - 7})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. PRICE FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Price (₹)</span>
          <div className="flex items-center gap-1.5">
            {(filters.maxPrice < 15000 || filters.minPrice > 0) && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                1
              </span>
            )}
            {openSections.price ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.price && (
          <div className="mt-2.5 space-y-3">
            {/* Quick Price Buckets */}
            <div className="space-y-1.5">
              {PRICE_BUCKETS.map((bucket) => {
                const isSelected = filters.minPrice === bucket.min && filters.maxPrice === bucket.max;
                return (
                  <label
                    key={bucket.label}
                    onClick={() => handleSelectPriceBucket(bucket)}
                    className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`${isSelected ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                      >
                        {bucket.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Slider */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Max Ceiling:</span>
                <span className="font-mono text-amber-700 font-black">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="299"
                max="15000"
                step="200"
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹299</span>
                <span>₹15,000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. DISCOUNT FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Discount</span>
          <div className="flex items-center gap-1.5">
            {((filters.discountRanges && filters.discountRanges.length > 0) || filters.minDiscount > 0) && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {(filters.discountRanges ? filters.discountRanges.length : 0) + (filters.minDiscount > 0 ? 1 : 0)}
              </span>
            )}
            {openSections.discount ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.discount && (
          <div className="mt-2.5 space-y-1.5">
            {DISCOUNT_RANGE_OPTIONS.map((range) => {
              const isChecked = filters.discountRanges?.includes(range.id);
              const count = counts.discountRangeCounts[range.id] || 0;
              return (
                <label
                  key={range.id}
                  onClick={() => handleToggleDiscountRange(range.id)}
                  className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`${isChecked ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                    >
                      {range.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. BRAND FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Brands</span>
          <div className="flex items-center gap-1.5">
            {filters.brands.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {filters.brands.length}
              </span>
            )}
            {openSections.brand ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.brand && (
          <div className="mt-2.5 space-y-2">
            {/* Search Brand */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Brand..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
              {visibleBrands.map((brand) => {
                const isChecked = filters.brands.includes(brand);
                const count = counts.brandCounts[brand] || 0;
                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between cursor-pointer group py-0.5 text-xs select-none"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div
                        className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                        onClick={() => handleToggleBrand(brand)}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        onClick={() => handleToggleBrand(brand)}
                        className={`truncate ${isChecked ? 'font-black text-slate-950' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}
                      >
                        {brand}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">({count})</span>
                  </label>
                );
              })}
            </div>

            {POPULAR_BRANDS.length > 7 && !brandSearch && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-1 cursor-pointer"
              >
                {showAllBrands ? '− View Less' : `+ View More (${POPULAR_BRANDS.length - 7})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 7. COLORS FILTER */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Colors</span>
          <div className="flex items-center gap-1.5">
            {filters.colors.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                {filters.colors.length}
              </span>
            )}
            {openSections.color ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.color && (
          <div className="mt-2.5 grid grid-cols-2 gap-2 max-h-52 overflow-y-auto scrollbar-thin pr-1">
            {COLOR_OPTIONS.map((col) => {
              const isChecked = filters.colors.includes(col.name);
              return (
                <button
                  key={col.name}
                  onClick={() => handleToggleColor(col.name)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all text-xs ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50 font-black text-amber-950 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-2xs"
                    style={{ background: col.hex }}
                  />
                  <span className="truncate text-[11px]">{col.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. CUSTOMER RATING */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider py-1 hover:text-amber-700 transition-colors"
        >
          <span>Customer Rating</span>
          <div className="flex items-center gap-1.5">
            {filters.minRating > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                1
              </span>
            )}
            {openSections.rating ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        </button>

        {openSections.rating && (
          <div className="mt-2.5 space-y-1.5">
            {[4.5, 4.0, 3.5, 0].map((star) => (
              <label
                key={star}
                onClick={() => onChange({ ...filters, minRating: star })}
                className="flex items-center justify-between cursor-pointer group py-1 text-xs select-none"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      filters.minRating === star
                        ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                  >
                    {filters.minRating === star && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span
                    className={`${filters.minRating === star ? 'font-black text-slate-950' : 'text-slate-700 font-medium'}`}
                  >
                    {star === 0 ? 'All Ratings' : `${star}★ & Above`}
                  </span>
                </div>
                {star > 0 && (
                  <div className="flex items-center text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 9. CLUB EXCLUSIVE TOGGLE */}
      <div className="pt-4">
        <button
          onClick={() => onChange({ ...filters, clubOnly: !filters.clubOnly })}
          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
            filters.clubOnly
              ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold shadow-2xs'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <div>
              <div className="font-extrabold text-slate-900">Voraeclat Club Exclusive</div>
              <div className="text-[10px] text-slate-500">Show VIP member-only rates</div>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
              filters.clubOnly ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-300 bg-white'
            }`}
          >
            {filters.clubOnly && '✓'}
          </div>
        </button>
      </div>

      {/* Results Count Footer for Mobile */}
      {isMobile && (
        <div className="pt-4 mt-4 border-t border-slate-200 flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 text-xs font-bold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Clear All
          </button>
          <button
            onClick={onCloseMobile}
            className="flex-1 py-2.5 text-xs font-extrabold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl shadow-xs"
          >
            Apply ({totalFilteredCount})
          </button>
        </div>
      )}
    </div>
  );
}
