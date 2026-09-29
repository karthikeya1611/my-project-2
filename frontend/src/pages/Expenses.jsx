import React, { useState, useEffect, useMemo } from "react";
import { EXPENSE_CATEGORIES } from "../data/expensesData";
import { formatCurrency } from "../utils/formatters";
import Modal from "../components/Modal";
import { apiFetch } from "../utils/apiHelpers";
import { DollarSign, Plus, Search, Calendar, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    category: "Utilities",
    amount: "",
    paymentMethod: "UPI"
  });

  const fetchExpensesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [listRes, summaryRes] = await Promise.all([
        apiFetch("/expenses"),
        apiFetch("/expenses/summary")
      ]);
      setExpenses(listRes.expenses || listRes.data || []);
      setSummary(summaryRes.summary || summaryRes.data || summaryRes || null);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  // Summary metrics
  const totalMonthlyExpenses = useMemo(() => {
    if (summary && summary.total_monthly_expenses !== undefined) {
      return Number(summary.total_monthly_expenses);
    }
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [summary, expenses]);

  const todaysExpenses = useMemo(() => {
    if (summary && summary.todays_expenses !== undefined) {
      return Number(summary.todays_expenses);
    }
    const todayStr = new Date().toISOString().split("T")[0];
    return expenses
      .filter((e) => e.date === todayStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [summary, expenses]);

  // Expenses grouped by Category for chart
  const categoryChartData = useMemo(() => {
    if (summary && summary.expenses_by_category) {
      return summary.expenses_by_category.map((item) => ({
        category: item.category,
        amount: Number(item.total_amount || item.amount || 0)
      }));
    }
    const cats = EXPENSE_CATEGORIES.filter((c) => c !== "All");
    return cats.map((cat) => {
      const catExpenses = expenses.filter((e) => e.category === cat);
      const totalAmount = catExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      return { category: cat, amount: totalAmount };
    });
  }, [summary, expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        (exp.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (exp.expense_id || exp.id || "").toString().toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);

  // Add Expense Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          amount: Number(formData.amount),
          payment_method: formData.paymentMethod
        })
      });
      setIsModalOpen(false);
      setFormData({ description: "", category: "Utilities", amount: "", paymentMethod: "UPI" });
      fetchExpensesData();
    } catch (err) {
      alert(`Error creating expense: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
        <span>Loading expense ledger from backend...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <p className="text-red-400 font-bold mb-2">Error Loading Expenses</p>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          onClick={fetchExpensesData}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Expense Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track overhead costs, ingredient purchases, salaries, and utility bills.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Today's Expenses</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(todaysExpenses)}</h3>
          </div>
          <Calendar className="w-8 h-8 text-amber-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Monthly Expenses</p>
            <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalMonthlyExpenses)}</h3>
          </div>
          <DollarSign className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-bold text-white mb-4">Expense Breakdown by Category</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                formatter={(val) => [formatCurrency(val), "Total Expense"]}
              />
              <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search description or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.expense_id || exp.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-slate-500">EXP-{exp.expense_id || exp.id}</td>
                    <td className="p-3 text-slate-400">
                      {exp.expense_date ? exp.expense_date.split("T")[0] : exp.date}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">{exp.description}</td>
                    <td className="p-3 text-slate-300">{exp.payment_method || exp.paymentMethod}</td>
                    <td className="p-3 text-right font-extrabold text-amber-400">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Expense Entry">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Expense Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Kitchen Generator Maintenance"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              >
                {EXPENSE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="4500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            >
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg font-bold"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

