import React from "react";
import { initialSuppliers } from "../../data/suppliersData";
import { formatRating } from "../../utils/formatters";
import { Award, Clock, Star } from "lucide-react";

export default function SupplierPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Supplier Performance & Scorecards</h2>
        <p className="text-sm text-slate-400 mt-1">
          Evaluate vendor reliability, delivery accuracy, and quality metrics (Out of 10).
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Vendor</th>
                <th className="p-3">Category</th>
                <th className="p-3">On-Time Delivery %</th>
                <th className="p-3">Quality Score (Out of 10)</th>
                <th className="p-3">Active POs</th>
                <th className="p-3 text-right">Overall Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {initialSuppliers.map((sup, idx) => (
                <tr key={sup.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-white">{sup.name}</td>
                  <td className="p-3 text-slate-400">{sup.category}</td>
                  <td className="p-3 text-emerald-400 font-bold">{sup.onTimeDeliveryRate}</td>
                  <td className="p-3 font-bold text-amber-400">{formatRating(sup.rating)}</td>
                  <td className="p-3 text-slate-300">{sup.activeOrders}</td>
                  <td className="p-3 text-right font-extrabold text-blue-400">#{idx + 1} Vendor</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
