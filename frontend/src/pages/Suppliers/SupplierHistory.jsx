import React from "react";
import { MOCK_SUPPLIER_HISTORY } from "../../data/suppliersData";
import { formatCurrency } from "../../utils/formatters";
import { History, CheckCircle } from "lucide-react";

export default function SupplierHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Supplier Order History</h2>
        <p className="text-sm text-slate-400 mt-1">
          Historical log of fulfilled purchase orders and quality inspections.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">History ID</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">PO Reference</th>
                <th className="p-3">Total Cost</th>
                <th className="p-3">Delivery Date</th>
                <th className="p-3">Delivery Status</th>
                <th className="p-3 text-right">Quality Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {MOCK_SUPPLIER_HISTORY.map((his) => (
                <tr key={his.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-500">{his.id}</td>
                  <td className="p-3 font-bold text-white">{his.supplierName}</td>
                  <td className="p-3 text-amber-400 font-semibold">{his.poNumber}</td>
                  <td className="p-3 font-bold">{formatCurrency(his.amount)}</td>
                  <td className="p-3 text-slate-400">{his.deliveryDate}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{his.status}</td>
                  <td className="p-3 text-right font-bold text-amber-400">{his.qualityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
