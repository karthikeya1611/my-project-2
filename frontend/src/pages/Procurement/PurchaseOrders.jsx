import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import Modal from "../../components/Modal";
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  Edit2,
  Clock,
  CheckCircle2,
  Package,
  RefreshCw
} from "lucide-react";

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewingPO, setViewingPO] = useState(null);
  const [editingPO, setEditingPO] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newPOForm, setNewPOForm] = useState({
    supplier_id: 1,
    ingredient_id: 1,
    quantity: 20
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [poRes, supRes, ingRes] = await Promise.all([
        fetchApi('/purchase-orders'),
        fetchApi('/suppliers'),
        fetchApi('/inventory')
      ]);

      if (poRes.success) setPurchaseOrders(poRes.data);
      if (supRes.success) setSuppliers(supRes.data);
      if (ingRes.success) setIngredients(ingRes.data);
    } catch (err) {
      console.error("Error loading purchase orders:", err);
      setError(err.message || "Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const poNum = po.po_number || po.poNumber || '';
      const supName = po.supplier_name || po.supplier || '';
      const matchesSearch =
        poNum.toLowerCase().includes(search.toLowerCase()) ||
        supName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || po.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, search, statusFilter]);

  const handleCreatePOSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        supplier_id: parseInt(newPOForm.supplier_id, 10),
        status: 'Pending',
        items: [
          {
            ingredient_id: parseInt(newPOForm.ingredient_id, 10),
            quantity: parseFloat(newPOForm.quantity)
          }
        ]
      };

      await fetchApi('/purchase-orders', {
        method: 'POST',
        body: payload
      });

      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to create purchase order: " + err.message);
    }
  };

  const handleUpdateStatus = async (poId, newStatus) => {
    try {
      await fetchApi(`/purchase-orders/${poId}`, {
        method: 'PUT',
        body: { status: newStatus }
      });
      loadData();
      if (editingPO) setEditingPO(null);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const viewPODetails = async (po) => {
    try {
      const res = await fetchApi(`/purchase-orders/${po.id}`);
      if (res.success) {
        setViewingPO(res.data);
      } else {
        setViewingPO(po);
      }
    } catch (err) {
      setViewingPO(po);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Procurement & Purchase Orders
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {purchaseOrders.length} Orders
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Issue and track purchase orders with raw material suppliers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Issue Purchase Order
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO Number or Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* PO Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Loading purchase orders...</p>
          </div>
        ) : filteredPOs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No POs match criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400">
                  <th className="p-3.5">PO Number</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Order Date</th>
                  <th className="p-3.5">Total Cost</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-amber-400">{po.po_number || po.poNumber || po.id}</td>
                    <td className="p-3.5 font-semibold text-white">{po.supplier_name || po.supplier}</td>
                    <td className="p-3.5 text-slate-300">
                      {po.order_date ? new Date(po.order_date).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(po.total_cost || po.totalAmount)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        po.status === 'In Transit' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => viewPODetails(po)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(po.id, 'Delivered')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-400"
                          title="Mark Delivered"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View PO Details */}
      {viewingPO && (
        <Modal isOpen={!!viewingPO} onClose={() => setViewingPO(null)} title={`Purchase Order: ${viewingPO.po_number || viewingPO.id}`}>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block">Supplier:</span>
                <span className="font-bold text-white">{viewingPO.supplier_name || viewingPO.supplier}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Cost:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(viewingPO.total_cost)}</span>
              </div>
            </div>

            {viewingPO.items && viewingPO.items.length > 0 && (
              <div>
                <span className="text-slate-400 font-bold block mb-2">PO Materials Requested:</span>
                <div className="space-y-1.5">
                  {viewingPO.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-slate-800/30 rounded">
                      <span className="text-slate-200">{it.ingredient_name || it.name} ({it.quantity} {it.unit})</span>
                      <span className="font-bold text-amber-400">{formatCurrency(it.total_cost || it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Create PO */}
      {isCreateModalOpen && (
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Issue Purchase Order">
          <form onSubmit={handleCreatePOSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Supplier</label>
              <select
                value={newPOForm.supplier_id}
                onChange={(e) => setNewPOForm({ ...newPOForm, supplier_id: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Ingredient</label>
                <select
                  value={newPOForm.ingredient_id}
                  onChange={(e) => setNewPOForm({ ...newPOForm, ingredient_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newPOForm.quantity}
                  onChange={(e) => setNewPOForm({ ...newPOForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Issue Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
