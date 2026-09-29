import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Utensils,
  Package,
  Store,
  ShoppingCart,
  Trash2,
  DollarSign,
  BarChart3,
  BookOpen,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // Open state for expandable submenus
  const [openSections, setOpenSections] = useState({
    menu: location.pathname.startsWith("/menu"),
    inventory: location.pathname.startsWith("/inventory"),
    suppliers: location.pathname.startsWith("/suppliers"),
    procurement: location.pathname.startsWith("/procurement"),
    waste: location.pathname.startsWith("/waste"),
    managerReports: location.pathname.startsWith("/manager-reports")
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
    }`;

  const subNavItemClass = ({ isActive }) =>
    `flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? "text-amber-400 font-semibold bg-amber-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
    }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">SmartServe</h1>
          <p className="text-[11px] text-slate-400 font-medium">Restaurant & Procurement</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 text-slate-300">
        {/* Dashboard */}
        <NavLink to="/" end className={navItemClass}>
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        {/* Orders */}
        <NavLink to="/orders" className={navItemClass}>
          <ClipboardList className="w-4 h-4" />
          <span>Orders</span>
        </NavLink>

        {/* Menu Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("menu")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Menu</span>
            </div>
            {openSections.menu ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.menu && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/menu/all" className={subNavItemClass}>
                All Items
              </NavLink>
              <NavLink to="/menu/categories" className={subNavItemClass}>
                Categories
              </NavLink>
              <NavLink to="/menu/ratings" className={subNavItemClass}>
                Ratings & Reviews
              </NavLink>
              <NavLink to="/menu/performance" className={subNavItemClass}>
                Menu Performance
              </NavLink>
            </div>
          )}
        </div>

        {/* Inventory Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("inventory")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Inventory</span>
            </div>
            {openSections.inventory ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.inventory && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/inventory/ingredients" className={subNavItemClass}>
                Ingredients
              </NavLink>
              <NavLink to="/inventory/movements" className={subNavItemClass}>
                Stock Movements
              </NavLink>
              <NavLink to="/inventory/expiry" className={subNavItemClass}>
                Expiry Tracking
              </NavLink>
              <NavLink to="/inventory/reports" className={subNavItemClass}>
                Inventory Reports
              </NavLink>
            </div>
          )}
        </div>

        {/* Suppliers Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("suppliers")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-blue-400" />
              <span>Suppliers</span>
            </div>
            {openSections.suppliers ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.suppliers && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/suppliers/list" className={subNavItemClass}>
                Supplier List
              </NavLink>
              <NavLink to="/suppliers/performance" className={subNavItemClass}>
                Supplier Performance
              </NavLink>
              <NavLink to="/suppliers/history" className={subNavItemClass}>
                Supplier History
              </NavLink>
            </div>
          )}
        </div>

        {/* Procurement Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("procurement")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <span>Procurement</span>
            </div>
            {openSections.procurement ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.procurement && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/procurement/orders" className={subNavItemClass}>
                Purchase Orders
              </NavLink>
              <NavLink to="/procurement/pending" className={subNavItemClass}>
                Pending Deliveries
              </NavLink>
              <NavLink to="/procurement/history" className={subNavItemClass}>
                Purchase History
              </NavLink>
            </div>
          )}
        </div>

        {/* Waste Management Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("waste")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Waste Management</span>
            </div>
            {openSections.waste ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.waste && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/waste/record" className={subNavItemClass}>
                Record Waste
              </NavLink>
              <NavLink to="/waste/analytics" className={subNavItemClass}>
                Waste Analytics
              </NavLink>
              <NavLink to="/waste/reports" className={subNavItemClass}>
                Waste Reports
              </NavLink>
            </div>
          )}
        </div>

        {/* Expenses */}
        <NavLink to="/expenses" className={navItemClass}>
          <DollarSign className="w-4 h-4" />
          <span>Expenses</span>
        </NavLink>

        {/* Reports */}
        <NavLink to="/reports" className={navItemClass}>
          <BarChart3 className="w-4 h-4" />
          <span>Reports</span>
        </NavLink>

        {/* Manager Reports Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("managerReports")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Manager Reports</span>
            </div>
            {openSections.managerReports ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {openSections.managerReports && (
            <div className="mt-1 space-y-1 pl-2">
              <NavLink to="/manager-reports/current" className={subNavItemClass}>
                Current Reports
              </NavLink>
              <NavLink to="/manager-reports/archived" className={subNavItemClass}>
                Archived Reports
              </NavLink>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NavLink to="/notifications" className={navItemClass}>
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </NavLink>

        {/* Settings */}
        <NavLink to="/settings" className={navItemClass}>
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        <p>Spice Garden Admin v1.0</p>
      </div>
    </aside>
  );
}
