import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function WasteAnalytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/waste/summary');
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Error loading waste summary:", err);
      setError(err.message || "Failed to load waste summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const totalCost = summary?.total_cost || 0;
  const totalQty = summary?.total_quantity || 0;
  const totalLogs = summary?.total_records || 0;
  const wasteByReasonData = summary?.by_reason || [];
  const wasteByIngredientData = summary?.by_ingredient || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Waste Analytics & Cost Breakdown</h2>
          <p className="text-sm text-slate-400 mt-1">
            Analyze food waste metrics by ingredient, reason, daily logs, and monthly estimates.
          </p>
        </div>
        <button
          onClick={loadSummary}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          title="Refresh Analytics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Total Waste Cost</p>
          <h3 className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalCost)}</h3>
          <p className="text-xs text-slate-500 mt-2">{totalLogs} recorded logs</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Total Discarded Volume</p>
          <h3 className="text-2xl font-bold text-orange-400 mt-1">{totalQty.toFixed(1)} Units</h3>
          <p className="text-xs text-slate-500 mt-2">Cumulative food waste</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Primary Waste Reason</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">
            {wasteByReasonData.length > 0 ? wasteByReasonData[0].reason : 'Spoilage'}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Highest cost loss contributor</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Highest Loss Item</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1 truncate">
            {wasteByIngredientData.length > 0 ? wasteByIngredientData[0].ingredient_name : 'Saffron'}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Top discarded raw material</p>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Loading analytics summary from PostgreSQL...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4">Waste Cost by Reason</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteByReasonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="reason" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    formatter={(val) => [formatCurrency(val), "Cost Loss"]}
                  />
                  <Bar dataKey="total_cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4">Top Wasted Ingredients (Cost)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteByIngredientData.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="ingredient_name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    formatter={(val) => [formatCurrency(val), "Cost Loss"]}
                  />
                  <Bar dataKey="total_cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
