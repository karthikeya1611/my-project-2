const db = require('../db');

// GET /api/menu?category=&available=&search=
const getAllMenuItems = async (req, res) => {
  try {
    const { category, available, search } = req.query;
    let queryText = `
      SELECT m.*, c.name AS category_name,
             COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
             COUNT(r.id) AS total_ratings
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN ratings r ON m.id = r.menu_item_id
    `;

    const whereClauses = [];
    const queryParams = [];

    if (category && category !== 'All') {
      queryParams.push(category);
      whereClauses.push(`c.name = $${queryParams.length}`);
    }

    if (available !== undefined && available !== '') {
      queryParams.push(available === 'true');
      whereClauses.push(`m.is_available = $${queryParams.length}`);
    }

    if (search && search.trim() !== '') {
      queryParams.push(`%${search.trim()}%`);
      whereClauses.push(`(m.name ILIKE $${queryParams.length} OR m.description ILIKE $${queryParams.length})`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' GROUP BY m.id, c.name ORDER BY m.id ASC';

    const result = await db.query(queryText, queryParams);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ success: false, message: 'Server error fetching menu items' });
  }
};

// GET /api/menu/:id
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = `
      SELECT m.*, c.name AS category_name,
             COALESCE(ROUND(AVG(r.rating), 1), 9.0) AS avg_rating,
             COUNT(DISTINCT r.id) AS total_ratings,
             COALESCE(SUM(oi.quantity), 0) AS total_quantity_sold,
             COALESCE(SUM(oi.total_price), 0) AS total_revenue
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN ratings r ON m.id = r.menu_item_id
      LEFT JOIN order_items oi ON m.id = oi.menu_item_id
      WHERE m.id = $1
      GROUP BY m.id, c.name
    `;
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const dish = result.rows[0];

    // Fetch ingredients used
    const ingRes = await db.query(`
      SELECT i.name, mi.quantity_required, mi.unit
      FROM menu_ingredients mi
      JOIN ingredients i ON mi.ingredient_id = i.id
      WHERE mi.menu_item_id = $1
    `, [id]);

    // Fetch reviews
    const revRes = await db.query(`
      SELECT customer_name, rating, comment, rating_date
      FROM ratings
      WHERE menu_item_id = $1
      ORDER BY rating_date DESC
      LIMIT 5
    `, [id]);

    const prepTimeMinutes = 15 + (dish.id % 15);
    const popularityLabel = dish.total_quantity_sold > 500 ? 'Bestseller 🔥' : dish.total_quantity_sold > 200 ? 'Popular ⭐' : 'Standard 🍛';

    res.json({
      success: true,
      data: {
        ...dish,
        preparation_time: `${prepTimeMinutes} mins`,
        popularity: popularityLabel,
        ingredients_used: ingRes.rows,
        customer_reviews: revRes.rows
      }
    });
  } catch (err) {
    console.error('Error fetching menu item by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching menu item' });
  }
};


// POST /api/menu
const createMenuItem = async (req, res) => {
  try {
    const { category_id, name, description, price, is_available } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ success: false, message: 'Name, price, and category_id are required' });
    }

    const queryText = `
      INSERT INTO menu_items (category_id, name, description, price, is_available)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [category_id, name, description || '', price, is_available ?? true];
    const result = await db.query(queryText, values);

    res.status(201).json({ success: true, message: 'Menu item created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ success: false, message: 'Server error creating menu item' });
  }
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, is_available } = req.body;

    const checkRes = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const existing = checkRes.rows[0];
    const queryText = `
      UPDATE menu_items
      SET category_id = $1, name = $2, description = $3, price = $4, is_available = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      category_id ?? existing.category_id,
      name ?? existing.name,
      description ?? existing.description,
      price ?? existing.price,
      is_available ?? existing.is_available,
      id
    ];

    const result = await db.query(queryText, values);
    res.json({ success: true, message: 'Menu item updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ success: false, message: 'Server error updating menu item' });
  }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ success: false, message: 'Server error deleting menu item' });
  }
};

// GET /api/categories
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};

// GET /api/menu/:id/ratings
const getMenuItemRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM ratings WHERE menu_item_id = $1 ORDER BY rating_date DESC, id DESC',
      [id]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching menu item ratings:', err);
    res.status(500).json({ success: false, message: 'Server error fetching ratings' });
  }
};

// POST /api/menu/:id/ratings
const createMenuItemRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1.0 and 10.0' });
    }

    const checkRes = await db.query('SELECT id FROM menu_items WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const queryText = `
      INSERT INTO ratings (menu_item_id, customer_name, rating, comment, rating_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(queryText, [id, customer_name || 'Anonymous', rating, comment || '', todayStr]);

    res.status(201).json({ success: true, message: 'Rating submitted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ success: false, message: 'Server error submitting rating' });
  }
};

// GET /api/ratings
const getAllRatings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, m.name AS menu_item_name
       FROM ratings r
       JOIN menu_items m ON r.menu_item_id = m.id
       ORDER BY r.rating_date DESC, r.id DESC
       LIMIT 100`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('Error fetching all ratings:', err);
    res.status(500).json({ success: false, message: 'Server error fetching ratings' });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllCategories,
  getMenuItemRatings,
  getAllRatings,
  createMenuItemRating
};
