const db = require('../db');

// GET /api/purchase-orders
const getAllPurchaseOrders = async (req, res) => {
  try {
    const { status, supplier_id } = req.query;
    let queryText = `
      SELECT po.*, s.name AS supplier_name, s.contact_person, s.phone AS supplier_phone
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
    `;
    const params = [];
    const whereClauses = [];

    if (status) {
      params.push(status);
      whereClauses.push(`po.status = $${params.length}`);
    }

    if (supplier_id) {
      params.push(supplier_id);
      whereClauses.push(`po.supplier_id = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' ORDER BY po.order_date DESC, po.id DESC';
    const result = await db.query(queryText, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    res.status(500).json({ success: false, message: 'Server error fetching purchase orders' });
  }
};

// GET /api/purchase-orders/:id
const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && Number.isInteger(Number(id));
    const whereClause = isNumeric ? 'po.id = $1' : 'po.po_number = $1';
    const queryParam = isNumeric ? parseInt(id, 10) : id;

    const poRes = await db.query(`
      SELECT po.*, s.name AS supplier_name, s.contact_person, s.phone AS supplier_phone, s.email AS supplier_email
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE ${whereClause}
    `, [queryParam]);

    if (poRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    const po = poRes.rows[0];

    const itemsRes = await db.query(`
      SELECT poi.*, i.name AS ingredient_name, i.unit AS ingredient_unit
      FROM purchase_order_items poi
      LEFT JOIN ingredients i ON poi.ingredient_id = i.id
      WHERE poi.purchase_order_id = $1
    `, [po.id]);

    res.json({
      success: true,
      data: {
        ...po,
        items: itemsRes.rows
      }
    });
  } catch (err) {
    console.error('Error fetching purchase order by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching purchase order' });
  }
};

// POST /api/purchase-orders
const createPurchaseOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const { supplier_id, items, expected_delivery_date, status = 'Pending' } = req.body;

    if (!supplier_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'supplier_id and items list are required' });
    }

    await client.query('BEGIN');

    let totalCost = 0;
    const processedItems = [];

    for (const item of items) {
      const ingRes = await client.query('SELECT name, unit, cost_per_unit FROM ingredients WHERE id = $1', [item.ingredient_id]);
      if (ingRes.rows.length === 0) {
        throw new Error(`Ingredient ID ${item.ingredient_id} not found`);
      }
      const unitCost = item.unit_cost ?? ingRes.rows[0].cost_per_unit;
      const quantity = item.quantity || 1;
      const itemTotal = parseFloat((unitCost * quantity).toFixed(2));
      totalCost += itemTotal;

      processedItems.push({
        ingredient_id: item.ingredient_id,
        quantity,
        unit: ingRes.rows[0].unit,
        unit_cost: unitCost,
        total_cost: itemTotal
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const poNumber = `PO-2026-${Date.now().toString().slice(-5)}`;

    const poQuery = `
      INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_delivery_date, total_cost, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const poResult = await client.query(poQuery, [
      poNumber,
      supplier_id,
      todayStr,
      expected_delivery_date || todayStr,
      totalCost,
      status
    ]);
    const createdPo = poResult.rows[0];

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO purchase_order_items (purchase_order_id, ingredient_id, quantity, unit, unit_cost, total_cost)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [createdPo.id, pItem.ingredient_id, pItem.quantity, pItem.unit, pItem.unit_cost, pItem.total_cost]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: {
        ...createdPo,
        items: processedItems
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating purchase order:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating purchase order' });
  } finally {
    client.release();
  }
};

// PUT /api/purchase-orders/:id
const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expected_delivery_date } = req.body;

    const checkRes = await db.query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE purchase_orders
      SET status = $1, expected_delivery_date = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [
      status ?? existing.status,
      expected_delivery_date ?? existing.expected_delivery_date,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Purchase order updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating purchase order:', err);
    res.status(500).json({ success: false, message: 'Server error updating purchase order' });
  }
};

module.exports = {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder
};
