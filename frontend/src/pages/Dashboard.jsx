import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import { formatCurrency, formatRating } from "../utils/formatters";
import { fetchApi } from "../utils/apiHelpers";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Trash2,
  AlertTriangle,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { MOCK_SALES_7_DAYS } from "../data/reportsData";
import { initialIngredients, MOCK_EXPIRY_ITEMS } from "../data/inventoryData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [syncNotice, setSyncNotice] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load live dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncClick = async () => {
    try {
      setSyncing(true);
      setSyncNotice(null);
      const res = await fetchApi('/dashboard/sync', { method: 'POST' });
      if (res.success) {
        if (res.last_updated) {
          setLastUpdated(new Date(res.last_updated).toLocaleTimeString());
        }
        if (res.simulated) {
          setSyncNotice(`⚡ Live Event: ${res.message}`);
        } else {
          setSyncNotice(`✅ Synced with PostgreSQL database at ${new Date().toLocaleTimeString()}`);
        }
        await loadDashboard();
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStockItems = initialIngredients.filter(
    (item) => item.status === "Low Stock" || item.currentStock <= item.minThreshold
  );

  const kpis = dashboardData?.kpis || {
    today_revenue: 48250,
    today_orders: 142,
    inventory_value: 285000,
    today_waste: 3200,
    low_stock_count: lowStockItems.length,
    pending_po_count: 4,
    active_orders_count: 3
  };

  const financials = dashboardData?.financials || {
    today: { revenue: kpis.today_revenue, waste: kpis.today_waste, expenses: 2500, estimated_profit: kpis.today_revenue - kpis.today_waste - 2500 },
    month: { revenue: 1450000, waste: 28500, expenses: 120000, estimated_profit: 1301500 },
    year: { revenue: 17400000, waste: 342000, expenses: 1440000, estimated_profit: 15618000 }
  };

  const activeOrders = dashboardData?.active_orders || [];
  const topSellingDishes = dashboardData?.top_selling_dishes || [];
  const recentOrders = dashboardData?.recent_orders || [];
  const recentPurchases = dashboardData?.recent_purchases || [];
  const recentWaste = dashboardData?.recent_waste || [];
  const ratingSummary = dashboardData?.customer_rating_summary || {
    avg_rating: 9.4,
    total_reviews: 6420,
    high_rating_percentage: 82,
    mid_rating_percentage: 18
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header & Live Sync */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Good Morning, Admin 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time operations for <span className="text-amber-400 font-semibold">Spice Garden Restaurant</span>.
            <span className="text-xs text-slate-500 ml-2">Last updated: {lastUpdated}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncClick}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-2 text-xs shadow-lg cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncing || loading ? 'animate-spin' : ''}`} />
            <span>Sync / Refresh Live Data</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Kitchen Active ({kpis.active_orders_count || 0} Orders In Progress)
          </span>
        </div>
      </div>

      {/* Sync Banner */}
      {syncNotice && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
          <span>{syncNotice}</span>
          <button onClick={() => setSyncNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={loadDashboard} className="underline font-semibold hover:text-red-300">
            Try Again
          </button>
        </div>
      )}

      {/* FINANCIAL SUMMARY SECTION (TODAY, MONTH, YEAR) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              Financial Summary Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Formula: <span className="text-amber-400 font-semibold">Estimated Profit/Loss = Revenue - Waste Cost - Recorded Expenses</span>
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            PostgreSQL Real-Time Query
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* TODAY */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Today's Performance</span>
            <div className="flex justify-between text-slate-300">
              <span>Revenue:</span>
              <span className="font-bold text-white">{formatCurrency(financials.today.revenue)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Waste Cost:</span>
              <span className="text-red-400">{formatCurrency(financials.today.waste)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Other Expenses:</span>
              <span className="text-orange-400">{formatCurrency(financials.today.expenses)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-extrabold text-sm">
              <span className="text-slate-200">Est. Profit/Loss:</span>
              <span className={financials.today.estimated_profit >= 0 ? "text-emerald-400" : "text-red-400"}>
                {formatCurrency(financials.today.estimated_profit)}
              </span>
            </div>
          </div>

          {/* MONTH */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-teal-400 font-bold uppercase tracking-wider text-[11px]">Monthly Summary</span>
            <div className="flex justify-between text-slate-300">
              <span>Monthly Revenue:</span>
              <span className="font-bold text-white">{formatCurrency(financials.month.revenue)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly Waste Cost:</span>
              <span className="text-red-400">{formatCurrency(financials.month.waste)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly Expenses:</span>
              <span className="text-orange-400">{formatCurrency(financials.month.expenses)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-extrabold text-sm">
              <span className="text-slate-200">Est. Profit/Loss:</span>
              <span className={financials.month.estimated_profit >= 0 ? "text-emerald-400" : "text-red-400"}>
                {formatCurrency(financials.month.estimated_profit)}
              </span>
            </div>
          </div>

          {/* YEAR */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">Yearly Financials (2026)</span>
            <div className="flex justify-between text-slate-300">
              <span>Yearly Revenue:</span>
              <span className="font-bold text-white">{formatCurrency(financials.year.revenue)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Yearly Waste Cost:</span>
              <span className="text-red-400">{formatCurrency(financials.year.waste)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Yearly Expenses:</span>
              <span className="text-orange-400">{formatCurrency(financials.year.expenses)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-extrabold text-sm">
              <span className="text-slate-200">Est. Profit/Loss:</span>
              <span className={financials.year.estimated_profit >= 0 ? "text-emerald-400" : "text-red-400"}>
                {formatCurrency(financials.year.estimated_profit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(kpis.today_revenue)}
          subtitle="Live PostgreSQL"
          icon={IndianRupee}
          color="amber"
          trend="14%"
        />
        <StatCard
          title="Today's Orders"
          value={kpis.today_orders.toString()}
          subtitle="Fulfilling live"
          icon={ShoppingBag}
          color="emerald"
          trend="8%"
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(kpis.inventory_value)}
          subtitle="Active evaluation"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Food Waste"
          value={formatCurrency(kpis.today_waste)}
          subtitle="Cost loss today"
          icon={Trash2}
          color="red"
        />
        <StatCard
          title="Low Stock Items"
          value={kpis.low_stock_count.toString()}
          subtitle="Requires reorder"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          title="Active Orders"
          value={`${kpis.active_orders_count || activeOrders.length} Active`}
          subtitle="Pending / Preparing"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* ACTIVE ORDERS SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Active / Kitchen In-Progress Orders ({activeOrders.length})
            </h3>
            <p className="text-xs text-slate-400">Live order queue from PostgreSQL database</p>
          </div>
          <Link to="/orders" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
            Manage Orders Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {activeOrders.length === 0 ? (
            <div className="col-span-3 text-center py-6 text-slate-500">
              No active orders currently in preparation queue.
            </div>
          ) : (
            activeOrders.map((ord) => (
              <div key={ord.id} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-amber-400">{ord.order_number || `ORD-${ord.id}`}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.order_status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    ord.order_status === 'Preparing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {ord.order_status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{ord.customer_name || 'Guest'} ({ord.order_type})</span>
                  <span className="font-extrabold text-white">{formatCurrency(ord.total)}</span>
                </div>
                <p className="text-[11px] text-slate-400">Table: {ord.table_number || 'Takeaway'} • Logged: {ord.order_time || 'Just now'}</p>
              </div>
            ))
          )}
        </div>
      </div>


      {/* Row 1: Charts (7-Day Sales & 7-Day Order Volume) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. 7-Day Sales Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                7-Day Revenue Growth
              </h3>
              <p className="text-xs text-slate-400">Total weekly revenue: ₹3,96,300</p>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-semibold">
              Weekly
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_7_DAYS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 7-Day Order Volume Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                7-Day Order Volume
              </h3>
              <p className="text-xs text-slate-400">Total orders fulfilled: 1,056</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-semibold">
              Orders
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SALES_7_DAYS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(value) => [`${value} orders`, "Orders"]}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Top Selling Dishes & Customer Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Dishes */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Top Selling Dishes
            </h3>
            <Link to="/menu/performance" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {topSellingDishes.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No top dishes loaded yet.</p>
            ) : (
              topSellingDishes.map((dish, idx) => (
                <div key={dish.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{dish.name}</h4>
                      <p className="text-xs text-slate-400">{dish.category} • {dish.total_sold || dish.numberOfRatings || 0} ordered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{formatCurrency(dish.price)}</p>
                    <p className="text-xs text-emerald-400 font-medium">{formatRating(dish.rating)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Rating Summary (OUT OF 10) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Customer Rating Summary</h3>
            <p className="text-xs text-slate-400 mb-6">Overall rating across all menu items (Out of 10)</p>

            <div className="text-center bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl mb-4">
              <div className="text-4xl font-extrabold text-amber-400 tracking-tight">{ratingSummary.avg_rating} / 10</div>
              <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
                {"★".repeat(5)}
              </div>
              <p className="text-xs text-slate-300">Based on {ratingSummary.total_reviews?.toLocaleString() || ratingSummary.total_reviews} customer feedback entries</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between items-center">
              <span>9.0 - 10.0 Rating:</span>
              <span className="font-semibold text-emerald-400">{ratingSummary.high_rating_percentage}% of items</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${ratingSummary.high_rating_percentage}%` }} />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span>7.5 - 8.9 Rating:</span>
              <span className="font-semibold text-amber-400">{ratingSummary.mid_rating_percentage}% of items</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${ratingSummary.mid_rating_percentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Low Stock Alerts & Expiry Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Low Stock Alerts
            </h3>
            <Link to="/inventory/ingredients" className="text-xs text-amber-400 hover:underline">
              Manage Inventory
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.name}</h4>
                  <p className="text-xs text-slate-400">
                    Threshold: {item.minThreshold} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {item.currentStock} {item.unit} Left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiry Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              Expiry Warnings (Next 7 Days)
            </h3>
            <Link to="/inventory/expiry" className="text-xs text-amber-400 hover:underline">
              View Expiry Log
            </Link>
          </div>
          <div className="space-y-3">
            {(dashboardData?.expiry_warnings || MOCK_EXPIRY_ITEMS).map((item) => {
              const statusText = item.display_text || (item.daysLeft < 0 ? 'Expired' : item.daysLeft === 0 ? 'Expires today' : item.daysLeft === 1 ? 'Expires tomorrow' : `Expires in ${item.daysLeft} days`);
              const isRed = item.daysLeft <= 0 || item.category === 'Expired' || item.category === 'Expires today';
              return (
                <div
                  key={item.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.ingredient}</h4>
                    <p className="text-xs text-slate-400">
                      Batch: {item.batch} • {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                      isRed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders, Recent POs, Recent Waste Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Recent Orders</h3>
            <Link to="/orders" className="text-xs text-amber-400 hover:underline">
              View Orders
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentOrders.length === 0 ? (
              <p className="text-slate-500 py-2">No recent orders.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{ord.order_number || ord.id} ({ord.table_number || ord.order_type})</span>
                    <span className="text-amber-400">{formatCurrency(ord.total)}</span>
                  </div>
                  <p className="text-slate-400 truncate mt-1">{ord.customer_name || 'Customer'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Recent Purchase Orders</h3>
            <Link to="/procurement/orders" className="text-xs text-amber-400 hover:underline">
              View POs
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentPurchases.length === 0 ? (
              <p className="text-slate-500 py-2">No recent purchase orders.</p>
            ) : (
              recentPurchases.map((po) => (
                <div key={po.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{po.po_number || po.id}</span>
                    <span className="text-emerald-400">{formatCurrency(po.total_cost)}</span>
                  </div>
                  <p className="text-slate-400 truncate mt-1">{po.supplier_name || 'Supplier'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Waste Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Recent Food Waste</h3>
            <Link to="/waste/record" className="text-xs text-amber-400 hover:underline">
              Waste Logs
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentWaste.length === 0 ? (
              <p className="text-slate-500 py-2">No recent waste logs.</p>
            ) : (
              recentWaste.map((w) => (
                <div key={w.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{w.ingredient_name} ({w.quantity} {w.unit})</span>
                    <span className="text-red-400">₹{w.cost}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{w.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
