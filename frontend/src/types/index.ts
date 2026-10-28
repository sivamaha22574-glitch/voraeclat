export type CategoryId =
  | 'all'
  | 'festive-ethnic'
  | 'boy-fashion'
  | 'girl-fashion'
  | 'baby-toddler'
  | 'casual-wear'
  | 'diapering'
  | 'feeding'
  | 'bath-skin'
  | 'toys-learning'
  | 'nursery-gear'
  | 'books-library'
  | 'health-safety'
  | 'footwear-accessories'
  | 'moms-maternity';

export type AgeGroup =
  | 'all'
  | '0-3M'
  | '3-6M'
  | '6-12M'
  | '1-2Y'
  | '2-4Y'
  | '4-6Y'
  | '6-8Y'
  | '8+Y';

export type Gender = 'all' | 'boy' | 'girl' | 'unisex';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  childAge?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  categoryName: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  clubPrice: number; // Voraeclat Club exclusive price
  rating: number;
  reviewCount: number;
  ageGroup: AgeGroup[];
  gender: Gender;
  inStock: boolean;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tag?: 'Best Seller' | 'Club Choice' | 'Organic' | 'New Arrival' | 'Trending';
  badgeColor?: string;
  badgeBg?: string;
  description: string;
  highlights: string[];
  fabricOrMaterial: string;
  safetyCertifications: string[];
  imageIllustration: string; // thematic identifier for the high-res SVG product visual
  imageUrl?: string; // high-resolution commercial photography URL
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId;
  ageGroup: AgeGroup;
  gender: Gender;
  minPrice: number;
  maxPrice: number;
  clubOnly: boolean;
  minRating: number;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating' | 'discount' | 'newest';
}

export interface PuppyClubPlan {
  id: string;
  durationMonths: number;
  title: string;
  price: number;
  originalPrice: number;
  popular?: boolean;
  features: string[];
}

export interface CustomerUser {
  mobile: string;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  isLoggedIn: boolean;
  notifyOffers: boolean;
  joinedDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Packed'
  | 'Dispatched'
  | 'In Transit'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivery Pending'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type CourierPartner =
  | 'Delhivery'
  | 'BlueDart Express'
  | 'DTDC'
  | 'XpressBees'
  | 'Shadowfax'
  | 'Ekart Logistics'
  | 'Self Delivery / Local Courier';

export type PaymentMode =
  | 'COD'
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Wallet'
  | 'EMI';

export type DeliveryPendingReason =
  | 'Customer Unavailable'
  | 'Incomplete Address / Wrong Address'
  | 'Customer Requested Reschedule'
  | 'Door / Gate Locked'
  | 'Cash Not Ready'
  | 'Customer Phone Unreachable'
  | 'Bad Weather / Area Restriction'
  | 'Entry Restricted by Society / Security'
  | 'Package Refused by Customer'
  | 'Other';

export interface CustomerOrder {
  orderId: string;
  invoiceNumber?: string;
  date: string;
  status: OrderStatus;
  expectedDelivery: string;
  trackingNumber: string;
  awbNumber?: string;
  courierPartner?: string;
  courierContact?: string;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    locality?: string;
    state?: string;
    landmark?: string;
  };
  items: OrderItem[];
  subTotal?: number;
  discountAmount?: number;
  gstAmount?: number;
  shippingFee?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentMode?: PaymentMode | string;
  paymentStatus?: string;
  isPaid?: boolean;
  // Out for Delivery Telemetry
  outForDeliveryAt?: string;
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
  deliveryOtp?: string;
  // Delivery Pending Telemetry
  deliveryPendingReason?: DeliveryPendingReason | string;
  deliveryAttemptsCount?: number;
  rescheduledDeliveryDate?: string;
  // Marketing & Ad attribution
  adCampaignId?: string;
  adCampaignName?: string;
  adPlatform?: string;
}

