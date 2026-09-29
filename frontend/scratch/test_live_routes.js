import http from 'http';

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, length: data.length, sample: data.substring(0, 150) });
      });
    }).on('error', (err) => {
      resolve({ status: 'ERROR', error: err.message });
    });
  });
}

async function runTests() {
  console.log("Testing Backend and Frontend servers...\n");

  const backendHealth = await checkUrl('http://localhost:5000/api/health');
  console.log("Backend Health (/api/health):", backendHealth);

  const dashboardApi = await checkUrl('http://localhost:5000/api/dashboard');
  console.log("Backend Dashboard (/api/dashboard):", dashboardApi.status, `(${dashboardApi.length} bytes)`);

  const frontendIndex = await checkUrl('http://localhost:5173/');
  console.log("Frontend Index (http://localhost:5173/):", frontendIndex.status, `(${frontendIndex.length} bytes)`);

  const frontendOrders = await checkUrl('http://localhost:5173/orders');
  console.log("Frontend /orders route:", frontendOrders.status, `(${frontendOrders.length} bytes)`);

  const frontendMenu = await checkUrl('http://localhost:5173/menu/all');
  console.log("Frontend /menu/all route:", frontendMenu.status, `(${frontendMenu.length} bytes)`);

  const frontendInventory = await checkUrl('http://localhost:5173/inventory/ingredients');
  console.log("Frontend /inventory/ingredients route:", frontendInventory.status, `(${frontendInventory.length} bytes)`);

  const frontendSuppliers = await checkUrl('http://localhost:5173/suppliers/list');
  console.log("Frontend /suppliers/list route:", frontendSuppliers.status, `(${frontendSuppliers.length} bytes)`);

  const frontendProcurement = await checkUrl('http://localhost:5173/procurement/orders');
  console.log("Frontend /procurement/orders route:", frontendProcurement.status, `(${frontendProcurement.length} bytes)`);

  const frontendWaste = await checkUrl('http://localhost:5173/waste/record');
  console.log("Frontend /waste/record route:", frontendWaste.status, `(${frontendWaste.length} bytes)`);

  const frontendExpenses = await checkUrl('http://localhost:5173/expenses');
  console.log("Frontend /expenses route:", frontendExpenses.status, `(${frontendExpenses.length} bytes)`);

  const frontendReports = await checkUrl('http://localhost:5173/reports');
  console.log("Frontend /reports route:", frontendReports.status, `(${frontendReports.length} bytes)`);

  const frontendManagerReports = await checkUrl('http://localhost:5173/manager-reports/current');
  console.log("Frontend /manager-reports/current route:", frontendManagerReports.status, `(${frontendManagerReports.length} bytes)`);

  const frontendNotifications = await checkUrl('http://localhost:5173/notifications');
  console.log("Frontend /notifications route:", frontendNotifications.status, `(${frontendNotifications.length} bytes)`);
}

runTests();
