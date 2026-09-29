import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../utils/formatters";
import { fetchApi } from "../utils/apiHelpers";
import Modal from "../components/Modal";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  Edit2,
  XCircle,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    table_number: "Table 01",
    order_type: "Dine-in",
    customer_name: "",
    payment_method: "UPI",
    discount: 0,
    selected_menu_item_id: 1,
    quantity: 1
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, menuRes] = await Promise.all([
        fetchApi('/orders?limit=100'),
        fetchApi('/menu')
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (menuRes.success) setMenuItems(menuRes.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const analytics = useMemo(() => {
    const totalOrdersCount = orders.length;
    const completedOrdersList = orders.filter((o) => (o.order_status || o.orderStatus) === "Completed");
    const cancelledOrdersCount = orders.filter((o) => (o.order_status || o.orderStatus) === "Cancelled").length;
    const totalRevenue = completedOrdersList.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const avgOrderValue = completedOrdersList.length > 0 ? Math.round(totalRevenue / completedOrdersList.length) : 0;

    return {
      totalOrdersCount,
      totalRevenue,
      avgOrderValue,
      completedCount: completedOrdersList.length,
      cancelledOrdersCount
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const ordNum = ord.order_number || ord.orderId || '';
      const custName = ord.customer_name || ord.customerName || '';
      const tbl = ord.table_number || ord.tableNumber || '';
      const oType = ord.order_type || ord.orderType || '';
      const pStatus = ord.payment_status || ord.paymentStatus || '';
      const oStatus = ord.order_status || ord.orderStatus || '';

      const matchesSearch =
        ordNum.toLowerCase().includes(search.toLowerCase()) ||
        custName.toLowerCase().includes(search.toLowerCase()) ||
        tbl.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || oType === typeFilter;
      const matchesPayment = paymentFilter === "All" || pStatus === paymentFilter;
      const matchesStatus =
        statusFilter === "All" ? true :
        statusFilter === "Active" ? ['Pending', 'Preparing', 'Ready'].includes(oStatus) :
        oStatus === statusFilter;


      return matchesSearch && matchesType && matchesPayment && matchesStatus;
    });
  }, [orders, search, typeFilter, paymentFilter, statusFilter]);

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDish = menuItems.find(m => m.id === parseInt(newOrderForm.selected_menu_item_id, 10)) || menuItems[0];
      const payload = {
        order_type: newOrderForm.order_type,
        table_number: newOrderForm.table_number,
        payment_method: newOrderForm.payment_method,
        discount: parseFloat(newOrderForm.discount || 0),
        items: [
          {
            menu_item_id: selectedDish.id,
            quantity: parseInt(newOrderForm.quantity, 10),
            unit_price: parseFloat(selectedDish.price)
          }
        ]
      };

      await fetchApi('/orders', {
        method: 'POST',
        body: payload
      });

      setIsCreateModalOpen(false);
      loadOrders();
    } catch (err) {
      alert("Failed to create order: " + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetchApi(`/orders/${orderId}`, {
        method: 'PUT',
        body: { order_status: newStatus }
      });
      loadOrders();
      if (editingOrder) setEditingOrder(null);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await fetchApi(`/orders/${orderId}`, { method: 'DELETE' });
      loadOrders();
    } catch (err) {
      alert("Failed to cancel order: " + err.message);
    }
  };

  const viewOrderDetails = async (ord) => {
    try {
      const res = await fetchApi(`/orders/${ord.id}`);
      if (res.success) {
        setViewingOrder(res.data);
      } else {
        setViewingOrder(ord);
      }
    } catch (err) {
      setViewingOrder(ord);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Orders & Sales Management
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {orders.length} Total Orders
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fulfillment tracking across Dine-in, Takeaway, and Delivery orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Order
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Sales Revenue</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(analytics.totalRevenue)}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Average Order Value</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(analytics.avgOrderValue)}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Completed Orders</p>
          <h3 className="text-2xl font-bold text-white mt-1">{analytics.completedCount}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Cancelled Orders</p>
          <h3 className="text-2xl font-bold text-red-400 mt-1">{analytics.cancelledOrdersCount}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order # or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Order Types</option>
            <option value="Dine-in">Dine-in</option>
            <option value="Takeaway">Takeaway</option>
            <option value="Delivery">Delivery</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="All">All Order Statuses</option>
            <option value="Active">Active Queue (Pending / Preparing / Ready)</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Active Orders Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Active Kitchen Queue ({orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.order_status || o.orderStatus)).length} Orders)
          </h3>
          <span className="text-[11px] text-slate-400">Live order fulfillment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.order_status || o.orderStatus)).length === 0 ? (
            <div className="col-span-3 text-center py-4 text-slate-500">No active kitchen orders in queue.</div>
          ) : (
            orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.order_status || o.orderStatus)).slice(0, 6).map((ord) => (
              <div key={ord.id} className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-amber-400">{ord.order_number || `ORD-${ord.id}`}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    (ord.order_status || ord.orderStatus) === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    (ord.order_status || ord.orderStatus) === 'Preparing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {ord.order_status || ord.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between text-slate-200 font-medium">
                  <span>{ord.customer_name || ord.customerName || 'Walk-in'} ({ord.order_type || ord.orderType})</span>
                  <span className="font-extrabold text-amber-400">{formatCurrency(ord.total)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-700/60 text-[11px]">
                  <span className="text-slate-400">{ord.table_number || 'Takeaway'}</span>
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'Completed')}
                    className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-semibold hover:bg-emerald-500/30"
                  >
                    Mark Complete ✓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Loading live orders from PostgreSQL...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No orders match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Customer & Table</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((ord) => {
                  const oStatus = ord.order_status || ord.orderStatus || 'Completed';
                  const pStatus = ord.payment_status || ord.paymentStatus || 'Paid';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-amber-400">{ord.order_number || ord.orderId || ord.id}</td>
                      <td className="p-3.5 text-slate-300">
                        {ord.order_date ? new Date(ord.order_date).toLocaleDateString() : ord.date} • {ord.order_time || ord.time}
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-white">{ord.customer_name || ord.customerName || 'Walk-in Customer'}</p>
                        <p className="text-[11px] text-slate-400">{ord.table_number || ord.tableNumber}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                          {ord.order_type || ord.orderType}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(ord.total)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                          {pStatus} ({ord.payment_method || ord.paymentMethod})
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          oStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          oStatus === 'Preparing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          oStatus === 'Ready' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {oStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => viewOrderDetails(ord)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'Completed')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-400"
                            title="Mark Complete"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400"
                            title="Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
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

      {/* Modal: View Order Details */}
      {viewingOrder && (
        <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title={`Order Details: ${viewingOrder.order_number || viewingOrder.id}`}>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div>
                <span className="text-slate-400 block">Customer:</span>
                <span className="font-bold text-white">{viewingOrder.customer_name || 'Walk-in'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Table/Type:</span>
                <span className="font-bold text-amber-400">{viewingOrder.table_number || viewingOrder.order_type}</span>
              </div>
            </div>

            {viewingOrder.items && viewingOrder.items.length > 0 && (
              <div>
                <span className="text-slate-400 font-bold block mb-2">Order Line Items:</span>
                <div className="space-y-1.5">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-slate-800/40 rounded-lg">
                      <span className="text-slate-200">{it.item_name || it.name} x{it.quantity}</span>
                      <span className="font-bold text-amber-400">{formatCurrency(it.total_price || it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-700 pt-3 space-y-1 text-right">
              <p className="text-slate-400">Subtotal: {formatCurrency(viewingOrder.subtotal)}</p>
              <p className="text-slate-400">GST (5%): {formatCurrency(viewingOrder.tax)}</p>
              <p className="text-slate-400">Discount: -{formatCurrency(viewingOrder.discount)}</p>
              <p className="text-sm font-bold text-emerald-400 pt-1">Total: {formatCurrency(viewingOrder.total)}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create Order */}
      {isCreateModalOpen && (
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Order">
          <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Order Type</label>
                <select
                  value={newOrderForm.order_type}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, order_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                >
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Table Number</label>
                <input
                  type="text"
                  value={newOrderForm.table_number}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, table_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Dish</label>
              <select
                value={newOrderForm.selected_menu_item_id}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, selected_menu_item_id: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
              >
                {menuItems.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.price)})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newOrderForm.quantity}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Discount (₹)</label>
                <input
                  type="number"
                  value={newOrderForm.discount}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, discount: e.target.value })}
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
                Submit Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
