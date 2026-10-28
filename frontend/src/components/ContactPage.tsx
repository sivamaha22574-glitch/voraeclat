import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Send,
  HelpCircle,
  Building2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Truck,
  RotateCcw,
  Navigation,
  ExternalLink,
  Compass,
  Car,
  Facebook,
  Instagram,
  Share2,
} from 'lucide-react';
import { submitContactMessageToSupabase } from '../lib/supabase';

interface ContactPageProps {
  onBackToHome: () => void;
  onOpenFranchise: () => void;
  onOpenStore: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onOpenFranchise,
  onOpenStore,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Delivery Tracking',
    orderId: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [ticketId, setTicketId] = useState('');
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [mapViewMode, setMapViewMode] = useState<'map' | 'list'>('map');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = `PUPPY-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomTicket);
    setIsSubmitted(true);
    // Asynchronously sync contact inquiry to Supabase
    submitContactMessageToSupabase({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.orderId ? `${formData.subject} (Order #${formData.orderId})` : formData.subject,
      message: `[Ticket: ${randomTicket}] ${formData.message}`,
    }).catch((err) => {
      console.warn('Failed to submit contact message to Supabase:', err);
    });
  };

  const supportChannels = [
    {
      icon: Phone,
      title: '24x7 Parent Helpline',
      subtitle: 'Toll-Free for All States',
      value: '1800-PUPPY-CARE',
      extra: '(1800-787-7922)',
      color: 'amber',
      action: 'Call Now',
      href: 'tel:18007877922',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Assistance',
      subtitle: 'Instant Chat & Updates',
      value: '+91 98200 PUPPY',
      extra: '+91 98200 78779',
      color: 'emerald',
      action: 'Chat on WhatsApp',
      href: 'https://wa.me/919820078779',
    },
    {
      icon: Mail,
      title: 'Email Support Desk',
      subtitle: 'Replies within 2 hours',
      value: 'care@voraeclat.com',
      extra: 'support@voraeclat.com',
      color: 'blue',
      action: 'Write Email',
      href: 'mailto:care@voraeclat.com',
    },
    {
      icon: Building2,
      title: 'Franchise & Business',
      subtitle: 'Expansion & Trade',
      value: 'partner@voraeclat.com',
      extra: '+91 1800 258 7789',
      color: 'purple',
      action: 'Franchise Desk',
      onClick: onOpenFranchise,
    },
  ];

  const flagshipStores = [
    {
      id: 'mumbai',
      city: 'Mumbai (BKC)',
      tag: 'Headquarters & Mega Flagship',
      mall: 'One BKC Experience Center',
      address: 'Voraeclat Flagship Center, Ground Floor, One BKC, G Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
      phone: '+91 22 6123 4567',
      timings: '10:00 AM – 9:30 PM (Mon - Sun)',
      embedUrl: 'https://maps.google.com/maps?q=One+BKC+Bandra+Kurla+Complex+Mumbai+Maharashtra+400051&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=One+BKC+Bandra+Kurla+Complex+Mumbai+Maharashtra+400051',
      features: ['Nursery Demo Room', 'Stroller Test Track', 'Lactation Pod', 'Valet Parking'],
    },
    {
      id: 'bengaluru',
      city: 'Bengaluru (Indiranagar)',
      tag: 'Flagship Studio',
      mall: '100 Feet Road Experience Hub',
      address: 'Voraeclat Studio, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      phone: '+91 80 4123 7890',
      timings: '10:00 AM – 9:30 PM (Mon - Sun)',
      embedUrl: 'https://maps.google.com/maps?q=100+Feet+Road+Indiranagar+Bengaluru+Karnataka+560038&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=100+Feet+Road+Indiranagar+Bengaluru+Karnataka+560038',
      features: ['Baby Sizing Studio', 'Montessori Toy Bar', 'Hospital Bag Packing Desk'],
    },
    {
      id: 'delhi',
      city: 'Delhi NCR (Saket)',
      tag: 'Experience Hub',
      mall: 'Select CITYWALK Mall',
      address: 'Shop No. 24-27, Ground Floor, Select CITYWALK Mall, Saket District Centre, New Delhi 110017',
      phone: '+91 11 4987 6543',
      timings: '10:00 AM – 10:00 PM (Mon - Sun)',
      embedUrl: 'https://maps.google.com/maps?q=Select+CITYWALK+Saket+District+Centre+New+Delhi+110017&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Select+CITYWALK+Saket+District+Centre+New+Delhi+110017',
      features: ['Festive Ethnic Atelier', 'Car Seat Fitting Service', 'VIP Lounge'],
    },
    {
      id: 'hyderabad',
      city: 'Hyderabad (Hitec City)',
      tag: 'Experience Center',
      mall: 'Inorbit Mall',
      address: 'Level 2, Inorbit Mall, Mindspace, Madhapur, Hitec City, Hyderabad, Telangana 500081',
      phone: '+91 40 6812 3456',
      timings: '10:30 AM – 9:30 PM (Mon - Sun)',
      embedUrl: 'https://maps.google.com/maps?q=Inorbit+Mall+Hitec+City+Hyderabad+Telangana+500081&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Inorbit+Mall+Hitec+City+Hyderabad+Telangana+500081',
      features: ['Express Click & Collect', 'Organic Cotton Lab', 'Nursing Pod'],
    },
    {
      id: 'pune',
      city: 'Pune (Viman Nagar)',
      tag: 'Flagship Studio',
      mall: 'Phoenix Marketcity',
      address: 'Ground Floor, Phoenix Marketcity, Viman Nagar, Pune, Maharashtra 411014',
      phone: '+91 20 6712 8900',
      timings: '10:00 AM – 9:30 PM (Mon - Sun)',
      embedUrl: 'https://maps.google.com/maps?q=Phoenix+Marketcity+Viman+Nagar+Pune+Maharashtra+411014&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Phoenix+Marketcity+Viman+Nagar+Pune+Maharashtra+411014',
      features: ['Play Gym Area', 'Nursery Demo Room', 'Dedicated Parking'],
    },
  ];

  const faqs = [
    {
      q: 'How long does order delivery take?',
      a: 'We deliver within 24 to 48 hours in metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Chennai). Tier 2 & Tier 3 cities receive express deliveries within 2 to 4 business days.',
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'Voraeclat offers a 30-Day Hassle-Free Doorstep Return policy on all unused apparel, footwear, and baby gear. Return pickups are 100% free with instant refunds to your original payment method or store credit.',
    },
    {
      q: 'Are all clothing and infant products certified baby-safe?',
      a: 'Yes, 100% of our baby clothing is crafted with GOTS-certified organic cotton, pre-washed with hypoallergenic enzymes, and free of toxic azo dyes or nickel hardware.',
    },
    {
      q: 'How can I inquire about opening a Voraeclat store franchise?',
      a: 'You can directly visit our Franchise Enquiry page or contact our corporate retail desk at partner@voraeclat.com. We offer FOCO, FOFO, and express kiosk models with comprehensive brand support.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-slate-500 font-medium">
            <button
              onClick={onBackToHome}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md">
              Contact Us & Support
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenStore}
              className="text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We&apos;re Always Here For You & Your Baby</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Contact Voraeclat
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Have questions about sizing, delivery updates, baby essentials, or business collaborations?
              Our dedicated parenting care champions are on standby 24 hours a day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center shrink-0">
            <button
              onClick={onOpenFranchise}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Franchise Enquiry</span>
            </button>
            <button
              onClick={onOpenStore}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Back to Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Support Channels Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportChannels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 hover:shadow-xl hover:border-amber-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Active 24x7
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{channel.title}</h3>
                  <p className="text-xs text-slate-500">{channel.subtitle}</p>
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">{channel.value}</div>
                  <div className="text-xs text-slate-500">{channel.extra}</div>
                </div>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-1"
                  >
                    <span>{channel.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={channel.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-1 cursor-pointer"
                  >
                    <span>{channel.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Social Media Connection Option: Facebook & Instagram */}
        <div className="mt-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700 shadow-md">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black flex items-center justify-center md:justify-start gap-1.5">
                <span>Connect With Us on Social Media</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Official Channels
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Daily parenting reels, new arrival lookbooks, exclusive promo codes & instant DMs on Instagram & Facebook.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://facebook.com/voraeclatofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md group cursor-pointer"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>Facebook Community (120K)</span>
            </a>

            <a
              href="https://instagram.com/voraeclat_kids"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md group cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram (@voraeclat_kids • 245K)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Body: Contact Form & Store Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Resolution Form</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details below. Our customer care team responds within 2 hours during active hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-950">
                    Thank You! Your Inquiry is Received
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                    Support Ticket <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">{ticketId}</strong> has been logged. Our parenting specialist will reach out to <strong>{formData.email}</strong> shortly.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Order & Delivery Tracking',
                        orderId: '',
                        message: '',
                      });
                    }}
                    className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={onOpenStore}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                      <option value="Return, Exchange & Refund">Return, Exchange & Refund</option>
                      <option value="Product Sizing & Material Care">Product Sizing & Material Care</option>
                      <option value="Voraeclat Club VIP Membership">Voraeclat Club VIP Membership</option>
                      <option value="Franchise Opportunity">Franchise Opportunity</option>
                      <option value="Hospital Bag & Newborn Guidance">Hospital Bag & Newborn Guidance</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g. ORD-2026-98124"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please explain how we can assist you today with your order or product inquiries..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Send Message to Customer Care</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Your contact details are encrypted and 100% private.</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: 5 cols (Flagship Stores & FAQ) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Store Locations & Interactive Map */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <h3 className="font-black text-slate-950 text-base">
                    Store Locations & Live Map
                  </h3>
                </div>

                {/* Map vs List Mode Toggle */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setMapViewMode('map')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      mapViewMode === 'map'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🗺️ Map View
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapViewMode('list')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      mapViewMode === 'list'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📋 All Stores
                  </button>
                </div>
              </div>

              {/* City Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {flagshipStores.map((store, idx) => (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => setSelectedStoreIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      selectedStoreIndex === idx
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{store.city}</span>
                  </button>
                ))}
              </div>

              {mapViewMode === 'map' ? (
                /* Interactive Google Map Embed View */
                <div className="space-y-3 pt-1">
                  {/* Google Maps Iframe */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner h-64 sm:h-72">
                    <iframe
                      title={`${flagshipStores[selectedStoreIndex].city} Location Map`}
                      src={flagshipStores[selectedStoreIndex].embedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Quick Directions Button overlay */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <a
                        href={flagshipStores[selectedStoreIndex].directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-950 backdrop-blur-md text-white text-[11px] font-bold shadow-lg transition-all hover:scale-102"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>

                  {/* Selected Store Information Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-black text-slate-950 text-sm">
                          {flagshipStores[selectedStoreIndex].city} — {flagshipStores[selectedStoreIndex].mall}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {flagshipStores[selectedStoreIndex].tag}
                        </span>
                      </div>

                      <a
                        href={flagshipStores[selectedStoreIndex].directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 shrink-0"
                      >
                        <span>Open in Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {flagshipStores[selectedStoreIndex].address}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {flagshipStores[selectedStoreIndex].features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-[11px]">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span>📞 {flagshipStores[selectedStoreIndex].phone}</span>
                        <span className="text-slate-300">•</span>
                        <span>🕒 {flagshipStores[selectedStoreIndex].timings}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAddress(flagshipStores[selectedStoreIndex].address)}
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                      >
                        {copiedAddress ? '✓ Address Copied!' : 'Copy Address'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* All Stores List View */
                <div className="space-y-3 pt-1">
                  {flagshipStores.map((store, i) => (
                    <div
                      key={store.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
                        selectedStoreIndex === i
                          ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      }`}
                      onClick={() => {
                        setSelectedStoreIndex(i);
                        setMapViewMode('map');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {store.city} — {store.mall}
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          View on Map 🗺️
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {store.address}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="font-semibold text-slate-700">📞 {store.phone}</span>
                        <span className="text-slate-400">•</span>
                        <span>🕒 {store.timings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-slate-950 text-base">
                  Common Questions
                </h3>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 text-xs font-bold text-slate-900 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                          activeFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-3.5 py-3 text-[11px] text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
