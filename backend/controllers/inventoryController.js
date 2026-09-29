const db = require('../db');

// Helper to ensure expiry_date column exists and has values in ingredients
const ensureExpiryDates = async () => {
  try {
    await db.query(`ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS expiry_date DATE;`);
    // Populate NULL expiry_date entries with realistic dates around today
    const checkNull = await db.query(`SELECT COUNT(*) FROM ingredients WHERE expiry_date IS NULL`);
    if (parseInt(checkNull.rows[0].count, 10) > 0) {
      const today = new Date();
      const ings = await db.query(`SELECT id FROM ingredients WHERE expiry_date IS NULL ORDER BY id ASC`);
      const offsets = [-2, 0, 1, 2, 3, 5, 7, 10, 14, 20, 30];
      for (let i = 0; i < ings.rows.length; i++) {
        const offset = offsets[i % offsets.length];
        const expDate = new Date(today);
        expDate.setDate(expDate.getDate() + offset);
        const expStr = expDate.toISOString().split('T')[0];
        await db.query(`UPDATE ingredients SET expiry_date = $1 WHERE id = $2`, [expStr, ings.rows[i].id]);
      }
    }
  } catch (err) {
    console.error('Error ensuring expiry dates in ingredients:', err.message);
  }
};

// Run migration check once on startup
ensureExpiryDates();

// GET /api/inventory/expiry
const getExpiryTracking = async (req, res) => {
  try {
    await ensureExpiryDates();
    const result = await db.query(`
      SELECT i.*,
             (i.expiry_date - CURRENT_DATE) AS days_left
      FROM ingredients i
      WHERE i.expiry_date IS NOT NULL
      ORDER BY i.expiry_date ASC
    `);

    const formatted = result.rows.map((item) => {
      const daysLeft = parseInt(item.days_left, 10);
      let category = 'Expiring in X days';
      let displayText = `Expires in ${daysLeft} days`;

      if (daysLeft < 0) {
        category = 'Expired';
        displayText = 'Expired';
      } else if (daysLeft === 0) {
        category = 'Expires today';
        displayText = 'Expires today';
      } else if (daysLeft === 1) {
        category = 'Expires tomorrow';
        displayText = 'Expires tomorrow';
      } else {
        category = `Expires in ${daysLeft} days`;
        displayText = `Expires in ${daysLeft} days`;
      }

      const expDateStr = item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : 'N/A';

      return {
        id: item.id,
        ingredient: item.name,
        batch: `BATCH-2026-${String(item.id).padStart(3, '0')}`,
        quantity: `${item.current_stock} ${item.unit}`,
        current_stock: item.current_stock,
        unit: item.unit,
        expiryDate: expDateStr,
        expiry_date: expDateStr,
        daysLeft,
        category,
        display_text: displayText
      };
    });

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('Error fetching expiry tracking:', err);
    res.status(500).json({ success: false, message: 'Server error fetching expiry tracking' });
  }
};

// GET /api/inventory
const getAllInventory = async (req, res) => {
  try {
    await ensureExpiryDates();
    const { category, status } = req.query;
    let queryText = 'SELECT * FROM ingredients';
    const params = [];
    const whereClauses = [];

    if (category) {
      params.push(category);
      whereClauses.push(`category = $${params.length}`);
    }

    if (status) {
      params.push(status);
      whereClauses.push(`status = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' ORDER BY id ASC';
    const result = await db.query(queryText, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ success: false, message: 'Server error fetching inventory' });
  }
};

// GET /api/inventory/movements
const getAllMovements = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT it.*, i.name AS ingredient_name
       FROM inventory_transactions it
       JOIN ingredients i ON it.ingredient_id = i.id
       ORDER BY it.transaction_date DESC, it.id DESC
       LIMIT 100`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching inventory movements:', err);
    res.status(500).json({ success: false, message: 'Server error fetching inventory movements' });
  }
};

// GET /api/inventory/:id/movements
const getIngredientMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT it.*, i.name AS ingredient_name
       FROM inventory_transactions it
       JOIN ingredients i ON it.ingredient_id = i.id
       WHERE it.ingredient_id = $1
       ORDER BY it.transaction_date DESC, it.id DESC`,
      [id]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching ingredient movements:', err);
    res.status(500).json({ success: false, message: 'Server error fetching inventory movements' });
  }
};

// POST /api/inventory/movements
const recordInventoryMovement = async (req, res) => {
  const client = await db.connect();
  try {
    const { ingredient_id, transaction_type, quantity, reason } = req.body;

    if (!ingredient_id || !transaction_type || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'ingredient_id, transaction_type, and quantity are required'
      });
    }

    const validTypes = ['RESTOCK', 'USAGE', 'WASTE', 'RETURN', 'ADJUSTMENT'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({
        success: false,
        message: `transaction_type must be one of: ${validTypes.join(', ')}`
      });
    }

    await client.query('BEGIN');

    // Fetch existing ingredient
    const ingRes = await client.query('SELECT * FROM ingredients WHERE id = $1', [ingredient_id]);
    if (ingRes.rows.length === 0) {
      throw new Error('Ingredient not found');
    }

    const ing = ingRes.rows[0];
    let newStock = parseFloat(ing.current_stock);
    const qtyNum = parseFloat(quantity);

    if (transaction_type === 'RESTOCK' || transaction_type === 'ADJUSTMENT') {
      newStock += qtyNum;
    } else {
      // USAGE, WASTE, RETURN
      newStock = Math.max(0, newStock - qtyNum);
    }

    // Determine status
    let newStatus = 'In Stock';
    if (newStock <= 0) newStatus = 'Out of Stock';
    else if (newStock <= ing.min_threshold) newStatus = 'Low Stock';

    // Update ingredient stock
    await client.query(
      'UPDATE ingredients SET current_stock = $1, status = $2 WHERE id = $3',
      [newStock, newStatus, ingredient_id]
    );

    // Insert inventory transaction log
    const todayStr = new Date().toISOString().split('T')[0];
    const txRes = await client.query(
      `INSERT INTO inventory_transactions (ingredient_id, transaction_type, quantity, unit, reason, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [ingredient_id, transaction_type, qtyNum, ing.unit, reason || 'Manual stock update', todayStr]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Inventory movement recorded successfully',
      data: {
        transaction: txRes.rows[0],
        updated_stock: newStock,
        updated_status: newStatus
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error recording inventory movement:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error recording movement' });
  } finally {
    client.release();
  }
};

// PUT /api/inventory/:id
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, current_stock, min_threshold, cost_per_unit } = req.body;

    const checkRes = await db.query('SELECT * FROM ingredients WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ingredient not found' });
    }

    const existing = checkRes.rows[0];
    const updatedStock = current_stock ?? existing.current_stock;
    const updatedThreshold = min_threshold ?? existing.min_threshold;

    let updatedStatus = 'In Stock';
    if (updatedStock <= 0) updatedStatus = 'Out of Stock';
    else if (updatedStock <= updatedThreshold) updatedStatus = 'Low Stock';

    const queryText = `
      UPDATE ingredients
      SET name = $1, category = $2, current_stock = $3, min_threshold = $4, cost_per_unit = $5, status = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [
      name ?? existing.name,
      category ?? existing.category,
      updatedStock,
      updatedThreshold,
      cost_per_unit ?? existing.cost_per_unit,
      updatedStatus,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Ingredient updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating inventory item:', err);
    res.status(500).json({ success: false, message: 'Server error updating ingredient' });
  }
};

module.exports = {
  getAllInventory,
  getExpiryTracking,
  getAllMovements,
  getIngredientMovements,
  recordInventoryMovement,
  updateInventoryItem
};

