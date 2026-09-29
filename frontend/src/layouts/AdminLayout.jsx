import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <Outlet context={{ searchTerm, setSearchTerm }} />
        </main>
      </div>
    </div>
  );
}
