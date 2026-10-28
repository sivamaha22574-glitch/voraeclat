import React from 'react';
import { AgeGroup } from '../types';

interface ShopByAgeProps {
  selectedAge: AgeGroup;
  onSelectAge: (age: AgeGroup) => void;
}

export const ShopByAge: React.FC<ShopByAgeProps> = ({ selectedAge, onSelectAge }) => {
  const ageTiers: { id: AgeGroup; label: string; sub: string; image?: string }[] = [
    {
      id: 'all',
      label: 'All Ages',
      sub: 'All Products',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '0-3M',
      label: '0 - 3 Months',
      sub: 'Newborns',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '3-6M',
      label: '3 - 6 Months',
      sub: 'Infants',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '6-12M',
      label: '6 - 12 Months',
      sub: 'Crawlers',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '1-2Y',
      label: '1 - 2 Years',
      sub: 'Toddlers',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '2-4Y',
      label: '2 - 4 Years',
      sub: 'Preschoolers',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '4-6Y',
      label: '4 - 6 Years',
      sub: 'Young Kids',
      image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '6-8Y',
      label: '6 - 8 Years',
      sub: 'Junior Stars',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '8+Y',
      label: '8+ Years',
      sub: 'Big Kids',
      image: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=160&q=80',
    },
  ];

  return (
    <div className="py-6 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Shop by Age</h2>
            <p className="text-xs text-slate-500">Pick the perfect size & developmental stage for your child</p>
          </div>
          {selectedAge !== 'all' && (
            <button
              onClick={() => onSelectAge('all')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline"
            >
              Reset Age Filter
            </button>
          )}
        </div>

        {/* Scrollable Age Badges with Real Photos */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {ageTiers.map((tier) => {
            const isSelected = selectedAge === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => onSelectAge(tier.id)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl border text-left shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-400'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-white shadow-2xs">
                  <img
                    src={tier.image}
                    alt={tier.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight whitespace-nowrap">{tier.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight whitespace-nowrap">{tier.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
