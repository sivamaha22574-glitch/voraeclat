import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';
import { Coupon } from '../models/Coupon.js';
import { FranchiseLead } from '../models/FranchiseLead.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { connectDB } from '../config/db.js';

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
        isDefault: true
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
        pincode: '201301',
        isDefault: true
      }
    ]
  }
];

const sampleOrders = [
  {
    orderId: 'ORD-849201',
    invoiceNumber: 'INV-2026-0041',
    customerName: 'Pooja Sharma',
    customerMobile: '+91 98201 23456',
    customerEmail: 'pooja.sharma@gmail.com',
    deliveryAddress: {
      name: 'Pooja Sharma',
      phone: '+91 98201 23456',
      address: 'Flat 402, Sunshine Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    billingAddress: {
      name: 'Pooja Sharma',
      phone: '+91 98201 23456',
      address: 'Flat 402, Sunshine Heights, Bandra West',
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
      },
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
    subTotal: 2297,
    discountAmount: 230,
    couponApplied: 'WELCOME10',
    gstAmount: 103,
    shippingFee: 0,
    totalAmount: 2170,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    isPaid: true,
    paidAt: new Date('2026-10-25T14:30:00Z'),
    status: 'Delivered',
    expectedDelivery: '27 Oct 2026',
    trackingNumber: 'TRK-983210451',
    courierPartner: 'BlueDart Express'
  },
  {
    orderId: 'ORD-731940',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Rahul Verma',
    customerMobile: '+91 98110 54321',
    customerEmail: 'rahul.verma@outlook.com',
    deliveryAddress: {
      name: 'Rahul Verma',
      phone: '+91 98110 54321',
      address: 'B-12, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301'
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
    shippingFee: 0,
    totalAmount: 1574,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    isPaid: false,
    status: 'Shipped',
    expectedDelivery: '30 Oct 2026',
    trackingNumber: 'TRK-842019382',
    courierPartner: 'Delhivery Surface'
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
    description: 'Special discount for ethnic wear and festival shopping',
    discountType: 'percentage',
    discountValue: 20,
    minCartValue: 1499,
    maxDiscount: 800,
    isActive: true
  },
  {
    code: 'CLUB500',
    title: 'Club Member Special ₹500 Off',
    description: 'Flat ₹500 off on purchases above ₹2499',
    discountType: 'fixed',
    discountValue: 500,
    minCartValue: 2499,
    isActive: true
  }
];

const sampleBanners = [
  {
    customId: 'hero-1',
    name: 'Childhood Looks Better with Voraeclat',
    location: 'homepage',
    group: 'hero',
    badge: 'NEW ARRIVALS 2026',
    title: 'Childhood Looks Better with Voraeclat',
    underText: 'Trendy. Safe. Premium. For Every Little Moment.',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Shop Now',
    buttonLink: '#',
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
    buttonText: 'Explore Collection',
    buttonLink: '#',
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
    price: 699,
    originalPrice: 1199,
    discountPercent: 42,
    clubPrice: 599,
    rating: 4.8,
    reviewCount: 142,
    ageGroup: ['0-3M', '3-6M', '6-12M'],
    gender: 'unisex',
    inStock: true,
    sizes: ['0-3M', '3-6M', '6-12M', '1-2Y'],
    colors: [
      { name: 'Sky Blue', hex: '#7DD3FC' },
      { name: 'Soft Cream', hex: '#FEF3C7' },
      { name: 'Blush Pink', hex: '#FBCFE8' }
    ],
    tag: 'Best Seller',
    badgeColor: '#047857',
    badgeBg: '#D1FAE5',
    description: 'Ultra-gentle GOTS certified organic cotton romper with safe nickel-free snap closures.',
    highlights: ['100% GOTS Organic Cotton', 'Hypoallergenic dyes', 'Nickel-free press studs'],
    fabricOrMaterial: '100% Organic Interlock Cotton',
    safetyCertifications: ['GOTS Certified', 'OEKO-TEX Standard 100'],
    imageIllustration: 'baby-clothing',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    reviews: []
  },
  {
    customId: 'ps-102',
    name: 'Festive Embroidered Silk Kurta Pajama Set',
    brand: 'Voraeclat Heritage',
    categoryId: 'festive-ethnic',
    categoryName: 'Festive & Ethnic',
    subCategory: 'Boys Ethnic Wear',
    price: 1499,
    originalPrice: 2499,
    discountPercent: 40,
    clubPrice: 1299,
    rating: 4.9,
    reviewCount: 98,
    ageGroup: ['1-2Y', '2-4Y', '4-6Y'],
    gender: 'boy',
    inStock: true,
    sizes: ['1-2Y', '2-4Y', '4-6Y', '6-8Y'],
    colors: [
      { name: 'Royal Mustard', hex: '#D97706' },
      { name: 'Emerald Green', hex: '#059669' }
    ],
    tag: 'Trending',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
    description: 'Chanderi silk blend kurta with detailed thread embroidery and soft cotton lining.',
    highlights: ['Pure breathable inner lining', 'No itchy seams', 'Elasticated soft pajama waist'],
    fabricOrMaterial: 'Chanderi Silk Blend with 100% Cotton Lining',
    safetyCertifications: ['Azo-Free Dyes'],
    imageIllustration: 'festive-apparel',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    reviews: []
  },
  {
    customId: 'ps-103',
    name: 'Princess Floral Flare Party Frock',
    brand: 'Voraeclat Princess',
    categoryId: 'girl-fashion',
    categoryName: 'Girl Fashion',
    subCategory: 'Frocks & Dresses',
    price: 1299,
    originalPrice: 2199,
    discountPercent: 41,
    clubPrice: 1099,
    rating: 4.7,
    reviewCount: 76,
    ageGroup: ['2-4Y', '4-6Y', '6-8Y'],
    gender: 'girl',
    inStock: true,
    sizes: ['2-4Y', '4-6Y', '6-8Y'],
    colors: [
      { name: 'Peach Coral', hex: '#FDBA74' },
      { name: 'Lilac Lavender', hex: '#C084FC' }
    ],
    tag: 'New Arrival',
    badgeColor: '#9333EA',
    badgeBg: '#F3E8FF',
    description: 'Voluminous tiered tulle frock with satin bow and delicate hand-embroidery.',
    highlights: ['Multi-layered soft tulle', '100% cotton underskirt', 'Concealed zipper back'],
    fabricOrMaterial: 'Tulle & Satin with Pure Cotton Lining',
    safetyCertifications: ['Non-toxic fabric dyes'],
    imageIllustration: 'girl-dress',
    imageUrl: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
    reviews: []
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old collections...');
    await Product.deleteMany();
    await Banner.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Inserting sample data...');
    await Product.insertMany(sampleProducts);
    await Banner.insertMany(sampleBanners);
    await Coupon.insertMany(sampleCoupons);
    await Order.insertMany(sampleOrders);
    await User.insertMany(sampleUsers);

    console.log('✅ [Seeder] MongoDB populated with Products, Orders, Customer Data & Billing Invoices!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
