const db = require('../db');

// GET /api/orders?type=&status=&payment_status=&date=&search=&limit=50&offset=0
const getAllOrders = async (req, res) => {
  try {
    const { type, status, payment_status, date, search, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, u.name AS user_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.user_id = u.id
    `;

    const whereClauses = [];
    const params = [];

    if (type) {
      params.push(type);
      whereClauses.push(`o.order_type = $${params.length}`);
    }

    if (status) {
      params.push(status);
      whereClauses.push(`o.order_status = $${params.length}`);
    }

    if (payment_status) {
      params.push(payment_status);
      whereClauses.push(`o.payment_status = $${params.length}`);
    }

    if (date) {
      params.push(date);
      whereClauses.push(`o.order_date = $${params.length}`);
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      whereClauses.push(`(o.order_number ILIKE $${params.length} OR c.name ILIKE $${params.length} OR o.table_number ILIKE $${params.length})`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' ORDER BY o.order_date DESC, o.order_time DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await db.query(queryText, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id) && Number.isInteger(Number(id));
    const whereClause = isNumeric ? 'o.id = $1' : 'o.order_number = $1';
    const queryParam = isNumeric ? parseInt(id, 10) : id;

    const orderRes = await db.query(`
      SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, u.name AS waiter_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE ${whereClause}
    `, [queryParam]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderRes.rows[0];

    // Fetch line items with dish details
    const itemsRes = await db.query(`
      SELECT oi.*, m.name AS item_name, c.name AS category_name
      FROM order_items oi
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE oi.order_id = $1
    `, [order.id]);

    res.json({
      success: true,
      data: {
        ...order,
        items: itemsRes.rows
      }
    });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching order' });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const {
      customer_id,
      user_id,
      order_type,
      table_number,
      items, // Array of { menu_item_id, quantity, unit_price }
      discount = 0,
      payment_method = 'UPI',
      payment_status = 'Paid',
      order_status = 'Preparing'
    } = req.body;

    if (!order_type || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order type and items list are required' });
    }

    await client.query('BEGIN');

    // Calculate Subtotal from items
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const dishRes = await client.query('SELECT price, name FROM menu_items WHERE id = $1', [item.menu_item_id]);
      if (dishRes.rows.length === 0) {
        throw new Error(`Menu item ID ${item.menu_item_id} not found`);
      }
      const unitPrice = item.unit_price ?? dishRes.rows[0].price;
      const quantity = item.quantity || 1;
      const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));
      subtotal += totalPrice;

      processedItems.push({
        menu_item_id: item.menu_item_id,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice
      });
    }

    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
    const finalDiscount = parseFloat((discount || 0).toFixed(2));
    const total = parseFloat((subtotal + tax - finalDiscount).toFixed(2));

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().split(' ')[0];
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Insert Order
    const orderQuery = `
      INSERT INTO orders (order_number, customer_id, user_id, order_type, table_number, order_date, order_time,
                          subtotal, tax, discount, total, payment_method, payment_status, order_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const orderValues = [
      orderNumber,
      customer_id || null,
      user_id || null,
      order_type,
      table_number || (order_type === 'Dine-in' ? 'Table 01' : order_type),
      todayStr,
      timeStr,
      subtotal,
      tax,
      finalDiscount,
      total,
      payment_method,
      payment_status,
      order_status
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const createdOrder = orderResult.rows[0];

    // Insert Order Items
    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [createdOrder.id, pItem.menu_item_id, pItem.quantity, pItem.unit_price, pItem.total_price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        ...createdOrder,
        items: processedItems
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating order' });
  } finally {
    client.release();
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, table_number, payment_method } = req.body;

    const checkRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE orders
      SET order_status = $1, payment_status = $2, table_number = $3, payment_method = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [
      order_status ?? existing.order_status,
      payment_status ?? existing.payment_status,
      table_number ?? existing.table_number,
      payment_method ?? existing.payment_method,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Order updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ success: false, message: 'Server error updating order' });
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order cancelled/deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ success: false, message: 'Server error deleting order' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
