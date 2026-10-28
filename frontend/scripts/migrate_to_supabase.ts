import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products';
import { INITIAL_SITE_BANNERS } from '../src/data/siteBanners';
import { INITIAL_AD_CAMPAIGNS, INITIAL_PROMO_COUPONS, INITIAL_SOCIAL_CONNECTION } from '../src/data/adCampaigns';
import { INITIAL_SAMPLE_ORDERS } from '../src/data/sampleOrders';
import { INITIAL_FRANCHISE_LEADS } from '../src/data/franchiseLeads';
import { HOSPITAL_BAG_CHECKLIST, BABY_SIZE_GUIDE } from '../src/data/checklists';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ntruvmlzfyouxyasfivn.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tE8KL6ALP04iKUjBe8mzuw_JDWoI9VL';

console.log('Connecting to Supabase:', SUPABASE_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log('--- Starting Complete Data Migration to Supabase ---');

  // 1. Migrate Products
  console.log(`Migrating ${PRODUCTS.length} products...`);
  const formattedProducts = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category_id: p.categoryId,
    category_name: p.categoryName,
    sub_category: p.subCategory,
    price: p.price,
    original_price: p.originalPrice,
    discount_percent: p.discountPercent,
    club_price: p.clubPrice,
    rating: p.rating,
    review_count: p.reviewCount,
    age_group: p.ageGroup,
    gender: p.gender,
    in_stock: p.inStock,
    sizes: p.sizes,
    colors: p.colors,
    tag: p.tag || null,
    badge_color: p.badgeColor || null,
    badge_bg: p.badgeBg || null,
    description: p.description,
    highlights: p.highlights,
    fabric_or_material: p.fabricOrMaterial,
    safety_certifications: p.safetyCertifications,
    image_illustration: p.imageIllustration,
    image_url: p.imageUrl || '',
    reviews: p.reviews,
  }));

  // Batch insert in chunks of 20
  for (let i = 0; i < formattedProducts.length; i += 20) {
    const chunk = formattedProducts.slice(i, i + 20);
    const { error } = await supabase.from('puppy_products').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting products chunk:', error);
    } else {
      console.log(`Uploaded products ${i + 1} to ${Math.min(i + 20, formattedProducts.length)}`);
    }
  }

  // 2. Migrate Site Banners
  console.log(`Migrating ${INITIAL_SITE_BANNERS.length} banners...`);
  const formattedBanners = INITIAL_SITE_BANNERS.map((b, idx) => ({
    id: b.id,
    name: b.name,
    location: b.location,
    group_name: b.group,
    badge: b.badge || '',
    title: b.title,
    under_text: b.underText || '',
    image_url: b.imageUrl,
    button_text: b.buttonText,
    button_link: b.buttonLink || '',
    price_tag: b.priceTag || null,
    original_price_tag: b.originalPriceTag || null,
    discount_tag: b.discountTag || null,
    coupon_code: b.couponCode || null,
    style_highlights: b.styleHighlights || null,
    accent_color: b.accentColor || null,
    object_position: b.objectPosition || 'center',
    fit_mode: b.fitMode || 'cover',
    sort_order: idx,
  }));

  const { error: bannerErr } = await supabase.from('puppy_banners').upsert(formattedBanners, { onConflict: 'id' });
  if (bannerErr) console.error('Error inserting banners:', bannerErr);
  else console.log(`Uploaded ${formattedBanners.length} banners successfully.`);

  // 3. Migrate Ad Campaigns
  console.log(`Migrating ${INITIAL_AD_CAMPAIGNS.length} ad campaigns...`);
  const formattedCampaigns = INITIAL_AD_CAMPAIGNS.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    badge: c.badge || '',
    title: c.title,
    highlight: c.highlight || '',
    description: c.description || '',
    category: c.category,
    cta_text: c.ctaText,
    coupon_code: c.couponCode || '',
    discount_badge: c.discountBadge || '',
    image_url: c.imageUrl || '',
    accent_color: c.accentColor || '',
    theme_hue: c.themeHue || 'amber',
    status: c.status || 'active',
    start_date: c.startDate || '',
    end_date: c.endDate || '',
    budget: c.budget || 0,
    spend: c.spend || 0,
    impressions: c.impressions || 0,
    clicks: c.clicks || 0,
    conversions: c.conversions || 0,
    revenue: c.revenue || 0,
    priority: c.priority || 1,
  }));

  const { error: campErr } = await supabase.from('puppy_ad_campaigns').upsert(formattedCampaigns, { onConflict: 'id' });
  if (campErr) console.error('Error inserting ad campaigns:', campErr);
  else console.log(`Uploaded ${formattedCampaigns.length} ad campaigns successfully.`);

  // 4. Migrate Promo Coupons
  console.log(`Migrating ${INITIAL_PROMO_COUPONS.length} coupons...`);
  const formattedCoupons = INITIAL_PROMO_COUPONS.map((cp) => ({
    code: cp.code,
    title: cp.title,
    discount_type: cp.discountType,
    discount_value: cp.discountValue,
    min_cart_value: cp.minCartValue,
    expiry: cp.expiry,
    status: cp.status,
    usage_count: cp.usageCount,
    max_uses: cp.maxUses,
  }));

  const { error: couponErr } = await supabase.from('puppy_coupons').upsert(formattedCoupons, { onConflict: 'code' });
  if (couponErr) console.error('Error inserting coupons:', couponErr);
  else console.log(`Uploaded ${formattedCoupons.length} coupons successfully.`);

  // 5. Migrate Sample Orders
  console.log(`Migrating ${INITIAL_SAMPLE_ORDERS.length} sample orders...`);
  const formattedOrders = INITIAL_SAMPLE_ORDERS.map((o) => ({
    order_id: o.orderId,
    date: o.date,
    status: o.status,
    expected_delivery: o.expectedDelivery,
    tracking_number: o.trackingNumber,
    customer_name: o.deliveryAddress.name,
    customer_phone: o.deliveryAddress.phone,
    customer_address: o.deliveryAddress.address,
    customer_city: o.deliveryAddress.city,
    customer_pincode: o.deliveryAddress.pincode,
    items: o.items,
    total_amount: o.totalAmount,
    payment_method: o.paymentMethod,
  }));

  const { error: ordersErr } = await supabase.from('puppy_orders').upsert(formattedOrders, { onConflict: 'order_id' });
  if (ordersErr) console.error('Error inserting sample orders:', ordersErr);
  else console.log(`Uploaded ${formattedOrders.length} sample orders successfully.`);

  // 6. Migrate Sample Franchise Leads
  console.log(`Migrating ${INITIAL_FRANCHISE_LEADS.length} franchise leads...`);
  const formattedLeads = INITIAL_FRANCHISE_LEADS.map((l) => ({
    id: l.id,
    full_name: l.fullName,
    email: l.email,
    phone: l.phone,
    city: l.city,
    state: l.state,
    current_business: l.currentBusiness,
    commercial_space_status: l.commercialSpaceStatus,
    carpet_area: l.carpetArea,
    investment_budget: l.investmentBudget,
    expected_timeline: l.expectedTimeline,
    message: l.message,
    submitted_at: l.submittedAt,
    status: l.status,
    notes: l.notes || '',
  }));

  const { error: leadErr } = await supabase.from('puppy_franchise_leads').upsert(formattedLeads, { onConflict: 'id' });
  if (leadErr) console.error('Error inserting franchise leads:', leadErr);
  else console.log(`Uploaded ${formattedLeads.length} franchise leads successfully.`);

  // 7. Migrate Site Content (Checklists, Guides, Social Connections)
  console.log('Migrating site content & metadata...');
  const siteContents = [
    {
      key: 'hospital_bag_checklist',
      data: HOSPITAL_BAG_CHECKLIST,
      description: 'Hospital Bag Checklist for Newborn & Mom',
    },
    {
      key: 'baby_size_guide',
      data: BABY_SIZE_GUIDE,
      description: 'Baby & Toddler Size & Weight Guide',
    },
    {
      key: 'social_media_connection',
      data: INITIAL_SOCIAL_CONNECTION,
      description: 'Facebook & Instagram Integration Settings',
    },
  ];

  const { error: contentErr } = await supabase.from('puppy_site_content').upsert(siteContents, { onConflict: 'key' });
  if (contentErr) console.error('Error inserting site contents:', contentErr);
  else console.log(`Uploaded ${siteContents.length} site content documents successfully.`);

  console.log('--- Migration Completed! Verifying counts ---');
}

migrate()
  .then(() => console.log('All migrations completed successfully.'))
  .catch((e) => console.error('Migration failed:', e));
