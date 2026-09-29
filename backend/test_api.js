const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runFullBackendAudit() {
  console.log('==================================================');
  console.log('🧪 RUNNING COMPREHENSIVE SMARTSERVE API AUDIT');
  console.log('==================================================\n');

  const tests = [
    { name: '1. Health Check API', path: '/api/health' },
    { name: '2. Dashboard Summary API', path: '/api/dashboard' },
    { name: '3. Menu List (55+ items)', path: '/api/menu' },
    { name: '4. Menu Filter by Category', path: '/api/menu?category=Breakfast' },
    { name: '5. Menu Item by ID', path: '/api/menu/1' },
    { name: '6. Categories List', path: '/api/categories' },
    { name: '7. Menu Ratings by Item ID', path: '/api/menu/1/ratings' },
    { name: '8. Customers List (100+ items)', path: '/api/customers' },
    { name: '9. Customer Search', path: '/api/customers?search=Sharma' },
    { name: '10. Customer by ID', path: '/api/customers/1' },
    { name: '11. Orders List (1,400+ items)', path: '/api/orders?limit=10' },
    { name: '12. Order Filter by Type (Dine-in)', path: '/api/orders?type=Dine-in&limit=5' },
    { name: '13. Order by ID with Items', path: '/api/orders/1' },
    { name: '14. Inventory List (35+ items)', path: '/api/inventory' },
    { name: '15. Ingredient Movements Audit', path: '/api/inventory/1/movements' },
    { name: '16. Suppliers List', path: '/api/suppliers' },
    { name: '17. Supplier by ID with PO History', path: '/api/suppliers/1' },
    { name: '18. Purchase Orders List (100+ items)', path: '/api/purchase-orders' },
    { name: '19. Purchase Order by ID with Items', path: '/api/purchase-orders/1' },
    { name: '20. Waste Records List (200+ items)', path: '/api/waste' },
    { name: '21. Waste Summary Aggregations', path: '/api/waste/summary' },
    { name: '22. Expenses List (200+ items)', path: '/api/expenses' },
    { name: '23. Expense Summary Aggregations', path: '/api/expenses/summary' },
    { name: '24. Manager Reports List', path: '/api/manager-reports' },
    { name: '25. Notifications List', path: '/api/notifications' },
    { name: '26. Invalid ID Error Handling Test', path: '/api/menu/999999' }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await makeRequest(t.path);
      const isExpected = t.path.includes('999999') ? res.status === 404 : res.status === 200;
      
      if (isExpected) {
        passed++;
        console.log(`  ✅ [PASS] ${t.name.padEnd(40)} (Status: ${res.status})`);
      } else {
        failed++;
        console.log(`  ❌ [FAIL] ${t.name.padEnd(40)} (Status: ${res.status})`);
      }
    } catch (err) {
      failed++;
      console.log(`  ❌ [ERROR] ${t.name.padEnd(40)} - ${err.message}`);
    }
  }

  console.log('\n==================================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================');
}

runFullBackendAudit();
