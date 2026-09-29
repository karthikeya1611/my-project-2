import React, { useState, useEffect } from "react";
import { formatCurrency, formatRating } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import Modal from "../../components/Modal";
import { Utensils, RefreshCw, Star, CheckCircle2, XCircle } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catRes, menuRes] = await Promise.all([
        fetchApi('/categories'),
        fetchApi('/menu')
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (menuRes.success) setMenuItems(menuRes.data);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryStats = categories.map((cat) => {
    const items = menuItems.filter(
      (item) => item.category_id === cat.id || item.category_name === cat.name || item.category === cat.name
    );
    const totalCount = items.length;
    const avgPrice = totalCount > 0 ? Math.round(items.reduce((sum, item) => sum + parseFloat(item.price), 0) / totalCount) : 0;
    const avgRating = totalCount > 0
      ? (items.reduce((sum, item) => sum + parseFloat(item.avg_rating || item.rating || 9.0), 0) / totalCount).toFixed(1)
      : "9.0";

    return {
      id: cat.id,
      category: cat.name,
      totalCount,
      avgPrice,
      avgRating,
      items
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Menu Categories</h2>
          <p className="text-sm text-slate-400 mt-1">
            Click any category card to view all menu items belonging to that category.
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Refresh Categories"
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
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Loading categories from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryStats.map((stat) => (
            <div
              key={stat.id}
              onClick={() => setSelectedCategoryModal(stat)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/60 transition shadow-lg flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    {stat.totalCount} items
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-1">{stat.category}</h3>
                <p className="text-xs text-slate-400">Average Price: {formatCurrency(stat.avgPrice)}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-medium">
                <span className="text-slate-400">Category Rating:</span>
                <span className="text-amber-400 font-bold">⭐ {stat.avgRating} / 10</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Category Items List */}
      {selectedCategoryModal && (
        <Modal
          isOpen={!!selectedCategoryModal}
          onClose={() => setSelectedCategoryModal(null)}
          title={`Category: ${selectedCategoryModal.category} (${selectedCategoryModal.items.length} Items)`}
        >
          <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
            {selectedCategoryModal.items.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No menu items currently in this category.</p>
            ) : (
              selectedCategoryModal.items.map((item) => {
                const isAvail = item.is_available ?? (item.availability === "In Stock");
                return (
                  <div key={item.id} className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAvail ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isAvail ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{item.description || "Authentic freshly prepared dish."}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="font-extrabold text-amber-400 text-sm block">{formatCurrency(item.price)}</span>
                      <span className="text-emerald-400 text-xs font-semibold">⭐ {formatRating(item.avg_rating || item.rating || 9.0)} / 10</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

