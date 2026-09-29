import React from "react";
import { initialPurchaseOrders } from "../../data/procurementData";
import { formatCurrency } from "../../utils/formatters";

export default function PurchaseHistory() {
  const completedPOs = initialPurchaseOrders.filter((p) => p.status === "Delivered");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Purchase History</h2>
        <p className="text-sm text-slate-400 mt-1">
          Historical record of completed purchase transactions and payments.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">PO Reference</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Items Summary</th>
                <th className="p-3">Total Paid</th>
                <th className="p-3">Order Date</th>
                <th className="p-3 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {completedPOs.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-purple-400 font-bold">{po.id}</td>
                  <td className="p-3 font-bold text-white">{po.supplier}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{po.itemsList}</td>
                  <td className="p-3 font-extrabold text-emerald-400">{formatCurrency(po.totalCost)}</td>
                  <td className="p-3 text-slate-400">{po.orderDate}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">Fulfilled & Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
