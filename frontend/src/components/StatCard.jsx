import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "amber", trend }) {
  const colorMap = {
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  };

  const selectedColorClass = colorMap[color] || colorMap.amber;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-all shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${selectedColorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className="text-xs font-semibold text-emerald-400 mt-1.5 flex items-center gap-1">
            <span>↑ {trend}</span>
          </p>
        )}
      </div>
    </div>
  );
}
