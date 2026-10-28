import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Tag,
  Star,
  Edit2,
  ExternalLink,
  Plus,
  Sliders,
  Trash2,
  RefreshCw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  AlertCircle,
  DollarSign,
  FileText,
  Zap,
  X,
  ArrowRight,
  ListFilter,
  TrendingUp,
  FolderTree,
  Upload,
} from 'lucide-react';
import { Product, CategoryId, AgeGroup, Gender } from '../../types';
import { PRODUCTS, getStoredProducts, saveStoredProducts } from '../../data/products';
import { BOY_FASHION_CATEGORIES } from '../BoyFashionMegaMenu';
import { GIRL_FASHION_CATEGORIES } from '../GirlFashionMegaMenu';
import { CURATED_COLLECTIONS } from '../CollectionsMegaMenu';

/**
 * Utility: Compresses user-uploaded image to a lightweight JPEG Data URL
 * to ensure crisp high-res rendering without exceeding localStorage limits.
 */
export const compressAndLoadImage = (file: File, callback: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 600;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        callback(e.target?.result as string);
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

interface ProductsManagerTabProps {
  products?: Product[];
  onUpdateProducts?: (products: Product[]) => void;
  onNotify: (msg: string) => void;
}

export interface SubcategoryGroup {
  groupTitle: string;
  badge?: string | null;
  items: string[];
}

export const getSubcategoryGroupsForCategory = (
  catId: CategoryId | string,
  catalogProducts?: Product[]
): SubcategoryGroup[] => {
  let groups: SubcategoryGroup[] = [];

  if (catId === 'boy-fashion') {
    groups = BOY_FASHION_CATEGORIES.map((c) => ({
      groupTitle: c.title,
      badge: c.badge,
      items: c.items,
    }));
  } else if (catId === 'girl-fashion') {
    groups = GIRL_FASHION_CATEGORIES.map((c) => ({
      groupTitle: c.title,
      badge: c.badge,
      items: c.items,
    }));
  } else if (catId === 'festive-ethnic') {
    groups = CURATED_COLLECTIONS.map((c) => ({
      groupTitle: c.name,
      badge: c.badge,
      items: [c.name, ...c.subItems],
    }));
  } else {
    const matched = ALL_CATEGORY_OPTIONS.find((c) => c.id === catId);
    if (matched) {
      groups = [
        {
          groupTitle: `${matched.name} Collection`,
          badge: null,
          items: matched.defaultSubs,
        },
      ];
    }
  }

  // If catalogProducts is provided, discover any custom subcategories in this category
  if (catalogProducts && catalogProducts.length > 0) {
    const existingSubs = new Set(groups.flatMap((g) => g.items.map((i) => i.toLowerCase().trim())));
    const customSubs: string[] = [];
    catalogProducts
      .filter((p) => catId === 'all' || p.categoryId === catId)
      .forEach((p) => {
        const sub = (p.subCategory || '').trim();
        if (sub && !existingSubs.has(sub.toLowerCase())) {
          existingSubs.add(sub.toLowerCase());
          customSubs.push(sub);
        }
      });
    if (customSubs.length > 0) {
      groups.push({
        groupTitle: 'Custom & Added Categories',
        badge: 'New',
        items: customSubs,
      });
    }
  }

  return groups;
};

export const ALL_CATEGORY_OPTIONS: {
  id: CategoryId;
  name: string;
  icon: string;
  defaultSubs: string[];
}[] = [
  {
    id: 'festive-ethnic',
    name: 'Shop by Collection (Festive & Curated Edits)',
    icon: '🪔',
    defaultSubs: [
      'Diwali 2026 Collection',
      'Navratri Utsav',
      'Halloween Collection',
      'Rainwear Collection',
      'Multi-packs',
      'Bestsellers',
      'Baby Essentials',
      'Zari Silk Kurtas',
      'Twirling Lehengas',
      'Dhoti & Angrakha Sets',
      'Embroidered Sherwanis',
      'Silk Pattu Pavadai',
      'Kurta Pajama Sets',
    ],
  },
  {
    id: 'boy-fashion',
    name: 'Boy Fashion',
    icon: '👦',
    defaultSubs: [
      'Graphic T-Shirts',
      'Solid Crew Necks',
      'Polo Shirts',
      'Sleeveless Tanks',
      'Casual Button-Downs',
      'Formal Shirts',
      'Flannel & Plaid',
      'Denim Shirts',
      'Jeans',
      'Chinos & Khakis',
      'Casual Shorts',
      'Denim Shorts',
      'Kurta Sets',
      'Nehru Jackets',
      'Hoodies & Sweatshirts',
      'Denim Jackets',
      'Pajama Sets',
      'Performance Tees',
    ],
  },
  {
    id: 'girl-fashion',
    name: 'Girl Fashion',
    icon: '👧',
    defaultSubs: [
      'Casual / A-Line Day Dresses',
      'Party & Birthday Frocks',
      'Maxi & Sundresses',
      'Shirt & Tiered Dresses',
      'Tutu & Tulle Dresses',
      'Graphic T-Shirts',
      'Peplum & Ruffle Tops',
      'Skirts',
      'Shorts',
      'Jeans',
      'Leggings & Jeggings',
      'Co-ord Sets',
      'Rompers',
      'Jumpsuits',
      'Lehengas & Cholis',
      'Anarkali & Kurta Sets',
      'Pattu Pavadai',
      'Cardigans & Sweaters',
      'Denim Jackets',
      'Nightdresses',
      'Cotton Pajama Sets',
    ],
  },
  {
    id: 'baby-toddler',
    name: 'Baby & Toddler (0-24M)',
    icon: '👶',
    defaultSubs: [
      'Organic Rompers',
      'Sleepsuits & Onesies',
      'Baby Gift Hampers',
      'Mittens & Booties',
      'Swaddles & Blankets',
      'Baby Essentials',
    ],
  },
  {
    id: 'casual-wear',
    name: 'Casual & Daily Wear',
    icon: '👕',
    defaultSubs: [
      'Casual Tees & Shorts',
      'T-Shirts & Tops',
      'Everyday Cotton Sets',
      'Trackpants & Joggers',
      'Multi-packs',
      'Rainwear Collection',
      'Halloween Collection',
      'Loungewear & Nightwear',
      'Pajamas',
    ],
  },
  {
    id: 'footwear-accessories',
    name: 'Footwear & Accessories',
    icon: '👟',
    defaultSubs: [
      'Sneakers & Casual Shoes',
      'Ethnic Mojaris & Juttis',
      'Booties & Pre-walkers',
      'Hair Accessories & Bows',
      'Kids Sunglasses',
    ],
  },
  {
    id: 'toys-learning',
    name: 'Toys & Games',
    icon: '🧸',
    defaultSubs: [
      'Wooden Montessori Toys',
      'Building Blocks & Puzzles',
      'STEAM & Robotics',
      'Plush Soft Toys',
      'Board Games & Activity',
    ],
  },
  {
    id: 'diapering',
    name: 'Diapers & Wipes',
    icon: '🧷',
    defaultSubs: [
      'Taped Diapers',
      'Pant Diapers',
      'Bamboo Water Wipes',
      'Diaper Rash Cream',
      'Changing Mats & Pails',
    ],
  },
  {
    id: 'feeding',
    name: 'Feeding & Nursing',
    icon: '🍼',
    defaultSubs: [
      'Anti-Colic Glass Bottles',
      'Silicone Teethers & Soothers',
      'Sterilizers & Warmers',
      'High Chairs & Booster Seats',
      'Bibs & Spoons',
    ],
  },
  {
    id: 'bath-skin',
    name: 'Bath & Skin Care',
    icon: '🛁',
    defaultSubs: [
      'Tear-Free Baby Wash & Shampoo',
      'Cold Pressed Massage Oil',
      'Organic Body Lotion',
      'Soft Hooded Towels',
      'Baby Grooming Kits',
    ],
  },
  {
    id: 'nursery-gear',
    name: 'Cribs & Strollers',
    icon: '🛏️',
    defaultSubs: [
      'Convertible Wooden Cribs',
      'Cabin Travel Strollers',
      'Baby Rockers & Bouncers',
      'Car Safety Seats',
      'Ergonomic Baby Carriers',
    ],
  },
  {
    id: 'books-library',
    name: 'Books & Library',
    icon: '📚',
    defaultSubs: [
      'Touch & Feel Sensory Books',
      'Bedtime Story Books',
      'Montessori Flashcards',
      'Bilingual Picture Books',
      'Early Learning Kits',
    ],
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    icon: '🛡️',
    defaultSubs: [
      'Pediatric Digital Thermometers',
      'Nasal Aspirators',
      'High-Definition Baby Monitors',
      'Corner Edge Cushions',
      'Socket Safety Covers',
    ],
  },
  {
    id: 'moms-maternity',
    name: "Mom's & Maternity",
    icon: '🤰',
    defaultSubs: [
      'Maternity Maxi Dresses',
      'Feeding Kurtas & Tops',
      'Nursing Bras & Intimates',
      'Postpartum Belly Wraps',
      'Stretch Mark Creams',
    ],
  },
];

const SAMPLE_IMAGE_PRESETS = [
  {
    name: 'Festive Pure Silk Pattu Pavadai',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Royal Sherwani & Brocade Jacket',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Pastel Twirl Party Frock',
    url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Organic Bamboo Baby Romper Pack',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Kids Playground Casual Tees & Denim',
    url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Montessori Wooden Learning Toy',
    url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=85',
  },
];

export const ProductsManagerTab: React.FC<ProductsManagerTabProps> = ({
  products,
  onUpdateProducts,
  onNotify,
}) => {
  const [productList, setProductList] = useState<Product[]>(() => {
    if (products && products.length > 0) return products;
    return getStoredProducts();
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [quickPriceEditProduct, setQuickPriceEditProduct] = useState<Product | null>(null);
  const [isSubcategoryBatchModalOpen, setIsSubcategoryBatchModalOpen] = useState(false);
  const [batchDraftProducts, setBatchDraftProducts] = useState<Product[]>([]);

  // Simple New Product Draft State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: 'Voraeclat Signature',
    categoryId: 'casual-wear',
    categoryName: 'Casual & Daily Wear',
    subCategory: 'Casual Tees & Shorts',
    price: 799,
    originalPrice: 1299,
    discountPercent: 38,
    clubPrice: 719,
    description: 'Comfortable casual tees and shorts made with premium breathable baby-safe cotton fabric.',
    imageUrl: '',
    inStock: true,
  });

  // Sync internal productList whenever incoming products prop changes
  useEffect(() => {
    if (products && products.length > 0) {
      setProductList(products);
    }
  }, [products]);

  // Subcategory Matching Helper (smart, alias-aware, and case-resilient)
  const isSubCategoryMatch = (product: Product, targetSub: string) => {
    if (!targetSub || targetSub === 'all') return true;
    const pSub = (product.subCategory || '').toLowerCase().trim();
    const tSub = targetSub.toLowerCase().trim();
    if (pSub === tSub) return true;
    if (pSub.includes(tSub) || tSub.includes(pSub)) return true;

    // Normalize clothing aliases (tees, t-shirts, shirts, frocks, dresses)
    const norm = (s: string) =>
      s
        .replace(/t-shirts?/g, 'tee')
        .replace(/tees?/g, 'tee')
        .replace(/frocks?/g, 'dress')
        .replace(/[^a-z0-9 ]/g, ' ')
        .trim();
    const normP = norm(pSub);
    const normT = norm(tSub);
    if (normP === normT || (normP.length > 0 && normT.length > 0 && (normP.includes(normT) || normT.includes(normP)))) {
      return true;
    }

    const tWords = normT.split(/\s+/).filter((w) => w.length > 2 && w !== 'and');
    if (tWords.length > 0 && tWords.some((w) => normP.includes(w))) {
      return true;
    }

    const pName = (product.name || '').toLowerCase();
    if (pName.includes(tSub)) return true;
    return false;
  };

  const getSubcategoryCount = (subName: string, categoryId: string) => {
    return productList.filter((p) => {
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false;
      return isSubCategoryMatch(p, subName);
    }).length;
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const handleOpenAddProduct = (catId?: string, subName?: string) => {
    const targetCatId =
      catId && catId !== 'all'
        ? (catId as CategoryId)
        : selectedCategory !== 'all'
        ? (selectedCategory as CategoryId)
        : 'casual-wear';

    const matchedCat = ALL_CATEGORY_OPTIONS.find((c) => c.id === targetCatId);
    const resolvedSub =
      subName && subName !== 'all' && subName.trim() !== ''
        ? subName
        : selectedSubCategory !== 'all' && selectedSubCategory.trim() !== ''
        ? selectedSubCategory
        : matchedCat?.defaultSubs[0] || 'Casual Tees & Shorts';

    setNewProduct({
      name: '',
      brand: 'Voraeclat Signature',
      categoryId: targetCatId,
      categoryName: matchedCat?.name || 'Casual & Daily Wear',
      subCategory: resolvedSub,
      price: 799,
      originalPrice: 1299,
      discountPercent: 38,
      clubPrice: 719,
      description: `Comfortable ${resolvedSub} made with premium breathable baby-safe cotton fabric.`,
      imageUrl: '',
      inStock: true,
      sizes: ['Standard', '1-2Y', '2-4Y'],
      colors: [{ name: 'Classic Gold & Navy', hex: '#D97706' }],
      tag: 'New Arrival',
    });
    setIsAddProductModalOpen(true);
  };

  const handleOpenAddForSubcategory = handleOpenAddProduct;

  const handleOpenBatchEditor = () => {
    if (selectedSubCategory === 'all') {
      onNotify('Please select a specific subcategory first to open the batch editor.');
      return;
    }
    const matching = productList.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      return isSubCategoryMatch(p, selectedSubCategory);
    });
    if (matching.length === 0) {
      onNotify(`No products found in "${selectedSubCategory}". Add a new product first!`);
      return;
    }
    setBatchDraftProducts(matching.map((p) => ({ ...p })));
    setIsSubcategoryBatchModalOpen(true);
  };

  const handleSaveBatchChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMap = new Map(batchDraftProducts.map((p) => [p.id, p]));
    const updatedCatalogList = productList.map((p) => {
      const match = updatedMap.get(p.id);
      if (match) {
        const price = Number(match.price) || 0;
        const origPrice = Number(match.originalPrice) || price;
        const discountPercent =
          origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
        return {
          ...match,
          price,
          originalPrice: origPrice,
          clubPrice: Number(match.clubPrice) || Math.round(price * 0.9),
          discountPercent,
        };
      }
      return p;
    });
    updateCatalog(updatedCatalogList);
    onNotify(`Updated ${batchDraftProducts.length} products in "${selectedSubCategory}"!`);
    setIsSubcategoryBatchModalOpen(false);
  };

  const handleSaveQuickPriceAndDesc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceEditProduct) return;
    const price = Number(quickPriceEditProduct.price) || 0;
    const origPrice = Number(quickPriceEditProduct.originalPrice) || price;
    const discountPercent =
      origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
    const matchedCategory = ALL_CATEGORY_OPTIONS.find((c) => c.id === quickPriceEditProduct.categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : quickPriceEditProduct.categoryName;

    const updatedProduct: Product = {
      ...quickPriceEditProduct,
      price,
      originalPrice: origPrice,
      clubPrice: Number(quickPriceEditProduct.clubPrice) || Math.round(price * 0.9),
      discountPercent,
      categoryName,
    };

    const updated = productList.map((p) => (p.id === quickPriceEditProduct.id ? updatedProduct : p));
    updateCatalog(updated);
    onNotify(`✨ "${updatedProduct.name.slice(0, 22)}..." price & description updated!`);
    setQuickPriceEditProduct(null);
  };

  const appendDescriptionSnippet = (
    snippet: string,
    target: 'draft' | 'edit' | 'quick'
  ) => {
    if (target === 'quick' && quickPriceEditProduct) {
      const curr = quickPriceEditProduct.description || '';
      setQuickPriceEditProduct({
        ...quickPriceEditProduct,
        description: curr ? `${curr.trim()}\n${snippet}` : snippet,
      });
    } else if (target === 'draft') {
      const curr = newProduct.description || '';
      setNewProduct({
        ...newProduct,
        description: curr ? `${curr.trim()}\n${snippet}` : snippet,
      });
    } else if (target === 'edit' && editingProduct) {
      const curr = editingProduct.description || '';
      setEditingProduct({
        ...editingProduct,
        description: curr ? `${curr.trim()}\n${snippet}` : snippet,
      });
    }
  };


  // Handle local photo file upload (JPG, PNG, WEBP) with automatic compression
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'draft' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('Please select a valid photo (JPG, PNG, WEBP)');
      return;
    }
    compressAndLoadImage(file, (dataUrl) => {
      if (target === 'draft') {
        setNewProduct((prev) => ({ ...prev, imageUrl: dataUrl }));
        onNotify('Product photo uploaded successfully! 📷');
      } else if (target === 'edit') {
        setEditingProduct((prev) => (prev ? { ...prev, imageUrl: dataUrl } : null));
        onNotify('Product photo updated successfully! 📷');
      }
    });
  };

  // Sync state with parent and localStorage
  const updateCatalog = (updated: Product[]) => {
    setProductList(updated);
    saveStoredProducts(updated);
    if (onUpdateProducts) {
      onUpdateProducts(updated);
    }
  };

  const handleToggleStock = (productId: string) => {
    const updated = productList.map((p) => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    updateCatalog(updated);
    const toggled = updated.find((p) => p.id === productId);
    onNotify(
      `"${toggled?.name.slice(0, 24)}..." is now ${toggled?.inStock ? 'IN STOCK ✅' : 'OUT OF STOCK ❌'}`
    );
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Auto-calculate discount percentage if price or originalPrice changed
    const price = Number(editingProduct.price) || 0;
    const origPrice = Number(editingProduct.originalPrice) || price;
    const discountPercent =
      origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;

    // Lookup Category Name if categoryId was updated
    const matchedCategory = ALL_CATEGORY_OPTIONS.find((c) => c.id === editingProduct.categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : editingProduct.categoryName;

    const updatedProduct: Product = {
      ...editingProduct,
      price,
      originalPrice: origPrice,
      clubPrice: Number(editingProduct.clubPrice) || Math.round(price * 0.9),
      discountPercent,
      categoryName,
    };

    const updated = productList.map((p) => (p.id === editingProduct.id ? updatedProduct : p));
    updateCatalog(updated);
    onNotify(`Product "${updatedProduct.name.slice(0, 20)}..." updated successfully!`);
    setEditingProduct(null);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = (newProduct.name || '').trim();
    if (!trimmedName) {
      onNotify('⚠️ Please enter a product title before saving.');
      return;
    }

    const targetCatId = (newProduct.categoryId as CategoryId) || 'casual-wear';
    const matchedCat = ALL_CATEGORY_OPTIONS.find((c) => c.id === targetCatId);
    const categoryName = matchedCat ? matchedCat.name : 'Casual & Daily Wear';
    const resolvedSub =
      (newProduct.subCategory || '').trim() || matchedCat?.defaultSubs[0] || 'Casual Tees & Shorts';

    const price = Number(newProduct.price) > 0 ? Number(newProduct.price) : 799;
    const origPrice =
      Number(newProduct.originalPrice) && Number(newProduct.originalPrice) >= price
        ? Number(newProduct.originalPrice)
        : Math.round(price * 1.4);
    const discountPercent =
      origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
    const clubPrice =
      Number(newProduct.clubPrice) && Number(newProduct.clubPrice) < price
        ? Number(newProduct.clubPrice)
        : Math.round(price * 0.9);

    const createdProduct: Product = {
      id: `ps-new-${Date.now().toString().slice(-6)}`,
      name: trimmedName,
      brand: (newProduct.brand || '').trim() || 'Voraeclat Signature',
      categoryId: targetCatId,
      categoryName: categoryName,
      subCategory: resolvedSub,
      price: price,
      originalPrice: origPrice,
      discountPercent: discountPercent,
      clubPrice: clubPrice,
      rating: 4.9,
      reviewCount: 1,
      ageGroup: newProduct.ageGroup && newProduct.ageGroup.length > 0 ? newProduct.ageGroup : ['all'],
      gender: (newProduct.gender as Gender) || 'unisex',
      inStock: newProduct.inStock ?? true,
      sizes: newProduct.sizes && newProduct.sizes.length > 0 ? newProduct.sizes : ['Standard', '1-2Y', '2-4Y'],
      colors:
        newProduct.colors && newProduct.colors.length > 0
          ? newProduct.colors
          : [{ name: 'Classic Gold & Navy', hex: '#D97706' }],
      tag: (newProduct.tag as any) || 'New Arrival',
      badgeColor: '#D97706',
      badgeBg: '#FEF3C7',
      description:
        (newProduct.description || '').trim() ||
        `Comfortable ${resolvedSub} made with premium breathable baby-safe cotton fabric.`,
      highlights:
        newProduct.highlights && newProduct.highlights.length > 0
          ? newProduct.highlights
          : ['Ultra-soft breathable material', 'Machine washable & gentle on sensitive skin'],
      fabricOrMaterial: newProduct.fabricOrMaterial || '100% GOTS Pure Organic Cotton',
      safetyCertifications: ['Azo-Free Certified', 'Skin-Safe Dyes', 'Pediatrician Approved'],
      imageIllustration: 'festive-dress',
      imageUrl: (newProduct.imageUrl || '').trim() || SAMPLE_IMAGE_PRESETS[0].url,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Voraeclat Certified Buyer',
          rating: 5,
          date: 'Just Now',
          title: 'Top quality product!',
          comment: 'Fabric feels luxurious and soft. Exactly as shown!',
          verifiedBuyer: true,
        },
      ],
    };

    const updated = [createdProduct, ...productList];
    updateCatalog(updated);

    // CRITICAL: Ensure the newly added product is visible immediately in the view!
    setSelectedCategory(targetCatId);
    if (selectedSubCategory !== 'all' && !isSubCategoryMatch(createdProduct, selectedSubCategory)) {
      setSelectedSubCategory(resolvedSub);
    }
    setSearchQuery('');
    setStockFilter('all');

    onNotify(`✨ New product "${createdProduct.name.slice(0, 24)}..." successfully added to ${categoryName}!`);
    setIsAddProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      const updated = productList.filter((p) => p.id !== productId);
      updateCatalog(updated);
      onNotify(`Product "${productName.slice(0, 20)}..." deleted.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset entire catalog to initial factory products? Any custom additions will be cleared.')) {
      updateCatalog(PRODUCTS);
      onNotify('Catalog reset to initial 60+ products');
    }
  };

  // Filtered Products
  const filteredProducts = productList.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (selectedSubCategory !== 'all' && !isSubCategoryMatch(p, selectedSubCategory)) return false;
    if (stockFilter === 'inStock' && !p.inStock) return false;
    if (stockFilter === 'outOfStock' && p.inStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Master Product & Inventory Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Products Management</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Full control across <strong>all 14 store categories</strong>. Add new products, update prices, discounts,
            descriptions, and toggle live stock in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600/60 cursor-pointer"
            title="Reset catalog to default factory products"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={() => handleOpenAddProduct(selectedCategory, selectedSubCategory)}
            className="px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Category Pills Strip & All 14 Categories Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Category Selector with all 14 categories */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Department:</span>
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="all">🌐 All Departments ({productList.length} SKUs)</option>
              {ALL_CATEGORY_OPTIONS.map((cat) => {
                const count = productList.filter((p) => p.categoryId === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({count} items)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Stock Filter & Search */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  stockFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStockFilter('inStock')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  stockFilter === 'inStock' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockFilter('outOfStock')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  stockFilter === 'outOfStock' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Out of Stock
              </button>
            </div>

            <div className="relative min-w-[200px] flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, price, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Horizontal Department Chips for Instant Clicking */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({productList.length})
          </button>
          {ALL_CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = productList.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SUBCATEGORY-WISE NAVIGATION & MANAGEMENT SUITE
          ========================================================================= */}
      {selectedCategory === 'all' ? (
        /* Fast-track Jump cards for the 3 key categories requested by user */
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-amber-500" />
              <span>Subcategory-Wise Product Managers (Boy Fashion, Girl Fashion & Collections):</span>
            </span>
            <span className="text-[11px] text-slate-400">Click to filter & manage subcategories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSelectCategory('girl-fashion')}
              className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-pink-950 flex items-center gap-1.5">
                  <span>👧 Girl Fashion</span>
                </span>
                <span className="text-[10px] font-bold bg-pink-200/80 text-pink-900 px-2 py-0.5 rounded-full">
                  38 Subcategories
                </span>
              </div>
              <p className="text-[11px] text-pink-700/90 mt-1 line-clamp-1">
                Frocks, Tops, Bottoms, Lehengas, Sets, Active
              </p>
              <div className="mt-2 text-[10px] font-bold text-pink-600 group-hover:underline flex items-center gap-1">
                <span>Manage Subcategories & Prices</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => handleSelectCategory('boy-fashion')}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                  <span>👦 Boy Fashion</span>
                </span>
                <span className="text-[10px] font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full">
                  33 Subcategories
                </span>
              </div>
              <p className="text-[11px] text-blue-700/90 mt-1 line-clamp-1">
                Graphic Tees, Shirts, Jeans, Kurtas, Outerwear
              </p>
              <div className="mt-2 text-[10px] font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                <span>Manage Subcategories & Prices</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => handleSelectCategory('festive-ethnic')}
              className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                  <span>🪔 Shop by Collection</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
                  7 Curated Edits
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1 line-clamp-1">
                Diwali, Navratri, Halloween, Rainwear, Multipacks
              </p>
              <div className="mt-2 text-[10px] font-bold text-amber-700 group-hover:underline flex items-center gap-1">
                <span>Manage Subcategories & Prices</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Subcategory-Wise Selector & Management Bar when a category is selected */
        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-amber-500" />
                <span>
                  {ALL_CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.icon}{' '}
                  {ALL_CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.name} Subcategories:
                </span>
              </span>

              {/* Subcategory Select Dropdown grouped by section */}
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
              >
                <option value="all">
                  📂 All Subcategories ({productList.filter((p) => p.categoryId === selectedCategory).length} SKUs)
                </option>
                {getSubcategoryGroupsForCategory(selectedCategory, productList).map((grp) => (
                  <optgroup
                    key={grp.groupTitle}
                    label={`${grp.groupTitle}${grp.badge ? ` (${grp.badge})` : ''}`}
                  >
                    {grp.items.map((sub) => {
                      const count = getSubcategoryCount(sub, selectedCategory);
                      return (
                        <option key={sub} value={sub}>
                          {sub} ({count})
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleOpenAddProduct(
                    selectedCategory,
                    selectedSubCategory !== 'all' ? selectedSubCategory : ''
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  + Add Product {selectedSubCategory !== 'all' ? `to "${selectedSubCategory}"` : 'to Category'}
                </span>
              </button>

              {selectedSubCategory !== 'all' && (
                <button
                  onClick={handleOpenBatchEditor}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="Edit prices and descriptions for all items in this subcategory"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Batch Price & Desc Editor</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Subcategory Pills Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedSubCategory === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({productList.filter((p) => p.categoryId === selectedCategory).length})
            </button>

            {getSubcategoryGroupsForCategory(selectedCategory, productList).flatMap((grp) =>
              grp.items.map((sub) => {
                const isSelected = selectedSubCategory === sub;
                const count = getSubcategoryCount(sub, selectedCategory);
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : count > 0
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <span>{sub}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-slate-950 text-amber-300'
                          : count > 0
                          ? 'bg-amber-200/80 text-amber-950'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Subcategory Alert / Quick Actions Bar */}
          {selectedSubCategory !== 'all' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300/80 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-slate-800">
                  Subcategory Filter: <strong className="text-amber-950 font-black">{selectedSubCategory}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-black text-[10px]">
                  {filteredProducts.length} Items Found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddForSubcategory(selectedCategory, selectedSubCategory)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add to this Subcategory</span>
                </button>
                <button
                  onClick={handleOpenBatchEditor}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>⚡ Quick Price & Desc Edit</span>
                </button>
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Clear Subcategory filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Catalog Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product Info & Brand</th>
                <th className="py-3 px-4">Category & Subcategory</th>
                <th className="py-3 px-4">Price & Discounts</th>
                <th className="py-3 px-4">Description Snippet</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const matchedCategory = ALL_CATEGORY_OPTIONS.find((c) => c.id === p.categoryId);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setEditingProduct({ ...p })}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[240px]">
                          <div className="font-extrabold text-slate-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Brand: <strong className="text-slate-600">{p.brand}</strong> &bull;{' '}
                            <span className="font-mono text-[10px]">{p.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-800">
                        <span>{matchedCategory?.icon || '🏷️'}</span>
                        <span>{p.categoryName || matchedCategory?.name}</span>
                      </div>
                      <div className="mt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(p.categoryId);
                            setSelectedSubCategory(p.subCategory);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors cursor-pointer"
                          title={`Click to filter by ${p.subCategory}`}
                        >
                          <span>📁</span>
                          <span>{p.subCategory}</span>
                        </button>
                      </div>
                      {p.tag && (
                        <span className="inline-block mt-1 px-2 py-0.2 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">
                          {p.tag}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 text-sm">₹{p.price}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-[11px] text-slate-400 line-through">₹{p.originalPrice}</span>
                        )}
                        {p.discountPercent > 0 && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            {p.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold">Club: ₹{p.clubPrice}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed" title={p.description}>
                        {p.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black cursor-pointer transition-all ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                            : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                        title="Click to toggle stock status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setQuickPriceEditProduct({ ...p })}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Directly Change Price & Description"
                        >
                          <DollarSign className="w-3 h-3 text-amber-600" />
                          <span>Price & Desc</span>
                        </button>
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit Full Specifications"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div>
                      No products found matching &ldquo;{searchQuery || (selectedSubCategory !== 'all' ? selectedSubCategory : selectedCategory)}&rdquo;.
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                      <button
                        onClick={() => handleOpenAddProduct(selectedCategory, selectedSubCategory)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Product {selectedSubCategory !== 'all' ? `to "${selectedSubCategory}"` : 'to this Category'}</span>
                      </button>
                      {selectedSubCategory !== 'all' && (
                        <button
                          onClick={() => setSelectedSubCategory('all')}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          View All in {ALL_CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.name || 'Category'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: SIMPLE ADD NEW PRODUCT MODAL (Supports ALL 14 CATEGORIES)
          ========================================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[94vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Add New Product</h3>
                <p className="text-xs text-slate-500">
                  Select category, enter title, upload photo, set price, and write description.
                </p>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3.5 text-xs">
              {/* 1. Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={newProduct.categoryId || 'casual-wear'}
                    onChange={(e) => {
                      const newCatId = e.target.value as CategoryId;
                      const matched = ALL_CATEGORY_OPTIONS.find((c) => c.id === newCatId);
                      const firstSub = matched?.defaultSubs[0] || 'General';
                      setNewProduct({
                        ...newProduct,
                        categoryId: newCatId,
                        categoryName: matched?.name || 'Kids Collection',
                        subCategory: firstSub,
                        description: `Comfortable ${firstSub} made with premium breathable baby-safe cotton fabric.`,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    {ALL_CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subcategory <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      list="subcategories-add-list"
                      type="text"
                      required
                      value={newProduct.subCategory || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                      placeholder="Select or type subcategory..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <datalist id="subcategories-add-list">
                      {getSubcategoryGroupsForCategory(newProduct.categoryId || 'casual-wear', productList)
                        .flatMap((g) => g.items)
                        .map((sub) => (
                          <option key={sub} value={sub} />
                        ))}
                    </datalist>
                  </div>
                  {/* Quick subcategory suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5 max-h-16 overflow-y-auto no-scrollbar">
                    {(ALL_CATEGORY_OPTIONS.find((c) => c.id === newProduct.categoryId)?.defaultSubs || []).slice(0, 5).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          setNewProduct({
                            ...newProduct,
                            subCategory: sub,
                            description: `Comfortable ${sub} made with premium breathable baby-safe cotton fabric.`,
                          })
                        }
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                          newProduct.subCategory === sub
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Product Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Boys 100% Pure Cotton Daily Graphic T-Shirt"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newProduct.brand || 'Voraeclat Signature'}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="Voraeclat Signature"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 3. Photo Upload & Sample Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Product Photo <span className="text-[10px] text-slate-400 font-normal">(Optional — demo photo used if empty)</span>
                  </label>
                  {newProduct.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>

                {newProduct.imageUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-200 rounded-2xl">
                    <img
                      src={newProduct.imageUrl}
                      alt="Product preview"
                      className="w-14 h-14 object-cover rounded-xl border border-amber-200 bg-white shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Photo Selected</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        Ready to display on customer catalog & cards
                      </p>
                      <label className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer inline-flex items-center gap-1 pt-0.5">
                        <Upload className="w-3 h-3" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, 'draft')}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/30 hover:bg-amber-50/60 rounded-2xl cursor-pointer transition-colors text-center group">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-1 group-hover:scale-105 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Click to Upload Photo from Device
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, WEBP (Auto-optimized)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, 'draft')}
                      />
                    </label>

                    {/* Quick Preset Image Thumbnails */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      <span className="text-[10px] text-slate-500 font-bold shrink-0">Preset Photos:</span>
                      {SAMPLE_IMAGE_PRESETS.slice(0, 4).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, imageUrl: preset.url })}
                          className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-[10px] font-semibold text-slate-700 cursor-pointer transition-colors"
                        >
                          <img src={preset.url} alt={preset.name} className="w-3.5 h-3.5 rounded object-cover" />
                          <span className="truncate max-w-[70px]">{preset.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>

                    {/* Alternative Photo URL */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">Or Photo URL:</span>
                      <input
                        type="text"
                        value={newProduct.imageUrl || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Price & MRP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProduct.price || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const orig = Math.round(val * 1.4);
                      setNewProduct({
                        ...newProduct,
                        price: val,
                        originalPrice: newProduct.originalPrice && newProduct.originalPrice > val ? newProduct.originalPrice : orig,
                        clubPrice: Math.round(val * 0.9),
                      });
                    }}
                    placeholder="e.g. 799"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Original MRP (₹)</label>
                    {newProduct.originalPrice && newProduct.price && newProduct.originalPrice > newProduct.price && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                        {Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    placeholder="e.g. 1299"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* 5. Product Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Write product description..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400 font-bold self-center">Templates:</span>
                  {[
                    '100% GOTS Pure Organic Cotton, breathable & gentle on sensitive baby skin.',
                    'Playground durable active-wear with anti-fade dyes and relaxed comfort fit.',
                    'Royal festive edit with zari motifs, comfortable cotton lining, and premium finish.',
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, description: tmpl })}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 transition-colors cursor-pointer"
                    >
                      {idx === 0 ? '🌿 Organic Cotton' : idx === 1 ? '🏃 Active Play' : '✨ Royal Festive'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Stock Status */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-800">Inventory Stock Status</div>
                  <div className="text-[10px] text-slate-500">Enable to make instantly purchasable on storefront</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock ?? true}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save & Add Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SIMPLE EDIT PRODUCT MODAL (Supports ALL 14 CATEGORIES)
          ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[94vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Product</h3>
                <p className="text-xs text-slate-500">
                  SKU ID: <span className="font-mono">{editingProduct.id}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3.5 text-xs">
              {/* 1. Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value as CategoryId;
                      const matched = ALL_CATEGORY_OPTIONS.find((c) => c.id === newCatId);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: newCatId,
                        categoryName: matched?.name || editingProduct.categoryName,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    {ALL_CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subcategory <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      list="subcategories-edit-list"
                      type="text"
                      required
                      value={editingProduct.subCategory || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, subCategory: e.target.value })
                      }
                      placeholder="Choose or type subcategory..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <datalist id="subcategories-edit-list">
                      {getSubcategoryGroupsForCategory(editingProduct.categoryId)
                        .flatMap((g) => g.items)
                        .map((sub) => (
                          <option key={sub} value={sub} />
                        ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* 2. Product Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* 3. Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Photo <span className="text-rose-500">*</span>
                </label>

                {editingProduct.imageUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-200 rounded-2xl">
                    <img
                      src={editingProduct.imageUrl}
                      alt="Product preview"
                      className="w-16 h-16 object-cover rounded-xl border border-amber-200 bg-white shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Current Photo</span>
                      </div>
                      <div className="flex items-center gap-3 pt-0.5">
                        <label className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Upload New Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, 'edit')}
                          />
                        </label>
                        <span className="text-slate-300">&bull;</span>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, imageUrl: '' })}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl cursor-pointer transition-colors text-center group">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-1.5 group-hover:scale-105 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Click to Upload Photo from Device
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, WEBP (Auto-optimized)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileUpload(e, 'edit')}
                      />
                    </label>

                    {/* Alternative Photo URL */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">Or Photo URL:</span>
                      <input
                        type="url"
                        value={editingProduct.imageUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Price & MRP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                        clubPrice: Math.round(Number(e.target.value) * 0.9),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Original MRP (₹)</label>
                    {editingProduct.originalPrice > editingProduct.price && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                        {Math.round(
                          ((editingProduct.originalPrice - editingProduct.price) /
                            editingProduct.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* 5. Product Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: QUICK PRICE & DESCRIPTION CHANGE MODAL
          ========================================================================= */}
      {quickPriceEditProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Change Product Price & Description</h3>
                  <p className="text-[11px] text-slate-500">
                    SKU: {quickPriceEditProduct.id} &bull; {quickPriceEditProduct.categoryName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickPriceEditProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuickPriceAndDesc} className="space-y-4 text-xs">
              {/* Product Preview Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                  {quickPriceEditProduct.imageUrl ? (
                    <img
                      src={quickPriceEditProduct.imageUrl}
                      alt={quickPriceEditProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">
                    {quickPriceEditProduct.name}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Brand: <strong>{quickPriceEditProduct.brand}</strong></span>
                    <span>&bull;</span>
                    <span className="font-bold text-amber-800">
                      Current Price: ₹{quickPriceEditProduct.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subcategory Change Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Subcategory / Collection</span>
                  <span className="text-[10px] text-amber-800 font-semibold">
                    Current: {quickPriceEditProduct.subCategory}
                  </span>
                </label>
                <select
                  value={quickPriceEditProduct.subCategory}
                  onChange={(e) =>
                    setQuickPriceEditProduct({
                      ...quickPriceEditProduct,
                      subCategory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:border-amber-400"
                >
                  {getSubcategoryGroupsForCategory(quickPriceEditProduct.categoryId).map((grp) => (
                    <optgroup key={grp.groupTitle} label={grp.groupTitle}>
                      {grp.items.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* PRICE CHANGE CONTROLS */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 text-xs flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>Price Change Controls</span>
                  </span>
                  {quickPriceEditProduct.originalPrice > quickPriceEditProduct.price && (
                    <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                      {Math.round(
                        ((quickPriceEditProduct.originalPrice - quickPriceEditProduct.price) /
                          quickPriceEditProduct.originalPrice) *
                          100
                      )}
                      % OFF (Save ₹{quickPriceEditProduct.originalPrice - quickPriceEditProduct.price})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900">Sale Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quickPriceEditProduct.price}
                      onChange={(e) =>
                        setQuickPriceEditProduct({
                          ...quickPriceEditProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-amber-400 rounded-xl font-black text-base text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Original MRP (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={quickPriceEditProduct.originalPrice}
                      onChange={(e) =>
                        setQuickPriceEditProduct({
                          ...quickPriceEditProduct,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-amber-900">VIP Club Price (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={quickPriceEditProduct.clubPrice}
                      onChange={(e) =>
                        setQuickPriceEditProduct({
                          ...quickPriceEditProduct,
                          clubPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-bold text-amber-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* PRODUCT DESCRIPTION CHANGE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Change Product Description</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {quickPriceEditProduct.description?.length || 0} characters
                  </span>
                </div>

                <textarea
                  rows={4}
                  required
                  value={quickPriceEditProduct.description || ''}
                  onChange={(e) =>
                    setQuickPriceEditProduct({
                      ...quickPriceEditProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter full product description, fabric weave details, fitting, wash care..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-400 text-xs"
                />

                {/* Quick Helper Template Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold">Quick Insert:</span>
                  <button
                    type="button"
                    onClick={() =>
                      appendDescriptionSnippet(
                        '• Material: 100% GOTS Pure Organic Cotton, gentle on delicate skin.',
                        'quick'
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    + Fabric Info
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      appendDescriptionSnippet(
                        '• Fit: Relaxed comfortable silhouette designed for unrestricted movement and play.',
                        'quick'
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    + Fit & Comfort
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      appendDescriptionSnippet(
                        '• Occasion: Perfect for festive gatherings, birthdays, ceremonies, and gifts.',
                        'quick'
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    + Occasion
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      appendDescriptionSnippet(
                        '• Wash Care: Machine wash gentle cycle cold with like colors, warm iron inside out.',
                        'quick'
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    + Wash Care
                  </button>
                </div>
              </div>

              {/* Stock Status Availability */}
              <div className="flex items-center gap-4 pt-1">
                <span className="font-bold text-slate-700">Stock Availability:</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 font-bold">
                  <input
                    type="radio"
                    checked={quickPriceEditProduct.inStock === true}
                    onChange={() =>
                      setQuickPriceEditProduct({ ...quickPriceEditProduct, inStock: true })
                    }
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-rose-800 font-bold">
                  <input
                    type="radio"
                    checked={quickPriceEditProduct.inStock === false}
                    onChange={() =>
                      setQuickPriceEditProduct({ ...quickPriceEditProduct, inStock: false })
                    }
                  />
                  <span>Out of Stock</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickPriceEditProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-md transition-all cursor-pointer"
                >
                  Save Price & Description Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SUBCATEGORY BATCH PRICE & DESCRIPTION EDITOR
          ========================================================================= */}
      {isSubcategoryBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Subcategory Price & Description Manager: {selectedSubCategory}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust price and description for all {batchDraftProducts.length} products in &ldquo;{selectedSubCategory}&rdquo; simultaneously.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubcategoryBatchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBatchChanges} className="space-y-4 text-xs">
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {batchDraftProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-slate-400">
                            ID: <span className="font-mono">{p.id}</span> &bull; Brand: <strong>{p.brand}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={p.inStock}
                            onChange={(e) => {
                              const updated = [...batchDraftProducts];
                              updated[idx].inStock = e.target.checked;
                              setBatchDraftProducts(updated);
                            }}
                          />
                          <span className={p.inStock ? 'text-emerald-700' : 'text-rose-700'}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-800 text-[11px]">Sale Price (₹) *</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={p.price}
                          onChange={(e) => {
                            const updated = [...batchDraftProducts];
                            updated[idx].price = Number(e.target.value);
                            setBatchDraftProducts(updated);
                          }}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-black text-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 text-[11px]">Original MRP (₹)</label>
                        <input
                          type="number"
                          min={1}
                          value={p.originalPrice}
                          onChange={(e) => {
                            const updated = [...batchDraftProducts];
                            updated[idx].originalPrice = Number(e.target.value);
                            setBatchDraftProducts(updated);
                          }}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-amber-900 text-[11px]">VIP Club Price (₹)</label>
                        <input
                          type="number"
                          min={1}
                          value={p.clubPrice}
                          onChange={(e) => {
                            const updated = [...batchDraftProducts];
                            updated[idx].clubPrice = Number(e.target.value);
                            setBatchDraftProducts(updated);
                          }}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-amber-200 rounded-xl font-bold text-amber-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 text-[11px]">Product Description</label>
                      <textarea
                        rows={2}
                        required
                        value={p.description || ''}
                        onChange={(e) => {
                          const updated = [...batchDraftProducts];
                          updated[idx].description = e.target.value;
                          setBatchDraftProducts(updated);
                        }}
                        className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl leading-relaxed text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubcategoryBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-md cursor-pointer"
                >
                  Save All Changes ({batchDraftProducts.length} SKUs)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
