const db = require('../db');

// GET /api/waste
const getAllWasteRecords = async (req, res) => {
  try {
    const { reason, startDate, endDate } = req.query;
    let queryText = `
      SELECT w.*, i.name AS ingredient_name, i.category AS ingredient_category
      FROM waste_records w
      LEFT JOIN ingredients i ON w.ingredient_id = i.id
    `;
    const params = [];
    const whereClauses = [];

    if (reason) {
      params.push(reason);
      whereClauses.push(`w.reason = $${params.length}`);
    }

    if (startDate) {
      params.push(startDate);
      whereClauses.push(`w.waste_date >= $${params.length}`);
    }

    if (endDate) {
      params.push(endDate);
      whereClauses.push(`w.waste_date <= $${params.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' ORDER BY w.waste_date DESC, w.id DESC';
    const result = await db.query(queryText, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching waste records:', err);
    res.status(500).json({ success: false, message: 'Server error fetching waste records' });
  }
};

// GET /api/waste/summary
const getWasteSummary = async (req, res) => {
  try {
    // Total Waste Cost & Records
    const totalRes = await db.query(`
      SELECT COUNT(*) AS total_records,
             COALESCE(SUM(cost), 0) AS total_cost,
             COALESCE(SUM(quantity), 0) AS total_quantity
      FROM waste_records
    `);

    // Waste by Reason
    const reasonRes = await db.query(`
      SELECT reason, COUNT(*) AS count, COALESCE(SUM(cost), 0) AS total_cost
      FROM waste_records
      GROUP BY reason
      ORDER BY total_cost DESC
    `);

    // Waste by Ingredient
    const ingRes = await db.query(`
      SELECT i.name AS ingredient_name, w.unit, COUNT(*) AS logs_count,
             COALESCE(SUM(w.quantity), 0) AS total_qty,
             COALESCE(SUM(w.cost), 0) AS total_cost
      FROM waste_records w
      JOIN ingredients i ON w.ingredient_id = i.id
      GROUP BY i.name, w.unit
      ORDER BY total_cost DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        total_records: parseInt(totalRes.rows[0].total_records, 10),
        total_cost: parseFloat(totalRes.rows[0].total_cost),
        total_quantity: parseFloat(totalRes.rows[0].total_quantity),
        by_reason: reasonRes.rows.map(r => ({
          reason: r.reason,
          count: parseInt(r.count, 10),
          total_cost: parseFloat(r.total_cost)
        })),
        by_ingredient: ingRes.rows.map(r => ({
          ingredient_name: r.ingredient_name,
          unit: r.unit,
          logs_count: parseInt(r.logs_count, 10),
          total_qty: parseFloat(r.total_qty),
          total_cost: parseFloat(r.total_cost)
        }))
      }
    });
  } catch (err) {
    console.error('Error fetching waste summary:', err);
    res.status(500).json({ success: false, message: 'Server error fetching waste summary' });
  }
};

// GET /api/waste/:id
const getWasteRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT w.*, i.name AS ingredient_name, i.category AS ingredient_category
      FROM waste_records w
      LEFT JOIN ingredients i ON w.ingredient_id = i.id
      WHERE w.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Waste record not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching waste record by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching waste record' });
  }
};

// POST /api/waste
const createWasteRecord = async (req, res) => {
  const client = await db.connect();
  try {
    const { ingredient_id, quantity, reason, waste_date } = req.body;

    if (!ingredient_id || !quantity || !reason) {
      return res.status(400).json({ success: false, message: 'ingredient_id, quantity, and reason are required' });
    }

    await client.query('BEGIN');

    const ingRes = await client.query('SELECT name, unit, cost_per_unit, current_stock FROM ingredients WHERE id = $1', [ingredient_id]);
    if (ingRes.rows.length === 0) {
      throw new Error('Ingredient not found');
    }

    const ing = ingRes.rows[0];
    const qtyNum = parseFloat(quantity);
    const cost = parseFloat((ing.cost_per_unit * qtyNum).toFixed(2));
    const todayStr = waste_date || new Date().toISOString().split('T')[0];

    // Insert Waste Record
    const queryText = `
      INSERT INTO waste_records (ingredient_id, quantity, unit, reason, cost, waste_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const wasteResult = await client.query(queryText, [ingredient_id, qtyNum, ing.unit, reason, cost, todayStr]);

    // Record inventory transaction
    await client.query(
      `INSERT INTO inventory_transactions (ingredient_id, transaction_type, quantity, unit, reason, transaction_date)
       VALUES ($1, 'WASTE', $2, $3, $4, $5)`,
      [ingredient_id, qtyNum, ing.unit, `Food Waste: ${reason}`, todayStr]
    );

    // Deduct stock from ingredient
    const updatedStock = Math.max(0, parseFloat(ing.current_stock) - qtyNum);
    await client.query('UPDATE ingredients SET current_stock = $1 WHERE id = $2', [updatedStock, ingredient_id]);

    await client.query('COMMIT');

    res.status(201).json({ success: true, message: 'Waste record logged successfully', data: wasteResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating waste record:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating waste record' });
  } finally {
    client.release();
  }
};

// PUT /api/waste/:id
const updateWasteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, quantity, cost } = req.body;

    const checkRes = await db.query('SELECT * FROM waste_records WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Waste record not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE waste_records
      SET reason = $1, quantity = $2, cost = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [
      reason ?? existing.reason,
      quantity ?? existing.quantity,
      cost ?? existing.cost,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Waste record updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating waste record:', err);
    res.status(500).json({ success: false, message: 'Server error updating waste record' });
  }
};

// DELETE /api/waste/:id
const deleteWasteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM waste_records WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Waste record not found' });
    }

    res.json({ success: true, message: 'Waste record deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting waste record:', err);
    res.status(500).json({ success: false, message: 'Server error deleting waste record' });
  }
};

module.exports = {
  getAllWasteRecords,
  getWasteSummary,
  getWasteRecordById,
  createWasteRecord,
  updateWasteRecord,
  deleteWasteRecord
};
