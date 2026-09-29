import React, { useState, useEffect } from "react";
import { fetchApi } from "../../utils/apiHelpers";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

export default function ExpiryTracking() {
  const [expiryItems, setExpiryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const loadExpiryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/inventory/expiry');
      if (res.success) {
        setExpiryItems(res.data);
      }
    } catch (err) {
      console.error("Error loading expiry tracking:", err);
      setError(err.message || "Failed to load expiry data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpiryData();
  }, []);

  const categories = ["All", "Expired", "Expires today", "Expires tomorrow", "Expiring within 7 days"];

  const filteredItems = expiryItems.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Expired") return item.daysLeft < 0;
    if (activeCategory === "Expires today") return item.daysLeft === 0;
    if (activeCategory === "Expires tomorrow") return item.daysLeft === 1;
    if (activeCategory === "Expiring within 7 days") return item.daysLeft >= 0 && item.daysLeft <= 7;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Ingredient Expiry Tracking
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {expiryItems.length} Batches Tracked
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Monitor perishable ingredient expiration dates directly from PostgreSQL database.
          </p>
        </div>
        <button
          onClick={loadExpiryData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Refresh Expiry Log"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = cat === "All" ? expiryItems.length :
            cat === "Expired" ? expiryItems.filter(i => i.daysLeft < 0).length :
            cat === "Expires today" ? expiryItems.filter(i => i.daysLeft === 0).length :
            cat === "Expires tomorrow" ? expiryItems.filter(i => i.daysLeft === 1).length :
            expiryItems.filter(i => i.daysLeft >= 0 && i.daysLeft <= 7).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Expiry Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Loading expiry tracking from database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
          No ingredient batches match the selected category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const daysLeft = item.daysLeft;
            const isExpired = daysLeft < 0;
            const isToday = daysLeft === 0;
            const isTomorrow = daysLeft === 1;

            const badgeColor = isExpired
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : isToday
              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
              : isTomorrow
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

            return (
              <div
                key={item.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-3 transition ${
                  isExpired
                    ? "border-red-500/80 bg-red-950/10"
                    : isToday
                    ? "border-orange-500/80 bg-orange-950/10"
                    : "border-slate-800 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{item.batch}</span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeColor}`}>
                    {item.display_text}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{item.ingredient}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Stock Batch Quantity: {item.quantity}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Expiry: {item.expiryDate}
                  </span>
                  <span className={`font-bold ${isExpired || isToday ? 'text-red-400' : 'text-amber-400'}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

