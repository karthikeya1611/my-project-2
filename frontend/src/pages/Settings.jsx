import React, { useState } from "react";
import { Store, User, Bell, Save } from "lucide-react";

export default function Settings() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Spice Garden Restaurant",
    address: "102 MG Road, Indiranagar, Bengaluru, KA 560038",
    phone: "+91 80 4567 8900",
    taxRate: "5% GST",
    currency: "INR (₹)"
  });

  const [adminProfile, setAdminProfile] = useState({
    adminName: "Suresh Kumar",
    email: "admin@spicegarden.com",
    role: "General Manager HQ",
    shiftHours: "10:00 AM - 11:00 PM"
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    lowStockAlerts: true,
    expiryAlerts: true,
    poUpdates: true,
    wasteThresholdAlerts: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & Configuration</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage Restaurant Information, Admin Profile, and Automated Alert Preferences.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
              ✓ Settings saved successfully!
            </div>
          )}

          {/* Section 1: Restaurant Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4" /> 1. Restaurant Information
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Establishment Name</label>
              <input
                type="text"
                value={restaurantInfo.name}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
              <input
                type="text"
                value={restaurantInfo.address}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GST Tax Rate</label>
                <input
                  type="text"
                  value={restaurantInfo.taxRate}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, taxRate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Admin Profile */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> 2. Admin Manager Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Manager Name</label>
                <input
                  type="text"
                  value={adminProfile.adminName}
                  onChange={(e) => setAdminProfile({ ...adminProfile, adminName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Notification Preferences */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4" /> 3. Automated Alert Preferences
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="prefStock"
                  checked={notificationPrefs.lowStockAlerts}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, lowStockAlerts: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <label htmlFor="prefStock">Trigger Low Stock warnings when ingredient drops below minimum threshold</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="prefExpiry"
                  checked={notificationPrefs.expiryAlerts}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, expiryAlerts: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <label htmlFor="prefExpiry">Trigger Expiry alerts 3 days prior to batch expiration</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="prefPO"
                  checked={notificationPrefs.poUpdates}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, poUpdates: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <label htmlFor="prefPO">Notify on Purchase Order status updates & vendor shipments</label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
