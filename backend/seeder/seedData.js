import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';
import { Coupon } from '../models/Coupon.js';
import { FranchiseLead } from '../models/FranchiseLead.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { AdCampaign } from '../models/AdCampaign.js';
import { connectDB, isDbConnected } from '../config/db.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Pooja Sharma',
    email: 'pooja.sharma@gmail.com',
    mobile: '+91 98201 23456',
    role: 'customer',
    isClubMember: true,
    clubTier: 'Gold',
    totalOrders: 3,
    totalSpent: 4890,
    addresses: [
      {
        title: 'Home',
        name: 'Pooja Sharma',
        phone: '+91 98201 23456',
        address: 'Flat 402, Sunshine Heights, Bandra West',
        locality: 'Hill Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        landmark: 'Near Mehboob Studio'
      }
    ]
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@outlook.com',
    mobile: '+91 98110 54321',
    role: 'customer',
    isClubMember: false,
    totalOrders: 1,
    totalSpent: 1499,
    addresses: [
      {
        title: 'Home',
        name: 'Rahul Verma',
        phone: '+91 98110 54321',
        address: 'B-12, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301'
      }
    ]
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    mobile: '+91 98922 11009',
    role: 'customer',
    isClubMember: true,
    clubTier: 'Platinum',
    totalOrders: 4,
    totalSpent: 7350,
    addresses: [
      {
        title: 'Home',
        name: 'Ananya Deshmukh',
        phone: '+91 98922 11009',
        address: 'A-704, Marvel Zephyr, Kharadi',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411014'
      }
    ]
  }
];

const sampleAdCampaigns = [
  {
    campaignId: 'CAMP-META-SUMMER26',
    campaignName: 'Instagram Reels - Summer Baby & Kids Fest 2026',
    platform: 'Instagram Reels',
    status: 'Active',
    dailyBudget: 2500,
    totalSpend: 18500,
    impressions: 145000,
    clicks: 6200,
    conversions: 84,
    revenueGenerated: 142000,
    roas: 7.68,
    utmSource: 'instagram',
    utmMedium: 'reels',
    utmCampaign: 'summer_fest_2026',
    targetAudience: 'Parents with kids aged 0-8 yrs, Tier 1 & 2 cities'
  },
  {
    campaignId: 'CAMP-GGL-ORGANIC',
    campaignName: 'Google Search - Organic Pure Cotton Rompers & Ethnic',
    platform: 'Google Ads',
    status: 'Active',
    dailyBudget: 1800,
    totalSpend: 12400,
    impressions: 54000,
    clicks: 4100,
    conversions: 62,
    revenueGenerated: 98000,
    roas: 7.90,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'search_pure_cotton_romper',
    targetAudience: 'High intent baby clothing shoppers'
  },
  {
    campaignId: 'CAMP-FB-RETARGET',
    campaignName: 'Facebook Dynamic Product Retargeting - Cart Abandonment',
    platform: 'Facebook',
    status: 'Active',
    dailyBudget: 1200,
    totalSpend: 8600,
    impressions: 48000,
    clicks: 3400,
    conversions: 51,
    revenueGenerated: 89400,
    roas: 10.4,
    utmSource: 'facebook',
    utmMedium: 'retargeting',
    utmCampaign: 'cart_recovery',
    targetAudience: 'Cart abandoners within 7 days'
  }
];

const sampleOrders = [
  // 1. OUT FOR DELIVERY (COD, Courier: Delhivery, Agent info, OTP)
  {
    orderId: 'ORD-910482',
    invoiceNumber: 'INV-2026-0041',
    customerName: 'Pooja Sharma',
    customerMobile: '+91 98201 23456',
    customerEmail: 'pooja.sharma@gmail.com',
    customerAlternateMobile: '+91 98201 99999',
    deliveryAddress: {
      name: 'Pooja Sharma',
      phone: '+91 98201 23456',
      alternatePhone: '+91 98201 99999',
      address: 'Flat 402, Sunshine Heights, Bandra West',
      locality: 'Hill Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      landmark: 'Near Mehboob Studio',
      addressType: 'Home'
    },
    billingAddress: {
      name: 'Pooja Sharma',
      phone: '+91 98201 23456',
      address: 'Flat 402, Sunshine Heights, Bandra West',
      locality: 'Hill Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    items: [
      {
        productId: 'ps-101',
        productName: 'Pure Organic Cotton Baby Romper',
        imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
        price: 599,
        originalPrice: 1199,
        quantity: 2,
        size: '3-6M',
        color: 'Sky Blue'
      }
    ],
    subTotal: 1198,
    discountAmount: 120,
    couponApplied: 'WELCOME10',
    gstAmount: 54,
    cgst: 27,
    sgst: 27,
    shippingFee: 0,
    codFee: 49,
    totalAmount: 1181,
    // Payment mode: COD
    paymentMode: 'COD',
    paymentMethod: 'COD',
    paymentStatus: 'COD Pending Collection',
    codAmountToCollect: 1181,
    codCollectionStatus: 'Pending Collection',
    isPaid: false,
    // Courier & Logistics
    courierPartner: 'Delhivery',
    awbNumber: 'DLV-982145328IN',
    trackingNumber: 'DLV-982145328',
    trackingUrl: 'https://www.delhivery.com/track/package/DLV-982145328IN',
    dispatchedAt: new Date(Date.now() - 24 * 3600 * 1000),
    courierContact: '1800-103-6354 (Delhivery Mumbai Hub)',
    expectedDelivery: 'Today by 4:00 PM',
    // Status: OUT FOR DELIVERY
    status: 'Out for Delivery',
    outForDeliveryAt: new Date(Date.now() - 3 * 3600 * 1000),
    deliveryAgentName: 'Ramesh Kumar',
    deliveryAgentPhone: '+91 98765 43210',
    deliveryOtp: '4829',
    // Ad Campaign Attribution
    adCampaignId: 'CAMP-META-SUMMER26',
    adCampaignName: 'Instagram Reels - Summer Baby & Kids Fest 2026',
    adPlatform: 'Instagram Reels',
    utmSource: 'instagram',
    utmMedium: 'reels',
    utmCampaign: 'summer_fest_2026'
  },

  // 2. DELIVERY PENDING (Prepaid UPI, BlueDart, Customer Unavailable)
  {
    orderId: 'ORD-824190',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Rahul Verma',
    customerMobile: '+91 98110 54321',
    customerEmail: 'rahul.verma@outlook.com',
    deliveryAddress: {
      name: 'Rahul Verma',
      phone: '+91 98110 54321',
      address: 'B-12, Sector 62',
      locality: 'Tech Zone',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      addressType: 'Office'
    },
    billingAddress: {
      name: 'Rahul Verma',
      phone: '+91 98110 54321',
      address: 'B-12, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301'
    },
    items: [
      {
        productId: 'ps-102',
        productName: 'Festive Embroidered Silk Kurta Pajama Set',
        imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
        price: 1499,
        originalPrice: 2499,
        quantity: 1,
        size: '2-4Y',
        color: 'Royal Mustard'
      }
    ],
    subTotal: 1499,
    discountAmount: 0,
    gstAmount: 75,
    cgst: 37.5,
    sgst: 37.5,
    shippingFee: 0,
    codFee: 0,
    totalAmount: 1574,
    // Payment mode: UPI (Prepaid)
    paymentMode: 'UPI',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    transactionId: 'UPI-938210948123',
    isPaid: true,
    paidAt: new Date(Date.now() - 48 * 3600 * 1000),
    codAmountToCollect: 0,
    codCollectionStatus: 'Not Applicable',
    // Courier & Logistics
    courierPartner: 'BlueDart Express',
    awbNumber: 'BLU-549102837IN',
    trackingNumber: 'BLU-549102837',
    trackingUrl: 'https://www.bluedart.com/tracking/BLU-549102837IN',
    dispatchedAt: new Date(Date.now() - 36 * 3600 * 1000),
    courierContact: '1860-233-1234 (BlueDart Noida)',
    expectedDelivery: 'Rescheduled for Tomorrow',
    // Status: DELIVERY PENDING
    status: 'Delivery Pending',
    deliveryPendingReason: 'Customer Unavailable',
    deliveryAttemptsCount: 1,
    lastAttemptAt: new Date(Date.now() - 4 * 3600 * 1000),
    rescheduledDeliveryDate: new Date(Date.now() + 20 * 3600 * 1000),
    deliveryAgentName: 'Vikas Singh',
    deliveryAgentPhone: '+91 99112 33445',
    // Ad Campaign Attribution
    adCampaignId: 'CAMP-GGL-ORGANIC',
    adCampaignName: 'Google Search - Organic Pure Cotton Rompers & Ethnic',
    adPlatform: 'Google Search',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'search_pure_cotton_romper'
  },

  // 3. DELIVERED (COD Collected, Courier: Shadowfax)
  {
    orderId: 'ORD-739105',
    invoiceNumber: 'INV-2026-0043',
    customerName: 'Ananya Deshmukh',
    customerMobile: '+91 98922 11009',
    customerEmail: 'ananya.d@gmail.com',
    deliveryAddress: {
      name: 'Ananya Deshmukh',
      phone: '+91 98922 11009',
      address: 'A-704, Marvel Zephyr, Kharadi',
      locality: 'World Trade Center Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      addressType: 'Home'
    },
    billingAddress: {
      name: 'Ananya Deshmukh',
      phone: '+91 98922 11009',
      address: 'A-704, Marvel Zephyr, Kharadi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    items: [
      {
        productId: 'ps-103',
        productName: 'Princess Floral Flare Party Frock',
        imageUrl: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
        price: 1099,
        originalPrice: 2199,
        quantity: 1,
        size: '2-4Y',
        color: 'Peach Coral'
      }
    ],
    subTotal: 1099,
    discountAmount: 110,
    couponApplied: 'WELCOME10',
    gstAmount: 49,
    shippingFee: 0,
    codFee: 49,
    totalAmount: 1087,
    paymentMode: 'COD',
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    codAmountToCollect: 1087,
    codCollectionStatus: 'Collected by Delivery Agent',
    isPaid: true,
    paidAt: new Date(Date.now() - 12 * 3600 * 1000),
    courierPartner: 'Shadowfax',
    awbNumber: 'SFX-774910238IN',
    trackingNumber: 'SFX-774910238',
    trackingUrl: 'https://www.shadowfax.in/track/SFX-774910238IN',
    status: 'Delivered',
    deliveredAt: new Date(Date.now() - 12 * 3600 * 1000),
    deliveryAgentName: 'Sunil Patil',
    deliveryAgentPhone: '+91 98231 77665',
    adCampaignId: 'CAMP-FB-RETARGET',
    adCampaignName: 'Facebook Dynamic Product Retargeting - Cart Abandonment',
    adPlatform: 'Facebook',
    utmSource: 'facebook',
    utmMedium: 'retargeting',
    utmCampaign: 'cart_recovery'
  }
];

const sampleCoupons = [
  {
    code: 'WELCOME10',
    title: 'Flat 10% Off on First Order',
    description: 'Get 10% discount on baby & kids clothing and essentials',
    discountType: 'percentage',
    discountValue: 10,
    minCartValue: 499,
    maxDiscount: 300,
    isActive: true
  },
  {
    code: 'FESTIVE20',
    title: 'Festive Season 20% Off',
    description: 'Save 20% on ethnic wear & party dresses above ₹1,999',
    discountType: 'percentage',
    discountValue: 20,
    minCartValue: 1999,
    maxDiscount: 1000,
    isActive: true
  },
  {
    code: 'PUPPY500',
    title: 'Flat ₹500 Off Mega Club Voucher',
    description: 'Exclusive club savings on orders above ₹2,499',
    discountType: 'flat',
    discountValue: 500,
    minCartValue: 2499,
    maxDiscount: 500,
    isActive: true
  }
];

const sampleBanners = [
  {
    customId: 'hero-1',
    name: 'Diwali Grand Fest Banner',
    location: 'homepage',
    group: 'hero',
    badge: 'FESTIVE SALE',
    title: 'Celebrate with Pure Luxury Kids Wear',
    underText: 'Up to 60% off on verified organic cotton & handloom silks.',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Shop Ethnic',
    ctaLink: '/category/festive-ethnic',
    accentColor: '#F59E0B',
    active: true,
    orderIndex: 1
  },
  {
    customId: 'hero-2',
    name: 'Festive & Ethnic Collection',
    location: 'homepage',
    group: 'hero',
    badge: 'LIMITED EDITION',
    title: 'Sparkling Celebrations & Kids Ethnic Wear',
    underText: 'Pure cotton silk kurtas, lehengas & festive sets.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Explore Collection',
    ctaLink: '/category/festive-ethnic',
    accentColor: '#EC4899',
    active: true,
    orderIndex: 2
  }
];

const sampleProducts = [
  {
    customId: 'ps-101',
    name: 'Pure Organic Cotton Baby Romper',
    brand: 'Voraeclat Pure',
    categoryId: 'baby-toddler',
    categoryName: 'Baby & Toddler',
    subCategory: 'Rompers & Sleepsuits',
    price: 599,
    originalPrice: 1199,
    discountPercent: 50,
    clubPrice: 499,
    rating: 4.8,
    reviewCount: 128,
    ageGroup: ['0-3M', '3-6M', '6-12M'],
    gender: 'unisex',
    inStock: true,
    sizes: ['0-3M', '3-6M', '6-12M'],
    colors: [
      { name: 'Sky Blue', hex: '#7DD3FC' },
      { name: 'Peach', hex: '#FDBA74' },
      { name: 'Mint Green', hex: '#86EFAC' }
    ],
    tag: 'Best Seller',
    badgeColor: '#10B981',
    badgeBg: '#ECFDF5',
    description: '100% GOTS certified organic combed cotton romper. Gentle on sensitive infant skin with nickel-free snap buttons for easy diaper changes.',
    highlights: ['100% GOTS Organic Cotton', 'Nickel-free snap buttons', 'Breathable zero-chemical dyes'],
    fabricOrMaterial: '100% Organic Combed Cotton',
    safetyCertifications: ['GOTS Certified', 'OEKO-TEX Standard 100', 'Hypoallergenic Tested'],
    imageIllustration: 'baby-romper',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    reviews: []
  },
  {
    customId: 'ps-102',
    name: 'Festive Embroidered Silk Kurta Pajama Set',
    brand: 'Voraeclat Royal',
    categoryId: 'festive-ethnic',
    categoryName: 'Festive & Ethnic',
    subCategory: 'Boys Kurta Pajama',
    price: 1499,
    originalPrice: 2499,
    discountPercent: 40,
    clubPrice: 1299,
    rating: 4.9,
    reviewCount: 94,
    ageGroup: ['1-2Y', '2-4Y', '4-6Y'],
    gender: 'boy',
    inStock: true,
    sizes: ['1-2Y', '2-4Y', '4-6Y'],
    colors: [
      { name: 'Royal Mustard', hex: '#EAB308' },
      { name: 'Maroon', hex: '#991B1B' }
    ],
    tag: 'Trending',
    badgeColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    description: 'Exquisite banarasi chanderi silk blend kurta with comfortable cotton lining and matching churidar pants.',
    highlights: ['Soft inner cotton lining', 'Zari embroidery detailing', 'Elasticated comfortable waist'],
    fabricOrMaterial: 'Chanderi Silk Blend with 100% Cotton Lining',
    safetyCertifications: ['Skin-Friendly Lining', 'Lead-Free Dyes'],
    imageIllustration: 'festive-kurta',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    reviews: []
  },
  {
    customId: 'ps-103',
    name: 'Princess Floral Flare Party Frock',
    brand: 'Voraeclat Princess',
    categoryId: 'girl-fashion',
    categoryName: 'Girls Fashion',
    subCategory: 'Party Dresses',
    price: 1099,
    originalPrice: 2199,
    discountPercent: 50,
    clubPrice: 899,
    rating: 4.7,
    reviewCount: 156,
    ageGroup: ['2-4Y', '4-6Y', '6-8Y'],
    gender: 'girl',
    inStock: true,
    sizes: ['2-4Y', '4-6Y', '6-8Y'],
    colors: [
      { name: 'Peach Coral', hex: '#FB7185' },
      { name: 'Lavender Mist', hex: '#C084FC' }
    ],
    tag: 'Club Choice',
    badgeColor: '#EC4899',
    badgeBg: '#FDF2F8',
    description: 'Multi-layer tulle flare party frock with hand-sewn petal embroidery and breathable cotton inner lining.',
    highlights: ['Voluminous tulle flare', 'Soft 100% cotton base lining', 'Concealed back zip'],
    fabricOrMaterial: 'Premium Satin Tulle with 100% Cotton Lining',
    safetyCertifications: ['Anti-chafing soft hem', 'OEKO-TEX Certified'],
    imageIllustration: 'floral-frock',
    imageUrl: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
    reviews: []
  }
];

const seedData = async () => {
  try {
    await connectDB();

    if (!isDbConnected) {
      console.log('--------------------------------------------------------------------------------');
      console.log('ℹ️  MongoDB Atlas or local MongoDB is not connected.');
      console.log('To populate your MongoDB Atlas cluster:');
      console.log('1. Open backend/.env');
      console.log('2. Set your connection string:');
      console.log('   MONGO_URI=mongodb+srv://sivamaha22574_db_user:<YOUR_PASSWORD>@voraeclat.yz0ig7h.mongodb.net/voraeclat?retryWrites=true&w=majority');
      console.log('3. Run: npm run seed');
      console.log('--------------------------------------------------------------------------------');
      process.exit(0);
    }

    console.log('[Seeder] Clearing old collections...');
    await Product.deleteMany();
    await Banner.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();
    await AdCampaign.deleteMany();

    console.log('[Seeder] Inserting sample data with Courier, Out For Delivery, Delivery Pending, Payment Modes, and Ad Attribution...');
    await Product.insertMany(sampleProducts);
    await Banner.insertMany(sampleBanners);
    await Coupon.insertMany(sampleCoupons);
    await Order.insertMany(sampleOrders);
    await User.insertMany(sampleUsers);
    await AdCampaign.insertMany(sampleAdCampaigns);

    console.log('✅ [Seeder] MongoDB successfully seeded with Ad Campaigns, Couriers, Doorstep Delivery Statuses, and Billing data!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
