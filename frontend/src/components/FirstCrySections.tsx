import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Crown, Tag } from 'lucide-react';
import { CategoryId, Gender } from '../types';
import { getStoredSiteBanners, SiteBanner } from '../data/siteBanners';

interface FirstCrySectionsProps {
  onSelectCategory: (cat: CategoryId) => void;
  onSelectGender: (g: Gender) => void;
  onApplyCoupon: (code: string) => void;
  onSearchTag: (tag: string) => void;
}

interface FestiveStyleItem {
  name: string;
  displayName: string;
  image: string;
  price: string;
  gender: Gender;
}

export const FirstCrySections: React.FC<FirstCrySectionsProps> = ({
  onSelectCategory,
  onSelectGender,
  onApplyCoupon,
  onSearchTag,
}) => {
  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>(() => getStoredSiteBanners());

  useEffect(() => {
    const handleUpdate = () => setSiteBanners(getStoredSiteBanners());
    window.addEventListener('site_banners_updated', handleUpdate);
    return () => window.removeEventListener('site_banners_updated', handleUpdate);
  }, []);

  const footwearBanner =
    siteBanners.find((b) => b.id === 'banner-festive-footwear') || {
      badge: 'Diwali Carnival • Festive Edit',
      title: 'TRENDY FOOTWEAR FLAT 65% OFF',
      underText:
        'Pure leather handcrafted mojaris, ethnic kolhapuris, formal wedding brogues, and flexible barefoot toddler sneakers.',
      imageUrl:
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Shop Footwear →',
      buttonLink: 'footwear-accessories',
      couponCode: 'FESTIVE65',
    };

  const forHerBanner =
    siteBanners.find((b) => b.id === 'banner-for-her') || {
      badge: 'Girls Collection',
      title: 'FOR HER 🌸',
      underText: 'Twirl party frocks, festive lehengas, cute floral jumpsuits, and pastel shoes.',
      imageUrl:
        'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=800&q=85',
      buttonText: 'Explore Girls Fashion →',
      buttonLink: 'girl-fashion',
    };

  const forHimBanner =
    siteBanners.find((b) => b.id === 'banner-for-him') || {
      badge: 'Boys Collection',
      title: 'FOR HIM 🚀',
      underText: 'Denim dungarees, silk kurta dhoti sets, graphic tees, blazers, and sneakers.',
      imageUrl:
        'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=800&q=85',
      buttonText: 'Explore Boys Fashion →',
      buttonLink: 'boy-fashion',
    };

  const partyWearBanner =
    siteBanners.find((b) => b.id === 'banner-party-wear') || {
      badge: 'GOLDEN CELEBRATION EDIT',
      title: 'PARTY WEAR COLLECTION',
      underText: 'Starting ₹399 • Gowns, tuxedo sets, sequins & layered fairy frocks',
      imageUrl:
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1400&q=80',
      buttonText: 'Shop Party Outfits →',
      buttonLink: 'festive-ethnic',
    };
  // 12 Premium Boutiques Data with authentic kid photography matching each title exactly
  const boutiques = [
    {
      title: 'New Arrivals',
      subtitle: 'Light Up Your Wardrobe',
      discount: '40% OFF',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=85',
      badge: 'NEW TODAY',
      cat: 'festive-ethnic' as CategoryId,
    },
    {
      title: 'Navratri Utsav',
      subtitle: 'Festive Chaniya Cholis & Kurtas',
      discount: '40% OFF',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=85',
      badge: 'SHOP NOW',
      cat: 'festive-ethnic' as CategoryId,
    },
    {
      title: 'Spooky & Party Styles',
      subtitle: 'Costumes & Fun Wear',
      discount: '40% OFF',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=85',
      badge: 'TRENDING',
      cat: 'casual-wear' as CategoryId,
    },
    {
      title: 'Style Add-Ons',
      subtitle: 'Caps, Belts, Hair Accessories',
      discount: '85% OFF',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=85',
      badge: 'FLAT DEAL',
      cat: 'footwear-accessories' as CategoryId,
    },
    {
      title: 'Festive Elegance',
      subtitle: 'Pure Silk Lehengas & Sherwanis',
      discount: '89% OFF',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=85',
      badge: 'LIMITED',
      cat: 'festive-ethnic' as CategoryId,
    },
    {
      title: 'Celeb Glam Kids',
      subtitle: 'Trendy Runway Outfits Up to 14Y',
      discount: '80% OFF',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=85',
      badge: 'HOT EDIT',
      cat: 'girl-fashion' as CategoryId,
    },
    {
      title: 'Denim Wardrobe',
      subtitle: 'Jeans, Dungarees & Jeggings',
      discount: 'Flat 50%',
      image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=85',
      badge: 'NEW TODAY',
      cat: 'boy-fashion' as CategoryId,
    },
    {
      title: 'Ready for Layers',
      subtitle: 'Sweatshirts, Hoodies & Jackets',
      discount: 'Winter Edit',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=85',
      badge: 'COZY PICKS',
      cat: 'casual-wear' as CategoryId,
    },
    {
      title: 'Classic Shirt Styles',
      subtitle: 'Full Sleeve Shirts & Polos',
      discount: 'New Today',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=85',
      badge: 'BESTSELLER',
      cat: 'boy-fashion' as CategoryId,
    },
    {
      title: 'Best of Gear Products',
      subtitle: 'Strollers, Cots & Car Seats',
      discount: '80% OFF',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=85',
      badge: 'SHOP NOW',
      cat: 'nursery-gear' as CategoryId,
    },
    {
      title: 'Full Sleeve Looks',
      subtitle: 'Cozy Bio-Wash Tees & Tops',
      discount: '82% OFF',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=85',
      badge: 'TOP VALUE',
      cat: 'casual-wear' as CategoryId,
    },
    {
      title: 'The Footwear Edit',
      subtitle: 'Sneakers, Mojaris & Booties',
      discount: '53% OFF',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=85',
      badge: 'HOT PAIRS',
      cat: 'footwear-accessories' as CategoryId,
    },
  ];

  const [activeDiwaliTab, setActiveDiwaliTab] = useState<'girls' | 'boys' | 'all'>('girls');

  // 10 Girls Festive Wardrobe Edit Categories matching Image 1
  const festiveGirlsStyles: FestiveStyleItem[] = [
    {
      name: 'Anarkali Styles',
      displayName: 'Anarkali Styles>',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=85',
      price: '₹349',
      gender: 'girl',
    },
    {
      name: 'Churidar Sets',
      displayName: 'Churidar Sets>',
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=85',
      price: '₹399',
      gender: 'girl',
    },
    {
      name: 'Sharara & Gharara Sets',
      displayName: 'Sharara & Gharara Sets>',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=85',
      price: '₹449',
      gender: 'girl',
    },
    {
      name: 'Heavy Lehengas',
      displayName: 'Heavy Lehengas>',
      image: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=600&q=85',
      price: '₹699',
      gender: 'girl',
    },
    {
      name: 'Ethnic Dresses',
      displayName: 'Ethnic Dresses>',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=85',
      price: '₹349',
      gender: 'girl',
    },
    {
      name: 'Salwar Sets',
      displayName: 'Salwar Sets>',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=85',
      price: '₹399',
      gender: 'girl',
    },
    {
      name: 'Chaniya Cholis',
      displayName: 'Chaniya Cholis>',
      image: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=600&q=85',
      price: '₹499',
      gender: 'girl',
    },
    {
      name: 'Pattu Pavadai',
      displayName: 'Pattu Pavadai>',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=85',
      price: '₹599',
      gender: 'girl',
    },
    {
      name: 'Evening Dresses & Gowns',
      displayName: 'Evening Dresses & Gowns>',
      image: 'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=600&q=85',
      price: '₹499',
      gender: 'girl',
    },
    {
      name: 'Fancy Frocks',
      displayName: 'Fancy Frocks>',
      image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=600&q=85',
      price: '₹349',
      gender: 'girl',
    },
  ];

  // 10 Boys Festive Wardrobe Edit Categories matching Image 2
  const festiveBoysStyles: FestiveStyleItem[] = [
    {
      name: 'Party Suits',
      displayName: 'Party Suits>',
      image: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=600&q=85',
      price: '₹649',
      gender: 'boy',
    },
    {
      name: 'Blazers & Jackets',
      displayName: 'Blazers & Jackets>',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=85',
      price: '₹599',
      gender: 'boy',
    },
    {
      name: 'Dhoti Sets',
      displayName: 'Dhoti Sets>',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=85',
      price: '₹399',
      gender: 'boy',
    },
    {
      name: 'Jodhpuri Pant Sets',
      displayName: 'Jodhpuri Pant Sets>',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=85',
      price: '₹549',
      gender: 'boy',
    },
    {
      name: 'Kurta Sets',
      displayName: 'Kurta Sets>',
      image: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=600&q=85',
      price: '₹349',
      gender: 'boy',
    },
    {
      name: 'Sherwani Styles',
      displayName: 'Sherwani Styles>',
      image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=85',
      price: '₹699',
      gender: 'boy',
    },
    {
      name: 'Indo Western',
      displayName: 'Indo Western>',
      image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=85',
      price: '₹549',
      gender: 'boy',
    },
    {
      name: 'Knit Collection',
      displayName: 'Knit Collection>',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=85',
      price: '₹399',
      gender: 'unisex',
    },
    {
      name: 'Mojaris & Kolhapuri',
      displayName: 'Mojaris & Kolhapuri>',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=85',
      price: '₹299',
      gender: 'unisex',
    },
    {
      name: 'Jewelry',
      displayName: 'Jewelry>',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=85',
      price: '₹199',
      gender: 'girl',
    },
  ];

  // 10 Casual Collection Cards with Photography Exactly Matching Each Title
  const casualPricedItems = [
    { title: 'Frocks & Dresses', price: 'Starting ₹249', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80', tag: 'Dresses', cat: 'girl-fashion' as CategoryId },
    { title: 'Casual Shirts', price: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80', tag: 'Shirts', cat: 'boy-fashion' as CategoryId },
    { title: 'Tops & Tees', price: 'Starting ₹289', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80', tag: 'Tops', cat: 'casual-wear' as CategoryId },
    { title: 'Sets & Suits', price: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80', tag: 'Sets', cat: 'boy-fashion' as CategoryId },
    { title: 'Nightwear & Pajamas', price: 'Starting ₹269', image: 'https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=400&q=80', tag: 'Sleepsuit', cat: 'baby-toddler' as CategoryId },
    { title: 'Skirts, Jeans & Denim', price: 'Starting ₹249', image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=400&q=80', tag: 'Denim', cat: 'casual-wear' as CategoryId },
    { title: 'Onesies & Rompers', price: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80', tag: 'Romper', cat: 'baby-toddler' as CategoryId },
    { title: 'Pajamas & Leggings', price: 'Starting ₹289', image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80', tag: 'Leggings', cat: 'casual-wear' as CategoryId },
    { title: 'Graphic T-Shirts', price: 'Starting ₹299', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80', tag: 'T-Shirts', cat: 'casual-wear' as CategoryId },
    { title: 'Innerwear & Vests', price: 'Starting ₹259', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80', tag: 'Essentials', cat: 'baby-toddler' as CategoryId },
  ];

  // The Fashion Collective Brands with Kid Portraits
  const brands = [
    { name: 'Babyhug', label: "India's #1 Baby Brand", image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pine Kids', label: 'Playful Everyday Styles', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80' },
    { name: "Carter's", label: 'Global Baby Comfort', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kookie Kids', label: 'Festive Celebration Wear', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=300&q=80' },
    { name: 'Mark & Mia', label: 'Trendy Boutique Looks', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=300&q=80' },
    { name: 'Bonfino', label: 'Premium Organic Cottons', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=80' },
    { name: 'Honeyhap', label: 'Cute Newborn Snuggles', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80' },
    { name: 'Ollypop', label: 'Color Pop Toddler Fashion', image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=300&q=80' },
  ];

  // Daily Care Essentials & Department Hubs with Real Commercial Photos
  const departmentHubs = [
    {
      title: 'Baby Diapers & Wipes',
      sub: 'Bamboo Tape, Pants & Wipes',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      cat: 'diapering' as CategoryId,
      tag: 'Tear-Free',
    },
    {
      title: 'Bath & Skincare',
      sub: 'Gentle Wash, Lotions & Tubs',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
      cat: 'bath-skin' as CategoryId,
      tag: 'Organic',
    },
    {
      title: 'Feeding & Nursing',
      sub: 'Glass Bottles, Sippers & Bowls',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
      cat: 'feeding' as CategoryId,
      tag: 'BPA-Free',
    },
    {
      title: 'Toys & Magic Time',
      sub: 'Montessori, Soft Toys & Remote Cars',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
      cat: 'toys-learning' as CategoryId,
      tag: 'STEM & Play',
    },
    {
      title: 'Gear & Activity',
      sub: 'Strollers, Cots, Car Seats & Trikes',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80',
      cat: 'nursery-gear' as CategoryId,
      tag: 'Tested Safe',
    },
    {
      title: 'Build Your Own Library',
      sub: 'Bedtime Stories, Rhymes & Books',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
      cat: 'books-library' as CategoryId,
      tag: 'Board Books',
    },
    {
      title: 'Health & Safety',
      sub: 'Childproofing, Monitors & Care',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      cat: 'health-safety' as CategoryId,
      tag: 'Pediatrician Pick',
    },
    {
      title: 'Moms & Maternity',
      sub: 'Nursing Sleepwear, Oils & Tunics',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
      cat: 'moms-maternity' as CategoryId,
      tag: 'Pure Comfort',
    },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* 1. DIWALI CARNIVAL / FESTIVE BANNER WITH LUXURY MOJARIS / FOOTWEAR PHOTO */}
      <div className="rounded-3xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-600 shadow-xl overflow-hidden relative border border-amber-300/40">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Banner Text Area */}
          <div className="p-6 sm:p-10 md:col-span-7 text-white space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{footwearBanner.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-xs">
              {footwearBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-md font-medium leading-relaxed">
              {footwearBanner.underText}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {footwearBanner.couponCode && (
                <div className="px-4 py-2 bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/30 text-xs font-bold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>Coupon: <strong className="font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded">{footwearBanner.couponCode}</strong></span>
                  <button
                    onClick={() => onApplyCoupon(footwearBanner.couponCode || 'FESTIVE65')}
                    className="text-[11px] underline hover:text-amber-300 text-white font-bold ml-1 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              <button
                onClick={() => onSelectCategory((footwearBanner.buttonLink as CategoryId) || 'footwear-accessories')}
                className="px-6 py-2.5 bg-white hover:bg-amber-50 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                {footwearBanner.buttonText || 'Shop Footwear →'}
              </button>
            </div>
          </div>

          {/* Banner Hero Image */}
          <div className="md:col-span-5 h-64 sm:h-80 md:h-full relative overflow-hidden flex items-center justify-center p-4">
            <div className="relative w-full h-full max-h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/40">
              <img
                src={footwearBanner.imageUrl}
                alt={footwearBanner.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-extrabold text-white tracking-wide">
                  {footwearBanner.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREMIUM BOUTIQUES (12 PHOTOGRAPHY CARDS LIKE FIRSTCRY) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">PREMIUM BOUTIQUES</h3>
            </div>
            <p className="text-xs text-slate-500">Hand-curated themed collections with up to 89% off</p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>View All Boutiques</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {boutiques.map((b) => (
            <div
              key={b.title}
              onClick={() => onSelectCategory(b.cat)}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Preview Thumbnail */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover object-top sm:object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs border border-white/20">
                  {b.discount}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-xs">
                  {b.badge}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">{b.subtitle}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-amber-600">
                  <span>Explore Edit</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FESTIVE EDIT WIDE BANNER (NEW ARRIVALS 0 TO 14 YEARS) */}
      <div
        onClick={() => onSelectCategory('festive-ethnic')}
        className="relative rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-rose-200 group"
      >
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80"
            alt="Festive Edit New Arrivals"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-rose-950/90 via-rose-900/60 to-transparent flex items-center p-6 sm:p-12">
            <div className="max-w-md text-white space-y-2">
              <span className="text-xs font-black tracking-widest uppercase bg-amber-400 text-slate-950 px-3 py-1 rounded-full inline-block">
                0 TO 14 YEARS • FESTIVE EDIT
              </span>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
                NEW ARRIVALS
              </h3>
              <p className="text-sm font-semibold text-rose-100">
                Light Up Your Wardrobe • FLAT 40% OFF On Pure Silk Lehengas, Kurtas & Party Sets
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-black text-xs rounded-xl shadow-lg group-hover:bg-amber-300 transition-colors">
                  Shop Festive Collection &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHOP BY STYLE: FOR HER & FOR HIM (ARCHED REAL PORTRAIT CARDS) */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
            SHOP BY STYLE
          </h3>
          <p className="text-xs text-slate-500">Signature celebratory edits designed for young trendsetters</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* For Her */}
          <div
            onClick={() => {
              onSelectGender('girl');
              onSelectCategory((forHerBanner.buttonLink as CategoryId) || 'girl-fashion');
            }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl border border-pink-200 transition-all duration-300"
          >
            <div className="h-80 sm:h-96 relative overflow-hidden">
              <img
                src={forHerBanner.imageUrl}
                alt={forHerBanner.title}
                className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-rose-950/95 via-pink-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white backdrop-blur-[0.5px]">
                <span className="text-xs font-bold text-pink-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {forHerBanner.badge}
                </span>
                <h4 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{forHerBanner.title}</h4>
                <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-sm font-medium leading-relaxed">
                  {forHerBanner.underText}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-rose-950 font-black text-xs rounded-xl shadow-md group-hover:bg-pink-100 transition-colors">
                    {forHerBanner.buttonText || 'Explore Girls Fashion →'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* For Him */}
          <div
            onClick={() => {
              onSelectGender('boy');
              onSelectCategory((forHimBanner.buttonLink as CategoryId) || 'boy-fashion');
            }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl border border-sky-200 transition-all duration-300"
          >
            <div className="h-80 sm:h-96 relative overflow-hidden">
              <img
                src={forHimBanner.imageUrl}
                alt={forHimBanner.title}
                className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-sky-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white backdrop-blur-[0.5px]">
                <span className="text-xs font-bold text-sky-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {forHimBanner.badge}
                </span>
                <h4 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{forHimBanner.title}</h4>
                <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-sm font-medium leading-relaxed">
                  {forHimBanner.underText}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-sky-950 font-black text-xs rounded-xl shadow-md group-hover:bg-sky-100 transition-colors">
                    {forHimBanner.buttonText || 'Explore Boys Fashion →'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DIWALI WARDROBE EDIT — EXACT PIXEL-PERFECT VIEW MATCHING REFERENCE SCREENSHOTS */}
      <div className="relative bg-[#fffdf9] rounded-3xl p-5 sm:p-8 md:p-10 border border-amber-200/80 shadow-xs overflow-hidden">
        {/* Decorative Golden Festive Sparkles (✦) matching reference screenshots */}
        <div className="absolute top-5 left-5 text-amber-400 select-none pointer-events-none animate-pulse">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-4 sm:right-6 text-amber-400 select-none pointer-events-none hidden md:block">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
          </svg>
        </div>
        <div className="absolute top-[54%] right-8 text-amber-300 select-none pointer-events-none hidden md:block">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
          </svg>
        </div>

        {/* Section Header: DIWALI WARDROBE EDIT | Starting ₹ 349 (Exactly matching reference screenshot) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-wide text-[#1a237e] uppercase">
              DIWALI WARDROBE EDIT
            </h2>
            <span className="text-slate-300 text-2xl font-light hidden sm:inline">|</span>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-700 font-semibold text-base sm:text-lg">Starting</span>
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#800020]">
                ₹ 349
              </span>
            </div>
          </div>

          {/* Toggle Pills: Girls Edit (Image 1), Boys Edit (Image 2), or All 20 */}
          <div className="flex items-center gap-1.5 bg-amber-50/80 p-1 rounded-2xl border border-amber-200/80 self-start md:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveDiwaliTab('girls')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeDiwaliTab === 'girls'
                  ? 'bg-[#4a121e] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              🌸 Girls Edit (10)
            </button>
            <button
              type="button"
              onClick={() => setActiveDiwaliTab('boys')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeDiwaliTab === 'boys'
                  ? 'bg-[#4a121e] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              🚀 Boys Edit (10)
            </button>
            <button
              type="button"
              onClick={() => setActiveDiwaliTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeDiwaliTab === 'all'
                  ? 'bg-[#4a121e] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              ✨ View Both (20)
            </button>
          </div>
        </div>

        {/* GIRLS FESTIVE WARDROBE EDIT GRID (Matching Image 1: 5 Columns x 2 Rows) */}
        {(activeDiwaliTab === 'girls' || activeDiwaliTab === 'all') && (
          <div className={activeDiwaliTab === 'all' ? 'mb-10' : ''}>
            {activeDiwaliTab === 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#800020] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Girls Festive Edit • 10 Styles
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {festiveGirlsStyles.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    onSelectGender(item.gender);
                    onSelectCategory('festive-ethnic');
                    onSearchTag(item.name);
                  }}
                  className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Decorative Arched Golden Outer Frame */}
                  <div className="w-full relative rounded-t-[44px] sm:rounded-t-[54px] rounded-b-[22px] p-[2.5px] bg-linear-to-b from-[#fcd34d] via-[#fef08a] to-[#d97706] shadow-xs group-hover:shadow-xl group-hover:from-amber-400 group-hover:to-amber-500 transition-all">
                    {/* Inner Card Arch Container */}
                    <div className="relative w-full rounded-t-[41.5px] sm:rounded-t-[51.5px] rounded-b-[19.5px] overflow-hidden bg-slate-100 aspect-[3/4.2] flex flex-col justify-end">
                      {/* Real Kid Model Photography */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle Bottom Vignette for Crisp Pill Contrast */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Bottom Burgundy Pill Label - Exactly matching reference screenshot */}
                      <div className="relative z-10 w-full px-2 sm:px-3 pb-2.5 sm:pb-3 flex justify-center">
                        <div className="w-full py-2 px-1.5 sm:px-2 rounded-2xl bg-[#4a121e] group-hover:bg-[#360b14] text-white font-bold text-center text-xs sm:text-[13px] tracking-tight shadow-md transition-colors leading-tight flex items-center justify-center">
                          <span>{item.displayName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOYS FESTIVE WARDROBE EDIT GRID (Matching Image 2: 5 Columns x 2 Rows) */}
        {(activeDiwaliTab === 'boys' || activeDiwaliTab === 'all') && (
          <div>
            {activeDiwaliTab === 'all' && (
              <div className="flex items-center gap-2 mb-4 pt-6 border-t border-amber-100">
                <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  Boys Festive Edit • 10 Styles
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {festiveBoysStyles.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    onSelectGender(item.gender);
                    onSelectCategory('festive-ethnic');
                    onSearchTag(item.name);
                  }}
                  className="group relative cursor-pointer flex flex-col items-center transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Decorative Arched Golden Outer Frame */}
                  <div className="w-full relative rounded-t-[44px] sm:rounded-t-[54px] rounded-b-[22px] p-[2.5px] bg-linear-to-b from-[#fcd34d] via-[#fef08a] to-[#d97706] shadow-xs group-hover:shadow-xl group-hover:from-amber-400 group-hover:to-amber-500 transition-all">
                    {/* Inner Card Arch Container */}
                    <div className="relative w-full rounded-t-[41.5px] sm:rounded-t-[51.5px] rounded-b-[19.5px] overflow-hidden bg-slate-100 aspect-[3/4.2] flex flex-col justify-end">
                      {/* Real Kid Model Photography */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle Bottom Vignette for Crisp Pill Contrast */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Bottom Burgundy Pill Label - Exactly matching reference screenshot */}
                      <div className="relative z-10 w-full px-2 sm:px-3 pb-2.5 sm:pb-3 flex justify-center">
                        <div className="w-full py-2 px-1.5 sm:px-2 rounded-2xl bg-[#4a121e] group-hover:bg-[#360b14] text-white font-bold text-center text-xs sm:text-[13px] tracking-tight shadow-md transition-colors leading-tight flex items-center justify-center">
                          <span>{item.displayName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. THE FASHION COLLECTIVE — TOP BRANDS (KID PORTRAITS LIKE SCREENSHOT) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              THE FASHION COLLECTIVE
            </h3>
            <p className="text-xs text-slate-500">India's most loved kids & baby apparel brands</p>
          </div>
          <span className="text-xs font-mono font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Starting ₹399
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              onClick={() => onSearchTag(b.name)}
              className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center group shadow-2xs hover:shadow-md"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm bg-slate-200">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="text-xs font-black text-slate-900 leading-tight group-hover:text-amber-800">
                {b.name}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PARTY WEAR COLLECTION SPARKLING BANNER */}
      <div
        onClick={() => onSelectCategory((partyWearBanner.buttonLink as CategoryId) || 'festive-ethnic')}
        className="relative rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-amber-300 group"
      >
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={partyWearBanner.imageUrl}
            alt={partyWearBanner.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-amber-950/90 via-amber-900/60 to-transparent flex items-center p-6 sm:p-10">
            <div className="max-w-md text-white space-y-2">
              <span className="text-xs font-black tracking-widest uppercase bg-amber-300 text-slate-950 px-3 py-1 rounded-full inline-block">
                {partyWearBanner.badge}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {partyWearBanner.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 font-semibold leading-relaxed">
                {partyWearBanner.underText}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-950 font-black text-xs rounded-xl shadow-md group-hover:bg-amber-100 transition-colors">
                  {partyWearBanner.buttonText || 'Shop Party Outfits →'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. CASUAL COLLECTION — BY STARTING PRICE (10 PHOTO CARDS) */}
      <div className="bg-linear-to-b from-amber-50/40 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-amber-200/60">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              CASUAL COLLECTION
            </h3>
            <p className="text-xs text-slate-600">Everyday playground comfort, bio-washed cotton, and cozy sleepwear</p>
          </div>
          <button
            onClick={() => onSelectCategory('casual-wear')}
            className="text-xs font-bold text-amber-800 underline hover:text-amber-900"
          >
            Browse All Casuals &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {casualPricedItems.map((c) => (
            <div
              key={c.title}
              onClick={() => {
                onSelectCategory(c.cat);
                onSearchTag(c.tag);
              }}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-lg cursor-pointer transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-amber-800">
                  {c.title}
                </h4>
                <div className="text-xs font-black font-mono text-amber-600 mt-1">
                  {c.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. DAILY CARE ESSENTIALS & DEPARTMENT HUBS (COMMERCIAL PHOTO TILES) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              DAILY CARE & ESSENTIALS HUBS
            </h3>
            <p className="text-xs text-slate-500">Everything your child needs from newborn through school years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentHubs.map((hub) => (
            <div
              key={hub.title}
              onClick={() => onSelectCategory(hub.cat)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl cursor-pointer transition-all overflow-hidden group flex flex-col justify-between"
            >
              <div className="aspect-16/10 w-full overflow-hidden relative bg-slate-100">
                <img
                  src={hub.image}
                  alt={hub.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {hub.tag}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  {hub.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{hub.sub}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-amber-600">
                  <span>Explore Hub</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. TRUSTED BRANDS LOGO STRIP AT BOTTOM */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
        <div className="text-center text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
          AUTHORIZED OFFICIAL RETAIL PARTNER FOR 1,000+ GLOBAL & INDIAN BRANDS
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-extrabold text-sm sm:text-base">
          <span className="hover:text-slate-950 transition-colors cursor-pointer">Babyhug</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-blue-600">Pampers</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-red-600">Huggies</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-indigo-600">MamyPoko</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-emerald-700">Sebamed</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-teal-700">Cetaphil</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-amber-700">Chicco</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-sky-600">Carter's</span>
          <span className="hover:text-slate-950 transition-colors cursor-pointer text-rose-600">Pigeon</span>
        </div>
      </div>
    </div>
  );
};
