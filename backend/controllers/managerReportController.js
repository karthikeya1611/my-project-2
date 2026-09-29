const db = require('../db');

// GET /api/manager-reports?type=current/archived
const getAllManagerReports = async (req, res) => {
  try {
    const { type } = req.query;

    if (type === 'live-digests') {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentYear = new Date().getFullYear();
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const monthPrefix = `${currentYear}-${currentMonth}`;

      // 1. Daily Metrics (Today)
      const dailySales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE order_date = $1 AND order_status != 'Cancelled'`, [todayStr]);
      const dailyWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE waste_date = $1`, [todayStr]);
      const dailyExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE expense_date = $1`, [todayStr]);

      const dRev = parseFloat(dailySales.rows[0].rev);
      const dOrds = parseInt(dailySales.rows[0].ords, 10);
      const dWaste = parseFloat(dailyWaste.rows[0].waste);
      const dExp = parseFloat(dailyExp.rows[0].exp);
      const dProfit = parseFloat((dRev - dWaste - dExp).toFixed(2));

      // 2. Weekly Metrics (Last 7 Days)
      const weeklySales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL '6 days' AND order_status != 'Cancelled'`);
      const weeklyWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE waste_date >= CURRENT_DATE - INTERVAL '6 days'`);
      const weeklyExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE expense_date >= CURRENT_DATE - INTERVAL '6 days'`);

      const wRev = parseFloat(weeklySales.rows[0].rev);
      const wOrds = parseInt(weeklySales.rows[0].ords, 10);
      const wWaste = parseFloat(weeklyWaste.rows[0].waste);
      const wExp = parseFloat(weeklyExp.rows[0].exp);
      const wProfit = parseFloat((wRev - wWaste - wExp).toFixed(2));

      // 3. Monthly Metrics (Current Month)
      const monthSales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE TO_CHAR(order_date, 'YYYY-MM') = $1 AND order_status != 'Cancelled'`, [monthPrefix]);
      const monthWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE TO_CHAR(waste_date, 'YYYY-MM') = $1`, [monthPrefix]);
      const monthExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE TO_CHAR(expense_date, 'YYYY-MM') = $1`, [monthPrefix]);

      const mRev = parseFloat(monthSales.rows[0].rev);
      const mOrds = parseInt(monthSales.rows[0].ords, 10);
      const mWaste = parseFloat(monthWaste.rows[0].waste);
      const mExp = parseFloat(monthExp.rows[0].exp);
      const mProfit = parseFloat((mRev - mWaste - mExp).toFixed(2));

      // 4. Yearly Metrics (Current Year)
      const yearSales = await db.query(`SELECT COALESCE(SUM(total), 0) AS rev, COUNT(*) AS ords FROM orders WHERE EXTRACT(YEAR FROM order_date) = $1 AND order_status != 'Cancelled'`, [currentYear]);
      const yearWaste = await db.query(`SELECT COALESCE(SUM(cost), 0) AS waste FROM waste_records WHERE EXTRACT(YEAR FROM waste_date) = $1`, [currentYear]);
      const yearExp = await db.query(`SELECT COALESCE(SUM(amount), 0) AS exp FROM expenses WHERE EXTRACT(YEAR FROM expense_date) = $1`, [currentYear]);

      const yRev = parseFloat(yearSales.rows[0].rev);
      const yOrds = parseInt(yearSales.rows[0].ords, 10);
      const yWaste = parseFloat(yearWaste.rows[0].waste);
      const yExp = parseFloat(yearExp.rows[0].exp);
      const yProfit = parseFloat((yRev - yWaste - yExp).toFixed(2));

      // Top selling & low performing dish overall
      const topDishRes = await db.query(`
        SELECT m.name, SUM(oi.quantity) AS sold
        FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id
        GROUP BY m.id ORDER BY sold DESC LIMIT 1
      `);
      const lowDishRes = await db.query(`
        SELECT m.name, SUM(oi.quantity) AS sold
        FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id
        GROUP BY m.id ORDER BY sold ASC LIMIT 1
      `);

      const topDish = topDishRes.rows[0] ? topDishRes.rows[0].name : 'Hyderabadi Chicken Dum Biryani';
      const lowDish = lowDishRes.rows[0] ? lowDishRes.rows[0].name : 'Meda Vada';

      const digests = {
        daily: {
          period: 'Daily Digest (Today)',
          revenue: dRev,
          orders: dOrds,
          waste_cost: dWaste,
          expenses: dExp,
          estimated_profit: dProfit,
          top_selling_dish: topDish,
          lowest_selling_dish: lowDish,
          major_issues: 'Minor delay in peak hour delivery dispatch.',
          recommendations: 'Optimize kitchen line preparation for dinner peak.'
        },
        weekly: {
          period: 'Weekly Operations Summary',
          revenue: wRev,
          orders: wOrds,
          waste_cost: wWaste,
          expenses: wExp,
          estimated_profit: wProfit,
          top_selling_dish: topDish,
          lowest_selling_dish: lowDish,
          major_issues: 'Raw ingredient price fluctuation in local mandi.',
          recommendations: 'Maintain 2-day buffer stock for essential spices & grains.'
        },
        monthly: {
          period: `Monthly Executive Report (${currentYear}-${currentMonth})`,
          revenue: mRev,
          orders: mOrds,
          waste_cost: mWaste,
          expenses: mExp,
          estimated_profit: mProfit,
          top_selling_dish: topDish,
          lowest_selling_dish: lowDish,
          major_issues: 'Spurt in utility costs during high monsoon heat.',
          recommendations: 'Review cold-storage compressor insulation.'
        },
        yearly: {
          period: `Annual Operational Review (${currentYear})`,
          revenue: yRev,
          orders: yOrds,
          waste_cost: yWaste,
          expenses: yExp,
          estimated_profit: yProfit,
          top_selling_dish: topDish,
          lowest_selling_dish: lowDish,
          major_issues: 'Seasonal vegetable price spikes in Q2.',
          recommendations: 'Negotiate fixed annual rate contracts with primary suppliers.'
        }
      };

      return res.json({ success: true, data: digests });
    }

    let queryText = 'SELECT * FROM manager_reports';
    if (type === 'current') {
      queryText += ' ORDER BY id DESC LIMIT 4';
    } else if (type === 'archived') {
      queryText += ' ORDER BY id DESC OFFSET 4';
    } else {
      queryText += ' ORDER BY id DESC';
    }

    const result = await db.query(queryText);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching manager reports:', err);
    res.status(500).json({ success: false, message: 'Server error fetching manager reports' });
  }
};


// GET /api/manager-reports/:id
const getManagerReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM manager_reports WHERE id = $1 OR report_number = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Manager report not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching manager report by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching manager report' });
  }
};

// POST /api/manager-reports
const createManagerReport = async (req, res) => {
  try {
    const {
      month,
      prepared_by,
      total_sales,
      total_expenses,
      total_waste,
      net_profit,
      major_causes,
      manager_remarks,
      recommendations
    } = req.body;

    if (!month || !prepared_by || total_sales === undefined) {
      return res.status(400).json({ success: false, message: 'Month, prepared_by, and total_sales are required' });
    }

    const calculatedNetProfit = net_profit ?? (total_sales - (total_expenses || 0) - (total_waste || 0));
    const reportNum = `REP-2026-${Date.now().toString().slice(-4)}`;

    const queryText = `
      INSERT INTO manager_reports (report_number, month, prepared_by, total_sales, total_expenses, total_waste, net_profit, major_causes, manager_remarks, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      reportNum,
      month,
      prepared_by,
      total_sales,
      total_expenses || 0,
      total_waste || 0,
      calculatedNetProfit,
      major_causes || '',
      manager_remarks || '',
      recommendations || ''
    ];

    const result = await db.query(queryText, values);
    res.status(201).json({ success: true, message: 'Manager report created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating manager report:', err);
    res.status(500).json({ success: false, message: 'Server error creating manager report' });
  }
};

module.exports = {
  getAllManagerReports,
  getManagerReportById,
  createManagerReport
};
