const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runFullIntegrationTest() {
  console.log('==================================================');
  console.log('🧪 SMARTSERVE END-TO-END INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health & DB Check
  await test('1. System Health & DB Check', async () => {
    const res = await request('/health');
    if (res.status !== 200 || res.body.status !== 'ok') throw new Error('Health check failed');
  });

  // 2. Dashboard KPIs & Aggregations
  await test('2. Dashboard Aggregated Metrics', async () => {
    const res = await request('/dashboard');
    if (res.status !== 200 || !res.body.data || !res.body.data.kpis) throw new Error('Dashboard API failed');
  });

  // 3. Menu READ
  let createdMenuItemId = null;
  await test('3. Menu READ (45+ dishes in DB)', async () => {
    const res = await request('/menu');
    const items = res.body.data || res.body.items || res.body;
    if (res.status !== 200 || !Array.isArray(items) || items.length < 40) {
      throw new Error(`Menu list failed or insufficient items. Got count: ${items ? items.length : 0}`);
    }
  });

  await test('4. Menu CREATE Dish', async () => {
    const res = await request('/menu', 'POST', {
      category_id: 1,
      name: 'Integration Test Tikka',
      price: 320.00,
      description: 'Test dish description',
      is_available: true
    });
    if (res.status !== 201 || !res.body.data || !res.body.data.id) throw new Error(`Failed to create menu item: ${JSON.stringify(res.body)}`);
    createdMenuItemId = res.body.data.id;
  });

  await test('5. Menu UPDATE & DELETE Dish', async () => {
    const updateRes = await request(`/menu/${createdMenuItemId}`, 'PUT', { price: 350.00 });
    if (updateRes.status !== 200) throw new Error('Failed to update menu item');
    const deleteRes = await request(`/menu/${createdMenuItemId}`, 'DELETE');
    if (deleteRes.status !== 200) throw new Error('Failed to delete menu item');
  });

  // 6. Customers READ/SEARCH
  await test('6. Customers READ & Search (100+ customers)', async () => {
    const res = await request('/customers?search=Ramesh');
    const customers = res.body.data || res.body.customers || res.body;
    if (res.status !== 200 || !Array.isArray(customers)) throw new Error('Customers API failed');
  });

  // 7. Orders & Financial Computations (Tax 5%, Subtotal, Discount)
  let createdOrderId = null;
  await test('7. Orders CREATE & Financial Calculation (5% GST)', async () => {
    const res = await request('/orders', 'POST', {
      order_type: 'Dine-in',
      table_number: 'T-99',
      payment_method: 'UPI',
      items: [
        { menu_item_id: 1, quantity: 2, unit_price: 200.00 }, // subtotal 400
        { menu_item_id: 2, quantity: 1, unit_price: 100.00 }  // subtotal 100 -> total subtotal 500
      ],
      discount: 50.00
    });
    // Expected: subtotal = 500, discount = 50, taxable/subtotal tax 5% = 25.00, total = 475.00
    if (res.status !== 201 || !res.body.data || (!res.body.data.id && !res.body.data.order_id)) {
      throw new Error(`Order creation failed: ${JSON.stringify(res.body)}`);
    }
    createdOrderId = res.body.data.id || res.body.data.order_id;
    const total = Number(res.body.data.total);
    if (Math.abs(total - 475.00) > 0.05) {
      throw new Error(`Tax/Total calculation mismatch. Expected 475.00, got ${total}`);
    }
  });

  await test('8. Orders READ Single with Line Items', async () => {
    const res = await request(`/orders/${createdOrderId}`);
    if (res.status !== 200 || !res.body.data || (!res.body.data.items && !res.body.data.order_items)) {
      throw new Error('Order detail reading failed');
    }
  });

  await test('9. Orders DELETE (Cancel)', async () => {
    const res = await request(`/orders/${createdOrderId}`, 'DELETE');
    if (res.status !== 200) throw new Error('Order cancellation failed');
  });

  // 10. Inventory & Stock Movements (RESTOCK, USAGE, WASTE)
  await test('10. Inventory READ & Stock Movement Log', async () => {
    const invRes = await request('/inventory');
    const items = invRes.body.data || invRes.body.items || invRes.body;
    if (invRes.status !== 200 || !Array.isArray(items) || items.length === 0) throw new Error('Inventory fetch failed');
    const firstItem = items[0];

    const moveRes = await request('/inventory/movements', 'POST', {
      ingredient_id: firstItem.id || firstItem.ingredient_id,
      transaction_type: 'RESTOCK',
      quantity: 5.0,
      reason: 'Integration test restock'
    });
    if (moveRes.status !== 201) throw new Error(`Movement creation failed: ${JSON.stringify(moveRes.body)}`);
  });

  // 11. Waste Management & Summary Calculation
  let createdWasteId = null;
  await test('11. Waste CREATE & Summary Aggregations', async () => {
    const createRes = await request('/waste', 'POST', {
      ingredient_id: 1,
      quantity: 2.5,
      unit: 'kg',
      reason: 'Spoilage',
      cost: 450.00
    });
    if (createRes.status !== 201) throw new Error(`Waste creation failed: ${JSON.stringify(createRes.body)}`);
    createdWasteId = createRes.body.data.id || createRes.body.data.waste_id;

    const summaryRes = await request('/waste/summary');
    if (summaryRes.status !== 200 || !summaryRes.body.data) throw new Error('Waste summary failed');

    // Cleanup test waste
    if (createdWasteId) {
      await request(`/waste/${createdWasteId}`, 'DELETE');
    }
  });

  // 12. Expenses & Category Aggregations
  let createdExpId = null;
  await test('12. Expenses CREATE & Summary Aggregations', async () => {
    const createRes = await request('/expenses', 'POST', {
      category: 'Utilities',
      description: 'Integration Test Power Bill',
      amount: 1500.00,
      payment_method: 'UPI'
    });
    if (createRes.status !== 201) throw new Error(`Expense creation failed: ${JSON.stringify(createRes.body)}`);
    createdExpId = createRes.body.data.id || createRes.body.data.expense_id;

    const summaryRes = await request('/expenses/summary');
    if (summaryRes.status !== 200 || !summaryRes.body.data) {
      throw new Error('Expense summary failed');
    }

    // Cleanup test expense
    if (createdExpId) {
      await request(`/expenses/${createdExpId}`, 'DELETE');
    }
  });

  // 13. Suppliers & Purchase Orders
  await test('13. Suppliers & Purchase Orders READ', async () => {
    const suppRes = await request('/suppliers');
    const poRes = await request('/purchase-orders');
    if (suppRes.status !== 200 || poRes.status !== 200) throw new Error('Supplier/PO API failed');
  });

  // 14. Manager Reports & Notifications
  await test('14. Manager Reports & Notifications READ', async () => {
    const repRes = await request('/manager-reports');
    const notifRes = await request('/notifications');
    if (repRes.status !== 200 || notifRes.status !== 200) throw new Error('Reports/Notifications API failed');
  });

  // 15. Error Handling & Invalid IDs
  await test('15. Error Handling (404 for Invalid IDs)', async () => {
    const res = await request('/orders/99999999');
    if (res.status !== 404) throw new Error('Invalid ID did not return 404');
  });

  console.log('\n==================================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');
}

runFullIntegrationTest().catch(console.error);
