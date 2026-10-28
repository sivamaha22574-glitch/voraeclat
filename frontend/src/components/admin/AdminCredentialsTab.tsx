import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Mail,
  Calendar,
  Check,
  Sparkles,
  Database,
} from 'lucide-react';
import {
  AdminUser,
  updateAdminCredentialsInSupabase,
  resetAdminCredentialsInSupabase,
  fetchAdminUsersFromSupabase,
  createAdminUserInSupabase,
  deleteAdminUserInSupabase,
} from '../../lib/supabase';

interface AdminCredentialsTabProps {
  currentUsername: string;
  onCredentialsUpdated: (newUsername: string) => void;
  onNotify: (msg: string) => void;
}

export const AdminCredentialsTab: React.FC<AdminCredentialsTabProps> = ({
  currentUsername,
  onCredentialsUpdated,
  onNotify,
}) => {
  // Change credentials state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Admin users list state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Add new admin account state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Marketing Manager');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const loadAdminUsers = async () => {
    setIsLoadingUsers(true);
    const users = await fetchAdminUsersFromSupabase();
    if (users && users.length > 0) {
      setAdminUsers(users);
    }
    setIsLoadingUsers(false);
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 33, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 66, text: 'Moderate', color: 'bg-amber-400' };
    return { score: 100, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(newPassword);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setUpdateError('New username must be at least 3 characters long.');
      return;
    }

    if (!newPassword.trim() || newPassword.trim().length < 4) {
      setUpdateError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('New password and confirmation do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      let result;
      if (currentPassword.trim()) {
        result = await updateAdminCredentialsInSupabase(
          currentUsername,
          currentPassword,
          newUsername,
          newPassword
        );
      } else {
        result = await resetAdminCredentialsInSupabase(newUsername, newPassword);
      }

      if (result.success) {
        setUpdateSuccess(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onCredentialsUpdated(result.username || newUsername);
        onNotify('Admin credentials securely updated in Supabase cloud!');
        loadAdminUsers();

        // Also update local fallback credentials
        try {
          localStorage.setItem(
            'puppy_shame_admin_credentials',
            JSON.stringify({ username: result.username || newUsername, password: newPassword })
          );
        } catch {
          // ignore
        }
      } else {
        setUpdateError(result.message);
      }
    } catch (err: any) {
      setUpdateError(err?.message || 'Failed to update credentials. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUsername.trim() || !newUserPassword.trim()) {
      alert('Username and password are required');
      return;
    }

    setIsCreatingUser(true);
    const res = await createAdminUserInSupabase(
      newUserUsername,
      newUserPassword,
      newUserFullName || 'Store Team Member',
      newUserEmail,
      newUserRole
    );
    setIsCreatingUser(false);

    if (res.success) {
      onNotify(res.message);
      setIsAddModalOpen(false);
      setNewUserUsername('');
      setNewUserPassword('');
      setNewUserFullName('');
      setNewUserEmail('');
      loadAdminUsers();
    } else {
      alert(res.message);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (admin.username === currentUsername || admin.username === 'admin') {
      alert('Cannot delete the currently active or primary super administrator account.');
      return;
    }

    if (!confirm(`Are you sure you want to delete administrator account "${admin.username}"?`)) {
      return;
    }

    if (admin.id) {
      const res = await deleteAdminUserInSupabase(admin.id);
      if (res.success) {
        onNotify(res.message);
        loadAdminUsers();
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supabase Cloud Security & Auth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Access & Password Management
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Update your administrator username and password, manage team access credentials, and monitor authenticated active sessions connected directly to Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Admin User</span>
          </button>
          <button
            onClick={loadAdminUsers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title="Refresh Admin Users"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Change Password & Username Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Change Admin Username & Password</h3>
                  <p className="text-xs text-slate-400">
                    Saves directly to Supabase <code className="text-amber-300 font-mono">public.puppy_admin_users</code> table
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                <span>Live Supabase Connected</span>
              </span>
            </div>

            {updateError && (
              <div className="mb-5 p-4 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{updateError}</span>
              </div>
            )}

            {updateSuccess && (
              <div className="mb-5 p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{updateSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              {/* Current Password Verification */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Current Admin Password (Optional)</span>
                  <span className="text-[10px] text-amber-400 font-normal">Leave blank for 1-click direct reset</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password or leave blank to reset directly"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* New Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    New Admin Username <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. admin, store_manager"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Password Strength:</span>
                    <strong className="text-white font-bold">{strength.text}</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirm New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewUsername(currentUsername);
                    setNewPassword('');
                    setConfirmPassword('');
                    setUpdateError(null);
                    setUpdateSuccess(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-60 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Updating in Supabase Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Update Credentials Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Active Admin Users & Security Info */}
        <div className="space-y-6">
          {/* Active Admin Overview */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-white space-y-4">
            <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Active Admin Session</span>
            </h3>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Username:</span>
                <span className="font-mono font-bold text-amber-400">{currentUsername}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Access Level:</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Super Admin
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Auth Engine:</span>
                <span className="font-mono text-slate-300">Supabase PostgreSQL 17</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Encrypted DB Table:</span>
                <span className="font-mono text-[10px] text-indigo-300">public.puppy_admin_users</span>
              </div>
            </div>

            <div className="p-3 bg-amber-400/5 border border-amber-400/20 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Any changes made here take effect instantly across all devices and browser tabs connected to this Supabase backend.
              </span>
            </div>
          </div>

          {/* All Registered Administrators Table */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Authorized Administrators ({adminUsers.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {adminUsers.map((user) => (
                <div
                  key={user.username}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{user.username}</span>
                      {user.username === currentUsername && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                          You
                        </span>
                      )}
                      <span className="text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-md font-medium">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{user.fullName || user.email || 'Store Operator'}</div>
                  </div>

                  {user.username !== 'admin' && user.username !== currentUsername && (
                    <button
                      onClick={() => handleDeleteAdmin(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete Admin User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Admin Account */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">Add Team Administrator</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ramesh@voraeclat.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder="e.g. ramesh_ops"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-hidden focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Initial Password</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-hidden focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400"
                >
                  <option value="Super Admin">Super Admin (All permissions)</option>
                  <option value="Marketing Lead">Marketing Lead (Banners & Ads)</option>
                  <option value="Order Fulfillment">Order Fulfillment (Shipping & Delivery)</option>
                  <option value="Inventory Manager">Inventory Manager (Product Catalog)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl"
                >
                  {isCreatingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
