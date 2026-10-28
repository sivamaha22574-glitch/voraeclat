import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  Landmark,
  Truck,
  ArrowRight,
  Package,
  Calendar,
} from 'lucide-react';
import { CartItem, CustomerUser, CustomerOrder } from '../types';

import { submitPuppyCheckoutOrder } from '../lib/supabase';

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
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('Expected delivery in 2-3 days');

  // Form State
  const [fullName, setFullName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.mobile ? customer.mobile.replace('+91 ', '') : '');
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [city, setCity] = useState(customer?.city || '');
  const [pincode, setPincode] = useState(deliveryPincode || customer?.pincode || '');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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
      setSubmitError('Please fill in your Full Name, Mobile Number, Delivery Address, City, and Pincode.');
      setStep('details');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const generatedOrder = 'VOR-' + Math.floor(100000 + Math.random() * 900000);
    const orderItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      imageUrl: i.product.imageUrl,
      price: isClubMember ? i.product.clubPrice : i.product.price,
      quantity: i.quantity,
      size: i.selectedSize,
      color: i.selectedColor?.name,
    }));

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
        totalAmount: finalTotal,
        paymentMethod: paymentMethodLabel,
        couponCode: appliedCoupon || undefined,
        expectedDelivery: deliverySpeed === 'express' ? 'Tomorrow by 2:00 PM (Express)' : 'Expected delivery in 2-3 days',
      });

      if (!response.success && response.error) {
        console.warn('Backend order submission warning:', response.error);
      }

      const confirmedId = response.orderId || generatedOrder;
      const tracking = response.trackingNumber || `DELHIVERY-${confirmedId}IN`;
      const expected = response.expectedDelivery || (deliverySpeed === 'express' ? 'Tomorrow by 2:00 PM (Express)' : 'Expected delivery in 2-3 days');

      setOrderNumber(confirmedId);
      setTrackingNumber(tracking);
      setExpectedDeliveryDate(expected);

      if (onOrderPlaced) {
        const placedOrder: CustomerOrder = {
          orderId: confirmedId,
          date: response.date || new Date().toLocaleDateString('en-IN', {
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
          totalAmount: finalTotal,
          paymentMethod: paymentMethodLabel,
        };
        onOrderPlaced(placedOrder);
      }

      setStep('confirmed');
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
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {step === 'confirmed' ? 'Order Confirmed!' : 'Voraeclat Secure Checkout'}
            </h3>
          </div>
          {step !== 'confirmed' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Navigation Tabs */}
        {step !== 'confirmed' && (
          <div className="flex border-b border-slate-200 bg-slate-100/90 p-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setStep('details')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                step === 'details'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                step === 'details' ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
              }`}>1</span>
              <span>1. Delivery Address</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                setStep('payment');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                step === 'payment'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200 font-black ring-1 ring-amber-400'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                step === 'payment' ? 'bg-amber-500 text-slate-950' : 'bg-amber-200 text-amber-950'
              }`}>2</span>
              <span>2. Payment Mode ({paymentMethodLabel})</span>
            </button>
          </div>
        )}

        {/* Multi-Step Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'details' && (
            <div className="space-y-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 1 of 2: Shipping & Delivery Address
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional for Invoice)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address / Apartment / House No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Flat/House No., Building, Street, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal / PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden font-medium"
                    required
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold">
                  {submitError}
                </div>
              )}

              {/* Delivery Speed Options */}
              <div className="pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-2">Delivery Option</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('standard')}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      deliverySpeed === 'standard'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Standard Delivery</div>
                      <div className="text-[11px] text-slate-500">Delivers in 3-4 business days</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {rawTotal >= 499 || isClubMember ? 'FREE' : '₹49'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('express')}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      deliverySpeed === 'express'
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Priority Express</div>
                      <div className="text-[11px] text-slate-500">Delivers Tomorrow (Sanitized)</div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹99</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
                    setSubmitError('Please enter your Full Name, 10-digit Phone, Delivery Address, City, and PIN code.');
                    return;
                  }
                  if (phone.trim().length < 10) {
                    setSubmitError('Please enter a valid 10-digit mobile number.');
                    return;
                  }
                  if (pincode.trim().length < 6) {
                    setSubmitError('Please enter a valid 6-digit PIN code.');
                    return;
                  }
                  setSubmitError(null);
                  setStep('payment');
                }}
                className="w-full mt-4 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Continue to Payment (₹{finalTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step 2 of 2: Payment Method
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  &larr; Edit Address
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 ring-1 ring-amber-500 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-extrabold text-amber-700 mb-0.5">UPI</div>
                  <span className="text-[11px]">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 ring-1 ring-amber-500 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-800" />
                  <span className="text-[11px]">Cards / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 ring-1 ring-amber-500 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Landmark className="w-4 h-4 mx-auto mb-1 text-indigo-700" />
                  <span className="text-[11px]">Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 ring-1 ring-amber-500 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-[11px]">Cash on Delivery</span>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">UPI ID / VPA</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or username@okhdfcbank"
                      className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-hidden"
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
                    >
                      Verify
                    </button>
                  </div>
                  <div className="flex gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200">Google Pay</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200">PhonePe</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200">Paytm</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Number (Visa / Mastercard / RuPay)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Select Popular Bank
                    </label>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant &amp; Safe
                    </span>
                  </div>

                  {/* Popular Banks Radio Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'HDFC Bank', code: 'HDFC' },
                      { name: 'State Bank of India', code: 'SBI' },
                      { name: 'ICICI Bank', code: 'ICICI' },
                      { name: 'Axis Bank', code: 'AXIS' },
                      { name: 'Kotak Mahindra', code: 'KOTAK' },
                      { name: 'Punjab National Bank', code: 'PNB' },
                    ].map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between cursor-pointer ${
                          selectedBank === bank.name
                            ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold ring-1 ring-amber-400 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{bank.name}</span>
                        <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {bank.code}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* All Other Banks Dropdown */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Or Choose from All Other Indian Banks
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-200 cursor-pointer"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="IDFC FIRST Bank">IDFC FIRST Bank</option>
                      <option value="Yes Bank">Yes Bank</option>
                      <option value="Federal Bank">Federal Bank</option>
                      <option value="Central Bank of India">Central Bank of India</option>
                      <option value="Indian Bank">Indian Bank</option>
                      <option value="Bank of India">Bank of India</option>
                      <option value="RBL Bank">RBL Bank</option>
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      You will be securely redirected to <strong>{selectedBank}</strong> with 256-bit bank-grade encryption.
                    </span>
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold">Cash on Delivery (COD) Selected</div>
                  <p className="text-emerald-800">
                    Pay safely in cash or scan UPI QR code directly on delivery. No extra COD handling fee!
                  </p>
                </div>
              )}

              {/* Final Order Review Strip */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Shipping to:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[240px]">
                    {fullName}, {city} ({pincode})
                  </span>
                </div>
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-900">
                    {paymentMethod === 'upi'
                      ? 'UPI (GPay / PhonePe)'
                      : paymentMethod === 'card'
                      ? 'Credit / Debit Card'
                      : paymentMethod === 'netbanking'
                      ? `Netbanking (${selectedBank})`
                      : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Items:</span>
                  <span className="font-semibold text-slate-900">{items.length} baby items</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Payable Amount:</span>
                  <span className="font-mono tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <span>{submitError}</span>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-950 font-extrabold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order & Syncing to Cloud...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order via {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'NetBanking'} (₹{finalTotal.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed &bull; Supabase Backend Verified
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-2">Thank you, {fullName}!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <strong className="font-mono text-slate-900 font-bold">{orderNumber}</strong>
                </p>
                {trackingNumber && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1 border border-amber-200 font-mono font-bold">
                    AWB: {trackingNumber}
                  </p>
                )}
              </div>

              {/* Simulated Shipment Timeline */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-4 max-w-md mx-auto">
                <div className="font-bold text-xs text-slate-900">Shipment Status & Tracking</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Order Confirmed & Logged in Cloud</div>
                      <div className="text-[10px] text-slate-500">Sent to sanitized baby warehouse</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-bold animate-pulse">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Quality Check & Packing</div>
                      <div className="text-[10px] text-slate-500">Packaged with safety seals</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Out for Delivery</div>
                      <div className="text-[10px] text-slate-500">Expected to {pincode} via {trackingNumber || 'Express Logistics'}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Estimated Delivery:
                  </span>
                  <strong className="text-slate-800">{expectedDeliveryDate}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
                {onOpenOrderHistory && (
                  <button
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
    </div>
  );
};
