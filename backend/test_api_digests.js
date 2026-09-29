const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ parseError: e.message, raw: data.substring(0, 200) });
        }
      });
    }).on('error', reject);
  });
}

async function runApiCheck() {
  console.log("Checking Live API Endpoints...\n");

  const health = await fetchJson('http://localhost:5000/api/health');
  console.log("1. /api/health:", health);

  const dash = await fetchJson('http://localhost:5000/api/dashboard');
  console.log("2. /api/dashboard KPIs:", dash.data ? dash.data.kpis : dash);
  console.log("   Financials Today:", dash.data ? dash.data.financials.today : 'N/A');
  console.log("   Financials Month:", dash.data ? dash.data.financials.month : 'N/A');
  console.log("   Financials Year:", dash.data ? dash.data.financials.year : 'N/A');

  const digests = await fetchJson('http://localhost:5000/api/manager-reports?type=live-digests');
  console.log("\n3. /api/manager-reports?type=live-digests:");
  console.log("   Daily:", digests.data ? digests.data.daily : 'N/A');
  console.log("   Monthly:", digests.data ? digests.data.monthly : 'N/A');
  console.log("   Yearly:", digests.data ? digests.data.yearly : 'N/A');

  process.exit(0);
}

runApiCheck();
