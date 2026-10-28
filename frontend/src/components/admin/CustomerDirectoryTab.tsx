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
} from 'lucide-react';
import { CustomerUser, CustomerOrder } from '../../types';
import { fetchPuppyCustomersFromSupabase } from '../../lib/supabase';

interface CustomerDirectoryTabProps {
  currentCustomer: CustomerUser | null;
  orders: CustomerOrder[];
  onNotify: (msg: string) => void;
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteCustomers, setRemoteCustomers] = useState<CustomerUser[]>([]);

  useEffect(() => {
    fetchPuppyCustomersFromSupabase().then((custs) => {
      if (custs && custs.length > 0) {
        setRemoteCustomers(custs);
      }
    });
  }, []);

  // Build customer list strictly from real Supabase customer profiles and genuine orders
  const customerMap = new Map<string, MockCustomerProfile>();

  // 1. Add real registered customers from Supabase
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

  const sampleDirectory: MockCustomerProfile[] = Array.from(customerMap.values());

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
