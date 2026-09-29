import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { MENU_CATEGORIES } from "../../data/menuData";
import { formatCurrency, formatRating } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import Modal from "../../components/Modal";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";

export default function AllItems() {
  const { searchTerm: globalSearch } = useOutletContext() || {};
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating-desc");

  // Modal states
  const [viewingDish, setViewingDish] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Dish Form State
  const [formData, setFormData] = useState({
    name: "",
    category_id: 4,
    category: "Main Course",
    description: "",
    price: "",
    is_available: true
  });

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchApi('/menu');
      if (res.success) {
        setMenuItems(res.data);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(err.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetchApi('/categories');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  const query = search || globalSearch || "";

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()));

        const matchesCategory =
          selectedCategory === "All" || item.category_name === selectedCategory || item.category === selectedCategory;

        const isAvailable = item.is_available ?? (item.availability === "In Stock");
        const matchesAvailability =
          availabilityFilter === "All" ||
          (availabilityFilter === "In Stock" && isAvailable) ||
          (availabilityFilter === "Out of Stock" && !isAvailable);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        const rA = parseFloat(a.avg_rating || a.rating || 0);
        const rB = parseFloat(b.avg_rating || b.rating || 0);
        if (sortBy === "rating-desc") return rB - rA;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [menuItems, query, selectedCategory, availabilityFilter, sortBy]);

  const handleAddDishSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description,
        price: parseFloat(formData.price),
        is_available: formData.is_available
      };

      await fetchApi('/menu', {
        method: 'POST',
        body: payload
      });

      setIsAddModalOpen(false);
      setFormData({ name: "", category_id: 4, category: "Main Course", description: "", price: "", is_available: true });
      loadMenuItems();
    } catch (err) {
      alert("Failed to add dish: " + err.message);
    }
  };

  const handleEditDishSubmit = async (e) => {
    e.preventDefault();
    if (!editingDish) return;
    try {
      const payload = {
        name: editingDish.name,
        description: editingDish.description,
        price: parseFloat(editingDish.price),
        is_available: editingDish.is_available ?? (editingDish.availability === "In Stock")
      };

      await fetchApi(`/menu/${editingDish.id}`, {
        method: 'PUT',
        body: payload
      });

      setEditingDish(null);
      loadMenuItems();
    } catch (err) {
      alert("Failed to update dish: " + err.message);
    }
  };

  const handleViewDishDetails = async (item) => {
    try {
      const res = await fetchApi(`/menu/${item.id}`);
      if (res.success && res.data) {
        setViewingDish(res.data);
      } else {
        setViewingDish(item);
      }
    } catch (err) {
      setViewingDish(item);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await fetchApi(`/menu/${id}`, { method: 'DELETE' });
      loadMenuItems();
    } catch (err) {
      alert("Failed to delete dish: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Menu Catalog
            <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {menuItems.length} Items Live
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage food dishes, descriptions, pricing, and live availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadMenuItems}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={loadMenuItems} className="underline font-semibold hover:text-red-300">
            Retry
          </button>
        </div>
      )}

      {/* Filter & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Local Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by dish name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              {categories.length > 0
                ? categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)
                : MENU_CATEGORIES.filter(c => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)
              }
            </select>
          </div>

          {/* Availability Filter */}
          <div className="relative">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">Available</option>
              <option value="Out of Stock">Unavailable</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Dish Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm">Loading live menu items from database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No dishes match your selected filters.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory("All"); setAvailabilityFilter("All"); }}
            className="mt-3 text-xs text-amber-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Dish Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isAvail = item.is_available ?? (item.availability === "In Stock");
            const ratingVal = item.avg_rating || item.rating || 9.0;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {item.category_name || item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        isAvail
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {isAvail ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isAvail ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                    {item.description || "Freshly prepared authentic dish."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-amber-400 tracking-tight">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {formatRating(ratingVal)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleViewDishDetails(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingDish(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: View Dish Details */}
      {viewingDish && (
        <Modal isOpen={!!viewingDish} onClose={() => setViewingDish(null)} title={viewingDish.name}>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Category & Popularity</span>
                <span className="font-bold text-amber-400 text-sm">{viewingDish.category_name || viewingDish.category}</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">
                {viewingDish.popularity || "Bestseller 🔥"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Price</span>
                <span className="font-extrabold text-emerald-400 text-base">{formatCurrency(viewingDish.price)}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Customer Rating</span>
                <span className="font-extrabold text-amber-400 text-base flex items-center gap-1">
                  ⭐ {formatRating(viewingDish.avg_rating || viewingDish.rating || 9.0)} / 10 ({viewingDish.total_ratings || 12} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Total Sold (Fulfillment)</span>
                <span className="font-bold text-white text-sm">{viewingDish.total_quantity_sold || 340} Portion Orders</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Preparation Time</span>
                <span className="font-bold text-white text-sm">{viewingDish.preparation_time || "20 mins"}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1 text-[11px] font-bold">Description</span>
              <p className="text-slate-200 leading-relaxed">{viewingDish.description || "Freshly cooked authentic Indian recipe using premium spices."}</p>
            </div>

            {viewingDish.ingredients_used && viewingDish.ingredients_used.length > 0 && (
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-2 text-[11px] font-bold">Key Ingredients Required</span>
                <div className="flex flex-wrap gap-2">
                  {viewingDish.ingredients_used.map((ing, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-[11px]">
                      {ing.name} ({ing.quantity_required} {ing.unit})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewingDish.customer_reviews && viewingDish.customer_reviews.length > 0 && (
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-2">
                <span className="text-slate-400 block text-[11px] font-bold">Recent Customer Reviews</span>
                {viewingDish.customer_reviews.slice(0, 3).map((rev, idx) => (
                  <div key={idx} className="p-2 bg-slate-900/60 rounded border border-slate-800 space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-white">{rev.customer_name || 'Guest'}</span>
                      <span className="text-amber-400 font-bold">★ {rev.rating}/10</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-italic">"{rev.comment || 'Excellent taste!'}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Add New Dish */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Dish">
          <form onSubmit={handleAddDishSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dish Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Save Dish
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Edit Dish */}
      {editingDish && (
        <Modal isOpen={!!editingDish} onClose={() => setEditingDish(null)} title="Edit Menu Dish">
          <form onSubmit={handleEditDishSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dish Name</label>
              <input
                type="text"
                required
                value={editingDish.name}
                onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={editingDish.price}
                onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows="3"
                value={editingDish.description || ''}
                onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_avail"
                checked={editingDish.is_available ?? (editingDish.availability === "In Stock")}
                onChange={(e) => setEditingDish({ ...editingDish, is_available: e.target.checked })}
                className="rounded text-amber-500 focus:ring-0"
              />
              <label htmlFor="is_avail" className="text-slate-300 font-semibold">Available for order</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Update Dish
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
