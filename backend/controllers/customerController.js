const db = require('../db');

// GET /api/customers?search=
const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let queryText = 'SELECT * FROM customers';
    const params = [];

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ' WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1';
    }

    queryText += ' ORDER BY id DESC';
    const result = await db.query(queryText, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ success: false, message: 'Server error fetching customers' });
  }
};

// GET /api/customers/:id
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Fetch recent orders for customer
    const ordersRes = await db.query(
      'SELECT id, order_number, order_date, total, order_status FROM orders WHERE customer_id = $1 ORDER BY order_date DESC LIMIT 5',
      [id]
    );

    const customerData = {
      ...result.rows[0],
      recent_orders: ordersRes.rows
    };

    res.json({ success: true, data: customerData });
  } catch (err) {
    console.error('Error fetching customer by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching customer' });
  }
};

// POST /api/customers
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const queryText = `
      INSERT INTO customers (name, email, phone)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(queryText, [name, email || '', phone]);

    res.status(201).json({ success: true, message: 'Customer created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ success: false, message: 'Server error creating customer' });
  }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const checkRes = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE customers
      SET name = $1, email = $2, phone = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [
      name ?? existing.name,
      email ?? existing.email,
      phone ?? existing.phone,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Customer updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ success: false, message: 'Server error updating customer' });
  }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ success: false, message: 'Server error deleting customer' });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
