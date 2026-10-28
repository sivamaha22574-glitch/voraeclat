import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Printer,
  CreditCard,
  Banknote,
  Send,
  UserCheck,
  Megaphone,
  RotateCcw
} from 'lucide-react';
import { CustomerOrder, OrderStatus, CourierPartner, PaymentMode, DeliveryPendingReason } from '../../types';
import { updatePuppyOrderStatusInSupabase } from '../../lib/supabase';

interface OrdersManagerTabProps {
  orders: CustomerOrder[];
  onUpdateOrders: (updated: CustomerOrder[]) => void;
  onNotify: (msg: string) => void;
}

const COURIER_OPTIONS: CourierPartner[] = [
  'Delhivery',
  'BlueDart Express',
  'DTDC',
  'XpressBees',
  'Shadowfax',
  'Ekart Logistics',
  'Self Delivery / Local Courier'
];

const PENDING_REASONS: DeliveryPendingReason[] = [
  'Customer Unavailable',
  'Incomplete Address / Wrong Address',
  'Customer Requested Reschedule',
  'Door / Gate Locked',
  'Cash Not Ready',
  'Customer Phone Unreachable',
  'Bad Weather / Area Restriction',
  'Entry Restricted by Society / Security',
  'Other'
];

export const OrdersManagerTab: React.FC<OrdersManagerTabProps> = ({
  orders,
  onUpdateOrders,
  onNotify,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCourier, setFilterCourier] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Status Change Dialog or Immediate Update
  const handleStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    pendingReason?: string,
    agentName?: string,
    agentPhone?: string
  ) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status: newStatus,
          deliveryPendingReason: newStatus === 'Delivery Pending' ? (pendingReason || 'Customer Unavailable') : o.deliveryPendingReason,
          deliveryAgentName: newStatus === 'Out for Delivery' ? (agentName || o.deliveryAgentName || 'Ramesh Kumar') : o.deliveryAgentName,
          deliveryAgentPhone: newStatus === 'Out for Delivery' ? (agentPhone || o.deliveryAgentPhone || '+91 98765 43210') : o.deliveryAgentPhone,
          outForDeliveryAt: newStatus === 'Out for Delivery' ? new Date().toISOString() : o.outForDeliveryAt,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    try {
      localStorage.setItem('puppy_shame_customer_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync to MongoDB & Supabase
    updatePuppyOrderStatusInSupabase(orderId, newStatus, {
      deliveryPendingReason: pendingReason,
      deliveryAgentName: agentName,
      deliveryAgentPhone: agentPhone
    }).catch(console.warn);

    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        deliveryPendingReason: pendingReason || selectedOrder.deliveryPendingReason
      });
    }

    onNotify(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleCourierChange = (orderId: string, courier: CourierPartner) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        return { ...o, courierPartner: courier };
      }
      return o;
    });
    onUpdateOrders(updated);
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierPartner: courier })
    }).catch(console.warn);

    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, courierPartner: courier });
    }
    onNotify(`Courier for #${orderId} updated to ${courier}`);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (filterCourier !== 'all' && o.courierPartner !== filterCourier) return false;
    if (filterPayment !== 'all') {
      const mode = (o.paymentMode || o.paymentMethod || '').toUpperCase();
      if (filterPayment === 'COD' && !mode.includes('COD')) return false;
      if (filterPayment === 'PREPAID' && mode.includes('COD')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q)) ||
        o.deliveryAddress.name.toLowerCase().includes(q) ||
        o.deliveryAddress.phone.includes(q) ||
        o.deliveryAddress.city.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
        (o.awbNumber && o.awbNumber.toLowerCase().includes(q)) ||
        (o.courierPartner && o.courierPartner.toLowerCase().includes(q)) ||
        (o.adCampaignName && o.adCampaignName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Out for Delivery':
        return 'bg-amber-500/10 text-amber-700 border-amber-300 font-black';
      case 'Delivery Pending':
        return 'bg-orange-500/10 text-orange-700 border-orange-300 font-black';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold';
      case 'Shipped':
      case 'In Transit':
      case 'Dispatched':
        return 'bg-blue-500/10 text-blue-700 border-blue-300 font-bold';
      case 'Cancelled':
      case 'Returned':
        return 'bg-rose-500/10 text-rose-700 border-rose-300 font-bold';
      default:
        return 'bg-purple-500/10 text-purple-700 border-purple-300 font-bold';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Customer Orders & Logistics</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              MongoDB Atlas Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fulfillment tracking, carrier dispatch (Delhivery, BlueDart), doorstep delivery telemetry (Out for Delivery & Delivery Pending), and Ad campaign attribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Filtered Orders</div>
            <div className="text-lg font-black text-slate-900">{filteredOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Row 1: Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            'all',
            'Confirmed',
            'Dispatched',
            'In Transit',
            'Out for Delivery',
            'Delivery Pending',
            'Delivered',
            'Cancelled'
          ].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? st === 'Out for Delivery'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : st === 'Delivery Pending'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        {/* Row 2: Courier, Payment Mode, and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Courier Filter */}
            <select
              value={filterCourier}
              onChange={(e) => setFilterCourier(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Couriers</option>
              <option value="Delhivery">Delhivery</option>
              <option value="BlueDart Express">BlueDart Express</option>
              <option value="Shadowfax">Shadowfax</option>
              <option value="XpressBees">XpressBees</option>
              <option value="DTDC">DTDC</option>
            </select>

            {/* Payment Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Payment Modes</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="PREPAID">Prepaid (UPI / Card / Net Banking)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, AWB, customer, city, ad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order & Invoice</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Courier & AWB</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Ad Attribution</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const isCod = (order.paymentMode || order.paymentMethod || '').toUpperCase().includes('COD');
                return (
                  <tr
                    key={order.orderId}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order ID & Invoice */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-slate-900">{order.orderId}</div>
                      {order.invoiceNumber && (
                        <div className="text-[10px] font-mono text-slate-500">{order.invoiceNumber}</div>
                      )}
                      <div className="text-[10px] text-slate-400">{order.date}</div>
                    </td>

                    {/* Customer & City */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{order.deliveryAddress.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.deliveryAddress.city} ({order.deliveryAddress.pincode})
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{order.deliveryAddress.phone}</div>
                    </td>

                    {/* Courier & AWB */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-indigo-500" />
                        <span>{order.courierPartner || 'Delhivery'}</span>
                      </div>
                      <div className="font-mono text-[10px] text-indigo-600 font-semibold">
                        {order.awbNumber || order.trackingNumber || 'Pending AWB'}
                      </div>
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCod
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isCod ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        {order.paymentMode || order.paymentMethod || 'COD'}
                      </span>
                    </td>

                    {/* Ad Attribution */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 max-w-[170px] truncate">
                        <Megaphone className="w-3 h-3 shrink-0" />
                        <span className="truncate">{order.adCampaignName || order.adPlatform || 'Organic'}</span>
                      </div>
                    </td>

                    {/* Status & Update */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const val = e.target.value as OrderStatus;
                          if (val === 'Delivery Pending') {
                            const reason = prompt('Select or enter Delivery Pending Reason:\n1. Customer Unavailable\n2. Incomplete Address\n3. Customer Requested Reschedule\n4. Door Locked\n5. Cash Not Ready', 'Customer Unavailable');
                            handleStatusChange(order.orderId, val, reason || 'Customer Unavailable');
                          } else if (val === 'Out for Delivery') {
                            const agent = prompt('Enter Delivery Agent Name:', order.deliveryAgentName || 'Ramesh Kumar');
                            const phone = prompt('Enter Agent Phone:', order.deliveryAgentPhone || '+91 98765 43210');
                            handleStatusChange(order.orderId, val, undefined, agent || undefined, phone || undefined);
                          } else {
                            handleStatusChange(order.orderId, val);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${getStatusBadgeStyle(order.status)}`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">⚡ Out for Delivery</option>
                        <option value="Delivery Pending">⏳ Delivery Pending</option>
                        <option value="Delivered">✅ Delivered</option>
                        <option value="Cancelled">❌ Cancelled</option>
                        <option value="Returned">↩️ Returned</option>
                      </select>

                      {/* Out for delivery telemetry */}
                      {order.status === 'Out for Delivery' && order.deliveryAgentName && (
                        <div className="text-[10px] text-amber-800 font-semibold mt-1 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>{order.deliveryAgentName}</span>
                          {order.deliveryOtp && <span className="font-mono bg-amber-100 px-1 rounded">OTP: {order.deliveryOtp}</span>}
                        </div>
                      )}

                      {/* Delivery pending reason */}
                      {order.status === 'Delivery Pending' && order.deliveryPendingReason && (
                        <div className="text-[10px] text-orange-800 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{order.deliveryPendingReason}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ORDER BILLING & DISPATCH</span>
                  {selectedOrder.invoiceNumber && (
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {selectedOrder.invoiceNumber}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedOrder.orderId}</h3>
                <div className="text-xs text-slate-400">{selectedOrder.date}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Courier & Doorstep Delivery Status Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-sm">Courier Partner:</span>
                  <select
                    value={selectedOrder.courierPartner || 'Delhivery'}
                    onChange={(e) => handleCourierChange(selectedOrder.orderId, e.target.value as CourierPartner)}
                    className="font-bold text-indigo-700 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="font-mono text-xs font-bold text-indigo-700">
                  AWB: {selectedOrder.awbNumber || selectedOrder.trackingNumber || 'Pending Generation'}
                </div>
              </div>

              {/* Status Specific Highlights */}
              {selectedOrder.status === 'Out for Delivery' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-900 space-y-1">
                  <div className="font-black text-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span>OUT FOR DELIVERY (Doorstep Handover in Progress)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>Agent Name: <strong className="font-bold">{selectedOrder.deliveryAgentName || 'Ramesh Kumar'}</strong></div>
                    <div>Agent Mobile: <strong className="font-mono font-bold">{selectedOrder.deliveryAgentPhone || '+91 98765 43210'}</strong></div>
                    {selectedOrder.deliveryOtp && (
                      <div>Customer Secure OTP: <strong className="font-mono font-black text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded">{selectedOrder.deliveryOtp}</strong></div>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.status === 'Delivery Pending' && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-300 text-orange-900 space-y-1">
                  <div className="font-black text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-orange-700" />
                    <span>DELIVERY PENDING (Doorstep Attempt Logged)</span>
                  </div>
                  <div className="text-[11px] pt-1">
                    Pending Reason: <strong className="font-bold">{selectedOrder.deliveryPendingReason || 'Customer Unavailable'}</strong>
                  </div>
                  {selectedOrder.rescheduledDeliveryDate && (
                    <div className="text-[11px]">
                      Rescheduled Date: <strong className="font-bold">{new Date(selectedOrder.rescheduledDeliveryDate).toLocaleDateString('en-IN')}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Payment & Ad Attribution Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="font-bold text-slate-500 text-[10px] uppercase">Payment Mode & Status</span>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mt-0.5">
                    <span>{selectedOrder.paymentMode || selectedOrder.paymentMethod || 'COD'}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                      {selectedOrder.paymentStatus || (selectedOrder.paymentMode === 'COD' ? 'Pending Collection' : 'Paid')}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 text-[10px] uppercase">Ad Campaign Attribution</span>
                  <div className="font-bold text-indigo-700 text-xs flex items-center gap-1 mt-0.5">
                    <Megaphone className="w-3 h-3 text-indigo-500" />
                    <span>{selectedOrder.adCampaignName || selectedOrder.adPlatform || 'Organic Direct'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Shipping & Billing Details */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-500">
                Customer & Delivery Address
              </h4>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900">{selectedOrder.deliveryAddress.name}</div>
                <div className="text-slate-600">{selectedOrder.deliveryAddress.address}</div>
                <div className="text-slate-600">
                  {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                </div>
                <div className="text-slate-600 font-mono pt-1">Phone: {selectedOrder.deliveryAddress.phone}</div>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-500">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-800 line-clamp-1">{item.productName}</div>
                        <div className="text-[11px] text-slate-400">
                          Size: {item.size} {item.color ? `• Color: ${item.color}` : ''} &bull; Qty:{' '}
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Footer & Packing Slip Print */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Order Grand Total</span>
                <div className="text-2xl font-black text-slate-900">
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice / Packing Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
