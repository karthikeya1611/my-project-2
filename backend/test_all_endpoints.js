const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const url = new URL(path, 'http://localhost:5000');
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
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, success: json.success, count: json.count || (Array.isArray(json.data) ? json.data.length : null) });
        } catch (e) {
          resolve({ status: res.statusCode, parseError: true, raw: data.substring(0, 100) });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runFullAudit() {
  console.log("==================================================");
  console.log("🚀 SMARTSERVE COMPLETE API ENDPOINT AUDIT");
  console.log("==================================================\n");

  const endpoints = [
    '/api/health',
    '/api/dashboard',
    '/api/menu',
    '/api/menu/1',
    '/api/categories',
    '/api/customers',
    '/api/customers/1',
    '/api/orders',
    '/api/orders/1',
    '/api/inventory',
    '/api/inventory/expiry',
    '/api/inventory/movements',
    '/api/suppliers',
    '/api/suppliers/1',
    '/api/purchase-orders',
    '/api/waste',
    '/api/waste/summary',
    '/api/expenses',
    '/api/expenses/summary',
    '/api/ratings',
    '/api/manager-reports',
    '/api/manager-reports?type=current',
    '/api/manager-reports?type=archived',
    '/api/manager-reports?type=live-digests',
    '/api/notifications'
  ];

  let passedCount = 0;

  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    const statusSymbol = res.status === 200 ? '✅' : '❌';
    console.log(`${statusSymbol} ${ep.padEnd(40)} : Status ${res.status} | Success: ${res.success !== undefined ? res.success : true} | Count/Data: ${res.count !== null ? res.count : 'Object'}`);
    if (res.status === 200) passedCount++;
  }

  console.log(`\n==================================================`);
  console.log(`🎯 ENDPOINT TEST SUMMARY: ${passedCount}/${endpoints.length} ENDPOINTS PASSED`);
  console.log(`==================================================\n`);

  process.exit(0);
}

runFullAudit();
