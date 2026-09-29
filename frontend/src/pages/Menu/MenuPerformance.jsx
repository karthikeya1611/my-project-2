import React from "react";
import { initialMenuItems } from "../../data/menuData";
import { MOCK_CATEGORY_SALES } from "../../data/reportsData";
import { formatCurrency, formatRating } from "../../utils/formatters";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";

export default function MenuPerformance() {
  const sortedByPopularity = initialMenuItems.slice().sort((a, b) => b.numberOfRatings - a.numberOfRatings);
  const topSelling = sortedByPopularity.slice(0, 5);

  const sortedByRating = initialMenuItems.slice().sort((a, b) => b.rating - a.rating);
  const highestRated = sortedByRating.slice(0, 5);
  const lowestRated = sortedByRating.slice(-5).reverse();

  // Color palette for category pie chart
  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

  // Bar chart data for top revenue items
  const revenueByDishData = topSelling.map((dish) => ({
    name: dish.name.length > 15 ? dish.name.substring(0, 15) + "..." : dish.name,
    estimatedRevenue: dish.price * dish.numberOfRatings
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Menu Performance Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed sales, customer demand, rating benchmarks (out of 10), and revenue share by category.
        </p>
      </div>

      {/* Row 1: Charts (Revenue by Dish & Sales by Category) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Dish Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Estimated Revenue by Top Dishes
          </h3>
          <p className="text-xs text-slate-400 mb-4">Calculated from price × order volume</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDishData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(val) => [formatCurrency(val), "Revenue"]}
                />
                <Bar dataKey="estimatedRevenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Share by Category Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-1">Sales Share by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Percentage contribution to total kitchen output</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_CATEGORY_SALES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {MOCK_CATEGORY_SALES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(val) => [`${val}%`, "Category Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Top Selling, Highest Rated, Lowest Rated tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Dishes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Top Selling Dishes
          </h3>
          <div className="space-y-3">
            {topSelling.map((dish, i) => (
              <div key={dish.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-200">#{i + 1} {dish.name}</h4>
                  <p className="text-slate-400">{dish.category} • {dish.numberOfRatings} orders</p>
                </div>
                <span className="font-bold text-amber-400">{formatCurrency(dish.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Rated Dishes (Out of 10) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Highest Rated Dishes (Out of 10)
          </h3>
          <div className="space-y-3">
            {highestRated.map((dish, i) => (
              <div key={dish.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-200">#{i + 1} {dish.name}</h4>
                  <p className="text-slate-400">{dish.category}</p>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {formatRating(dish.rating)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lowest Rated Dishes (Out of 10) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Lowest Rated Dishes (Out of 10)
          </h3>
          <div className="space-y-3">
            {lowestRated.map((dish, i) => (
              <div key={dish.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-semibold text-slate-200">{dish.name}</h4>
                  <p className="text-slate-400">{dish.category}</p>
                </div>
                <span className="font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                  {formatRating(dish.rating)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
