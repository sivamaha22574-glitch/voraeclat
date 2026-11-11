import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Crown,
  Package,
  Calendar,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { CustomerUser, CustomerOrder } from '../../types';
import { fetchCustomersFromMongo, apiFetch } from '../../lib/mongoApi';

interface CustomerDirectoryTabProps {
  currentCustomer: CustomerUser | null;
  orders: CustomerOrder[];
  onNotify: (msg: string) => void;
  onNavigateToAdmins?: () => void;
}

interface MockCustomerProfile {
  mobile: string;
  name: string;
  email: string;
  city: string;
  joinedDate: string;
  isClubMember: boolean;
  totalOrders: number;
  totalSpent: number;
}

export const CustomerDirectoryTab: React.FC<CustomerDirectoryTabProps> = ({
  currentCustomer,
  orders,
  onNotify,
  onNavigateToAdmins,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteCustomers, setRemoteCustomers] = useState<CustomerUser[]>([]);
  const [customerToDelete, setCustomerToDelete] = useState<MockCustomerProfile | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  const [deletedMobiles, setDeletedMobiles] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomersFromMongo().then((custs) => {
      if (custs && custs.length > 0) {
        setRemoteCustomers(custs);
      }
    });
  }, []);

  // Build customer list strictly from real MongoDB Atlas customer profiles and genuine orders
  const customerMap = new Map<string, MockCustomerProfile>();

  // 1. Add real registered customers from MongoDB Atlas
  remoteCustomers.forEach((rc) => {
    const cleanMobile = rc.mobile.replace(/\s+/g, '');
    const userOrders = orders.filter((o) => o.deliveryAddress.phone.replace(/\s+/g, '').includes(cleanMobile.slice(-10)));
    customerMap.set(cleanMobile, {
      mobile: rc.mobile,
      name: rc.name || 'Customer',
      email: rc.email || '—',
      city: rc.city || 'India',
      joinedDate: rc.joinedDate || 'Recently',
      isClubMember: true,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    });
  });

  // 2. Add customers who placed real orders
  orders.forEach((o) => {
    const cleanMobile = o.deliveryAddress.phone.replace(/\s+/g, '');
    if (!customerMap.has(cleanMobile)) {
      const userOrders = orders.filter((ord) => ord.deliveryAddress.phone.replace(/\s+/g, '').includes(cleanMobile.slice(-10)));
      customerMap.set(cleanMobile, {
        mobile: o.deliveryAddress.phone,
        name: o.deliveryAddress.name,
        email: '—',
        city: o.deliveryAddress.city,
        joinedDate: o.date.split(',')[0] || 'Recently',
        isClubMember: false,
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum, ord) => sum + ord.totalAmount, 0),
      });
    }
  });

  // 3. Add currently logged-in customer if not already present
  if (currentCustomer && currentCustomer.mobile) {
    const cleanMobile = currentCustomer.mobile.replace(/\s+/g, '');
    if (!customerMap.has(cleanMobile)) {
      const userOrders = orders.filter((ord) => ord.deliveryAddress.phone.replace(/\s+/g, '').includes(cleanMobile.slice(-10)));
      customerMap.set(cleanMobile, {
        mobile: currentCustomer.mobile,
        name: currentCustomer.name || 'Active Shopper',
        email: currentCustomer.email || '—',
        city: currentCustomer.city || 'India',
        joinedDate: currentCustomer.joinedDate || 'Recently',
        isClubMember: true,
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum, ord) => sum + ord.totalAmount, 0),
      });
    }
  }

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsDeletingCustomer(true);
    try {
      const cleanMobile = customerToDelete.mobile.replace(/\s+/g, '');
      const res = await apiFetch<any>(`/api/users/${encodeURIComponent(cleanMobile)}`, { method: 'DELETE' });
      if (res && res.success) {
        onNotify(`User "${customerToDelete.name}" deleted successfully.`);
        setDeletedMobiles((prev) => [...prev, cleanMobile, customerToDelete.mobile]);
        setCustomerToDelete(null);
      } else {
        alert(res?.message || 'Failed to delete customer account');
      }
    } catch (e: any) {
      alert(e?.message || 'Error deleting customer');
    } finally {
      setIsDeletingCustomer(false);
    }
  };

  const sampleDirectory: MockCustomerProfile[] = Array.from(customerMap.values()).filter(
    (c) => !deletedMobiles.includes(c.mobile) && !deletedMobiles.includes(c.mobile.replace(/\s+/g, ''))
  );

  const filtered = sampleDirectory.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Registered Customer Accounts</h2>
          <p className="text-xs text-slate-500">
            Omnichannel customer registry, OTP logins, VIP Voraeclat Club tier status, and lifetime value.
          </p>
        </div>

        <div className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          Total Registered Parents: <strong className="text-slate-950 font-black">2,410</strong>
        </div>
      </div>

      {onNavigateToAdmins && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-900 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Need to Manage or Delete Staff Administrator Accounts?</span>
              <p className="text-[11px] text-slate-300">View all executive admin accounts, add team members, or delete administrators.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToAdmins}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black transition-all shrink-0 cursor-pointer text-xs self-start sm:self-auto"
          >
            Manage & Delete Admin Users &rarr;
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parent name, mobile number, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Parent Name & Contact</th>
                <th className="py-3 px-4">City / Location</th>
                <th className="py-3 px-4">VIP Club Status</th>
                <th className="py-3 px-4">Order History</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Registered On</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.mobile} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.mobile}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{user.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {user.isClubMember ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>VIP Voraeclat Club</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Standard Account</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900">{user.totalOrders} Orders</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-emerald-700">₹{user.totalSpent.toLocaleString('en-IN')}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{user.joinedDate}</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setCustomerToDelete(user)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                      title={`Delete customer ${user.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Delete Customer Account</h3>
                <p className="text-[11px] text-slate-500">Permanent Account Removal</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete customer <strong className="text-slate-900">{customerToDelete.name}</strong> ({customerToDelete.mobile})? All their account data and credentials will be removed.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                disabled={isDeletingCustomer}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeletingCustomer ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
