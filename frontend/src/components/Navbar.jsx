import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, UtensilsCrossed, User } from "lucide-react";

export default function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Restaurant Title & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
          <UtensilsCrossed className="w-5 h-5 text-amber-500" />
          <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Spice Garden Restaurant
          </span>
        </div>

        {/* Global Quick Search */}
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search menu, inventory, orders..."
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 text-sm text-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-semibold">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-200 leading-tight">Admin Manager</p>
            <p className="text-xs text-slate-400">Spice Garden HQ</p>
          </div>
        </div>
      </div>
    </header>
  );
}
