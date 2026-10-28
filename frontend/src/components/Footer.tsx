import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Award, Mail, Phone, Facebook, Instagram, Share2 } from 'lucide-react';
import { VoraeclatLogo } from './VoraeclatLogo';
import { CategoryId } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenClubModal: () => void;
  onOpenParentingHub: () => void;
  onOpenFranchise?: () => void;
  onOpenContact?: () => void;
  onOpenHome?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenClubModal,
  onOpenParentingHub,
  onOpenFranchise,
  onOpenContact,
  onOpenHome,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Authentic Brands</div>
              <div className="text-[11px] text-slate-400">Directly from certified manufacturers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Lab Tested Baby Safe</div>
              <div className="text-[11px] text-slate-400">GOTS organic & non-toxic dyes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">30-Day Easy Returns</div>
              <div className="text-[11px] text-slate-400">Doorstep pickups with instant refund</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Sanitized Delivery</div>
              <div className="text-[11px] text-slate-400">Covering 15,000+ pin codes</div>
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Brand Info & Social Media Connection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <VoraeclatLogo size="lg" variant="dark" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Voraeclat is Asia&apos;s beloved baby &amp; kids destination, bringing together everything parents need: from hospital bag essentials and organic cotton rompers to pediatric-grade strollers and nursery furniture.
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>24x7 Parent Helpline: <strong>1800-VORAE-CARE</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Support: <strong>care@voraeclat.com</strong></span>
              </div>
            </div>

            {/* Social Media Connection Strip: Facebook & Instagram */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Follow Our Parenting Community</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://facebook.com/voraeclatofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all shadow-xs group cursor-pointer"
                  title="Follow Voraeclat on Facebook (120K Community)"
                >
                  <Facebook className="w-4 h-4 text-blue-400 group-hover:text-white fill-current" />
                  <span>Facebook</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/30 group-hover:bg-blue-700/60 font-semibold text-blue-200 group-hover:text-white">
                    120K
                  </span>
                </a>

                <a
                  href="https://instagram.com/voraeclat_kids"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-bold transition-all shadow-xs group cursor-pointer"
                  title="Follow Voraeclat on Instagram (@voraeclat_kids • 245K Followers)"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white" />
                  <span>Instagram</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/30 group-hover:bg-pink-700/60 font-semibold text-pink-200 group-hover:text-white">
                    245K
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('baby-toddler')} className="hover:text-amber-400 transition-colors">
                  Baby & Toddler (0-24M)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('boy-fashion')} className="hover:text-amber-400 transition-colors">
                  Boy Fashion & Dungarees
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('girl-fashion')} className="hover:text-amber-400 transition-colors">
                  Girl Dresses & Frocks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('diapering')} className="hover:text-amber-400 transition-colors">
                  Diapers & Bamboo Wipes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('nursery-gear')} className="hover:text-amber-400 transition-colors">
                  Wooden Cribs & Strollers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('moms-maternity')} className="hover:text-amber-400 transition-colors">
                  Maternity & Nursing Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Parenting Guides */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Parenting Guides</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenParentingHub} className="hover:text-amber-400 transition-colors">
                  Hospital Bag Checklist
                </button>
              </li>
              <li>
                <button onClick={onOpenParentingHub} className="hover:text-amber-400 transition-colors">
                  Shoe Size & Foot Finder
                </button>
              </li>
              <li>
                <button onClick={onOpenParentingHub} className="hover:text-amber-400 transition-colors">
                  Baby Growth Chart
                </button>
              </li>
              <li>
                <span className="text-slate-500">Newborn Feeding Milestones</span>
              </li>
              <li>
                <span className="text-slate-500">Nursery Safety Checklist</span>
              </li>
            </ul>
          </div>

          {/* Voraeclat Club & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Voraeclat Club &amp; Perks</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenClubModal} className="text-amber-400 font-semibold hover:underline cursor-pointer">
                  Join VIP Voraeclat Club
                </button>
              </li>
              {onOpenHome && (
                <li>
                  <button onClick={onOpenHome} className="text-slate-300 hover:text-white font-medium transition-colors cursor-pointer">
                    Home Page
                  </button>
                </li>
              )}
              {onOpenContact && (
                <li>
                  <button onClick={onOpenContact} className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors cursor-pointer">
                    Contact Us &amp; Parent Helpline
                  </button>
                </li>
              )}
              {onOpenFranchise && (
                <li>
                  <button onClick={onOpenFranchise} className="text-amber-300 font-semibold hover:underline cursor-pointer flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Franchise Enquiry Program</span>
                  </button>
                </li>
              )}
              <li>
                <span className="text-slate-400">Doorstep Pincode Delivery</span>
              </li>
              <li>
                <span className="text-slate-400">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy &amp; Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 Voraeclat Retail Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ISO 9001:2015 Certified</span>
            <span>&bull;</span>
            <span>Safe Payments with SSL</span>
            <span>&bull;</span>
            <span>Little Things, Big Dreams</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/voraeclatofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-colors"
              title="Voraeclat on Facebook"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://instagram.com/voraeclat_kids"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white transition-colors"
              title="Voraeclat on Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
