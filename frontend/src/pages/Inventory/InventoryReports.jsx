import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { BarChart3, PieChart as PieIcon, Download } from "lucide-react";

export default function InventoryReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Valuation & Reports</h2>
          <p className="text-sm text-slate-400 mt-1">
            Financial asset summary, turnover rates, and holding costs.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Total Stock Asset Value</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(285000)}</h3>
          <p className="text-xs text-slate-500 mt-2">Across 42 tracked items</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Inventory Turnover Rate</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">4.2x / month</h3>
          <p className="text-xs text-slate-500 mt-2">Healthy rotation speed</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">Monthly Holding Cost</p>
          <h3 className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(14200)}</h3>
          <p className="text-xs text-slate-500 mt-2">Cold storage & warehousing</p>
        </div>
      </div>
    </div>
  );
}
