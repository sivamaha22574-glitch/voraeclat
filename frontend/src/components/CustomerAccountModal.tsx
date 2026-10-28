import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  Download,
  RotateCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  Edit2,
} from 'lucide-react';
import { CustomerOrder, CustomerUser, OrderStatus } from '../types';
import { TaxInvoiceModal } from './TaxInvoiceModal';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser | null;
  orders: CustomerOrder[];
  onLogout: () => void;
  onUpdateCustomer: (updated: CustomerUser) => void;
  onReorder: (order: CustomerOrder) => void;
  onApplyCoupon?: (code: string) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  customer,
  orders,
  onLogout,
  onUpdateCustomer,
  onReorder,
  onApplyCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'offers'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<CustomerOrder | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CustomerOrder | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(customer?.name || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');
  const [editAddress, setEditAddress] = useState(customer?.address || '');
  const [editCity, setEditCity] = useState(customer?.city || '');
  const [editPincode, setEditPincode] = useState(customer?.pincode || '');

  useEffect(() => {
    if (customer) {
      setEditName(customer.name || '');
      setEditEmail(customer.email || '');
      setEditAddress(customer.address || '');
      setEditCity(customer.city || '');
      setEditPincode(customer.pincode || '');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (orderFilter === 'delivered') return o.status === 'Delivered';
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomerUser = {
      ...customer,
      name: editName.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      pincode: editPincode.trim(),
    };
    onUpdateCustomer(updated);
    setIsEditingProfile(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            Out for Delivery
          </span>
        );
      case 'Delivery Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            Delivery Pending
          </span>
        );
      case 'Shipped':
      case 'Dispatched':
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'Cancelled':
      case 'Returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Clock className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
    }
  };

  const getProgressWidth = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return '25%';
      case 'Packed':
        return '40%';
      case 'Dispatched':
      case 'Shipped':
      case 'In Transit':
        return '65%';
      case 'Delivery Pending':
        return '75%';
      case 'Out for Delivery':
        return '88%';
      case 'Delivered':
        return '100%';
      default:
        return '15%';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/20 shrink-0">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {customer.name || 'Valued Customer'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Account
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{customer.mobile}</span>
                {customer.email && (
                  <>
                    <span className="text-slate-500">•</span>
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>{customer.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
              title="Logout from Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-amber-500 text-slate-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>My Orders & History</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-amber-500 text-slate-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-slate-600" />
            <span>Profile & Addresses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'offers'
                ? 'border-amber-500 text-slate-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4 text-rose-500" />
            <span>My Coupons & 10% Discount</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              Active
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Filter Sub-nav */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {(['all', 'active', 'delivered'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setOrderFilter(filterKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                        orderFilter === filterKey
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filterKey === 'all'
                        ? `All (${orders.length})`
                        : filterKey === 'active'
                        ? 'Active / In Transit'
                        : 'Delivered'}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500">
                  Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} for <strong>{customer.mobile}</strong>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">No Orders in this filter</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You haven't placed any orders in this category yet. Explore our festive wear collection!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
                  >
                    {/* Order Top Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Order #{order.orderId}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Placed on: <span className="font-medium text-slate-700">{order.date}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs text-slate-400">Total Paid</div>
                        <div className="text-base font-black text-slate-900">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500">{order.paymentMethod}</div>
                      </div>
                    </div>

                    {/* Live Tracking Visual Progress Bar */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Truck className="w-4 h-4 text-amber-600" />
                          <span>{order.expectedDelivery}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          AWB: <strong className="text-slate-800">{order.trackingNumber}</strong>
                        </div>
                      </div>

                      {/* Step Progress Line */}
                      <div className="relative mt-3 mb-2">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: getProgressWidth(order.status) }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2">
                          <span className="text-emerald-700">✓ Order Placed</span>
                          <span className={order.status !== 'Confirmed' ? 'text-emerald-700' : 'text-slate-500'}>
                            ✓ Packed
                          </span>
                          <span className={order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'text-emerald-700' : 'text-slate-500'}>
                            {order.status === 'Shipped' ? '● Shipped' : '✓ Shipped'}
                          </span>
                          <span className={order.status === 'Out for Delivery' ? 'text-amber-700 font-extrabold' : order.status === 'Delivered' ? 'text-emerald-700' : 'text-slate-400'}>
                            {order.status === 'Out for Delivery' ? '● Out for Delivery' : 'Out for Delivery'}
                          </span>
                          <span className={order.status === 'Delivered' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}>
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                                {item.productName}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span>Size: <strong className="text-slate-700">{item.size}</strong></span>
                                {item.color && (
                                  <>
                                    <span>•</span>
                                    <span>Color: <strong className="text-slate-700">{item.color}</strong></span>
                                  </>
                                )}
                                <span>•</span>
                                <span>Qty: <strong className="text-slate-700">{item.quantity}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address & Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                      <div className="flex items-start gap-1.5 text-slate-600 max-w-md">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">
                          Deliver to: <strong className="text-slate-800">{order.deliveryAddress.name}</strong>, {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Invoice</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onReorder(order)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slate-950" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESSES */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Contact & Profile Information</h3>
                    <p className="text-xs text-slate-500">Your verified customer identity on Voraeclat</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden font-medium"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Primary Delivery Address</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City & State</label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={editPincode}
                          onChange={(e) => setEditPincode(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-300 outline-hidden font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Mobile Phone (Primary Key)</span>
                      <strong className="text-slate-900 text-sm font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {customer.mobile}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Customer Name</span>
                      <strong className="text-slate-900 text-sm font-bold">{customer.name || 'Not provided'}</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Email Notifications</span>
                      <strong className="text-slate-900 text-sm font-bold">{customer.email || 'Not provided'}</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5">Offers & WhatsApp Updates</span>
                      <strong className="text-emerald-700 text-sm font-bold">
                        {customer.notifyOffers ? 'Subscribed (10% OFF active)' : 'Unsubscribed'}
                      </strong>
                    </div>

                    <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block mb-0.5 font-semibold">Default Delivery Address</span>
                        <p className="text-slate-800 text-xs font-medium">
                          {customer.address}, {customer.city} - {customer.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS & 10% OFF WELCOME OFFER */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-5 text-slate-950 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-slate-950 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                    Member Welcome Bonus
                  </span>
                </div>
                <h3 className="text-xl font-black mt-2">Subscribe & Get 10% OFF Unlocked!</h3>
                <p className="text-xs text-slate-900 font-medium mt-1">
                  Thank you for subscribing with your Mail ID and mobile number. Apply your 10% welcome coupon on any festive or kids outfit today.
                </p>

                <div className="mt-4 flex items-center justify-between bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-amber-600/30">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Coupon Code</span>
                    <strong className="font-mono text-base font-black text-slate-950 tracking-wider">
                      WELCOME10
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('WELCOME10')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedCode === 'WELCOME10' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied & Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy & Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Other Active Coupons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="font-mono text-sm font-bold text-slate-900 block">PUPPYFIRST</strong>
                    <span className="text-xs text-slate-500">Flat ₹200 OFF on Orders above ₹999</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('PUPPYFIRST')}
                    className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer"
                  >
                    {copiedCode === 'PUPPYFIRST' ? 'Applied' : 'Apply'}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="font-mono text-sm font-bold text-slate-900 block">DIWALI2026</strong>
                    <span className="text-xs text-slate-500">Extra 15% OFF on Pure Silk Pattu Pavadai</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode('DIWALI2026')}
                    className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer"
                  >
                    {copiedCode === 'DIWALI2026' ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Tax Invoice Printable Modal */}
      <TaxInvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
};
