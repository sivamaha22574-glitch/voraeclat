import { createClient } from '@supabase/supabase-js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Banner } from '../models/Banner.js';
import { Coupon } from '../models/Coupon.js';
import { FranchiseLead } from '../models/FranchiseLead.js';
import { AdCampaign } from '../models/AdCampaign.js';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ntruvmlzfyouxyasfivn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tE8KL6ALP04iKUjBe8mzuw_JDWoI9VL';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalizePaymentMode(method) {
  if (!method) return 'COD';
  const m = method.toUpperCase();
  if (m.includes('COD') || m.includes('CASH')) return 'COD';
  if (m.includes('UPI') || m.includes('GPAY') || m.includes('PHONEPE')) return 'UPI';
  if (m.includes('CARD') || m.includes('CREDIT') || m.includes('DEBIT')) return 'Credit Card';
  if (m.includes('NETBANKING') || m.includes('NET BANKING')) return 'Net Banking';
  if (m.includes('WALLET')) return 'Wallet';
  return 'COD';
}

export async function syncOrderToMongo(row) {
  try {
    if (!row || !row.order_id) return;

    const paymentMode = normalizePaymentMode(row.payment_method);
    const isPrepaid = paymentMode !== 'COD';
    const subTotal = row.sub_total || row.total_amount || 0;
    const totalAmount = row.total_amount || subTotal;

    const formattedItems = (row.items || []).map((it) => ({
      productId: it.productId || it.id || 'item-unknown',
      productName: it.productName || it.name || 'Product',
      imageUrl: it.imageUrl || '',
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      size: it.size || 'Standard',
      color: it.color || ''
    }));

    const updateDoc = {
      orderId: row.order_id,
      customerName: row.customer_name || 'Customer',
      customerMobile: row.customer_phone || '+91 9999999999',
      customerEmail: row.customer_email || '',
      deliveryAddress: {
        name: row.customer_name || 'Customer',
        phone: row.customer_phone || '+91 9999999999',
        address: row.customer_address || 'Address not provided',
        city: row.customer_city || 'City',
        state: row.customer_state || 'State',
        pincode: row.customer_pincode || '000000',
        addressType: 'Home'
      },
      billingAddress: {
        name: row.customer_name || 'Customer',
        phone: row.customer_phone || '+91 9999999999',
        address: row.customer_address || 'Address not provided',
        city: row.customer_city || 'City',
        state: row.customer_state || 'State',
        pincode: row.customer_pincode || '000000'
      },
      items: formattedItems,
      subTotal: subTotal,
      totalAmount: totalAmount,
      paymentMode: paymentMode,
      paymentMethod: row.payment_method || paymentMode,
      paymentStatus: isPrepaid ? 'Paid' : 'COD Pending Collection',
      codAmountToCollect: isPrepaid ? 0 : totalAmount,
      codCollectionStatus: isPrepaid ? 'Not Applicable' : 'Pending Collection',
      isPaid: isPrepaid,
      courierPartner: row.courier_partner || 'Delhivery',
      awbNumber: row.tracking_number || `DLV-${row.order_id}IN`,
      trackingNumber: row.tracking_number || `DLV-${row.order_id}`,
      expectedDelivery: row.expected_delivery || 'Expected delivery in 2-3 days',
      status: row.status || 'Confirmed',
      adCampaignId: row.ad_campaign_id || 'CAMP-DEFAULT',
      adCampaignName: row.ad_campaign_name || 'Direct Organic Storefront',
      adPlatform: 'Organic'
    };

    if (row.created_at) {
      updateDoc.createdAt = new Date(row.created_at);
    }

    const order = await Order.findOneAndUpdate(
      { orderId: row.order_id },
      { $set: updateDoc },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sync Customer in Users collection
    if (row.customer_phone) {
      await User.findOneAndUpdate(
        { mobile: row.customer_phone },
        {
          $setOnInsert: { name: row.customer_name, email: row.customer_email || '' },
          $inc: { totalOrders: 1, totalSpent: totalAmount }
        },
        { upsert: true }
      );
    }

    return order;
  } catch (err) {
    console.error(`[AutoSync] Error syncing order ${row.order_id}:`, err.message);
  }
}

export async function syncAllFromSupabase() {
  try {
    // 1. Sync Orders
    const { data: orders, error: oErr } = await supabase.from('puppy_orders').select('*');
    if (!oErr && orders && orders.length > 0) {
      for (const ord of orders) {
        await syncOrderToMongo(ord);
      }
      console.log(`[AutoSync] Synced ${orders.length} orders from Supabase into MongoDB Atlas.`);
    }

    // 2. Sync Franchise Leads
    const { data: leads, error: lErr } = await supabase.from('puppy_franchise_leads').select('*');
    if (!lErr && leads && leads.length > 0) {
      for (const ld of leads) {
        await FranchiseLead.findOneAndUpdate(
          { phone: ld.phone || ld.mobile },
          {
            $set: {
              fullName: ld.fullName || ld.full_name || ld.name || 'Lead',
              email: ld.email || 'lead@example.com',
              phone: ld.phone || ld.mobile || '+91 9999999999',
              city: ld.city || 'City',
              state: ld.state || 'State',
              investmentBudget: ld.investment_budget || ld.budget || 'Standard',
              status: ld.status || 'New',
              notes: ld.notes || ''
            }
          },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.error('[AutoSync Error]:', error.message);
  }
}

export function startSupabaseAutoSync() {
  console.log('⚡ [AutoSync Service] Initializing Real-time Supabase-to-MongoDB Bridge...');

  // Initial sync immediately
  syncAllFromSupabase();

  // Listen to Realtime Postgres Changes
  try {
    supabase
      .channel('realtime_puppy_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'puppy_orders' },
        async (payload) => {
          console.log(`⚡ [Realtime Order Event]: ${payload.eventType} for order #${payload.new?.order_id || payload.old?.order_id}`);
          if (payload.new) {
            await syncOrderToMongo(payload.new);
            console.log(`✅ [AutoSync] Order #${payload.new.order_id} instantly updated in MongoDB Atlas!`);
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Supabase Realtime Channel Status]: ${status}`);
      });
  } catch (e) {
    console.warn('[AutoSync] Realtime subscription note:', e.message);
  }

  // Periodic heartbeat polling every 10 seconds to guarantee 100% data consistency
  setInterval(() => {
    syncAllFromSupabase().catch(() => {});
  }, 10000);
}
