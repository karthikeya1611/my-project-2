import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";
import Modal from "../../components/Modal";
import { fetchApi } from "../../utils/apiHelpers";
import { Eye, RefreshCw, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

export default function CurrentReports() {
  const [digests, setDigests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi("/manager-reports?type=live-digests");
      if (res.success && res.data) {
        setDigests(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch manager reports:", err);
      setError(err.message || "Failed to fetch manager reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const reportKeys = [
    { key: "daily", title: "Daily Management Report", tag: "Daily" },
    { key: "weekly", title: "Weekly Operations Report", tag: "Weekly" },
    { key: "monthly", title: "Monthly Executive Report", tag: "Monthly" },
    { key: "yearly", title: "Yearly Audit Report", tag: "Yearly" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Management Reports
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Real-Time PostgreSQL Data
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Calculated operational summaries across Daily, Weekly, Monthly, and Yearly intervals.
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Refresh Reports"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Calculating live management reports from PostgreSQL...</p>
        </div>
      ) : !digests ? (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
          No management report data calculated.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportKeys.map(({ key, title, tag }) => {
            const rep = digests[key] || {};
            return (
              <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {tag} Digest
                    </span>
                    <span className="text-xs text-slate-400">{rep.period}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <p className="text-slate-400 text-[11px]">Revenue</p>
                      <p className="font-extrabold text-emerald-400 text-sm mt-0.5">{formatCurrency(rep.revenue)}</p>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <p className="text-slate-400 text-[11px]">Est. Profit / Loss</p>
                      <p className="font-extrabold text-amber-400 text-sm mt-0.5">{formatCurrency(rep.estimated_profit)}</p>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <p className="text-slate-400 text-[11px]">Waste Cost</p>
                      <p className="font-semibold text-red-400 text-xs mt-0.5">{formatCurrency(rep.waste_cost)}</p>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <p className="text-slate-400 text-[11px]">Expenses</p>
                      <p className="font-semibold text-orange-400 text-xs mt-0.5">{formatCurrency(rep.expenses)}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1 text-xs">
                    <p className="text-slate-300"><strong>Top Dish:</strong> <span className="text-amber-400">{rep.top_selling_dish}</span></p>
                    <p className="text-slate-300"><strong>Low-Performing Dish:</strong> <span className="text-red-400">{rep.lowest_selling_dish}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => setViewingReport({ ...rep, title, tag })}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  View Full {tag} Management Report
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW COMPLETE MANAGEMENT REPORT MODAL */}
      {viewingReport && (
        <Modal
          isOpen={Boolean(viewingReport)}
          onClose={() => setViewingReport(null)}
          title={`${viewingReport.title} - Complete Details`}
        >
          <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex justify-between items-center bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div>
                <p className="text-sm font-bold text-white">{viewingReport.period}</p>
                <p className="text-slate-400 text-[11px]">Total Orders: {viewingReport.orders} orders fulfilled</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[11px] block">Est. Net Profit</span>
                <span className="text-sm font-extrabold text-emerald-400">{formatCurrency(viewingReport.estimated_profit)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Total Revenue</span>
                <span className="font-extrabold text-emerald-400 text-sm">{formatCurrency(viewingReport.revenue)}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Waste Cost</span>
                <span className="font-extrabold text-red-400 text-sm">{formatCurrency(viewingReport.waste_cost)}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Total Expenses</span>
                <span className="font-extrabold text-orange-400 text-sm">{formatCurrency(viewingReport.expenses)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-[11px] font-bold">Top Selling Dish</p>
                <p className="font-bold text-amber-400 text-sm mt-0.5">{viewingReport.top_selling_dish}</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-[11px] font-bold">Low Performing Dish</p>
                <p className="font-bold text-red-400 text-sm mt-0.5">{viewingReport.lowest_selling_dish}</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <p className="font-bold text-slate-200 uppercase tracking-wider mb-1 text-[11px]">Inventory & Major Waste Causes</p>
              <p className="text-slate-300 leading-relaxed">{viewingReport.major_issues || "Perishable items monitored; minimal wastage."}</p>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <p className="font-bold text-amber-400 uppercase tracking-wider mb-1 text-[11px]">Procurement & Management Recommendations</p>
              <p className="text-amber-200 leading-relaxed">{viewingReport.recommendations || "Optimize stock buffer based on weekly demand."}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


