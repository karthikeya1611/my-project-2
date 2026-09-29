import React, { useState } from "react";
import { MOCK_HISTORICAL_WASTE_REPORTS } from "../../data/wasteData";
import { formatCurrency } from "../../utils/formatters";
import Modal from "../../components/Modal";
import { FileText, Eye, Download, AlertTriangle } from "lucide-react";

export default function WasteReports() {
  const [activeTab, setActiveTab] = useState("All");
  const [viewingReport, setViewingReport] = useState(null);

  const filteredReports = MOCK_HISTORICAL_WASTE_REPORTS.filter((r) => {
    if (activeTab === "All") return true;
    return r.type === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Historical Waste Reports</h2>
          <p className="text-sm text-slate-400 mt-1">
            Monthly waste summaries, causes, manager remarks, and prevention recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 text-xs">
          {["All", "Current", "Previous", "Archived"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
                activeTab === t
                  ? "bg-red-500 text-slate-950 font-bold"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReports.map((rep) => (
          <div
            key={rep.reportId}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-red-500/40 transition shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-red-400 font-bold">{rep.reportId}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {rep.type}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{rep.month}</h3>
              <p className="text-xs text-slate-400">Prepared by: {rep.preparedBy}</p>

              <div className="mt-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Waste:</span>
                  <span className="font-bold text-white">{rep.totalWasteKg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Loss:</span>
                  <span className="font-bold text-red-400">{formatCurrency(rep.estimatedLoss)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingReport(rep)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              View Full Report
            </button>
          </div>
        ))}
      </div>

      {/* VIEW REPORT MODAL */}
      <Modal
        isOpen={Boolean(viewingReport)}
        onClose={() => setViewingReport(null)}
        title={viewingReport ? `Waste Report - ${viewingReport.month}` : ""}
      >
        {viewingReport && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <p className="text-sm font-bold text-white">{viewingReport.reportId}</p>
                <p className="text-slate-400">Prepared By: {viewingReport.preparedBy}</p>
              </div>
              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold">
                Est. Loss: {formatCurrency(viewingReport.estimatedLoss)}
              </span>
            </div>

            <div>
              <p className="font-bold text-slate-300 uppercase tracking-wider mb-1">Major Causes of Waste</p>
              <p className="text-slate-300 leading-relaxed bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                {viewingReport.majorCauses}
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-300 uppercase tracking-wider mb-1">Manager Remarks</p>
              <p className="text-slate-300 leading-relaxed bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                {viewingReport.managerRemarks}
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-400 uppercase tracking-wider mb-1">Prevention Recommendations</p>
              <p className="text-emerald-300 leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                {viewingReport.recommendations}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
