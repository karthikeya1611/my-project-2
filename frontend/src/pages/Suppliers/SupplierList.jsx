import React, { useState, useEffect, useMemo } from "react";
import { formatRating } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import { Store, Phone, Mail, Star, Plus, Eye, Edit2, Trash2, MapPin, RefreshCw } from "lucide-react";
import Modal from "../../components/Modal";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [viewingSup, setViewingSup] = useState(null);
  const [editingSup, setEditingSup] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Groceries & Staples",
    contact_person: "",
    phone: "",
    email: "",
    address: ""
  });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/suppliers');
      if (res.success) {
        setSuppliers(res.data);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(search.toLowerCase())) ||
        (s.phone && s.phone.toLowerCase().includes(search.toLowerCase()))
    );
  }, [suppliers, search]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/suppliers', {
        method: 'POST',
        body: formData
      });
      setIsAddModalOpen(false);
      setFormData({ name: "", category: "Groceries & Staples", contact_person: "", phone: "", email: "", address: "" });
      loadSuppliers();
    } catch (err) {
      alert("Failed to add supplier: " + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingSup) return;
    try {
      await fetchApi(`/suppliers/${editingSup.id}`, {
        method: 'PUT',
        body: {
          name: editingSup.name,
          contact_person: editingSup.contact_person,
          phone: editingSup.phone,
          email: editingSup.email,
          category: editingSup.category,
          address: editingSup.address
        }
      });
      setEditingSup(null);
      loadSuppliers();
    } catch (err) {
      alert("Failed to update supplier: " + err.message);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await fetchApi(`/suppliers/${id}`, { method: 'DELETE' });
      loadSuppliers();
    } catch (err) {
      alert("Failed to delete supplier: " + err.message);
    }
  };

  const handleViewSupplierDetails = async (sup) => {
    try {
      const res = await fetchApi(`/suppliers/${sup.id}`);
      if (res.success && res.data) {
        setViewingSup(res.data);
      } else {
        setViewingSup(sup);
      }
    } catch (err) {
      setViewingSup(sup);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Supplier Registry
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {suppliers.length} Vendors Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage vendor profiles, contact channels, current orders & upcoming deliveries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSuppliers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Suppliers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register New Supplier
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Loading suppliers...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No suppliers found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {sup.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {sup.rating || 4.5}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  {sup.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">Contact: {sup.contact_person || 'N/A'}</p>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {sup.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {sup.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleViewSupplierDetails(sup)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  title="View Vendor Details & Orders"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingSup(sup)}
                  className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSupplier(sup.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: View Supplier Details */}
      {viewingSup && (
        <Modal isOpen={!!viewingSup} onClose={() => setViewingSup(null)} title={`Supplier Details: ${viewingSup.name}`}>
          <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* A. Supplier Information */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>A. Supplier Information</span>
                <span className="text-amber-400 text-xs">⭐ Rating: {viewingSup.rating || 4.5}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <p><span className="text-slate-400">Category:</span> {viewingSup.category}</p>
                <p><span className="text-slate-400">Contact Person:</span> {viewingSup.contact_person || 'N/A'}</p>
                <p><span className="text-slate-400">Phone:</span> {viewingSup.phone}</p>
                <p><span className="text-slate-400">Email:</span> {viewingSup.email || 'N/A'}</p>
              </div>
              {viewingSup.address && (
                <p className="text-slate-300 border-t border-slate-700/60 pt-2"><span className="text-slate-400">Address:</span> {viewingSup.address}</p>
              )}
            </div>

            {/* B & C. Current Purchase Orders & Upcoming Deliveries */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">
                B & C. Current Purchase Orders & Upcoming Deliveries ({viewingSup.current_purchase_orders?.length || 0})
              </h4>
              {(!viewingSup.current_purchase_orders || viewingSup.current_purchase_orders.length === 0) ? (
                <p className="text-slate-500 py-2 text-center">No active or upcoming deliveries for this supplier.</p>
              ) : (
                <div className="space-y-2">
                  {viewingSup.current_purchase_orders.map((po, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/80 rounded-lg border border-slate-700 space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-amber-400 font-mono">{po.po_number}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          {po.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Expected Delivery: <strong className="text-white">{po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : 'Pending'}</strong></span>
                        <span className="font-extrabold text-emerald-400">₹{parseFloat(po.total_cost || 0).toLocaleString()}</span>
                      </div>
                      {po.items && po.items.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                          <p className="font-semibold text-slate-300">Items Supplied:</p>
                          {po.items.map((it, i) => (
                            <p key={i} className="pl-2">- {it.item_name} ({it.quantity} {it.unit}) @ ₹{it.unit_cost} = ₹{it.total_cost}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* I. Past Supply History */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">
                I. Past Supply History ({viewingSup.past_orders?.length || 0})
              </h4>
              {(!viewingSup.past_orders || viewingSup.past_orders.length === 0) ? (
                <p className="text-slate-500 py-2 text-center">No past delivered purchase history.</p>
              ) : (
                <div className="space-y-2">
                  {viewingSup.past_orders.slice(0, 4).map((po, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-slate-300 font-bold">{po.po_number}</span>
                        <p className="text-slate-400 text-[11px]">Delivered: {po.order_date ? new Date(po.order_date).toLocaleDateString() : 'Completed'}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">₹{parseFloat(po.total_cost || 0).toLocaleString()}</span>
                        <span className="block text-[10px] text-emerald-400 font-semibold">{po.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add Supplier */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Supplier">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Register Supplier
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
