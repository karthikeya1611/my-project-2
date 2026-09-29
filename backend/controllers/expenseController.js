const db = require('../db');

// GET /api/expenses
const getAllExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let queryText = 'SELECT * FROM expenses';
    const params = [];
    const whereClauses = [];

    if (category) {
      params.push(category);
      whereClauses.push(`category = $${params.length}`);
    }

    if (startDate) {
      params.push(startDate);
      whereClauses.push(`expense_date >= $${params.length}`);
    }

    if (endDate) {
      params.push(endDate);
      whereClauses.push(`expense_date <= $${params.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' ORDER BY expense_date DESC, id DESC';
    const result = await db.query(queryText, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ success: false, message: 'Server error fetching expenses' });
  }
};

// GET /api/expenses/summary
const getExpenseSummary = async (req, res) => {
  try {
    const totalRes = await db.query(`
      SELECT COUNT(*) AS total_records, COALESCE(SUM(amount), 0) AS total_amount
      FROM expenses
    `);

    const catRes = await db.query(`
      SELECT category, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total_amount
      FROM expenses
      GROUP BY category
      ORDER BY total_amount DESC
    `);

    const payRes = await db.query(`
      SELECT payment_method, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total_amount
      FROM expenses
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `);

    res.json({
      success: true,
      data: {
        total_records: parseInt(totalRes.rows[0].total_records, 10),
        total_amount: parseFloat(totalRes.rows[0].total_amount),
        by_category: catRes.rows.map(r => ({
          category: r.category,
          count: parseInt(r.count, 10),
          total_amount: parseFloat(r.total_amount)
        })),
        by_payment_method: payRes.rows.map(r => ({
          payment_method: r.payment_method,
          count: parseInt(r.count, 10),
          total_amount: parseFloat(r.total_amount)
        }))
      }
    });
  } catch (err) {
    console.error('Error fetching expense summary:', err);
    res.status(500).json({ success: false, message: 'Server error fetching expense summary' });
  }
};

// GET /api/expenses/:id
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching expense by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching expense' });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { category, description, amount, payment_method, expense_date, recorded_by } = req.body;

    if (!category || !amount || !payment_method) {
      return res.status(400).json({ success: false, message: 'Category, amount, and payment_method are required' });
    }

    const todayStr = expense_date || new Date().toISOString().split('T')[0];
    const queryText = `
      INSERT INTO expenses (category, description, amount, payment_method, expense_date, recorded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [category, description || '', amount, payment_method, todayStr, recorded_by || 'Admin'];
    const result = await db.query(queryText, values);

    res.status(201).json({ success: true, message: 'Expense created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ success: false, message: 'Server error creating expense' });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, amount, payment_method, expense_date } = req.body;

    const checkRes = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE expenses
      SET category = $1, description = $2, amount = $3, payment_method = $4, expense_date = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      category ?? existing.category,
      description ?? existing.description,
      amount ?? existing.amount,
      payment_method ?? existing.payment_method,
      expense_date ?? existing.expense_date,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Expense updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ success: false, message: 'Server error updating expense' });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    res.json({ success: true, message: 'Expense deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ success: false, message: 'Server error deleting expense' });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseSummary,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
