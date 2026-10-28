import React from 'react';
import { X, Crown, Check, Sparkles, Gift, Zap, Shield, HeartHandshake } from 'lucide-react';
import { PUPPY_CLUB_PLANS } from '../data/products';

interface PuppyClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClubMember: boolean;
  onJoinClub: (planId: string) => void;
}

export const PuppyClubModal: React.FC<PuppyClubModalProps> = ({
  isOpen,
  onClose,
  isClubMember,
  onJoinClub,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-amber-300 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Banner Top */}
        <div className="bg-linear-to-r from-amber-400 via-amber-300 to-yellow-300 p-6 sm:p-8 text-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-slate-950 text-amber-300 rounded-xl shadow-xs">
              <Crown className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-md">
              VIP Membership
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome to the Voraeclat Club Family
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1 max-w-lg">
            Join over 2.4 million savvy parents saving an average of ₹4,500 every year on essentials, clothing, and gear.
          </p>
        </div>

        {/* Membership Plans */}
        <div className="p-6 space-y-6">
          {isClubMember ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-full mx-auto flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">You are an Active Voraeclat Club Member!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your exclusive 10-15% club discount and complimentary free shipping are automatically applied to your cart.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Continue Shopping with Club Benefits
              </button>
            </div>
          ) : (
            <>
              {/* Tiers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PUPPY_CLUB_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      plan.popular
                        ? 'border-amber-400 bg-amber-50/50 shadow-md ring-1 ring-amber-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {plan.popular && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 mb-2">
                          <Sparkles className="w-3 h-3" /> Most Popular Choice
                        </div>
                      )}
                      <h3 className="font-extrabold text-slate-900 text-base">{plan.title}</h3>

                      <div className="flex items-baseline gap-2 my-3">
                        <span className="text-2xl font-black text-slate-950 font-mono">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-rose-600">
                          Save ₹{(plan.originalPrice - plan.price).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-700 mb-6">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onJoinClub(plan.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                      <span>Join Now for ₹{plan.price.toLocaleString('en-IN')}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Instant Savings</div>
                  <div className="text-[10px] text-slate-500">Applies to current bag</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <Gift className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Birthday Gift</div>
                  <div className="text-[10px] text-slate-500">Sent every year</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <Shield className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Priority Support</div>
                  <div className="text-[10px] text-slate-500">VIP help desk</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <HeartHandshake className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Parent Community</div>
                  <div className="text-[10px] text-slate-500">Milestone advice</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
