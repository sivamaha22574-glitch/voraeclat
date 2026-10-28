import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Package,
  Building2,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Sliders,
  Crown,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  X,
} from 'lucide-react';
import { VoraeclatLogo } from '../VoraeclatLogo';
import { AdDashboardTab } from './AdDashboardTab';
import { StoreOverviewTab } from './StoreOverviewTab';
import { OrdersManagerTab } from './OrdersManagerTab';
import { ProductsManagerTab } from './ProductsManagerTab';
import { FranchiseLeadsTab } from './FranchiseLeadsTab';
import { CustomerDirectoryTab } from './CustomerDirectoryTab';
import { AdminCredentialsTab } from './AdminCredentialsTab';
import {
  verifyAdminInSupabase,
  updateAdminCredentialsInSupabase,
  resetAdminCredentialsInSupabase,
  fetchAdminUsersFromSupabase,
  AdminUser,
} from '../../lib/supabase';
import { CustomerOrder, CustomerUser, CategoryId, Product } from '../../types';

interface AdminPortalProps {
  onBackToStore: () => void;
  orders: CustomerOrder[];
  onUpdateOrders: (orders: CustomerOrder[]) => void;
  currentCustomer: CustomerUser | null;
  onPreviewCategory?: (cat: CategoryId) => void;
  products?: Product[];
  onUpdateProducts?: (products: Product[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToStore,
  orders,
  onUpdateOrders,
  currentCustomer,
  onPreviewCategory,
  products,
  onUpdateProducts,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('puppy_shame_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'ads' | 'orders' | 'products' | 'franchise' | 'customers' | 'security'
  >('ads');

  const [adminUsername, setAdminUsername] = useState(() => {
    try {
      return localStorage.getItem('puppy_shame_admin_username') || 'admin';
    } catch {
      return 'admin';
    }
  });
  const [adminPassword, setAdminPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{
    username: string;
    fullName: string;
    role: string;
    email: string;
  }>(() => {
    try {
      const savedUser = localStorage.getItem('puppy_shame_admin_username') || 'admin';
      return {
        username: savedUser,
        fullName: savedUser === 'admin' ? 'Chief Store Administrator' : savedUser,
        role: 'Super Admin',
        email: 'admin@voraeclat.com',
      };
    } catch {
      return {
        username: 'admin',
        fullName: 'Chief Store Administrator',
        role: 'Super Admin',
        email: 'admin@voraeclat.com',
      };
    }
  });

  // Direct change credentials modal (accessible on login screen)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeCurrentUsername, setChangeCurrentUsername] = useState('admin');
  const [changeCurrentPassword, setChangeCurrentPassword] = useState('');
  const [changeNewUsername, setChangeNewUsername] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [changeShowPassword, setChangeShowPassword] = useState(false);
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const [changeModalError, setChangeModalError] = useState<string | null>(null);
  const [changeModalSuccess, setChangeModalSuccess] = useState<string | null>(null);

  const handleDirectResetDefault = async () => {
    setIsChangingCredentials(true);
    setChangeModalError(null);
    try {
      const res = await resetAdminCredentialsInSupabase('admin', 'admin');
      if (res.success) {
        setAdminUsername('admin');
        setAdminPassword('admin');
        setChangeCurrentUsername('admin');
        setChangeNewUsername('admin');
        setChangeNewPassword('admin');
        setChangeConfirmPassword('admin');
        setChangeModalSuccess('Reset to default (admin / admin) successful in cloud!');
        try {
          localStorage.setItem('puppy_shame_admin_username', 'admin');
          localStorage.setItem(
            'puppy_shame_admin_credentials',
            JSON.stringify({ username: 'admin', password: 'admin' })
          );
        } catch {
          // ignore
        }
        showToast('Credentials reset to admin / admin!');
        setTimeout(() => {
          setIsChangeModalOpen(false);
          setChangeModalSuccess(null);
        }, 1200);
      } else {
        setChangeModalError(res.message);
      }
    } catch (err: any) {
      setChangeModalError(err?.message || 'Failed to reset credentials.');
    } finally {
      setIsChangingCredentials(false);
    }
  };

  const handleChangeCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeModalError(null);
    setChangeModalSuccess(null);

    const currU = changeCurrentUsername.trim();
    const currP = changeCurrentPassword.trim();
    const newU = changeNewUsername.trim();
    const newP = changeNewPassword.trim();

    if (!newU || newU.length < 3) {
      setChangeModalError('New username must be at least 3 characters.');
      return;
    }
    if (!newP || newP.length < 4) {
      setChangeModalError('New password must be at least 4 characters.');
      return;
    }
    if (newP !== changeConfirmPassword) {
      setChangeModalError('New password and confirmation do not match.');
      return;
    }

    setIsChangingCredentials(true);
    try {
      let res;
      if (currP) {
        res = await updateAdminCredentialsInSupabase(currU, currP, newU, newP);
      } else {
        res = await resetAdminCredentialsInSupabase(newU, newP);
      }

      if (res.success) {
        setChangeModalSuccess(res.message || 'Admin credentials updated successfully in Supabase cloud!');
        const updatedUser = res.username || newU;
        setAdminUsername(updatedUser);
        setAdminPassword(newP);
        setAdminProfile((prev) => ({ ...prev, username: updatedUser }));
        try {
          localStorage.setItem('puppy_shame_admin_username', updatedUser);
          localStorage.setItem(
            'puppy_shame_admin_credentials',
            JSON.stringify({ username: updatedUser, password: newP })
          );
        } catch {
          // ignore
        }
        showToast('Credentials updated! Form auto-filled with your new login details.');
        setTimeout(() => {
          setIsChangeModalOpen(false);
          setChangeModalSuccess(null);
          setChangeCurrentPassword('');
          setChangeNewPassword('');
          setChangeConfirmPassword('');
        }, 1400);
      } else {
        setChangeModalError(res.message);
      }
    } catch (err: any) {
      setChangeModalError(err?.message || 'Failed to update credentials. Please try again.');
    } finally {
      setIsChangingCredentials(false);
    }
  };

  // Fetch active admin from Supabase on mount
  useEffect(() => {
    const fetchActiveAdmin = async () => {
      try {
        const users = await fetchAdminUsersFromSupabase();
        if (users && users.length > 0) {
          const primary = users.find((u) => u.role === 'Super Admin') || users[0];
          setAdminUsername(primary.username);
          setChangeCurrentUsername(primary.username);
          setAdminProfile((prev) => ({
            ...prev,
            username: primary.username,
            fullName: primary.fullName || 'Chief Administrator',
            role: primary.role || 'Super Admin',
            email: primary.email || 'admin@voraeclat.com',
          }));
        }
      } catch {
        // ignore
      }
    };
    fetchActiveAdmin();
  }, []);

  // Check URL hash if specific tab is requested
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('ads') || hash.includes('ad-dashboard') || hash.includes('campaigns')) {
      setActiveTab('ads');
    } else if (hash.includes('orders')) {
      setActiveTab('orders');
    } else if (hash.includes('products')) {
      setActiveTab('products');
    } else if (hash.includes('franchise')) {
      setActiveTab('franchise');
    } else if (hash.includes('customers')) {
      setActiveTab('customers');
    } else if (
      hash.includes('security') ||
      hash.includes('credentials') ||
      hash.includes('password') ||
      hash.includes('users')
    ) {
      setActiveTab('security');
    } else if (hash.includes('overview') || hash.includes('dashboard')) {
      setActiveTab('overview');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    const u = adminUsername.trim();
    const p = adminPassword.trim();

    try {
      // 1. Direct Supabase verification
      const verifyRes = await verifyAdminInSupabase(u, p);
      if (verifyRes.valid) {
        setIsAuthenticated(true);
        if (verifyRes.user) {
          setAdminProfile({
            username: verifyRes.user.username,
            fullName: verifyRes.user.fullName,
            role: verifyRes.user.role,
            email: verifyRes.user.email,
          });
          setAdminUsername(verifyRes.user.username);
        }
        if (rememberMe) {
          try {
            localStorage.setItem('puppy_shame_admin_auth', 'true');
            localStorage.setItem('puppy_shame_admin_username', verifyRes.user?.username || u);
          } catch {
            // ignore
          }
        }
        showToast(`Welcome back, ${verifyRes.user?.fullName || 'Administrator'}! 🚀`);
        setIsLoggingIn(false);
        return;
      }

      // If authentication fails, strictly reject and clear any stale session
      setIsAuthenticated(false);
      try {
        localStorage.removeItem('puppy_shame_admin_auth');
      } catch {
        // ignore
      }
      setAuthError(verifyRes.message || 'Invalid administrator username or password. Access denied.');
    } catch (err: any) {
      setAuthError('Authentication error. Please verify your network connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('puppy_shame_admin_auth');
    } catch {
      // ignore
    }
    showToast('Admin session closed.');
  };

  // If not logged in, render the authentic executive admin auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 text-white">
          <div className="text-center space-y-2">
            <div className="inline-block p-1 rounded-xl bg-white/5 border border-white/10">
              <VoraeclatLogo size="md" variant="dark" showSubtitle={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal • Executive Sign In</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">Staff Authentication</h1>
            <p className="text-xs text-slate-400">
              Enter your official administrator username and security password to access the retail console.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Username</span>
                <span className="text-[10px] text-amber-400 font-normal">Active: {adminUsername}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={adminUsername}
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-slate-500 font-normal">Cloud Encrypted</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter security password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember this session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-75 text-slate-950 font-black text-xs tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials in Supabase Cloud...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Direct Change Credentials Option on Login Screen */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setChangeCurrentUsername(adminUsername || 'admin');
                setChangeCurrentPassword('');
                setChangeNewUsername(adminUsername || 'admin');
                setChangeNewPassword('');
                setChangeConfirmPassword('');
                setChangeModalError(null);
                setChangeModalSuccess(null);
                setIsChangeModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Username & Password</span>
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
            <button
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>&larr;</span>
              <span>Return to Customer Storefront</span>
            </button>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Enterprise Console</span>
            </div>
          </div>
        </div>

        {/* Change Credentials Modal (Direct Access from Login Screen) */}
        {isChangeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Change Admin Credentials</h3>
                    <p className="text-[11px] text-slate-400">Updates username and password in Supabase cloud</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangeModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {changeModalError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{changeModalError}</span>
                </div>
              )}

              {changeModalSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{changeModalSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangeCredentialsSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Current Username</label>
                  <input
                    type="text"
                    required
                    value={changeCurrentUsername}
                    onChange={(e) => setChangeCurrentUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Current Security Password (Optional)</span>
                    <span className="text-[10px] text-amber-400 font-normal">Leave blank for direct reset</span>
                  </label>
                  <input
                    type={changeShowPassword ? 'text' : 'password'}
                    value={changeCurrentPassword}
                    onChange={(e) => setChangeCurrentPassword(e.target.value)}
                    placeholder="Enter current password or leave blank to reset"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-xs"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-amber-300">New Desired Username</label>
                    <input
                      type="text"
                      required
                      value={changeNewUsername}
                      onChange={(e) => setChangeNewUsername(e.target.value)}
                      placeholder="e.g. mynewadmin"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-400/40 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-amber-300">New Password</label>
                    <input
                      type={changeShowPassword ? 'text' : 'password'}
                      required
                      value={changeNewPassword}
                      onChange={(e) => setChangeNewPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-400/40 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-amber-300">Confirm New Password</label>
                    <input
                      type={changeShowPassword ? 'text' : 'password'}
                      required
                      value={changeConfirmPassword}
                      onChange={(e) => setChangeConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => setChangeShowPassword(!changeShowPassword)}
                      className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer"
                    >
                      {changeShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{changeShowPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                    </button>
                    <span className="text-[10px] text-slate-500">Instant Supabase Cloud Sync</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangeModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingCredentials}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isChangingCredentials ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Update Now</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={handleDirectResetDefault}
                    disabled={isChangingCredentials}
                    className="text-[11px] text-slate-400 hover:text-amber-300 underline cursor-pointer transition-colors"
                  >
                    Need emergency reset? 1-Click reset to default (admin / admin)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <VoraeclatLogo size="sm" variant="dark" showSubtitle={false} />
            <div className="h-6 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold tracking-wide" title="Connected to Express & MongoDB MERN Backend on Port 5000">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MERN Stack (Port 5000)</span>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Store Button */}
            <button
              onClick={onBackToStore}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Return to Customer Storefront"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Online Store</span>
              <span className="sm:hidden">Store</span>
            </button>

            {/* Backend MVC Admin Direct Link */}
            <a
              href="http://localhost:5000/admin"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-xs"
              title="Open Backend MVC Admin Console on Port 5000"
            >
              <span>⚡ Backend MVC Admin (5000)</span>
            </a>

            {/* Admin Profile & Credentials Trigger */}
            <button
              onClick={() => setActiveTab('security')}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/50 text-white'
              }`}
              title="Click to manage Admin Username and Password credentials"
            >
              <div
                className={`w-6 h-6 rounded-full font-black flex items-center justify-center text-[10px] ${
                  activeTab === 'security' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {adminProfile.role === 'Super Admin' ? 'SA' : 'CMO'}
              </div>
              <div className="text-left">
                <div className="font-bold leading-none flex items-center gap-1.5">
                  <span>{adminProfile.username}</span>
                  <KeyRound
                    className={`w-3 h-3 ${activeTab === 'security' ? 'text-slate-950' : 'text-amber-400'}`}
                  />
                </div>
                <div
                  className={`text-[10px] ${
                    activeTab === 'security' ? 'text-slate-800 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {adminProfile.role}
                </div>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ads'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ad Dashboard</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-950 text-amber-300 font-extrabold">
                Primary
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Store Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders & Logistics</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products Master</span>
            </button>

            <button
              onClick={() => setActiveTab('franchise')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'franchise'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Franchise Leads</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-102'
                  : 'text-amber-300/80 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Credentials & Security</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ads' && (
          <AdDashboardTab
            onNotify={showToast}
            onPreviewStoreWithFilter={(cat) => {
              if (onPreviewCategory) onPreviewCategory(cat);
              onBackToStore();
            }}
          />
        )}

        {activeTab === 'overview' && (
          <StoreOverviewTab
            orders={orders}
            onNavigateTab={(tab) =>
              setActiveTab(
                tab as 'overview' | 'ads' | 'orders' | 'products' | 'franchise' | 'customers' | 'security'
              )
            }
            onOpenStore={onBackToStore}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersManagerTab
            orders={orders}
            onUpdateOrders={onUpdateOrders}
            onNotify={showToast}
          />
        )}

        {activeTab === 'products' && (
          <ProductsManagerTab
            products={products}
            onUpdateProducts={onUpdateProducts}
            onNotify={showToast}
          />
        )}

        {activeTab === 'franchise' && <FranchiseLeadsTab onNotify={showToast} />}

        {activeTab === 'customers' && (
          <CustomerDirectoryTab
            currentCustomer={currentCustomer}
            orders={orders}
            onNotify={showToast}
          />
        )}

        {activeTab === 'security' && (
          <AdminCredentialsTab
            currentUsername={adminUsername}
            onCredentialsUpdated={(newU) => {
              setAdminUsername(newU);
              setAdminProfile((prev) => ({ ...prev, username: newU }));
              try {
                localStorage.setItem('puppy_shame_admin_username', newU);
              } catch {
                // ignore
              }
            }}
            onNotify={showToast}
          />
        )}
      </main>

      {/* Admin Portal Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Voraeclat Retail Operations Console</span>
            <span>&bull;</span>
            <span>Version 2.8.4 Enterprise</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={onBackToStore} className="hover:text-amber-400 transition-colors">
              Customer Storefront
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveTab('ads')} className="hover:text-amber-400 transition-colors">
              Ad Dashboard
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveTab('orders')} className="hover:text-amber-400 transition-colors">
              Order Fulfillment
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveTab('security')} className="hover:text-amber-400 transition-colors">
              Credentials & Security
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
