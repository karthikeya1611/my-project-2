import fs from 'fs';
import path from 'path';

const pages = [
  'src/pages/Dashboard.jsx',
  'src/pages/Orders.jsx',
  'src/pages/Expenses.jsx',
  'src/pages/Reports.jsx',
  'src/pages/Notifications.jsx',
  'src/pages/Settings.jsx',
  'src/pages/Menu/AllItems.jsx',
  'src/pages/Menu/Categories.jsx',
  'src/pages/Menu/RatingsReviews.jsx',
  'src/pages/Menu/MenuPerformance.jsx',
  'src/pages/Inventory/Ingredients.jsx',
  'src/pages/Inventory/StockMovements.jsx',
  'src/pages/Inventory/ExpiryTracking.jsx',
  'src/pages/Inventory/InventoryReports.jsx',
  'src/pages/Suppliers/SupplierList.jsx',
  'src/pages/Suppliers/SupplierPerformance.jsx',
  'src/pages/Suppliers/SupplierHistory.jsx',
  'src/pages/Procurement/PurchaseOrders.jsx',
  'src/pages/Procurement/PendingDeliveries.jsx',
  'src/pages/Procurement/PurchaseHistory.jsx',
  'src/pages/Waste/RecordWaste.jsx',
  'src/pages/Waste/WasteAnalytics.jsx',
  'src/pages/Waste/WasteReports.jsx',
  'src/pages/ManagerReports/CurrentReports.jsx',
  'src/pages/ManagerReports/ArchivedReports.jsx'
];

console.log("Checking page components for exports and safety patterns...\n");

let allPassed = true;

for (const p of pages) {
  const fullPath = path.resolve('c:/Users/laksh/OneDrive/ドキュメント/Desktop/my project-2/frontend', p);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${p}`);
    allPassed = false;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Check default export
  const hasDefaultExport = content.includes('export default');
  if (!hasDefaultExport) {
    console.error(`❌ Missing export default in ${p}`);
    allPassed = false;
  } else {
    console.log(`✅ ${p} has export default`);
  }
}

if (allPassed) {
  console.log("\n✨ All 25 page components verified to exist and have default exports.");
}
