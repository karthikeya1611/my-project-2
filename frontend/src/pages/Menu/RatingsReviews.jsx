import React, { useState, useEffect } from "react";
import { formatRating } from "../../utils/formatters";
import { fetchApi } from "../../utils/apiHelpers";
import { Star, MessageSquare, ThumbsUp, Award, RefreshCw, Plus } from "lucide-react";
import Modal from "../../components/Modal";

export default function RatingsReviews() {
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    menu_item_id: 1,
    customer_name: "",
    rating: 9.5,
    comment: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [menuRes] = await Promise.all([
        fetchApi('/menu')
      ]);

      if (menuRes.success) {
        setMenuItems(menuRes.data);
        if (menuRes.data.length > 0) {
          const firstDishId = menuRes.data[0].id;
          const ratingsRes = await fetchApi(`/menu/${firstDishId}/ratings`);
          if (ratingsRes.success) {
            setReviews(ratingsRes.data);
          }
        }
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setError(err.message || "Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDishChange = async (dishId) => {
    try {
      setLoading(true);
      setFormData({ ...formData, menu_item_id: dishId });
      const res = await fetchApi(`/menu/${dishId}/ratings`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Error fetching dish ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await fetchApi(`/menu/${formData.menu_item_id}/ratings`, {
        method: 'POST',
        body: {
          customer_name: formData.customer_name || 'Verified Customer',
          rating: parseFloat(formData.rating),
          comment: formData.comment
        }
      });
      setIsModalOpen(false);
      setFormData({ menu_item_id: formData.menu_item_id, customer_name: "", rating: 9.5, comment: "" });
      handleDishChange(formData.menu_item_id);
    } catch (err) {
      alert("Failed to submit rating: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Customer Ratings & Reviews</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track authentic customer feedback and ratings out of 10 for Spice Garden Restaurant.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh Reviews"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Review
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Average Overall Rating</p>
            <h3 className="text-2xl font-bold text-white">9.4 / 10</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Positive Feedback</p>
            <h3 className="text-2xl font-bold text-white">96.2%</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Reviews Logged</p>
            <h3 className="text-2xl font-bold text-white">520+</h3>
          </div>
        </div>
      </div>

      {/* Dish Select Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-300">Select Dish to View Reviews:</label>
        <select
          value={formData.menu_item_id}
          onChange={(e) => handleDishChange(parseInt(e.target.value, 10))}
          className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
        >
          {menuItems.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.category_name || d.category})</option>
          ))}
        </select>
      </div>

      {/* Review List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Customer Reviews</h3>
        {loading ? (
          <div className="text-center py-8 text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-xs">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-slate-400 text-xs py-4 text-center">No reviews logged for this dish yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.customer_name || "Verified Customer"}</h4>
                    <p className="text-xs text-slate-400">{rev.rating_date ? new Date(rev.rating_date).toLocaleDateString() : 'Recent'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-max">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {formatRating(rev.rating)} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">"{rev.comment || "Great dish!"}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Review */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Customer Review">
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rating (1.0 to 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Review Comment</label>
              <textarea
                rows="3"
                required
                placeholder="Describe food taste, quality, presentation..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Submit Review
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
