import React, { useState } from "react";
import { formatCurrency, formatRating } from "../utils/formatters";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  Store,
  Trash2,
  Star,
  Download,
  Calendar,
  Filter
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { MOCK_SALES_7_DAYS, MOCK_CATEGORY_SALES } from "../data/reportsData";
import { initialMenuItems } from "../data/menuData";
import { initialIngredients } from "../data/inventoryData";
import { initialSuppliers } from "../data/suppliersData";
import { initialPurchaseOrders } from "../data/procurementData";
import { initialWasteLogs } from "../data/wasteData";
import { initialExpenses } from "../data/expensesData";

export default function Reports() {
  const [activeSubReport, setActiveSubReport] = useState("sales");
  const [dateRange, setDateRange] = useState("this-month");

  const subReportsList = [
    { id: "sales", label: "Sales Reports", icon: TrendingUp },
    { id: "menu", label: "Menu Performance Reports", icon: BarChart3 },
    { id: "inventory", label: "Inventory Reports", icon: Package },
    { id: "procurement", label: "Procurement Reports", icon: ShoppingCart },
    { id: "supplier", label: "Supplier Reports", icon: Store },
    { id: "waste", label: "Waste Reports", icon: Trash2 },
    { id: "expense", label: "Expense Reports", icon: DollarSign },
    { id: "rating", label: "Customer Rating Reports", icon: Star }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Reports Hub</h2>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive business reports for sales, menu, inventory, procurement, suppliers, waste, expenses, and ratings.
          </p>
        </div>

        {/* Global Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month (September 2026)</option>
            <option value="last-quarter">Last Quarter (Q2 2026)</option>
          </select>
          <button className="px-3 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* 8 Sub-report Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {subReportsList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubReport(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. Sales Reports */}
      {activeSubReport === "sales" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <p className="text-xs text-slate-400">Total Gross Sales</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(386500)}</h3>
              <p className="text-xs text-slate-500 mt-2">1,054 fulfilled orders</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <p className="text-xs text-slate-400">Average Daily Revenue</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(55214)}</h3>
              <p className="text-xs text-slate-500 mt-2">Peak on Sunday (₹71.4k)</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <p className="text-xs text-slate-400">Average Ticket Size</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(366)}</h3>
              <p className="text-xs text-slate-500 mt-2">Dine-in & Delivery average</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">7-Day Sales Performance Chart</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SALES_7_DAYS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} formatter={(v) => [formatCurrency(v), "Sales"]} />
                  <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Menu Performance Reports */}
      {activeSubReport === "menu" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Top Revenue Generating Dishes</h3>
            <div className="space-y-3">
              {initialMenuItems.slice(0, 5).map((dish, i) => (
                <div key={dish.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">#{i + 1} {dish.name}</span>
                    <p className="text-slate-400">{dish.category} • Rating: {formatRating(dish.rating)}</p>
                  </div>
                  <span className="font-extrabold text-amber-400">{formatCurrency(dish.price * dish.numberOfRatings)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Inventory Reports */}
      {activeSubReport === "inventory" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Stock Valuation & Health Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <p className="text-slate-400">Total Stock Value</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(285000)}</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <p className="text-slate-400">Tracked Ingredients</p>
                <p className="text-lg font-bold text-white">34 Ingredients</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <p className="text-slate-400">Low Stock Reorders</p>
                <p className="text-lg font-bold text-orange-400">6 Items</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. Procurement Reports */}
      {activeSubReport === "procurement" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Purchase Orders Status Distribution</h3>
            <div className="space-y-3 text-xs">
              {initialPurchaseOrders.map((po) => (
                <div key={po.poNumber} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-400">{po.poNumber} - {po.supplier}</span>
                    <p className="text-slate-400">{po.quantity} • Expected: {po.expectedDelivery}</p>
                  </div>
                  <span className="font-extrabold text-amber-400">{formatCurrency(po.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. Supplier Reports */}
      {activeSubReport === "supplier" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Supplier Delivery & Scorecard Summary</h3>
            <div className="space-y-3 text-xs">
              {initialSuppliers.map((sup) => (
                <div key={sup.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{sup.name} ({sup.category})</span>
                    <p className="text-slate-400">Lead Time: {sup.leadTime} • Phone: {sup.contact.phone}</p>
                  </div>
                  <span className="font-bold text-amber-400">Score: {formatRating(sup.rating)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. Waste Reports */}
      {activeSubReport === "waste" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Food Spoilage & Loss Report</h3>
            <div className="space-y-3 text-xs">
              {initialWasteLogs.map((w) => (
                <div key={w.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{w.ingredient} ({w.quantity} {w.unit})</span>
                    <p className="text-slate-400">Reason: {w.reason} • Date: {w.date}</p>
                  </div>
                  <span className="font-extrabold text-red-400">{formatCurrency(w.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. Expense Reports */}
      {activeSubReport === "expense" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Operational Expenses Audit</h3>
            <div className="space-y-3 text-xs">
              {initialExpenses.map((exp) => (
                <div key={exp.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{exp.description}</span>
                    <p className="text-slate-400">Category: {exp.category} • Date: {exp.date}</p>
                  </div>
                  <span className="font-extrabold text-amber-400">{formatCurrency(exp.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. Customer Rating Reports */}
      {activeSubReport === "rating" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Customer Ratings Summary (Out of 10)</h3>
            <div className="p-6 bg-slate-800/60 rounded-xl border border-slate-700 text-center max-w-md mx-auto">
              <div className="text-4xl font-extrabold text-amber-400">9.4 / 10</div>
              <p className="text-xs text-slate-300 mt-2">Based on 6,420 customer feedback entries</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">96.2% Positive Feedback Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
