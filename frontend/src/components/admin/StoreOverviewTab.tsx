import React from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  Crown,
  Truck,
  ArrowUpRight,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CustomerOrder } from '../../types';

interface StoreOverviewTabProps {
  orders: CustomerOrder[];
  onNavigateTab: (tab: string) => void;
  onOpenStore: () => void;
}

export const StoreOverviewTab: React.FC<StoreOverviewTabProps> = ({
  orders,
  onNavigateTab,
  onOpenStore,
}) => {
  const calculatedTotalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(calculatedTotalRevenue / totalOrdersCount) : 0;
  const uniqueCustomersCount = new Set(
    orders
      .map((o) => (o.deliveryAddress?.phone || (o as any).customerMobile || '').replace(/\D/g, '').slice(-10))
      .filter(Boolean)
  ).size;
  const recentOrders = orders.slice(0, 4);

  // Dynamic monthly revenue aggregation for past 6 months from real orders
  const now = new Date();
  const monthlyRevenueData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const y = d.getFullYear();
    const m = d.getMonth();
    const monthOrders = orders.filter((o) => {
      const dateVal = o.date || (o as any).createdAt;
      const od = dateVal ? new Date(dateVal) : null;
      return od && !isNaN(od.getTime()) && od.getFullYear() === y && od.getMonth() === m;
    });
    const sum = monthOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    monthlyRevenueData.push({
      month: monthName,
      amount: sum,
      orders: monthOrders.length,
    });
  }

  const maxAmount = Math.max(...monthlyRevenueData.map((d) => d.amount), 1);

  // Dynamic department breakdown from actual ordered items
  const allOrderedItems = orders.flatMap((o) => o.items || []);
  const deptCounts: Record<string, { count: number; revenue: number }> = {};
  allOrderedItems.forEach((item) => {
    const name = (item.productName || '').toLowerCase();
    let category = 'Girl Dresses';
    if (name.includes('boy') || name.includes('kurta') || name.includes('suit') || name.includes('sherwani')) {
      category = 'Boy Kurta & Suits';
    } else if (name.includes('festive') || name.includes('lehenga') || name.includes('anarkali') || name.includes('ethnic')) {
      category = 'Festive Ethnic';
    } else if (name.includes('baby') || name.includes('romper') || name.includes('infant') || name.includes('newborn')) {
      category = 'Baby Essentials';
    } else if (name.includes('girl') || name.includes('frock') || name.includes('gown')) {
      category = 'Girl Dresses';
    } else {
      category = 'Festive Ethnic';
    }
    if (!deptCounts[category]) deptCounts[category] = { count: 0, revenue: 0 };
    deptCounts[category].count += item.quantity || 1;
    deptCounts[category].revenue += (item.price || 0) * (item.quantity || 1);
  });
  const totalItemRev = Object.values(deptCounts).reduce((acc, v) => acc + v.revenue, 0) || 1;
  const depts = [
    { name: 'Girl Dresses', data: deptCounts['Girl Dresses'] || { count: 0, revenue: 0 } },
    { name: 'Boy Kurta & Suits', data: deptCounts['Boy Kurta & Suits'] || { count: 0, revenue: 0 } },
    { name: 'Festive Ethnic', data: deptCounts['Festive Ethnic'] || { count: 0, revenue: 0 } },
    { name: 'Baby Essentials', data: deptCounts['Baby Essentials'] || { count: 0, revenue: 0 } },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950 text-white text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Store Operations Live</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Executive Store Dashboard</h2>
          <p className="text-slate-900 text-xs sm:text-sm font-medium">
            Real-time business telemetry across online sales, advertising attribution, and omnichannel fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('ads')}
            className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Ad Campaign</span>
          </button>
          <button
            onClick={onOpenStore}
            className="px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>View Live Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Merchandise (GMV)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {calculatedTotalRevenue >= 100000
              ? `₹${(calculatedTotalRevenue / 100000).toFixed(2)} Lakhs`
              : `₹${calculatedTotalRevenue.toLocaleString('en-IN')}`}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Real-time Total</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customer Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrdersCount}</div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Verified Orders</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{aov.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 font-medium">Average transaction value</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">VIP Club Members</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{uniqueCustomersCount} Customers</div>
          <div className="text-[11px] text-amber-700 font-bold">Unique buyer profiles</div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Revenue Trend Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Monthly Revenue Growth</h3>
              <p className="text-xs text-slate-500">Live order aggregation &bull; Last 6 billing cycles</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Data</span>
            </div>
          </div>

          {/* Clean Bar Visualization */}
          <div className="pt-4">
            <div className="flex items-end justify-between gap-3 h-52 border-b border-slate-100 pb-2">
              {monthlyRevenueData.map((d) => {
                const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                      ₹{d.amount.toLocaleString('en-IN')} ({d.orders} orders)
                    </div>
                    <div
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                        d.amount > 0
                          ? 'bg-linear-to-t from-amber-500 to-amber-400 group-hover:from-amber-600 group-hover:to-amber-500 shadow-md'
                          : 'bg-linear-to-t from-slate-200 to-slate-200'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-600">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Split */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Revenue Breakdown by Department
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {depts.map((dp) => {
                const pct = totalItemRev > 0 ? Math.round((dp.data.revenue / totalItemRev) * 100) : 0;
                return (
                  <div key={dp.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 text-[11px] truncate">{dp.name}</div>
                    <div className="font-black text-slate-900 text-sm">
                      {pct}% (₹{dp.data.revenue.toLocaleString('en-IN')})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Customer Orders */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order notifications from website</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              View All Orders &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.map((o) => (
              <div key={o.orderId} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{o.orderId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'Out for Delivery'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-700 font-medium">
                    {o.deliveryAddress.name} &bull;{' '}
                    <span className="text-slate-500">{o.items.length} items</span>
                  </div>
                  <div className="font-black text-slate-900">₹{o.totalAmount.toLocaleString('en-IN')}</div>
                </div>

                <div className="text-[11px] text-slate-400 truncate">
                  {o.items.map((i) => i.productName).join(', ')}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Manage Fulfillment & Logistics
          </button>
        </div>
      </div>
    </div>
  );
};
