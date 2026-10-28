export const defaultProducts = [
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
    reviews: [
      {
        author: 'Ananya S.',
        rating: 5,
        date: '2026-10-12',
        title: 'Super soft material',
        comment: 'Very soft on my 4-month-old baby skin. Color stays vibrant even after repeated washes.',
        verifiedBuyer: true,
        childAge: '4 Months'
      }
    ]
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

export const defaultBanners = [
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

export const defaultCoupons = [
  {
    code: 'WELCOME10',
    title: 'Flat 10% Off on First Order',
    discountType: 'percentage',
    discountValue: 10,
    minCartValue: 499,
    maxDiscount: 300,
    isActive: true
  },
  {
    code: 'FESTIVE20',
    title: 'Festive Season 20% Off',
    discountType: 'percentage',
    discountValue: 20,
    minCartValue: 1499,
    maxDiscount: 800,
    isActive: true
  }
];

