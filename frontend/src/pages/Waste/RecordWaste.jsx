import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import Modal from "../../components/Modal";
import { Trash2, Plus, Search, RefreshCw, XCircle } from "lucide-react";

export default function RecordWaste() {
  const [wasteLogs, setWasteLogs] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ingredient_id: 1,
    quantity: 2,
    reason: "Spoilage"
  });

  const loadWasteData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [wasteRes, ingRes] = await Promise.all([
        fetchApi('/waste'),
        fetchApi('/inventory')
      ]);

      if (wasteRes.success) setWasteLogs(wasteRes.data);
      if (ingRes.success) setIngredients(ingRes.data);
    } catch (err) {
      console.error("Error loading waste logs:", err);
      setError(err.message || "Failed to load waste records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWasteData();
  }, []);

  const filteredLogs = useMemo(() => {
    return wasteLogs.filter((w) => {
      const ingName = w.ingredient_name || w.ingredient || '';
      const matchesSearch =
        ingName.toLowerCase().includes(search.toLowerCase()) ||
        w.id.toString().includes(search.toLowerCase());
      const matchesReason = reasonFilter === "All" || w.reason === reasonFilter;
      return matchesSearch && matchesReason;
    });
  }, [wasteLogs, search, reasonFilter]);

  const totalWasteCost = wasteLogs.reduce((sum, w) => sum + parseFloat(w.cost || 0), 0);
  const totalWasteQtyKg = wasteLogs.reduce((sum, w) => sum + parseFloat(w.quantity || 0), 0);

  const handleAddWaste = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/waste', {
        method: 'POST',
        body: {
          ingredient_id: parseInt(formData.ingredient_id, 10),
          quantity: parseFloat(formData.quantity),
          reason: formData.reason
        }
      });
      setIsModalOpen(false);
      loadWasteData();
    } catch (err) {
      alert("Failed to log waste: " + err.message);
    }
  };

  const handleDeleteWaste = async (id) => {
    if (!window.confirm("Are you sure you want to delete this waste record?")) return;
    try {
      await fetchApi(`/waste/${id}`, { method: 'DELETE' });
      loadWasteData();
    } catch (err) {
      alert("Failed to delete waste log: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Record Kitchen Waste
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {wasteLogs.length} Logs Registered
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Log food waste, spoilage causes, and financial cost impact.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadWasteData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Refresh Waste Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" /> Log Waste Entry
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Analytics KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Waste Cost Loss</p>
          <h3 className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalWasteCost)}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Wasted Weight / Volume</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{totalWasteQtyKg.toFixed(1)} Units</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ingredient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
          />
        </div>
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
        >
          <option value="All">All Waste Reasons</option>
          <option value="Spoilage">Spoilage</option>
          <option value="Expired">Expired</option>
          <option value="Overproduction">Overproduction</option>
          <option value="Preparation Waste">Preparation Waste</option>
          <option value="Damaged">Damaged</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Waste Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Loading waste records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No waste logs match selected criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400">
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Ingredient Wasted</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Cost Loss</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400">W-{log.id}</td>
                    <td className="p-3.5 font-bold text-white">{log.ingredient_name || log.ingredient}</td>
                    <td className="p-3.5 text-amber-400 font-bold">{log.quantity} {log.unit}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {log.reason}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-red-400">₹{log.cost}</td>
                    <td className="p-3.5 text-slate-400">
                      {log.waste_date ? new Date(log.waste_date).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteWaste(log.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"
                        title="Delete Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Log Waste Entry */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Kitchen Waste Entry">
          <form onSubmit={handleAddWaste} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Wasted Ingredient</label>
              <select
                value={formData.ingredient_id}
                onChange={(e) => setFormData({ ...formData, ingredient_id: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              >
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Wasted Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Waste Reason</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                >
                  <option value="Spoilage">Spoilage</option>
                  <option value="Expired">Expired</option>
                  <option value="Overproduction">Overproduction</option>
                  <option value="Preparation Waste">Preparation Waste</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Log Entry
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
