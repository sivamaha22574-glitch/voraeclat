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
  Search,
  Users,
  ShieldAlert,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import {
  AdminUser,
  updateAdminCredentialsInMongo,
  resetAdminCredentialsInMongo,
  fetchAdminUsersFromMongo,
  createAdminUserInMongo,
  deleteAdminUserInMongo,
} from '../../lib/mongoApi';

interface AdminCredentialsTabProps {
  currentUsername: string;
  onCredentialsUpdated: (newUsername: string) => void;
  onNotify: (msg: string) => void;
  onLogout?: () => void;
}

export const AdminCredentialsTab: React.FC<AdminCredentialsTabProps> = ({
  currentUsername,
  onCredentialsUpdated,
  onNotify,
  onLogout,
}) => {
  // Navigation within Admin tab
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'password'>('users');
  const [adminSearch, setAdminSearch] = useState('');

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

  // Delete modal state
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    try {
      const users = await fetchAdminUsersFromMongo();
      if (users && users.length > 0) {
        setAdminUsers(users);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingUsers(false);
    }
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
      let res;
      if (currentPassword.trim()) {
        res = await updateAdminCredentialsInMongo(
          currentUsername,
          currentPassword.trim(),
          newUsername.trim(),
          newPassword.trim()
        );
      } else {
        res = await resetAdminCredentialsInMongo(newUsername.trim(), newPassword.trim());
      }

      if (res.success) {
        setUpdateSuccess(res.message);
        onCredentialsUpdated(newUsername.trim());
        onNotify('Admin credentials saved successfully in MongoDB Atlas!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await loadAdminUsers();
      } else {
        setUpdateError(res.message);
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
    const res = await createAdminUserInMongo(
      newUserUsername.trim(),
      newUserPassword.trim(),
      newUserFullName.trim() || 'Store Team Member',
      newUserEmail.trim(),
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
      await loadAdminUsers();
    } else {
      alert(res.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    const target = adminToDelete;
    const targetId = target.id || target.username;
    const isSelf = target.username.toLowerCase() === currentUsername.toLowerCase();
    const remainingMatchingUsers = adminUsers.filter(
      (u) => u.username.toLowerCase() === currentUsername.toLowerCase()
    );
    // If there are duplicate accounts with same username (e.g. 2 mayilvanan), deleting one duplicate does NOT log out
    const willLogOut = isSelf && remainingMatchingUsers.length <= 1;

    if (adminUsers.length <= 1) {
      setDeleteError('Cannot delete the last remaining administrator account. The store requires at least one admin.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAdminUserInMongo(targetId);
      if (res.success) {
        onNotify(res.message || `Admin user "${target.username}" deleted successfully from MongoDB Atlas`);
        // Remove only this target instance by id or username
        setAdminUsers((prev) =>
          prev.filter((u) => (target.id ? u.id !== target.id : u.username !== target.username))
        );
        setAdminToDelete(null);

        if (willLogOut) {
          if (onLogout) {
            onLogout();
          } else {
            window.location.reload();
          }
        } else {
          await loadAdminUsers();
        }
      } else {
        setDeleteError(res.message || 'Failed to delete administrator account.');
      }
    } catch (e: any) {
      setDeleteError(e?.message || 'Error occurred while deleting admin user.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered users for search
  const filteredUsers = adminUsers.filter((u) => {
    const q = adminSearch.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  // Reusable Authorized Administrators Card (with always-visible Delete button on every row)
  const renderAuthorizedAdminsCard = () => (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-white space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Authorized Administrators ({adminUsers.length})</span>
        </h3>
        <button
          type="button"
          onClick={loadAdminUsers}
          className="text-slate-400 hover:text-amber-400 text-xs flex items-center gap-1 transition-colors p-1"
          title="Refresh Administrator list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {isLoadingUsers ? (
          <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
            <span>Loading administrators from MongoDB Atlas...</span>
          </div>
        ) : adminUsers.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No administrator accounts registered.
          </div>
        ) : (
          adminUsers.map((user, idx) => {
            const isSelf = user.username.toLowerCase() === currentUsername.toLowerCase();
            return (
              <div
                key={user.id || `${user.username}-${idx}`}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-all shadow-inner"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-white text-sm">{user.username}</span>
                    {isSelf && (
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                        You
                      </span>
                    )}
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-md font-semibold">
                      {user.role || 'Super Admin'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user.fullName || user.email || 'Mayilvanan'}
                  </div>
                </div>

                {/* Always show Delete button for EVERY admin user */}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setAdminToDelete(user);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 hover:border-rose-600 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title={`Delete administrator ${user.username}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click <strong className="text-rose-400 font-bold">Delete</strong> to permanently remove duplicate or inactive admins.</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MongoDB Atlas Cloud Security & Authentication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Accounts & Access Control
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage administrator accounts, delete inactive staff, add new team admins, or change login passwords connected directly to your MongoDB Atlas database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Admin User</span>
          </button>
          <button
            onClick={loadAdminUsers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title="Refresh Admin Users from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-amber-400 text-slate-950 shadow-lg scale-102'
              : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Admin User Accounts ({adminUsers.length})</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/20 font-mono">Manage & Delete</span>
        </button>

        <button
          onClick={() => setActiveSubTab('password')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'password'
              ? 'bg-amber-400 text-slate-950 shadow-lg scale-102'
              : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Username & Password</span>
        </button>
      </div>

      {/* VIEW 1: ADMIN USER ACCOUNTS MANAGEMENT (PROMINENT TABLE WITH DELETE OPTION) */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search admin users by name, role, email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400">
                Total Administrators: <strong className="text-white font-mono">{adminUsers.length}</strong>
              </span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Admin</span>
              </button>
            </div>
          </div>

          {/* Authorized Administrators Card (with instant Delete button) */}
          {renderAuthorizedAdminsCard()}

          {/* Administrators Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">Registered Administrator Accounts</h3>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Live MongoDB Atlas `users` Collection</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Admin User</th>
                    <th className="px-6 py-3.5">Full Name & Contact</th>
                    <th className="px-6 py-3.5">Assigned Role</th>
                    <th className="px-6 py-3.5">Session Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-xs">
                        No administrator accounts found matching "{adminSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => {
                      const isSelf = user.username.toLowerCase() === currentUsername.toLowerCase();
                      return (
                        <tr
                          key={user.id || `${user.username}-${index}`}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            isSelf ? 'bg-amber-400/5' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black flex items-center justify-center text-sm shadow-md">
                                {user.username.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-mono font-bold text-white flex items-center gap-2">
                                  <span>{user.username}</span>
                                  {isSelf && (
                                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md uppercase">
                                      You (Current)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: {user.id || user.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-200">{user.fullName || 'Authorized Admin'}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{user.email || 'admin@voraeclat.com'}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                              {user.role || 'Super Admin'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {isSelf ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active Session
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                                Registered
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError(null);
                                setAdminToDelete(user);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-600 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                              title={`Delete admin account ${user.username}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete User</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CHANGE ADMIN CREDENTIALS */}
      {activeSubTab === 'password' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      Saves directly to MongoDB Atlas <code className="text-amber-300 font-mono">users</code> collection
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  <span>MongoDB Atlas Connected</span>
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
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Current Admin Password (Optional)</span>
                    <span className="text-[10px] text-amber-400 font-normal">Leave blank for direct reset</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password or leave blank"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                        placeholder="e.g. mayilvanan, admin"
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-hidden font-mono"
                        required
                      />
                    </div>
                  </div>

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
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

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
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-60 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Updating in MongoDB Atlas...</span>
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

          <div className="space-y-6">
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
                  <span className="font-mono text-slate-300">MongoDB Atlas Cloud</span>
                </div>
              </div>
            </div>

            {/* Authorized Administrators Card (with Delete button) */}
            {renderAuthorizedAdminsCard()}
          </div>
        </div>
      )}

      {/* POPUP MODAL: DELETE ADMIN ACCOUNT CONFIRMATION */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-rose-800/60 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Delete Administrator User</h3>
                <p className="text-[11px] text-slate-400">MongoDB Atlas User Deletion</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Username:</span>
                <span className="font-mono font-bold text-amber-400">{adminToDelete.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Full Name:</span>
                <span className="text-white font-medium">{adminToDelete.fullName || 'Admin User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="text-indigo-300">{adminToDelete.role || 'Super Admin'}</span>
              </div>
              {adminToDelete.id && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Account ID:</span>
                  <span className="font-mono text-[11px] text-slate-500">{adminToDelete.id}</span>
                </div>
              )}
            </div>

            {adminToDelete.username.toLowerCase() === currentUsername.toLowerCase() ? (
              adminUsers.filter((u) => u.username.toLowerCase() === currentUsername.toLowerCase()).length > 1 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Duplicate Account:</strong> You have multiple administrator accounts named <strong>"{adminToDelete.username}"</strong>. Deleting this specific instance will remove it from MongoDB Atlas while your other account and current session remain active.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warning:</strong> You are about to delete your own currently logged-in account. If you confirm, this account will be permanently deleted from MongoDB Atlas and your session will be closed immediately.
                  </span>
                </div>
              )
            ) : (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Are you sure you want to permanently delete this administrator from MongoDB Atlas? They will no longer be able to log in to the admin portal.
                </span>
              </div>
            )}

            {deleteError && (
              <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAdminToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting from MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD NEW ADMIN ACCOUNT */}
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
                className="text-slate-500 hover:text-white cursor-pointer"
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
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Admin Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="e.g. ramesh_admin"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ramesh@voraeclat.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Role / Permissions</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Store Manager">Store Manager (Products & Orders)</option>
                  <option value="Logistics Executive">Logistics Executive (Orders Only)</option>
                  <option value="Marketing Manager">Marketing Manager (Ads & Coupons)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Access Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-hidden focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCreatingUser ? 'Creating in Atlas...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
