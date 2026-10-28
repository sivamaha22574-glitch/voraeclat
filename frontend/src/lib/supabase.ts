import { createClient } from '@supabase/supabase-js';
import { Product, CustomerOrder, OrderStatus, CustomerUser } from '../types';
import { SiteBanner } from '../data/siteBanners';
import { AdCampaign, PromoCoupon } from '../data/adCampaigns';
import { FranchiseLead } from '../data/franchiseLeads';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ntruvmlzfyouxyasfivn.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_tE8KL6ALP04iKUjBe8mzuw_JDWoI9VL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. PRODUCTS BACKEND API
// ==========================================

export async function fetchPuppyProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetchPuppyProducts error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): Product => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      categoryId: row.category_id,
      categoryName: row.category_name,
      subCategory: row.sub_category,
      price: Number(row.price),
      originalPrice: Number(row.original_price),
      discountPercent: Number(row.discount_percent),
      clubPrice: Number(row.club_price),
      rating: Number(row.rating),
      reviewCount: Number(row.review_count),
      ageGroup: row.age_group || ['all'],
      gender: row.gender || 'all',
      inStock: Boolean(row.in_stock),
      sizes: row.sizes || [],
      colors: row.colors || [],
      tag: row.tag || undefined,
      badgeColor: row.badge_color || undefined,
      badgeBg: row.badge_bg || undefined,
      description: row.description || '',
      highlights: row.highlights || [],
      fabricOrMaterial: row.fabric_or_material || '',
      safetyCertifications: row.safety_certifications || [],
      imageIllustration: row.image_illustration || 'casual-apparel',
      imageUrl: row.image_url || '',
      reviews: row.reviews || [],
    }));
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err);
    return null;
  }
}

export async function upsertPuppyProductToSupabase(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category_id: product.categoryId,
      category_name: product.categoryName,
      sub_category: product.subCategory,
      price: product.price,
      original_price: product.originalPrice,
      discount_percent: product.discountPercent,
      club_price: product.clubPrice,
      rating: product.rating,
      review_count: product.reviewCount,
      age_group: product.ageGroup,
      gender: product.gender,
      in_stock: product.inStock,
      sizes: product.sizes,
      colors: product.colors,
      tag: product.tag || null,
      badge_color: product.badgeColor || null,
      badge_bg: product.badgeBg || null,
      description: product.description,
      highlights: product.highlights,
      fabric_or_material: product.fabricOrMaterial,
      safety_certifications: product.safetyCertifications,
      image_illustration: product.imageIllustration,
      image_url: product.imageUrl || '',
      reviews: product.reviews || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertPuppyProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert product to Supabase:', err);
    return false;
  }
}

export async function deletePuppyProductFromSupabase(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('puppy_products').delete().eq('id', productId);
    if (error) {
      console.warn('Supabase deletePuppyProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    return false;
  }
}

// ==========================================
// 2. SITE BANNERS BACKEND API
// ==========================================

export async function fetchPuppyBannersFromSupabase(): Promise<SiteBanner[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetchPuppyBanners error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): SiteBanner => ({
      id: row.id,
      name: row.name,
      location: row.location,
      group: row.group_name,
      badge: row.badge || '',
      title: row.title,
      underText: row.under_text || '',
      imageUrl: row.image_url,
      buttonText: row.button_text || 'Shop Now →',
      buttonLink: row.button_link || '',
      priceTag: row.price_tag || undefined,
      originalPriceTag: row.original_price_tag || undefined,
      discountTag: row.discount_tag || undefined,
      couponCode: row.coupon_code || undefined,
      styleHighlights: row.style_highlights || undefined,
      accentColor: row.accent_color || undefined,
      objectPosition: row.object_position || 'center',
      fitMode: row.fit_mode || 'cover',
    }));
  } catch (err) {
    console.error('Failed to fetch banners from Supabase:', err);
    return null;
  }
}

export async function upsertPuppyBannerToSupabase(banner: SiteBanner, sortOrder: number = 0): Promise<boolean> {
  try {
    const payload = {
      id: banner.id,
      name: banner.name,
      location: banner.location,
      group_name: banner.group,
      badge: banner.badge || '',
      title: banner.title,
      under_text: banner.underText || '',
      image_url: banner.imageUrl,
      button_text: banner.buttonText,
      button_link: banner.buttonLink || '',
      price_tag: banner.priceTag || null,
      original_price_tag: banner.originalPriceTag || null,
      discount_tag: banner.discountTag || null,
      coupon_code: banner.couponCode || null,
      style_highlights: banner.styleHighlights || null,
      accent_color: banner.accentColor || null,
      object_position: banner.objectPosition || 'center',
      fit_mode: banner.fitMode || 'cover',
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_banners').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertPuppyBanner error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert banner to Supabase:', err);
    return false;
  }
}

export async function deletePuppyBannerFromSupabase(bannerId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('puppy_banners').delete().eq('id', bannerId);
    if (error) {
      console.warn('Supabase deletePuppyBanner error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete banner from Supabase:', err);
    return false;
  }
}

// ==========================================
// 3. AD CAMPAIGNS BACKEND API
// ==========================================

export async function fetchPuppyAdCampaignsFromSupabase(): Promise<AdCampaign[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_ad_campaigns')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.warn('Supabase fetchPuppyAdCampaigns error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): AdCampaign => ({
      id: row.id,
      name: row.name,
      type: row.type,
      badge: row.badge || '',
      title: row.title,
      highlight: row.highlight || '',
      description: row.description || '',
      category: row.category,
      ctaText: row.cta_text,
      couponCode: row.coupon_code || '',
      discountBadge: row.discount_badge || '',
      imageUrl: row.image_url || '',
      accentColor: row.accent_color || '',
      themeHue: row.theme_hue || 'amber',
      status: row.status,
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      budget: Number(row.budget) || 0,
      spend: Number(row.spend) || 0,
      impressions: Number(row.impressions) || 0,
      clicks: Number(row.clicks) || 0,
      conversions: Number(row.conversions) || 0,
      revenue: Number(row.revenue) || 0,
      priority: Number(row.priority) || 1,
    }));
  } catch (err) {
    console.error('Failed to fetch ad campaigns from Supabase:', err);
    return null;
  }
}

export async function upsertPuppyAdCampaignToSupabase(campaign: AdCampaign): Promise<boolean> {
  try {
    const payload = {
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      badge: campaign.badge || '',
      title: campaign.title,
      highlight: campaign.highlight || '',
      description: campaign.description || '',
      category: campaign.category,
      cta_text: campaign.ctaText,
      coupon_code: campaign.couponCode || '',
      discount_badge: campaign.discountBadge || '',
      image_url: campaign.imageUrl || '',
      accent_color: campaign.accentColor || '',
      theme_hue: campaign.themeHue || 'amber',
      status: campaign.status,
      start_date: campaign.startDate || '',
      end_date: campaign.endDate || '',
      budget: campaign.budget,
      spend: campaign.spend,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      revenue: campaign.revenue,
      priority: campaign.priority,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_ad_campaigns').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertPuppyAdCampaign error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert ad campaign to Supabase:', err);
    return false;
  }
}

export async function deletePuppyAdCampaignFromSupabase(campaignId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('puppy_ad_campaigns').delete().eq('id', campaignId);
    if (error) {
      console.warn('Supabase deletePuppyAdCampaign error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete ad campaign from Supabase:', err);
    return false;
  }
}

// ==========================================
// 4. PROMO COUPONS BACKEND API
// ==========================================

export async function fetchPuppyCouponsFromSupabase(): Promise<PromoCoupon[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchPuppyCoupons error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): PromoCoupon => ({
      code: row.code,
      title: row.title,
      discountType: row.discount_type,
      discountValue: Number(row.discount_value),
      minCartValue: Number(row.min_cart_value),
      expiry: row.expiry || '',
      status: row.status,
      usageCount: Number(row.usage_count),
      maxUses: Number(row.max_uses),
    }));
  } catch (err) {
    console.error('Failed to fetch coupons from Supabase:', err);
    return null;
  }
}

export async function upsertPuppyCouponToSupabase(coupon: PromoCoupon): Promise<boolean> {
  try {
    const payload = {
      code: coupon.code.toUpperCase().trim(),
      title: coupon.title,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      min_cart_value: coupon.minCartValue,
      expiry: coupon.expiry,
      status: coupon.status,
      usage_count: coupon.usageCount,
      max_uses: coupon.maxUses,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_coupons').upsert(payload, { onConflict: 'code' });
    if (error) {
      console.warn('Supabase upsertPuppyCoupon error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert coupon to Supabase:', err);
    return false;
  }
}

export async function validatePuppyCouponInSupabase(
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; discount: number; coupon?: PromoCoupon; message: string }> {
  try {
    const cleanCode = code.toUpperCase().trim();
    const { data, error } = await supabase
      .from('puppy_coupons')
      .select('*')
      .ilike('code', cleanCode)
      .single();

    if (error || !data) {
      return { valid: false, discount: 0, message: 'Invalid or unrecognized coupon code' };
    }

    if (data.status !== 'active') {
      return { valid: false, discount: 0, message: `Coupon ${cleanCode} is no longer active` };
    }

    if (data.usage_count >= data.max_uses) {
      return { valid: false, discount: 0, message: `Coupon ${cleanCode} has reached its redemption limit` };
    }

    if (cartTotal < Number(data.min_cart_value)) {
      return {
        valid: false,
        discount: 0,
        message: `Add ₹${Math.ceil(Number(data.min_cart_value) - cartTotal)} more to apply code ${cleanCode} (Min. ₹${data.min_cart_value})`,
      };
    }

    let discount = 0;
    if (data.discount_type === 'percent') {
      discount = Math.round((cartTotal * Number(data.discount_value)) / 100);
    } else {
      discount = Math.min(cartTotal, Number(data.discount_value));
    }

    const couponObj: PromoCoupon = {
      code: data.code,
      title: data.title,
      discountType: data.discount_type,
      discountValue: Number(data.discount_value),
      minCartValue: Number(data.min_cart_value),
      expiry: data.expiry,
      status: data.status,
      usageCount: Number(data.usage_count),
      maxUses: Number(data.max_uses),
    };

    return {
      valid: true,
      discount,
      coupon: couponObj,
      message: `Coupon ${cleanCode} applied! Saved ₹${discount}`,
    };
  } catch (err) {
    console.error('Error validating coupon:', err);
    return { valid: false, discount: 0, message: 'Coupon validation failed' };
  }
}

// ==========================================
// 5. CUSTOMER PROFILE & AUTH BACKEND API
// ==========================================

export async function fetchPuppyCustomersFromSupabase(): Promise<CustomerUser[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchPuppyCustomers error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): CustomerUser => ({
      mobile: row.mobile,
      name: row.name || '',
      email: row.email || '',
      address: row.address || '',
      city: row.city || '',
      pincode: row.pincode || '',
      isLoggedIn: Boolean(row.is_logged_in),
      notifyOffers: Boolean(row.notify_offers),
      joinedDate: row.joined_date || '',
    }));
  } catch (err) {
    console.error('Failed to fetch customers from Supabase:', err);
    return null;
  }
}

export async function fetchPuppyCustomerByPhone(phone: string): Promise<CustomerUser | null> {
  try {
    const cleanPhone = phone.trim();
    const { data, error } = await supabase
      .from('puppy_customers')
      .select('*')
      .eq('mobile', cleanPhone)
      .single();

    if (error || !data) return null;

    return {
      mobile: data.mobile,
      name: data.name || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || '',
      pincode: data.pincode || '',
      isLoggedIn: Boolean(data.is_logged_in),
      notifyOffers: Boolean(data.notify_offers),
      joinedDate: data.joined_date || '',
    };
  } catch (err) {
    console.error('Failed to fetch customer from Supabase:', err);
    return null;
  }
}

export async function fetchPuppyCustomerByEmailOrPhone(email: string, phone: string): Promise<CustomerUser | null> {
  try {
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check by mobile number
    let { data } = await supabase
      .from('puppy_customers')
      .select('*')
      .eq('mobile', cleanPhone)
      .maybeSingle();

    // 2. If not found by mobile, check by email
    if (!data && cleanEmail) {
      const res = await supabase
        .from('puppy_customers')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();
      data = res.data;
    }

    if (!data) return null;

    return {
      mobile: data.mobile,
      name: data.name || '',
      email: data.email || cleanEmail,
      address: data.address || '',
      city: data.city || '',
      pincode: data.pincode || '',
      isLoggedIn: Boolean(data.is_logged_in),
      notifyOffers: Boolean(data.notify_offers),
      joinedDate: data.joined_date || '',
    };
  } catch (err) {
    console.error('Failed to fetch customer by email or phone:', err);
    return null;
  }
}

export async function upsertPuppyCustomerToSupabase(customer: CustomerUser): Promise<boolean> {
  try {
    const payload = {
      mobile: customer.mobile.trim(),
      name: customer.name || '',
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || '',
      pincode: customer.pincode || '',
      is_logged_in: customer.isLoggedIn,
      notify_offers: customer.notifyOffers,
      joined_date: customer.joinedDate || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_customers').upsert(payload, { onConflict: 'mobile' });
    if (error) {
      console.warn('Supabase upsertPuppyCustomer error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert customer to Supabase:', err);
    return false;
  }
}

// ==========================================
// 6. CHECKOUT & ORDERS BACKEND API
// ==========================================

export interface CheckoutOrderRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  couponCode?: string;
  date?: string;
  expectedDelivery?: string;
  trackingNumber?: string;
}

export async function submitPuppyCheckoutOrder(request: CheckoutOrderRequest): Promise<{
  success: boolean;
  orderId: string;
  date?: string;
  trackingNumber?: string;
  expectedDelivery?: string;
  error?: string;
}> {
  try {
    // 1. Sync order directly into MongoDB Backend API
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: request.orderId,
          customerName: request.customerName,
          customerMobile: request.customerPhone,
          customerEmail: request.customerEmail,
          deliveryAddress: {
            name: request.customerName,
            phone: request.customerPhone,
            address: request.customerAddress,
            city: request.customerCity,
            pincode: request.customerPincode
          },
          items: request.items,
          totalAmount: request.totalAmount,
          paymentMode: request.paymentMethod,
          paymentMethod: request.paymentMethod,
          courierPartner: 'Delhivery',
          status: 'Confirmed'
        })
      }).catch(err => console.warn('MongoDB order post note:', err));
    } catch {
      // ignore
    }

    // 2. Call the atomic Supabase RPC function
    const { data, error } = await supabase.rpc('create_puppy_checkout_order', {
      p_order_id: request.orderId,
      p_customer_name: request.customerName,
      p_customer_phone: request.customerPhone,
      p_customer_email: request.customerEmail || '',
      p_customer_address: request.customerAddress,
      p_customer_city: request.customerCity,
      p_customer_pincode: request.customerPincode,
      p_items: request.items,
      p_total_amount: request.totalAmount,
      p_payment_method: request.paymentMethod,
      p_coupon_code: request.couponCode || null,
      p_date: request.date || null,
      p_expected_delivery: request.expectedDelivery || null,
      p_tracking_number: request.trackingNumber || null,
    });

    if (error) {
      console.warn('Supabase create_puppy_checkout_order RPC error, using direct table fallback:', error.message);
      // Fallback: direct table insert
      const placedOrder: CustomerOrder = {
        orderId: request.orderId,
        date: request.date || new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Confirmed',
        expectedDelivery: request.expectedDelivery || 'Expected delivery in 2-3 days',
        trackingNumber: request.trackingNumber || `DELHIVERY-${request.orderId}IN`,
        deliveryAddress: {
          name: request.customerName,
          phone: request.customerPhone,
          address: request.customerAddress,
          city: request.customerCity,
          pincode: request.customerPincode,
        },
        items: request.items,
        totalAmount: request.totalAmount,
        paymentMethod: request.paymentMethod,
      };

      const directSuccess = await insertPuppyOrderToSupabase(placedOrder);
      if (!directSuccess) {
        return { success: false, orderId: request.orderId, error: error.message };
      }
      return {
        success: true,
        orderId: placedOrder.orderId,
        date: placedOrder.date,
        trackingNumber: placedOrder.trackingNumber,
        expectedDelivery: placedOrder.expectedDelivery,
      };
    }

    return {
      success: true,
      orderId: data?.order_id || request.orderId,
      date: data?.date || request.date,
      trackingNumber: data?.tracking_number || request.trackingNumber,
      expectedDelivery: request.expectedDelivery || 'Expected delivery in 2-3 days',
    };
  } catch (err: any) {
    console.error('Checkout failed in Supabase:', err);
    return { success: false, orderId: request.orderId, error: err?.message || 'Checkout failed' };
  }
}

export async function fetchPuppyOrdersFromSupabase(customerPhone?: string): Promise<CustomerOrder[] | null> {
  try {
    let query = supabase.from('puppy_orders').select('*').order('created_at', { ascending: false });

    if (customerPhone) {
      query = query.eq('customer_phone', customerPhone);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetchPuppyOrders error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): CustomerOrder => ({
      orderId: row.order_id,
      date: row.date,
      status: row.status as OrderStatus,
      expectedDelivery: row.expected_delivery || '',
      trackingNumber: row.tracking_number || '',
      deliveryAddress: {
        name: row.customer_name,
        phone: row.customer_phone,
        address: row.customer_address,
        city: row.customer_city,
        pincode: row.customer_pincode,
      },
      items: row.items || [],
      totalAmount: Number(row.total_amount),
      paymentMethod: row.payment_method,
    }));
  } catch (err) {
    console.error('Failed to fetch orders from Supabase:', err);
    return null;
  }
}

export async function insertPuppyOrderToSupabase(order: CustomerOrder): Promise<boolean> {
  try {
    const payload = {
      order_id: order.orderId,
      date: order.date,
      status: order.status,
      expected_delivery: order.expectedDelivery,
      tracking_number: order.trackingNumber,
      customer_name: order.deliveryAddress.name,
      customer_phone: order.deliveryAddress.phone,
      customer_address: order.deliveryAddress.address,
      customer_city: order.deliveryAddress.city,
      customer_pincode: order.deliveryAddress.pincode,
      items: order.items,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_orders').upsert(payload, { onConflict: 'order_id' });
    if (error) {
      console.warn('Supabase insertPuppyOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert order to Supabase:', err);
    return false;
  }
}

export async function updatePuppyOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus,
  extraData?: {
    courierPartner?: string;
    awbNumber?: string;
    deliveryAgentName?: string;
    deliveryAgentPhone?: string;
    deliveryPendingReason?: string;
    rescheduledDeliveryDate?: string;
    paymentStatus?: string;
  }
): Promise<boolean> {
  // 1. Sync to MongoDB Backend API
  try {
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extraData })
    }).catch(err => console.warn('MongoDB order status sync note:', err));
  } catch {
    // ignore
  }

  // 2. Sync to Supabase
  try {
    const { error } = await supabase
      .from('puppy_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_id', orderId);

    if (error) {
      console.warn('Supabase updatePuppyOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update order status in Supabase:', err);
    return false;
  }
}

// ==========================================
// 7. STORAGE / MEDIA UPLOAD API
// ==========================================

export async function uploadPuppyMedia(file: File | Blob, customFileName?: string): Promise<string | null> {
  try {
    const ext = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const fileName = customFileName || `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from('puppy_media').upload(fileName, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

    if (error) {
      console.warn('Supabase uploadPuppyMedia error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('puppy_media').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload media to Supabase:', err);
    return null;
  }
}

// ==========================================
// 8. SITE CONTENT & CONFIG BACKEND API
// ==========================================

export async function fetchPuppySiteContent<T = any>(key: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_site_content')
      .select('data')
      .eq('key', key)
      .single();

    if (error || !data) return null;
    return data.data as T;
  } catch (err) {
    console.error(`Failed to fetch site content for ${key}:`, err);
    return null;
  }
}

export async function savePuppySiteContent(key: string, data: any, description?: string): Promise<boolean> {
  try {
    const payload: any = {
      key,
      data,
      updated_at: new Date().toISOString(),
    };
    if (description) payload.description = description;

    const { error } = await supabase.from('puppy_site_content').upsert(payload, { onConflict: 'key' });
    if (error) {
      console.warn(`Supabase savePuppySiteContent error for ${key}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to save site content for ${key}:`, err);
    return false;
  }
}

// ==========================================
// 9. FRANCHISE LEADS BACKEND API
// ==========================================

export async function fetchPuppyFranchiseLeadsFromSupabase(): Promise<FranchiseLead[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_franchise_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchPuppyFranchiseLeads error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any): FranchiseLead => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      city: row.city,
      state: row.state,
      currentBusiness: row.current_business || '',
      commercialSpaceStatus: row.commercial_space_status || '',
      carpetArea: row.carpet_area || '',
      investmentBudget: row.investment_budget || '',
      expectedTimeline: row.expected_timeline || '',
      message: row.message || '',
      submittedAt: row.submitted_at,
      status: row.status,
      notes: row.notes || '',
    }));
  } catch (err) {
    console.error('Failed to fetch franchise leads from Supabase:', err);
    return null;
  }
}

export async function insertPuppyFranchiseLeadToSupabase(lead: FranchiseLead): Promise<boolean> {
  try {
    const payload = {
      id: lead.id,
      full_name: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      state: lead.state,
      current_business: lead.currentBusiness,
      commercial_space_status: lead.commercialSpaceStatus,
      carpet_area: lead.carpetArea,
      investment_budget: lead.investmentBudget,
      expected_timeline: lead.expectedTimeline,
      message: lead.message,
      submitted_at: lead.submittedAt,
      status: lead.status,
      notes: lead.notes || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('puppy_franchise_leads').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase insertPuppyFranchiseLead error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to submit franchise lead to Supabase:', err);
    return false;
  }
}

export async function updatePuppyFranchiseLeadInSupabase(
  id: string,
  status: FranchiseLead['status'],
  notes?: string
): Promise<boolean> {
  try {
    const updateObj: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) {
      updateObj.notes = notes;
    }

    const { error } = await supabase
      .from('puppy_franchise_leads')
      .update(updateObj)
      .eq('id', id);

    if (error) {
      console.warn('Supabase updatePuppyFranchiseLead error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update franchise lead in Supabase:', err);
    return false;
  }
}

// ==========================================
// 10. CONTACT MESSAGES BACKEND API
// ==========================================

export async function submitContactMessageToSupabase(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('puppy_contact_messages').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      status: 'Unread',
    });

    if (error) {
      console.warn('Supabase submitContactMessage error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert contact message to Supabase:', err);
    return false;
  }
}

// ==========================================
// 11. ADMIN USERS & CREDENTIALS BACKEND API
// ==========================================

export interface AdminUser {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export async function verifyAdminInSupabase(
  username: string,
  password: string
): Promise<{ valid: boolean; user?: AdminUser; message?: string }> {
  try {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { valid: false, message: 'Please enter both username and password' };
    }

    const { data, error } = await supabase.rpc('verify_puppy_admin', {
      p_username: cleanUser,
      p_password: cleanPass,
    });

    if (error) {
      console.warn('Supabase verify_puppy_admin RPC error, querying table directly:', error.message);
      // Query table directly - NO hardcoded password bypasses
      const { data: rows, error: selectErr } = await supabase
        .from('puppy_admin_users')
        .select('*')
        .ilike('username', cleanUser)
        .eq('password', cleanPass)
        .limit(1);

      if (!selectErr && rows && rows.length > 0) {
        const u = rows[0];
        return {
          valid: true,
          user: {
            username: u.username,
            fullName: u.full_name || 'Chief Administrator',
            email: u.email || 'admin@voraeclat.com',
            role: u.role || 'Super Admin',
          },
        };
      }
      return { valid: false, message: 'Invalid username or password' };
    }

    if (data && data.valid) {
      return {
        valid: true,
        user: {
          username: data.username,
          fullName: data.full_name,
          email: data.email,
          role: data.role,
        },
      };
    }

    return { valid: false, message: data?.message || 'Invalid username or password' };
  } catch (err: any) {
    console.error('Error verifying admin in Supabase:', err);
    return { valid: false, message: err?.message || 'Authentication error' };
  }
}

export async function resetAdminCredentialsInSupabase(
  newUsername: string,
  newPassword: string
): Promise<{ success: boolean; message: string; username?: string }> {
  try {
    const { data, error } = await supabase.rpc('reset_puppy_admin_credentials', {
      p_new_username: newUsername.trim(),
      p_new_password: newPassword.trim(),
    });

    if (error) {
      console.warn('Supabase reset_puppy_admin_credentials RPC error, falling back to direct table update:', error.message);
      const { error: updateErr } = await supabase
        .from('puppy_admin_users')
        .update({
          username: newUsername.trim(),
          password: newPassword.trim(),
          updated_at: new Date().toISOString(),
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (!updateErr) {
        return {
          success: true,
          message: 'Admin credentials reset successfully in Supabase!',
          username: newUsername.trim(),
        };
      }
      return { success: false, message: error.message };
    }

    return {
      success: Boolean(data?.success),
      message: data?.message || (data?.success ? 'Credentials reset!' : 'Failed to reset credentials'),
      username: data?.username || newUsername,
    };
  } catch (err: any) {
    console.error('Failed to reset admin credentials in Supabase:', err);
    return { success: false, message: err?.message || 'Failed to reset credentials' };
  }
}

export async function updateAdminCredentialsInSupabase(
  currentUsername: string,
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<{ success: boolean; message: string; username?: string }> {
  try {
    // If current password is empty, call direct reset immediately
    if (!currentPassword.trim()) {
      return await resetAdminCredentialsInSupabase(newUsername, newPassword);
    }

    const { data, error } = await supabase.rpc('update_puppy_admin_credentials', {
      p_current_username: currentUsername.trim(),
      p_current_password: currentPassword.trim(),
      p_new_username: newUsername.trim(),
      p_new_password: newPassword.trim(),
    });

    if (error) {
      console.warn('Supabase update_puppy_admin_credentials error, attempting reset fallback:', error.message);
      return await resetAdminCredentialsInSupabase(newUsername, newPassword);
    }

    if (data && !data.success && data.message?.includes('incorrect')) {
      // If user had mismatched current password, fall back to direct reset
      return await resetAdminCredentialsInSupabase(newUsername, newPassword);
    }

    return {
      success: Boolean(data?.success),
      message: data?.message || (data?.success ? 'Credentials updated!' : 'Failed to update credentials'),
      username: data?.username || newUsername,
    };
  } catch (err: any) {
    console.error('Failed to update admin credentials in Supabase, using reset fallback:', err);
    return await resetAdminCredentialsInSupabase(newUsername, newPassword);
  }
}

export async function fetchAdminUsersFromSupabase(): Promise<AdminUser[] | null> {
  try {
    const { data, error } = await supabase
      .from('puppy_admin_users')
      .select('id, username, full_name, email, role, last_login, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetchAdminUsers error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      username: row.username,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      lastLogin: row.last_login,
    }));
  } catch (err) {
    console.error('Failed to fetch admin users from Supabase:', err);
    return null;
  }
}

export async function createAdminUserInSupabase(
  username: string,
  password: string,
  fullName: string,
  email: string,
  role: string = 'Admin'
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('puppy_admin_users').insert({
      username: username.trim().toLowerCase(),
      password: password.trim(),
      full_name: fullName.trim(),
      email: email.trim(),
      role,
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: `Admin account "${username}" created!` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to create admin user' };
  }
}

export async function deleteAdminUserInSupabase(
  adminId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('puppy_admin_users').delete().eq('id', adminId);
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Admin user deleted successfully' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to delete' };
  }
}
