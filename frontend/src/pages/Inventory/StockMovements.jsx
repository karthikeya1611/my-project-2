import React, { useState, useEffect } from "react";
import { fetchApi } from "../../utils/apiHelpers";
import { ArrowDownRight, ArrowUpRight, AlertOctagon, RefreshCw, Plus } from "lucide-react";
import Modal from "../../components/Modal";

export default function StockMovements() {
  const [movements, setMovements] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngId, setSelectedIngId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    ingredient_id: 1,
    transaction_type: "RESTOCK",
    quantity: 10,
    reason: "Supplier Restock"
  });

  const loadMovements = async (ingId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi(`/inventory/${ingId}/movements`);
      if (res.success) {
        setMovements(res.data);
      }
    } catch (err) {
      console.error("Error loading movements:", err);
      setError(err.message || "Failed to load movements");
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const res = await fetchApi('/inventory');
      if (res.success && res.data.length > 0) {
        setIngredients(res.data);
        setSelectedIngId(res.data[0].id);
        loadMovements(res.data[0].id);
      }
    } catch (err) {
      console.error("Error loading ingredients:", err);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleIngSelect = (e) => {
    const id = parseInt(e.target.value, 10);
    setSelectedIngId(id);
    loadMovements(id);
  };

  const handleCreateMovement = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/inventory/movements', {
        method: 'POST',
        body: {
          ingredient_id: parseInt(form.ingredient_id, 10),
          transaction_type: form.transaction_type,
          quantity: parseFloat(form.quantity),
          reason: form.reason
        }
      });
      setIsModalOpen(false);
      loadMovements(selectedIngId);
    } catch (err) {
      alert("Failed to record movement: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Stock Movements & Audits</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track movement history across Restock, Usage, Waste, Return, and Adjustments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMovements(selectedIngId)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" /> Record Movement
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Ingredient Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 text-xs">
        <label className="text-slate-300 font-semibold">Select Ingredient to Audit:</label>
        <select
          value={selectedIngId}
          onChange={handleIngSelect}
          className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
        >
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>{ing.name} ({ing.current_stock} {ing.unit})</option>
          ))}
        </select>
      </div>

      {/* Movements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-8 text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-xs">Loading movements...</p>
          </div>
        ) : movements.length === 0 ? (
          <p className="text-slate-400 text-xs py-4 text-center">No movement logs for this ingredient yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Ingredient</th>
                  <th className="p-3">Movement Type</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {movements.map((mov) => {
                  const isAdd = mov.transaction_type === 'RESTOCK' || mov.transaction_type === 'ADJUSTMENT';
                  return (
                    <tr key={mov.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-slate-400">TX-{mov.id}</td>
                      <td className="p-3 font-bold text-white">{mov.ingredient_name || 'Ingredient'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isAdd ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {mov.transaction_type}
                        </span>
                      </td>
                      <td className={`p-3 font-bold ${isAdd ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isAdd ? '+' : '-'}{mov.quantity} {mov.unit}
                      </td>
                      <td className="p-3 text-slate-300">{mov.reason || 'General'}</td>
                      <td className="p-3 text-right text-slate-400">
                        {mov.transaction_date ? new Date(mov.transaction_date).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record Movement */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Stock Movement">
          <form onSubmit={handleCreateMovement} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ingredient</label>
              <select
                value={form.ingredient_id}
                onChange={(e) => setForm({ ...form, ingredient_id: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              >
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Movement Type</label>
                <select
                  value={form.transaction_type}
                  onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                >
                  <option value="RESTOCK">RESTOCK (+)</option>
                  <option value="USAGE">USAGE (-)</option>
                  <option value="WASTE">WASTE (-)</option>
                  <option value="RETURN">RETURN (-)</option>
                  <option value="ADJUSTMENT">ADJUSTMENT (+)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reason / Description</label>
              <input
                type="text"
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
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
                Save Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
