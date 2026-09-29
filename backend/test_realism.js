const db = require('./db');

async function testRealism() {
  console.log("==================================================");
  console.log("🔍 TESTING DATABASE FINANCIAL REALISM & RATIOS");
  console.log("==================================================\n");

  const todayStr = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const monthPrefix = `${currentYear}-${currentMonth}`;

  // 1. TODAY METRICS
  const todaySales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE order_date = $1 AND order_status != 'Cancelled'`, [todayStr]);
  const todayWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE waste_date = $1`, [todayStr]);
  const todayExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE expense_date = $1`, [todayStr]);

  const tRev = parseFloat(todaySales.rows[0].rev);
  const tOrds = parseInt(todaySales.rows[0].ords, 10);
  const tWaste = parseFloat(todayWaste.rows[0].waste);
  const tExp = parseFloat(todayExp.rows[0].exp);
  const tProfit = tRev - tWaste - tExp;

  console.log(`📅 TODAY (${todayStr}):`);
  console.log(`  • Revenue  : ₹${tRev.toLocaleString('en-IN')} (${tOrds} orders)`);
  console.log(`  • Waste    : ₹${tWaste.toLocaleString('en-IN')}`);
  console.log(`  • Expenses : ₹${tExp.toLocaleString('en-IN')}`);
  console.log(`  • Profit   : ₹${tProfit.toLocaleString('en-IN')}\n`);

  // 2. MONTHLY METRICS
  const monthSales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE TO_CHAR(order_date, 'YYYY-MM') = $1 AND order_status != 'Cancelled'`, [monthPrefix]);
  const monthWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE TO_CHAR(waste_date, 'YYYY-MM') = $1`, [monthPrefix]);
  const monthExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE TO_CHAR(expense_date, 'YYYY-MM') = $1`, [monthPrefix]);

  const mRev = parseFloat(monthSales.rows[0].rev);
  const mOrds = parseInt(monthSales.rows[0].ords, 10);
  const mWaste = parseFloat(monthWaste.rows[0].waste);
  const mExp = parseFloat(monthExp.rows[0].exp);
  const mProfit = mRev - mWaste - mExp;

  console.log(`📆 CURRENT MONTH (${monthPrefix}):`);
  console.log(`  • Revenue  : ₹${mRev.toLocaleString('en-IN')} (${mOrds} orders)`);
  console.log(`  • Waste    : ₹${mWaste.toLocaleString('en-IN')} (${((mWaste/mRev)*100).toFixed(2)}% of revenue)`);
  console.log(`  • Expenses : ₹${mExp.toLocaleString('en-IN')} (${((mExp/mRev)*100).toFixed(2)}% of revenue)`);
  console.log(`  • Net Profit: ₹${mProfit.toLocaleString('en-IN')} (${((mProfit/mRev)*100).toFixed(2)}% margin)\n`);

  // 3. YEARLY METRICS
  const yearSales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE EXTRACT(YEAR FROM order_date) = $1 AND order_status != 'Cancelled'`, [currentYear]);
  const yearWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE EXTRACT(YEAR FROM waste_date) = $1`, [currentYear]);
  const yearExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE EXTRACT(YEAR FROM expense_date) = $1`, [currentYear]);

  const yRev = parseFloat(yearSales.rows[0].rev);
  const yOrds = parseInt(yearSales.rows[0].ords, 10);
  const yWaste = parseFloat(yearWaste.rows[0].waste);
  const yExp = parseFloat(yearExp.rows[0].exp);
  const yProfit = yRev - yWaste - yExp;

  console.log(`📈 CURRENT YEAR (${currentYear}):`);
  console.log(`  • Revenue  : ₹${yRev.toLocaleString('en-IN')} (${yOrds} orders)`);
  console.log(`  • Waste    : ₹${yWaste.toLocaleString('en-IN')} (${((yWaste/yRev)*100).toFixed(2)}% of revenue)`);
  console.log(`  • Expenses : ₹${yExp.toLocaleString('en-IN')} (${((yExp/yRev)*100).toFixed(2)}% of revenue)`);
  console.log(`  • Net Profit: ₹${yProfit.toLocaleString('en-IN')} (${((yProfit/yRev)*100).toFixed(2)}% margin)\n`);

  process.exit(0);
}

testRealism();
