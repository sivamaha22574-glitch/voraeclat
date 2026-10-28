import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  Landmark,
  Truck,
  Package,
  Calendar,
  Lock,
  Zap,
  FileText,
} from 'lucide-react';
import { CartItem, CustomerUser, CustomerOrder } from '../types';
import { submitPuppyCheckoutOrder } from '../lib/supabase';
import { TaxInvoiceModal } from './TaxInvoiceModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string;
  couponDiscount: number;
  isClubMember: boolean;
  deliveryPincode: string;
  onClearCart: () => void;
  customer?: CustomerUser | null;
  onOrderPlaced?: (newOrder: CustomerOrder) => void;
  onOpenOrderHistory?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  couponDiscount,
  isClubMember,
  deliveryPincode,
  onClearCart,
  customer = null,
  onOrderPlaced,
  onOpenOrderHistory,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('Expected delivery in 2-3 days');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Form State with user or sensible defaults
  const [fullName, setFullName] = useState(customer?.name || 'Customer');
  const [phone, setPhone] = useState(customer?.mobile ? customer.mobile.replace('+91 ', '') : '9876543210');
  const [email, setEmail] = useState(customer?.email || 'customer@voraeclat.com');
  const [address, setAddress] = useState(customer?.address || '102, Green Park Avenue');
  const [city, setCity] = useState(customer?.city || 'Mumbai');
  const [pincode, setPincode] = useState(deliveryPincode || customer?.pincode || '400001');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExp, setCardExp] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('742');

  useEffect(() => {
    if (customer) {
      if (customer.name) setFullName(customer.name);
      if (customer.mobile) setPhone(customer.mobile.replace('+91 ', ''));
      if (customer.email) setEmail(customer.email);
      if (customer.address) setAddress(customer.address);
      if (customer.city) setCity(customer.city);
      if (customer.pincode) setPincode(customer.pincode);
    }
  }, [customer]);

  if (!isOpen) return null;

  const rawTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const clubSavings = isClubMember
    ? items.reduce((sum, item) => sum + (item.product.price - item.product.clubPrice) * item.quantity, 0)
    : 0;
  const shippingFee = deliverySpeed === 'express' ? 99 : rawTotal >= 499 || isClubMember ? 0 : 49;
  const finalTotal = Math.max(0, rawTotal - clubSavings - couponDiscount + shippingFee);

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setSubmitError('Please provide your Full Name, Mobile Number, Delivery Address, City, and Pincode.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const generatedOrder = 'VOR-' + Math.floor(100000 + Math.random() * 900000);
    const orderItems = items.length > 0
      ? items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          imageUrl: i.product.imageUrl,
          price: isClubMember ? i.product.clubPrice : i.product.price,
          quantity: i.quantity,
          size: i.selectedSize,
          color: i.selectedColor?.name,
        }))
      : [
          {
            productId: 'PRD-DEFAULT',
            productName: 'Premium Baby Organic Apparel',
            imageUrl: '/voraeclat-mark.png',
            price: finalTotal || 499,
            quantity: 1,
            size: 'Standard',
            color: 'Pastel',
          },
        ];

    const paymentMethodLabel =
      paymentMethod === 'upi'
        ? 'UPI (Google Pay / PhonePe)'
        : paymentMethod === 'card'
        ? 'Credit/Debit Card'
        : paymentMethod === 'netbanking'
        ? `${selectedBank} NetBanking`
        : 'Cash on Delivery (COD)';

    try {
      const response = await submitPuppyCheckoutOrder({
        orderId: generatedOrder,
        customerName: fullName.trim(),
        customerPhone: phone.startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
        customerEmail: email.trim(),
        customerAddress: address.trim(),
        customerCity: city.trim(),
        customerPincode: pincode.trim(),
        items: orderItems,
        totalAmount: finalTotal || 499,
        paymentMethod: paymentMethodLabel,
        couponCode: appliedCoupon || undefined,
        expectedDelivery:
          deliverySpeed === 'express' ? 'Tomorrow by 2:00 PM (Express)' : 'Expected delivery in 2-3 days',
      });

      const confirmedId = response.orderId || generatedOrder;
      const tracking = response.trackingNumber || `DELHIVERY-${confirmedId}IN`;
      const expected =
        response.expectedDelivery ||
        (deliverySpeed === 'express' ? 'Tomorrow by 2:00 PM (Express)' : 'Expected delivery in 2-3 days');

      setOrderNumber(confirmedId);
      setTrackingNumber(tracking);
      setExpectedDeliveryDate(expected);

      const placedOrder: CustomerOrder = {
        orderId: confirmedId,
        date:
          response.date ||
          new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        status: 'Confirmed',
        expectedDelivery: expected,
        trackingNumber: tracking,
        deliveryAddress: {
          name: fullName,
          phone,
          address,
          city,
          pincode,
        },
        items: orderItems,
        totalAmount: finalTotal || 499,
        paymentMethod: paymentMethodLabel,
      };

      setLastPlacedOrder(placedOrder);
      if (onOrderPlaced) {
        onOrderPlaced(placedOrder);
      }

      setIsConfirmed(true);
      onClearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setSubmitError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {isConfirmed ? 'Order Confirmed!' : 'Voraeclat Instant Checkout'}
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Secured &bull; Real-time Database Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
          {!isConfirmed ? (
            <div className="space-y-5">
              {/* ======================================================== */}
              {/* 1. PAYMENT MODES (FRONT & CENTER - DIRECTLY PROMINENT) */}
              {/* ======================================================== */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Choose Payment Mode</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    COD &amp; Online Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-white text-emerald-950 ring-2 ring-emerald-500 font-black shadow-md'
                        : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <div className="text-xs font-black">Cash on Delivery</div>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Pay at Doorstep</span>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-white text-slate-950 ring-2 ring-amber-500 font-black shadow-md'
                        : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="text-sm font-extrabold text-amber-700 mb-0.5">UPI</div>
                    <div className="text-xs font-black">GPay / PhonePe</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Paytm / QR</span>
                  </button>

                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-white text-slate-950 ring-2 ring-amber-500 font-black shadow-md'
                        : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-slate-800" />
                    <div className="text-xs font-black">Cards / RuPay</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Credit / Debit</span>
                  </button>

                  {/* NetBanking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-500 bg-white text-slate-950 ring-2 ring-amber-500 font-black shadow-md'
                        : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mx-auto mb-1 text-indigo-700" />
                    <div className="text-xs font-black">NetBanking</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">All Indian Banks</span>
                  </button>
                </div>

                {/* Sub-panels for selected payment method */}
                {paymentMethod === 'cod' && (
                  <div className="p-3 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold block">✓ Cash on Delivery Active</span>
                      <span className="text-[11px] text-emerald-700">Pay safely with cash or UPI QR code directly upon doorstep delivery.</span>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md shrink-0">₹0 Fee</span>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <label className="block text-[11px] font-bold text-slate-700">UPI ID / Virtual Payment Address</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobile@upi or id@okhdfcbank"
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono outline-hidden focus:bg-white focus:border-amber-500"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-lg cursor-pointer"
                      >
                        Verified ✓
                      </button>
                    </div>
                    <div className="flex gap-2 pt-1 text-[10px] text-slate-500 font-medium">
                      <span className="px-2 py-0.5 bg-slate-50 rounded border border-slate-200">Google Pay</span>
                      <span className="px-2 py-0.5 bg-slate-50 rounded border border-slate-200">PhonePe</span>
                      <span className="px-2 py-0.5 bg-slate-50 rounded border border-slate-200">Paytm</span>
                      <span className="px-2 py-0.5 bg-slate-50 rounded border border-slate-200">BHIM UPI</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number (Visa / Mastercard / RuPay)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono outline-hidden focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <label className="block text-[11px] font-bold text-slate-700">Choose Your Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold outline-hidden focus:bg-white focus:border-amber-500 cursor-pointer"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* 2. SHIPPING & DELIVERY ADDRESS */}
              {/* ======================================================== */}
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <span>Delivery Address &amp; Contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Parent Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Street Address / Flat / Building <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Flat/House No., Street name, Area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Speed Option */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    deliverySpeed === 'standard'
                      ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">Standard Delivery</div>
                    <div className="text-[10px] text-slate-500">2-3 business days</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">FREE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliverySpeed('express')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    deliverySpeed === 'express'
                      ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">Express Delivery</div>
                    <div className="text-[10px] text-slate-500">Tomorrow Guaranteed</div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-mono">₹99</span>
                </button>
              </div>

              {/* Order Summary Strip */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Mode:</span>
                  <strong className="text-slate-900">
                    {paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : paymentMethod === 'upi'
                      ? 'UPI (GPay / PhonePe)'
                      : paymentMethod === 'card'
                      ? 'Credit / Debit Card'
                      : `NetBanking (${selectedBank})`}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Destination:</span>
                  <span className="text-slate-900 font-medium truncate max-w-[260px]">
                    {address}, {city} ({pincode})
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount Payable:</span>
                  <span className="font-mono text-base text-amber-700">₹{(finalTotal || 499).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                  {submitError}
                </div>
              )}

              {/* Instant Submit Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-950 font-black rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order &amp; Updating MongoDB Atlas...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>
                      Place Order via{' '}
                      {paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD)'
                        : paymentMethod === 'upi'
                        ? 'UPI'
                        : paymentMethod === 'card'
                        ? 'Card'
                        : 'NetBanking'}{' '}
                      &bull; ₹{(finalTotal || 499).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Order Confirmed Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed &bull; MongoDB Atlas Synced
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-2">Thank you, {fullName}!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <strong className="font-mono text-slate-900 font-bold">{orderNumber}</strong>
                </p>
                {trackingNumber && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1 border border-amber-200 font-mono font-bold">
                    Courier AWB: {trackingNumber}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="font-bold text-slate-900">Shipment Status &amp; Tracking</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Order Confirmed &amp; Logged in Cloud</div>
                      <div className="text-[10px] text-slate-500">Auto-synced into MongoDB Atlas and Supabase</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-bold">
                      <Package className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Packing &amp; Quality Check</div>
                      <div className="text-[10px] text-slate-500">Sanitized packaging at Voraeclat baby hub</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                      <Truck className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">Out for Delivery</div>
                      <div className="text-[10px] text-slate-500">Delivery to {pincode} via {trackingNumber || 'Delhivery Express'}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Estimated Arrival:
                  </span>
                  <strong className="text-slate-800">{expectedDeliveryDate}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>View &amp; Print Tax Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
                {onOpenOrderHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOrderHistory();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-4 h-4" />
                    <span>View in My Orders History</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={lastPlacedOrder}
      />
    </div>
  );
};
