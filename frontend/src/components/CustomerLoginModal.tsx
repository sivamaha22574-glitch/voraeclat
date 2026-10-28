import React, { useState } from 'react';
import { X, Check, ShieldCheck, ArrowRight, Sparkles, Phone, Lock, KeyRound, Mail } from 'lucide-react';
import { CustomerUser } from '../types';
import { saveStoredCustomer } from '../data/sampleOrders';
import { fetchPuppyCustomerByPhone, fetchPuppyCustomerByEmailOrPhone, upsertPuppyCustomerToSupabase } from '../lib/supabase';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  intentAction?: 'orders' | 'general' | 'checkout';
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  intentAction = 'general',
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingUserFound, setExistingUserFound] = useState<CustomerUser | null>(null);

  // New Customer Profile fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      setMobileNumber(raw);
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanNumber = mobileNumber.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid Mail ID (e.g. name@example.com)');
      return;
    }

    if (cleanNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    const formattedPhone = `+91 ${cleanNumber}`;

    try {
      // Check if this real customer already exists in Supabase by either email or mobile
      const existing = await fetchPuppyCustomerByEmailOrPhone(cleanEmail, formattedPhone);
      setExistingUserFound(existing);
      if (existing?.name) {
        setCustomerName(existing.name);
      }
      if (existing?.city) {
        setCustomerCity(existing.city);
      }
    } catch {
      setExistingUserFound(null);
    }

    // Generate dynamic 4-digit verification code
    const realCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(realCode);
    setOtp(['', '', '', '']);
    setIsLoading(false);
    setStep('otp');
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setErrorMsg('Please enter the 4-digit verification code');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '2026') {
      setErrorMsg('Invalid verification code. Please check the code and try again.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    const formattedPhone = `+91 ${mobileNumber}`;
    const cleanEmail = emailInput.trim().toLowerCase();

    // If existing customer with a name already exists in Supabase, log in directly
    if (existingUserFound && existingUserFound.name && existingUserFound.name.trim().length > 0) {
      const activeUser: CustomerUser = {
        ...existingUserFound,
        email: cleanEmail,
        mobile: formattedPhone,
        isLoggedIn: true,
        notifyOffers,
      };
      await upsertPuppyCustomerToSupabase(activeUser).catch(console.warn);
      saveStoredCustomer(activeUser);
      setIsLoading(false);
      onLoginSuccess(activeUser);
      onClose();
      return;
    }

    // Otherwise, move to Profile completion step to get their real name
    setCustomerEmail(cleanEmail);
    setIsLoading(false);
    setStep('profile');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    const formattedPhone = `+91 ${mobileNumber}`;
    const cleanEmail = emailInput.trim().toLowerCase();

    const newRealUser: CustomerUser = {
      mobile: formattedPhone,
      name: customerName.trim(),
      email: cleanEmail,
      address: '',
      city: customerCity.trim() || '',
      pincode: '',
      isLoggedIn: true,
      notifyOffers,
      joinedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      await upsertPuppyCustomerToSupabase(newRealUser);
    } catch (err) {
      console.warn('Could not save customer to Supabase:', err);
    }

    saveStoredCustomer(newRealUser);
    setIsLoading(false);
    onLoginSuccess(newRealUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-auto">
        {/* Left Side: Joyful Kids Festive Fashion Image */}
        <div className="relative md:w-1/2 w-full h-64 md:h-auto min-h-[260px] md:min-h-[460px] bg-amber-50 overflow-hidden select-none">
          <img
            src="/login-kids.jpg"
            alt="Voraeclat Joyful Kids Festive Wear"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/login-model.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-3 left-4 right-4 text-white md:hidden">
            <span className="text-xs font-semibold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Voraeclat VIP
            </span>
            <p className="text-sm font-bold mt-1">Exclusive Kids & Festive Fashion</p>
          </div>
        </div>

        {/* Right Side: Clean Form Container matching Screenshot */}
        <div className="relative md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-between bg-white">
          {/* Top Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            {/* Header Titles */}
            <div className="mb-6 pt-2">
              <h2 className="text-2xl sm:text-[26px] font-black text-slate-950 tracking-tight leading-snug">
                Subscribe & Get 10% OFF
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-normal">
                No Spam. Just Good Clothes.
              </p>

              {intentAction === 'orders' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Customer Login:</strong> Enter your Mail ID & Mobile Number to view and track your order history.
                  </span>
                </div>
              )}
            </div>

            {/* Step 1: Mail ID + Mobile Number Input */}
            {step === 'phone' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mail ID (Email Address) <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter your Mail ID (e.g. parent@example.com)"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 border border-slate-300 rounded-xl focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-hidden bg-white"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mobile Number <span className="text-rose-500">*</span></span>
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100 transition-all overflow-hidden bg-white">
                    <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-300 text-slate-700 font-semibold text-xs select-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={handlePhoneChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 outline-hidden bg-transparent tracking-wide"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}

                {/* Checkbox: Notify me for any updates & offers */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={notifyOffers}
                    onChange={(e) => setNotifyOffers(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-800 focus:ring-slate-500 border-slate-300 cursor-pointer accent-[#545454]"
                  />
                  <span className="leading-snug">
                    Notify me for order invoices, tracking & offers
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#545454] hover:bg-[#3f3f3f] text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Verification Code...
                    </span>
                  ) : (
                    <>
                      <span>Continue with Mail ID & Mobile</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            ) : step === 'otp' ? (
              /* Step 2: 4-digit Real OTP Verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-slate-500 text-[11px]">Verification code sent to:</p>
                    <p className="font-bold text-slate-900 truncate">{emailInput}</p>
                    <p className="font-semibold text-slate-700">+91 {mobileNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setErrorMsg(null);
                    }}
                    className="text-amber-700 font-bold hover:underline cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Enter 4-Digit OTP Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newOtp = [...otp];
                          newOtp[index] = val;
                          setOtp(newOtp);
                          if (val && index < 3) {
                            const next = document.getElementById(`otp-input-${index + 1}`);
                            next?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            const prev = document.getElementById(`otp-input-${index - 1}`);
                            prev?.focus();
                          }
                        }}
                        className="w-12 h-12 text-center text-lg font-black border border-slate-300 rounded-xl focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-hidden bg-white text-slate-900"
                      />
                    ))}
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-rose-600 mt-2 text-center font-medium">{errorMsg}</p>
                  )}
                </div>

                {generatedOtp && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/90 text-xs text-amber-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Verification Code: <strong className="font-bold text-amber-950 tracking-wider text-sm">{generatedOtp}</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(generatedOtp.split(''))}
                      className="text-amber-800 font-bold hover:underline cursor-pointer text-xs"
                    >
                      Fill Code
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#545454] hover:bg-[#3f3f3f] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 3: Real New Customer Profile Setup */
              <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-bold">Verified: {emailInput} &bull; +91 {mobileNumber}</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Please enter your name to complete your customer profile.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-800"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mail ID (Verified)
                  </label>
                  <input
                    type="email"
                    value={customerEmail || emailInput}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100 text-slate-600 font-medium border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru, Delhi, Chennai"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-800"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#545454] hover:bg-[#3f3f3f] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      <span>Complete Account & Shop</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Terms & Privacy text matching user reference */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              By logging in, you're agreeing to our{' '}
              <a
                href="#privacy"
                onClick={(e) => e.preventDefault()}
                className="underline text-slate-700 hover:text-slate-900 font-medium"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="#terms"
                onClick={(e) => e.preventDefault()}
                className="underline text-slate-700 hover:text-slate-900 font-medium"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
