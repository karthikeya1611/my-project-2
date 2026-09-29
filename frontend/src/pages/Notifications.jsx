import React, { useState, useEffect, useMemo } from "react";
import { apiFetch } from "../utils/apiHelpers";
import { AlertTriangle, Info, Clock, Trash2, ShoppingCart, Truck, ShieldAlert, RefreshCw } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState("All");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/notifications");
      const list = res.notifications || res.data || res || [];
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markSingleRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => ((n.notification_id || n.id) === id ? { ...n, is_read: true, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !(n.is_read || n.isRead));
      await Promise.all(
        unreadList.map((n) =>
          apiFetch(`/notifications/${n.notification_id || n.id}/read`, { method: "PUT" })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const isRead = n.is_read || n.isRead;
      if (filterTab === "Unread") return !isRead;
      if (filterTab === "Read") return isRead;
      return true;
    });
  }, [notifications, filterTab]);

  const unreadCount = notifications.filter((n) => !(n.is_read || n.isRead)).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case "Low Stock":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "Expiry":
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case "Supplier Delivery":
        return <Truck className="w-5 h-5 text-blue-400" />;
      case "Purchase Order":
        return <ShoppingCart className="w-5 h-5 text-purple-400" />;
      case "Waste Alert":
        return <Trash2 className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-emerald-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
        <span>Loading notifications from backend...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <p className="text-red-400 font-bold mb-2">Error Loading Notifications</p>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Notification Center ({unreadCount} Unread)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Operational alerts across Low Stock, Expiry, POs, Supplier Deliveries, and Waste.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          {["All", "Unread", "Read"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTab(t)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
                filterTab === t
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const notifId = notif.notification_id || notif.id;
            const isRead = notif.is_read || notif.isRead;
            const type = notif.type || notif.notification_type || "Info";
            const title = notif.title || type;
            const message = notif.message || notif.content;
            const timeStr = notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (notif.time || "Just now");

            return (
              <div
                key={notifId}
                onClick={() => !isRead && markSingleRead(notifId)}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition cursor-pointer ${
                  isRead
                    ? "bg-slate-800/30 border-slate-800/60 opacity-80"
                    : "bg-slate-800/80 border-slate-700 shadow-md"
                }`}
              >
                <div className="mt-0.5 p-2 bg-slate-900 rounded-lg border border-slate-700">
                  {getTypeIcon(type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                        {type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {timeStr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

