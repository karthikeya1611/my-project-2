import React from "react";
import { MOCK_PENDING_DELIVERIES } from "../../data/procurementData";
import { Truck, Clock, Phone } from "lucide-react";

export default function PendingDeliveries() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Pending Deliveries</h2>
        <p className="text-sm text-slate-400 mt-1">
          Live tracking of incoming shipments and delivery drivers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PENDING_DELIVERIES.map((del) => (
          <div key={del.poId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-purple-400 font-bold">{del.poId}</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {del.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{del.supplier}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Expected: {del.eta}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Truck className="w-4 h-4 text-purple-400" /> Driver:
              </span>
              <span className="font-semibold text-slate-200">{del.driver}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
