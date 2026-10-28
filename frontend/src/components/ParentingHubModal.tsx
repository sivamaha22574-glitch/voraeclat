import React, { useState } from 'react';
import { X, ClipboardCheck, Ruler, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { HOSPITAL_BAG_CHECKLIST, BABY_SIZE_GUIDE } from '../data/checklists';
import { CategoryId } from '../types';

interface ParentingHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: CategoryId) => void;
}

export const ParentingHubModal: React.FC<ParentingHubModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'sizeguide'>('checklist');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'hosp-1': true,
    'hosp-2': true,
  });

  const [inputFootCm, setInputFootCm] = useState<number>(10.5);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = HOSPITAL_BAG_CHECKLIST.length;

  // Shoe size calculation based on foot length
  const recommendedShoe =
    BABY_SIZE_GUIDE.find((g) => {
      const [minStr, maxStr] = g.footCm.replace(' cm', '').split(' - ');
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      return inputFootCm >= min && inputFootCm <= max;
    }) || BABY_SIZE_GUIDE[2];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              Voraeclat Parenting Companion
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Parenting Hub & Newborn Tools</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Hospital Bag Checklist ({completedCount}/{totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('sizeguide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sizeguide'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Growth & Shoe Size Calculator</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900">
                <div>
                  <h4 className="font-extrabold text-sm">Labor & Delivery Hospital Bag</h4>
                  <p className="text-slate-600 mt-0.5">
                    Prepare your bag by the 34th-36th week of pregnancy. Tap items to mark them as packed!
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black font-mono text-amber-700">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                  <div className="text-[10px] text-slate-500">Ready</div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="divide-y divide-slate-100">
                {HOSPITAL_BAG_CHECKLIST.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="py-3 flex items-start gap-3 cursor-pointer group hover:bg-slate-50/80 p-2 rounded-xl transition-colors"
                    >
                      <button className="mt-0.5 text-amber-500 group-hover:scale-110 transition-transform">
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      <div className="flex-1 text-xs">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.recommendedQty}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {item.essentialLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onSelectCategory('baby-toddler');
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Shop Newborn Essentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sizeguide' && (
            <div className="space-y-6">
              {/* Interactive Calculator */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">
                  Foot Measurement & Shoe Size Finder
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Measure from the back of your baby&apos;s heel to the tip of the big toe using a soft tape.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Baby Foot Length:</span>
                    <span className="font-mono text-amber-600 text-sm">{inputFootCm} cm</span>
                  </div>

                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="0.5"
                    value={inputFootCm}
                    onChange={(e) => setInputFootCm(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>8.0 cm (Newborn)</span>
                    <span>13.0 cm (Toddler)</span>
                    <span>18.0 cm (Junior)</span>
                  </div>

                  {/* Calculated Recommendation Card */}
                  <div className="mt-4 p-4 bg-white rounded-xl border border-amber-300 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">
                        Recommended Shoe Size
                      </div>
                      <div className="text-xl font-black text-slate-950 mt-0.5">
                        US Size {recommendedShoe.shoeSize} &bull; {recommendedShoe.age}
                      </div>
                      <div className="text-xs text-slate-600">
                        Fits foot length up to {recommendedShoe.footCm}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectCategory('footwear-accessories');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      Shop Booties
                    </button>
                  </div>
                </div>
              </div>

              {/* Comprehensive Growth Chart Table */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Pediatric Growth Reference Table
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-3">Age Bracket</th>
                        <th className="p-3">Weight (lbs / kg)</th>
                        <th className="p-3">Height</th>
                        <th className="p-3">Foot Length</th>
                        <th className="p-3">Shoe Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {BABY_SIZE_GUIDE.map((row) => (
                        <tr key={row.age} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{row.age}</td>
                          <td className="p-3">{row.weightLbs} ({row.weightKg})</td>
                          <td className="p-3">{row.heightCm}</td>
                          <td className="p-3">{row.footCm}</td>
                          <td className="p-3 font-bold text-amber-700">{row.shoeSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
