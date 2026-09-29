import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import Modal from "../../components/Modal";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit2,
  Package,
  RefreshCw
} from "lucide-react";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewingIng, setViewingIng] = useState(null);
  const [editingIng, setEditingIng] = useState(null);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/inventory');
      if (res.success) {
        setIngredients(res.data);
      }
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const matchesSearch =
        (ing.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (ing.category && ing.category.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = categoryFilter === "All" || ing.category === categoryFilter;

      const currStatus = ing.status || (ing.current_stock <= ing.min_threshold ? 'Low Stock' : 'In Stock');
      const matchesStatus = statusFilter === "All" || currStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [ingredients, search, categoryFilter, statusFilter]);

  const handleUpdateIngredient = async (e) => {
    e.preventDefault();
    if (!editingIng) return;
    try {
      await fetchApi(`/inventory/${editingIng.id}`, {
        method: 'PUT',
        body: {
          name: editingIng.name,
          category: editingIng.category,
          current_stock: parseFloat(editingIng.current_stock),
          min_threshold: parseFloat(editingIng.min_threshold),
          cost_per_unit: parseFloat(editingIng.cost_per_unit)
        }
      });
      setEditingIng(null);
      loadIngredients();
    } catch (err) {
      alert("Failed to update ingredient: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Inventory Ingredients
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {ingredients.length} Ingredients Managed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of raw food ingredients, stock levels, and min thresholds.
          </p>
        </div>
        <button
          onClick={loadIngredients}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Refresh Inventory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ingredient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="Grains">Grains</option>
            <option value="Poultry">Poultry</option>
            <option value="Meat">Meat</option>
            <option value="Dairy">Dairy</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Spices">Spices</option>
            <option value="Oils">Oils</option>
            <option value="Beverages">Beverages</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Loading stock inventory...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No ingredients found matching the filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400">
                  <th className="p-3.5">Ingredient Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Min Threshold</th>
                  <th className="p-3.5">Cost / Unit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIngredients.map((ing) => {
                  const status = ing.status || (ing.current_stock <= ing.min_threshold ? 'Low Stock' : 'In Stock');
                  return (
                    <tr key={ing.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        {ing.name}
                      </td>
                      <td className="p-3.5 text-slate-300">{ing.category}</td>
                      <td className="p-3.5 font-bold text-slate-100">
                        {ing.current_stock} {ing.unit}
                      </td>
                      <td className="p-3.5 text-slate-400">{ing.min_threshold} {ing.unit}</td>
                      <td className="p-3.5 font-bold text-amber-400">{formatCurrency(ing.cost_per_unit)} / {ing.unit}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          status === 'Low Stock' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingIng(ing)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingIng(ing)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title="Edit Stock"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Ingredient */}
      {viewingIng && (
        <Modal isOpen={!!viewingIng} onClose={() => setViewingIng(null)} title={viewingIng.name}>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400">Category:</span>
              <span className="font-bold text-white">{viewingIng.category}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400">Current Stock:</span>
              <span className="font-bold text-amber-400">{viewingIng.current_stock} {viewingIng.unit}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400">Min Threshold:</span>
              <span className="font-bold text-slate-200">{viewingIng.min_threshold} {viewingIng.unit}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400">Cost Per Unit:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(viewingIng.cost_per_unit)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Edit Ingredient */}
      {editingIng && (
        <Modal isOpen={!!editingIng} onClose={() => setEditingIng(null)} title={`Edit Ingredient: ${editingIng.name}`}>
          <form onSubmit={handleUpdateIngredient} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ingredient Name</label>
              <input
                type="text"
                required
                value={editingIng.name}
                onChange={(e) => setEditingIng({ ...editingIng, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Stock</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingIng.current_stock}
                  onChange={(e) => setEditingIng({ ...editingIng, current_stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingIng.min_threshold}
                  onChange={(e) => setEditingIng({ ...editingIng, min_threshold: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cost Per Unit (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={editingIng.cost_per_unit}
                onChange={(e) => setEditingIng({ ...editingIng, cost_per_unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingIng(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
