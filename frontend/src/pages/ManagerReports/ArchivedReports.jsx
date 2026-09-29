import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";
import Modal from "../../components/Modal";
import { apiFetch } from "../../utils/apiHelpers";
import { Archive, Eye, RefreshCw } from "lucide-react";

export default function ArchivedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/manager-reports");
      const list = res.reports || res.data || res || [];
      setReports(list);
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

  const archivedReports = reports.filter((r) => r.type === "Archived");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-teal-500" />
        <span>Loading archived reports from database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <p className="text-red-400 font-bold mb-2">Error Loading Archived Reports</p>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          onClick={fetchReports}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Fallback to all reports if no archived tag found
  const displayReports = archivedReports.length > 0 ? archivedReports : reports;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Archived Manager Reports</h2>
        <p className="text-sm text-slate-400 mt-1">
          Historical quarterly and annual manager reports from former restaurant leadership.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {displayReports.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-xs">
            No archived reports found.
          </div>
        ) : (
          <div className="space-y-3">
            {displayReports.map((rep) => {
              const idStr = rep.report_code || (rep.id ? `REP-${rep.id}` : `REP-${rep.report_id}`);
              const period = rep.month || rep.reportPeriod || "Archived Digest";
              const manager = rep.prepared_by || rep.managerName || "Former Store Manager";
              const rev = Number(rep.total_revenue || rep.revenue || 0);

              return (
                <div key={rep.report_id || rep.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 text-teal-400 rounded-lg border border-slate-700">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{idStr} - {period}</h4>
                      <p className="text-slate-400">By: {manager} • Revenue: {formatCurrency(rev)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingReport(rep)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    View Full Report
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW ARCHIVED REPORT MODAL */}
      <Modal
        isOpen={Boolean(viewingReport)}
        onClose={() => setViewingReport(null)}
        title={viewingReport ? `Archived Manager Audit - ${viewingReport.report_code || viewingReport.id}` : ""}
      >
        {viewingReport && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <p className="text-sm font-bold text-white">{viewingReport.prepared_by || viewingReport.managerName}</p>
                <p className="text-slate-400">
                  Date: {viewingReport.created_at ? viewingReport.created_at.split("T")[0] : viewingReport.reportDate} • Period: {viewingReport.month || viewingReport.reportPeriod}
                </p>
              </div>
              <span className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold">
                Revenue: {formatCurrency(viewingReport.total_revenue || viewingReport.revenue || 0)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-[11px]">Top Dish</p>
                <p className="font-bold text-amber-400">{viewingReport.top_selling_dish || viewingReport.topDish || "Special Thali"}</p>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-[11px]">Lowest Dish</p>
                <p className="font-bold text-red-400">{viewingReport.lowest_selling_dish || viewingReport.lowestPerformingDish || "N/A"}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-300 uppercase tracking-wider mb-1">Major Issues</p>
              <p className="text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                {viewingReport.major_issues || viewingReport.majorIssues || "None recorded."}
              </p>
            </div>

            <div>
              <p className="font-bold text-teal-400 uppercase tracking-wider mb-1">Recommendations</p>
              <p className="text-teal-300 bg-teal-950/20 p-2.5 rounded-lg border border-teal-500/20">
                {viewingReport.recommendations || "Retained for historical audit."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

