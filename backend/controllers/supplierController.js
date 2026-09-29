const db = require('../db');

// Ensure some POs have active statuses for upcoming deliveries
const ensureActivePurchaseOrders = async () => {
  try {
    const checkActive = await db.query(`
      SELECT COUNT(*) FROM purchase_orders WHERE status IN ('Draft', 'Pending', 'In Transit', 'Approved', 'Ordered')
    `);
    if (parseInt(checkActive.rows[0].count, 10) === 0) {
      const today = new Date();
      const pos = await db.query(`SELECT id FROM purchase_orders ORDER BY id DESC LIMIT 6`);
      const statuses = ['In Transit', 'Pending', 'Approved', 'Ordered', 'Draft'];
      for (let i = 0; i < pos.rows.length; i++) {
        const status = statuses[i % statuses.length];
        const expDate = new Date(today);
        expDate.setDate(expDate.getDate() + (i + 1));
        const expStr = expDate.toISOString().split('T')[0];
        await db.query(`UPDATE purchase_orders SET status = $1, expected_delivery_date = $2 WHERE id = $3`, [status, expStr, pos.rows[i].id]);
      }
    }
  } catch (err) {
    console.error('Error ensuring active purchase orders:', err.message);
  }
};

ensureActivePurchaseOrders();

// GET /api/suppliers
const getAllSuppliers = async (req, res) => {
  try {
    await ensureActivePurchaseOrders();
    const result = await db.query(`
      SELECT s.*,
             COUNT(po.id) AS total_orders,
             COUNT(CASE WHEN po.status IN ('Draft', 'Pending', 'In Transit', 'Approved', 'Ordered') THEN 1 END) AS active_orders_count
      FROM suppliers s
      LEFT JOIN purchase_orders po ON s.id = po.supplier_id
      GROUP BY s.id
      ORDER BY s.id ASC
    `);

    // Fetch active POs for each supplier
    const activePos = await db.query(`
      SELECT po.id, po.po_number, po.supplier_id, po.order_date, po.expected_delivery_date, po.total_cost, po.status,
             JSON_AGG(JSON_BUILD_OBJECT(
               'item_name', i.name,
               'quantity', poi.quantity,
               'unit', poi.unit,
               'unit_cost', poi.unit_cost,
               'total_cost', poi.total_cost
             )) FILTER (WHERE poi.id IS NOT NULL) AS items
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      LEFT JOIN ingredients i ON poi.ingredient_id = i.id
      WHERE po.status IN ('Draft', 'Pending', 'In Transit', 'Approved', 'Ordered')
      GROUP BY po.id
      ORDER BY po.expected_delivery_date ASC NULLS LAST
    `);

    const activeMap = {};
    for (const po of activePos.rows) {
      if (!activeMap[po.supplier_id]) activeMap[po.supplier_id] = [];
      activeMap[po.supplier_id].push(po);
    }

    const suppliersEnriched = result.rows.map((sup) => ({
      ...sup,
      current_purchase_orders: activeMap[sup.id] || []
    }));

    res.json({ success: true, count: suppliersEnriched.length, data: suppliersEnriched });
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ success: false, message: 'Server error fetching suppliers' });
  }
};

// GET /api/suppliers/:id
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM suppliers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Purchase orders history & details
    const poRes = await db.query(`
      SELECT po.id, po.po_number, po.order_date, po.expected_delivery_date, po.total_cost, po.status,
             JSON_AGG(JSON_BUILD_OBJECT(
               'item_name', i.name,
               'quantity', poi.quantity,
               'unit', poi.unit,
               'unit_cost', poi.unit_cost,
               'total_cost', poi.total_cost
             )) FILTER (WHERE poi.id IS NOT NULL) AS items
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      LEFT JOIN ingredients i ON poi.ingredient_id = i.id
      WHERE po.supplier_id = $1
      GROUP BY po.id
      ORDER BY po.order_date DESC
    `, [id]);

    const allPos = poRes.rows;
    const currentOrders = allPos.filter((p) => ['Draft', 'Pending', 'In Transit', 'Approved', 'Ordered'].includes(p.status));
    const pastOrders = allPos.filter((p) => ['Delivered', 'Cancelled'].includes(p.status));

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        current_purchase_orders: currentOrders,
        upcoming_deliveries: currentOrders,
        purchase_orders: allPos,
        past_orders: pastOrders
      }
    });
  } catch (err) {
    console.error('Error fetching supplier by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching supplier' });
  }
};


// POST /api/suppliers
const createSupplier = async (req, res) => {
  try {
    const { name, contact_person, phone, email, category, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const queryText = `
      INSERT INTO suppliers (name, contact_person, phone, email, category, address, rating, status)
      VALUES ($1, $2, $3, $4, $5, $6, 4.5, 'Active')
      RETURNING *
    `;
    const values = [name, contact_person || '', phone, email || '', category || 'General', address || ''];
    const result = await db.query(queryText, values);

    res.status(201).json({ success: true, message: 'Supplier created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating supplier:', err);
    res.status(500).json({ success: false, message: 'Server error creating supplier' });
  }
};

// PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, email, category, address, rating, status } = req.body;

    const checkRes = await db.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE suppliers
      SET name = $1, contact_person = $2, phone = $3, email = $4, category = $5, address = $6, rating = $7, status = $8
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      name ?? existing.name,
      contact_person ?? existing.contact_person,
      phone ?? existing.phone,
      email ?? existing.email,
      category ?? existing.category,
      address ?? existing.address,
      rating ?? existing.rating,
      status ?? existing.status,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Supplier updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({ success: false, message: 'Server error updating supplier' });
  }
};

// DELETE /api/suppliers/:id
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, message: 'Supplier deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ success: false, message: 'Server error deleting supplier' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
