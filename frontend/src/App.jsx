import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import AdminLayout from "./layouts/AdminLayout";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// Menu Module Subpages
import AllItems from "./pages/Menu/AllItems";
import Categories from "./pages/Menu/Categories";
import RatingsReviews from "./pages/Menu/RatingsReviews";
import MenuPerformance from "./pages/Menu/MenuPerformance";

// Inventory Module Subpages
import Ingredients from "./pages/Inventory/Ingredients";
import StockMovements from "./pages/Inventory/StockMovements";
import ExpiryTracking from "./pages/Inventory/ExpiryTracking";
import InventoryReports from "./pages/Inventory/InventoryReports";

// Suppliers Module Subpages
import SupplierList from "./pages/Suppliers/SupplierList";
import SupplierPerformance from "./pages/Suppliers/SupplierPerformance";
import SupplierHistory from "./pages/Suppliers/SupplierHistory";

// Procurement Module Subpages
import PurchaseOrders from "./pages/Procurement/PurchaseOrders";
import PendingDeliveries from "./pages/Procurement/PendingDeliveries";
import PurchaseHistory from "./pages/Procurement/PurchaseHistory";

// Waste Management Module Subpages
import RecordWaste from "./pages/Waste/RecordWaste";
import WasteAnalytics from "./pages/Waste/WasteAnalytics";
import WasteReports from "./pages/Waste/WasteReports";

// Manager Reports Subpages
import CurrentReports from "./pages/ManagerReports/CurrentReports";
import ArchivedReports from "./pages/ManagerReports/ArchivedReports";

import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Orders */}
          <Route path="orders" element={<Orders />} />

          {/* Menu Module */}
          <Route path="menu/all" element={<AllItems />} />
          <Route path="menu/categories" element={<Categories />} />
          <Route path="menu/ratings" element={<RatingsReviews />} />
          <Route path="menu/performance" element={<MenuPerformance />} />
          <Route path="menu" element={<Navigate to="/menu/all" replace />} />

          {/* Inventory Module */}
          <Route path="inventory/ingredients" element={<Ingredients />} />
          <Route path="inventory/movements" element={<StockMovements />} />
          <Route path="inventory/expiry" element={<ExpiryTracking />} />
          <Route path="inventory/reports" element={<InventoryReports />} />
          <Route path="inventory" element={<Navigate to="/inventory/ingredients" replace />} />

          {/* Suppliers Module */}
          <Route path="suppliers/list" element={<SupplierList />} />
          <Route path="suppliers/performance" element={<SupplierPerformance />} />
          <Route path="suppliers/history" element={<SupplierHistory />} />
          <Route path="suppliers" element={<Navigate to="/suppliers/list" replace />} />

          {/* Procurement Module */}
          <Route path="procurement/orders" element={<PurchaseOrders />} />
          <Route path="procurement/pending" element={<PendingDeliveries />} />
          <Route path="procurement/history" element={<PurchaseHistory />} />
          <Route path="procurement" element={<Navigate to="/procurement/orders" replace />} />

          {/* Waste Management Module */}
          <Route path="waste/record" element={<RecordWaste />} />
          <Route path="waste/analytics" element={<WasteAnalytics />} />
          <Route path="waste/reports" element={<WasteReports />} />
          <Route path="waste" element={<Navigate to="/waste/record" replace />} />

          {/* Expenses */}
          <Route path="expenses" element={<Expenses />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Manager Reports */}
          <Route path="manager-reports/current" element={<CurrentReports />} />
          <Route path="manager-reports/archived" element={<ArchivedReports />} />
          <Route path="manager-reports" element={<Navigate to="/manager-reports/current" replace />} />

          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
  );
}
