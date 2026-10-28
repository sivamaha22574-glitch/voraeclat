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
} from 'lucide-react';
import { CustomerOrder, OrderStatus } from '../../types';
import { updatePuppyOrderStatusInSupabase } from '../../lib/supabase';

interface OrdersManagerTabProps {
  orders: CustomerOrder[];
  onUpdateOrders: (updated: CustomerOrder[]) => void;
  onNotify: (msg: string) => void;
}

export const OrdersManagerTab: React.FC<OrdersManagerTabProps> = ({
  orders,
  onUpdateOrders,
  onNotify,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
    try {
      localStorage.setItem('puppy_shame_customer_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }
    updatePuppyOrderStatusInSupabase(orderId, newStatus).catch(console.warn);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    onNotify(`Order #${orderId} marked as ${newStatus}`);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.deliveryAddress.name.toLowerCase().includes(q) ||
        o.deliveryAddress.phone.includes(q) ||
        o.deliveryAddress.city.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Orders & Logistics</h2>
          <p className="text-xs text-slate-500">
            Real-time fulfillment tracking, carrier dispatch statuses, and doorstep delivery telemetry from live Supabase database.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status & Update</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-black text-slate-900">{order.orderId}</div>
                    <div className="text-[11px] text-slate-400">{order.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{order.deliveryAddress.name}</div>
                    <div className="text-[11px] text-slate-500">{order.deliveryAddress.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium line-clamp-1 max-w-[200px]">
                      {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.items.length} unique products</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900 text-sm">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                  </td>

                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.status === 'Out for Delivery'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-purple-50 text-purple-900 border-purple-300'
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

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
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-amber-600">ORDER DETAILS</div>
                <h3 className="text-xl font-black text-slate-900">{selectedOrder.orderId}</h3>
                <div className="text-xs text-slate-400">{selectedOrder.date}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tracking Status Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Tracking Number:</span>
                <span className="font-mono font-bold text-indigo-700">{selectedOrder.trackingNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Expected Delivery:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.expectedDelivery}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Payment:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Customer Shipping Address */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-500">
                Delivery Address
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

            {/* Total Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Order Grand Total</span>
                <div className="text-xl font-black text-slate-900">
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
