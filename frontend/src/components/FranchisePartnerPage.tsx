import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Store,
  DollarSign,
  Briefcase,
  Users,
  Compass,
} from 'lucide-react';
import { appendFranchiseLead } from '../data/franchiseLeads';
import { insertPuppyFranchiseLeadToSupabase } from '../lib/supabase';

interface FranchisePartnerPageProps {
  onBackToStore?: () => void;
  onBackToHome?: () => void;
}

export const FranchisePartnerPage: React.FC<FranchisePartnerPageProps> = ({
  onBackToStore,
  onBackToHome,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    currentBusiness: '',
    commercialSpaceStatus: 'Ready commercial space available (Owned/Leased)',
    carpetArea: '1000 - 1500 sq. ft.',
    investmentBudget: '₹25 Lakhs - ₹35 Lakhs',
    expectedTimeline: 'Immediate (Within 30 days)',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: any = {
      id: `FL-${Date.now().toString().slice(-6)}`,
      fullName: formData.fullName || 'Prospective Retail Partner',
      email: formData.email,
      phone: formData.phone,
      city: formData.city || 'India',
      state: formData.state || 'India',
      currentBusiness: formData.currentBusiness || 'Retailer / Entrepreneur',
      commercialSpaceStatus: formData.commercialSpaceStatus,
      carpetArea: formData.carpetArea,
      investmentBudget: formData.investmentBudget,
      expectedTimeline: formData.expectedTimeline,
      message: formData.message,
      submittedAt: 'Just Now',
      status: 'New',
    };
    try {
      appendFranchiseLead(newLead);
    } catch {
      // ignore
    }
    // Asynchronously sync to Supabase puppy_franchise_leads
    insertPuppyFranchiseLeadToSupabase(newLead).catch((err) => {
      console.warn('Failed to sync franchise lead to Supabase:', err);
    });
    setIsSubmitted(true);
  };

  const investmentModels = [
    {
      title: 'Store Model FOCO',
      tag: 'Franchise Owned, Company Operated',
      area: '800 - 1,200 sq. ft.',
      investment: '₹20L - ₹30L',
      roi: '32% - 38% p.a.',
      payback: '18 - 22 Months',
      description: 'Hands-off partnership. You provide the space and capital; our retail team handles inventory, hiring, store operations, and POS billing.',
      features: [
        'Guaranteed operational efficiency by brand experts',
        'Zero dead-stock risk with automated replenishments',
        'Direct FirstCry/Voraeclat ERP & CRM integration',
        'Monthly assured gross revenue sharing model',
      ],
      recommended: false,
    },
    {
      title: 'Flagship Store FOFO',
      tag: 'Franchise Owned, Franchise Operated',
      area: '1,500 - 3,000 sq. ft.',
      investment: '₹35L - ₹50L',
      roi: '42% - 48% p.a.',
      payback: '14 - 18 Months',
      description: 'For passionate entrepreneurs desiring active hands-on retail leadership with maximum margin potential across baby apparel, gear & toys.',
      features: [
        'Highest retail operating margins (up to 38%)',
        'Comprehensive 3-week corporate onboarding & training',
        'Full inventory access (Apparel, Gear, Diapers, Toys, Nursery)',
        'Dedicated Territory Area Sales Manager (ASM) support',
      ],
      recommended: true,
    },
    {
      title: 'Kiosk & Express Hub',
      tag: 'Mall Walkway & Hospital Corridor',
      area: '250 - 500 sq. ft.',
      investment: '₹10L - ₹15L',
      roi: '35% - 40% p.a.',
      payback: '10 - 14 Months',
      description: 'Compact high-density setup positioned near maternity hospitals, pediatric centers, and premium mall escalators.',
      features: [
        'Fastest launch time (ready to open in under 18 days)',
        'Focus on newborn hampers, diapers & impulse babywear',
        'Lower upfront deposit & lean staffing needs',
        'Omnichannel click-and-collect local pickup node',
      ],
      recommended: false,
    },
  ];

  const stepsToLaunch = [
    {
      step: '01',
      title: 'Application & Screening',
      description: 'Submit your city, background profile, and preferred commercial site details.',
    },
    {
      step: '02',
      title: 'Site Visit & Feasibility',
      description: 'Our retail architects evaluate footfall, catchment demographic, and lease feasibility.',
    },
    {
      step: '03',
      title: 'Franchise Agreement',
      description: 'Transparent 5-year renewable contract with territorial exclusivity protection.',
    },
    {
      step: '04',
      title: '3D Fit-out & Design',
      description: 'Turnkey architectural guidance, signature pastel branding, display fixtures & lighting.',
    },
    {
      step: '05',
      title: 'Staff Training & Stocking',
      description: 'Intensive staff sales certification and initial seasonal collection stocking.',
    },
    {
      step: '06',
      title: 'Grand Launch & PR',
      description: 'Local influencer campaigns, opening weekend discounts, and digital geo-targeted ads.',
    },
  ];

  const faqs = [
    {
      q: 'What is the minimum carpet area required for a franchise store?',
      a: 'We require a minimum carpet area of 800 sq. ft. for a standard high-street boutique, 1,500 - 3,000 sq. ft. for a full-scale flagship destination, and 250 - 500 sq. ft. for high-footfall mall kiosks or hospital corridor express counters.',
    },
    {
      q: 'Do I need prior experience in kids apparel or retail?',
      a: 'Prior retail experience is valuable but not mandatory. Our corporate retail enablement team provides full SOPs, automated ERP inventory software, staff recruitment guides, and product knowledge training for you and your staff.',
    },
    {
      q: 'How does inventory replenishment and unsold stock return work?',
      a: 'Our smart inventory algorithm analyzes sell-through rates weekly. High-moving sizes are automatically dispatched from our regional mother fulfillment center. Unsold seasonal items are eligible for end-of-season markdown support or rotation.',
    },
    {
      q: 'What kind of marketing support is provided?',
      a: 'Every franchise partner receives national brand marketing campaigns, localized Google Maps optimization, influencer seeding in your city, launch PR kits, festive promotional collateral, and in-store loyalty program support.',
    },
    {
      q: 'Is territorial exclusivity guaranteed?',
      a: 'Yes. Every approved franchise store is granted a defined territorial radius (typically 3 to 5 km depending on city tier and population density) ensuring no other company outlet can open within your designated trade zone.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="hover:text-amber-600 transition-colors font-medium cursor-pointer"
              >
                <span>Home</span>
              </button>
            )}
            {onBackToHome && <span>/</span>}
            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="hover:text-amber-600 transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Shop</span>
              </button>
            )}
            <span>/</span>
            <span className="text-slate-900 font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
              Franchise Enquiry & Partnership
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="hidden sm:inline">Partner Helpline: <strong className="text-slate-900">+91 1800 258 7789</strong></span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ● Applications Open (Q3/Q4 2026)
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white py-16 lg:py-24">
        {/* Glow & grid decor */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>India&apos;s Fastest Growing Premium Kids Retail Brand</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Franchise Partner</span> with Us
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                Join our nationwide omni-channel retail network. Tap into India&apos;s ₹70,000+ Crore booming baby & kids market with guaranteed product margins, end-to-end store setup, and high customer repeat frequency.
              </p>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">180+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Cities Covered</div>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">35%+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Avg. Gross Margin</div>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">14-18M</div>
                  <div className="text-[11px] text-slate-400 font-medium">Avg. ROI Payback</div>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">98.4%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Partner Retention</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#partner-form"
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Apply for Franchise</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#investment-models"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all cursor-pointer"
                >
                  Explore Store Models
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/60 bg-slate-900/80 shadow-2xl backdrop-blur-xs p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Retail Partnership Desk</div>
                        <div className="text-xs text-slate-400">FY 2026-27 Expansion Drive</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
                      Verified Model
                    </span>
                  </div>

                  {/* Bullet Benefits */}
                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Zero Royalties for Year 1</strong>: 100% of store operating profits remain with the partner.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Automated Stock Replenishment</strong>: Never miss out on trending sizes or seasonal festive surges.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Turnkey Fit-out Blueprint</strong>: Complete 3D retail interior plans, child-safe display racks & signage.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Omni-Channel Local Fulfillment</strong>: Earn margin on online orders collected or delivered in your pin code.</span>
                    </div>
                  </div>

                  {/* Direct Contact Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Have an immediate query?</div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" /> franchise@voraeclat.com
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> +91 98200 45112
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Why Choose Us
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High Footfalls, Unmatched Margins & Proven Unit Economics
          </h2>
          <p className="text-slate-600 text-sm">
            Our retail format is engineered around parental psychology: experiential layouts, hospital bag essentials, gifting sections, and organic apparel that build high customer lifetime value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-400 text-amber-600 group-hover:text-slate-950 flex items-center justify-center transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">High Repeat Frequency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Babies outgrow sizes every 3-4 months. Parents visit 6 to 9 times annually for new clothing stages, diapers, milestone toys, and feeding upgrades.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-500 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Dead Inventory Risk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our automated demand forecasting moves slow-moving styles across stores in neighboring regions, guaranteeing fresh seasonal collections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Territory Exclusivity Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We contractually lock in a minimum 3 km to 5 km non-compete perimeter, ensuring your store is the sole authorized retailer in your neighborhood.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-500 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Turnkey Store Fit-out</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive standard modular fixtures, warm ambient lighting, signature pastel display walls, and kids play-nook furniture ready for opening day.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 group-hover:bg-rose-500 text-rose-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Staff Hiring & Training Academy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We train your sales associates in infant fabric safety, shoe sizing methods, gifting upsells, and compassionate customer hospitality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 group-hover:bg-cyan-500 text-cyan-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Omni-Channel Revenue Share</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parents shopping in your pin code via our app or web portal contribute to your store revenue through click-and-collect and store dispatch credits.
            </p>
          </div>
        </div>
      </section>

      {/* Investment Models Section */}
      <section id="investment-models" className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Format Options
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Choose the Franchise Format That Fits Your City
            </h2>
            <p className="text-slate-600 text-sm">
              We offer scalable models tailored for high streets, premium residential malls, and compact hospital commercial hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {investmentModels.map((model, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  model.recommended
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-md hover:shadow-xl'
                }`}
              >
                {model.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`text-xl font-extrabold ${model.recommended ? 'text-white' : 'text-slate-900'}`}>
                      {model.title}
                    </h3>
                    <div className={`text-xs mt-0.5 ${model.recommended ? 'text-amber-300' : 'text-amber-700 font-semibold'}`}>
                      {model.tag}
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed ${model.recommended ? 'text-slate-300' : 'text-slate-600'}`}>
                    {model.description}
                  </p>

                  {/* Financial Metrics Box */}
                  <div className={`p-4 rounded-2xl grid grid-cols-2 gap-3 text-xs ${model.recommended ? 'bg-slate-800/80 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                    <div>
                      <div className={`text-[10px] uppercase font-bold ${model.recommended ? 'text-slate-400' : 'text-slate-500'}`}>Est. Investment</div>
                      <div className={`text-base font-extrabold ${model.recommended ? 'text-amber-300' : 'text-slate-900'}`}>{model.investment}</div>
                    </div>
                    <div>
                      <div className={`text-[10px] uppercase font-bold ${model.recommended ? 'text-slate-400' : 'text-slate-500'}`}>Required Area</div>
                      <div className={`text-base font-extrabold ${model.recommended ? 'text-amber-300' : 'text-slate-900'}`}>{model.area}</div>
                    </div>
                    <div>
                      <div className={`text-[10px] uppercase font-bold ${model.recommended ? 'text-slate-400' : 'text-slate-500'}`}>Projected ROI</div>
                      <div className={`text-base font-extrabold ${model.recommended ? 'text-emerald-400' : 'text-emerald-600'}`}>{model.roi}</div>
                    </div>
                    <div>
                      <div className={`text-[10px] uppercase font-bold ${model.recommended ? 'text-slate-400' : 'text-slate-500'}`}>Payback Period</div>
                      <div className={`text-base font-extrabold ${model.recommended ? 'text-slate-100' : 'text-slate-800'}`}>{model.payback}</div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2">
                    <div className={`text-xs font-bold uppercase tracking-wider ${model.recommended ? 'text-slate-300' : 'text-slate-700'}`}>
                      What&apos;s Included:
                    </div>
                    {model.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${model.recommended ? 'text-amber-400' : 'text-emerald-600'}`} />
                        <span className={model.recommended ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/20">
                  <a
                    href="#partner-form"
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      model.recommended
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Enquire for {model.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Onboarding Process */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Launch Roadmap
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Application to Grand Opening in 30 Days
          </h2>
          <p className="text-slate-600 text-sm">
            Our systematic project management team assists you through lease vetting, architectural CAD plans, and inventory loading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stepsToLaunch.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-500 font-mono">{step.step}</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                  {idx + 1}/6
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form & Contact Section */}
      <section id="partner-form" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Partner Registration
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Submit Your Franchise Expression of Interest
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Fill out the application below. Our Head of Franchise Development will review your details and contact you within 24 business hours to schedule an introductory discovery call.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Direct Partner Line</div>
                    <div className="text-white font-bold text-sm">+91 1800 258 7789 (Toll Free)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Email Dossier</div>
                    <div className="text-white font-bold text-sm">franchise@voraeclat.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Corporate Retail HQ</div>
                    <div className="text-white font-bold text-sm">Voraeclat Towers, Sector 44, Gurgaon, Haryana 122003</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
                {isSubmitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your franchise inquiry for <strong className="text-slate-900">{formData.city || 'your city'}</strong> has been registered with reference ID <strong>#FRAN-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                    </p>
                    <p className="text-xs text-slate-500">
                      Our Area Expansion Lead will reach out to <strong className="text-slate-800">{formData.email}</strong> / <strong className="text-slate-800">{formData.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Franchise Applicant Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rajesh@company.com"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target City & State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Pune, Maharashtra"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Commercial Space Status
                        </label>
                        <select
                          value={formData.commercialSpaceStatus}
                          onChange={(e) => setFormData({ ...formData, commercialSpaceStatus: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50 cursor-pointer"
                        >
                          <option>Ready commercial space available (Owned/Leased)</option>
                          <option>Identified shortlisted properties</option>
                          <option>Need company assistance in site identification</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Available / Planned Carpet Area
                        </label>
                        <select
                          value={formData.carpetArea}
                          onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50 cursor-pointer"
                        >
                          <option>300 - 600 sq. ft. (Kiosk/Express)</option>
                          <option>800 - 1,200 sq. ft. (Boutique FOCO)</option>
                          <option>1,500 - 3,000 sq. ft. (Flagship FOFO)</option>
                          <option>3,000+ sq. ft. (Mega Experience Hub)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Investment Budget Capacity
                        </label>
                        <select
                          value={formData.investmentBudget}
                          onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50 cursor-pointer"
                        >
                          <option>₹15 Lakhs - ₹25 Lakhs</option>
                          <option>₹25 Lakhs - ₹35 Lakhs</option>
                          <option>₹35 Lakhs - ₹50 Lakhs</option>
                          <option>₹50 Lakhs+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Opening Timeline
                        </label>
                        <select
                          value={formData.expectedTimeline}
                          onChange={(e) => setFormData({ ...formData, expectedTimeline: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50 cursor-pointer"
                        >
                          <option>Immediate (Within 30 days)</option>
                          <option>1 to 3 Months</option>
                          <option>3 to 6 Months</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Current Business / Background & Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us briefly about your current business ventures, preferred mall or high-street location, and prior retail experience if any..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Franchise Application</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 text-center">
                      🔒 Your commercial details are held strictly confidential and protected by standard NDAs.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Franchise Questions
          </h2>
          <p className="text-xs text-slate-600">
            Everything you need to know about setting up a store, margins, inventory restocking, and licensing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky Action Banner */}
      <div className="bg-amber-400 text-slate-950 py-4 px-4 sm:px-8 border-t border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-950" />
            <span>Ready to bring Voraeclat to your city? Our expansion team is reviewing site submissions this week.</span>
          </div>
          <a
            href="#partner-form"
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold shrink-0 transition-colors cursor-pointer"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};
