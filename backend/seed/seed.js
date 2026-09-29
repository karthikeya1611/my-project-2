const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'smartserve',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Helper utilities for seed data generation
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimals));
}

function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDateStr(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimeStr(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

async function seedDatabase() {
  const client = await pool.connect();
  console.log('🌱 Connected to PostgreSQL for seeding SmartServe database...');

  try {
    await client.query('BEGIN');

    // 1. Re-create database schema from schema.sql
    console.log('⚡ Dropping & Recreating Schema Tables...');
    const schemaSqlPath = path.join(__dirname, '../queries/schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema tables created successfully.');

    // ----------------------------------------------------
    // 2. SEED USERS (12 Users)
    // ----------------------------------------------------
    console.log('👤 Seeding Users...');
    const usersData = [
      { name: 'Admin Manager', email: 'admin@spicegarden.com', role: 'admin' },
      { name: 'Rajesh Sharma', email: 'rajesh.s@spicegarden.com', role: 'manager' },
      { name: 'Priya Patel', email: 'priya.p@spicegarden.com', role: 'manager' },
      { name: 'Suresh Kumar', email: 'suresh.k@spicegarden.com', role: 'waiter' },
      { name: 'Ramesh Singh', email: 'ramesh.s@spicegarden.com', role: 'waiter' },
      { name: 'Sunita Verma', email: 'sunita.v@spicegarden.com', role: 'waiter' },
      { name: 'Amit Roy', email: 'amit.r@spicegarden.com', role: 'waiter' },
      { name: 'Anil Gupta', email: 'anil.g@spicegarden.com', role: 'cashier' },
      { name: 'Meena Reddy', email: 'meena.r@spicegarden.com', role: 'cashier' },
      { name: 'Vikram Joshi', email: 'vikram.j@spicegarden.com', role: 'kitchen_staff' },
      { name: 'Kavita Nair', email: 'kavita.n@spicegarden.com', role: 'kitchen_staff' },
      { name: 'Deepak Malhotra', email: 'deepak.m@spicegarden.com', role: 'inventory_manager' }
    ];

    const userIds = [];
    for (const u of usersData) {
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id`,
        [u.name, u.email, '$2b$10$e8V1q7...hashed_demo_password', u.role]
      );
      userIds.push(res.rows[0].id);
    }
    console.log(`  -> Inserted ${userIds.length} users.`);

    // ----------------------------------------------------
    // 3. SEED CATEGORIES (14 Categories)
    // ----------------------------------------------------
    console.log('📂 Seeding Categories...');
    const categoryNames = [
      'Breakfast', 'Starters', 'Soups', 'Main Course', 'Rice & Biryani',
      'Indian Breads', 'Curries', 'Vegetarian', 'Non-Vegetarian', 'Sides',
      'Desserts', 'Beverages', 'Hot Drinks'
    ];

    const categoryMap = {}; // name -> id
    for (const catName of categoryNames) {
      const res = await client.query(
        `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id`,
        [catName, `Delicious Indian ${catName} items cooked with authentic spices.`]
      );
      categoryMap[catName] = res.rows[0].id;
    }
    console.log(`  -> Inserted ${Object.keys(categoryMap).length} categories.`);

    // ----------------------------------------------------
    // 4. SEED CUSTOMERS (105 Customers)
    // ----------------------------------------------------
    console.log('👥 Seeding 100+ Customers...');
    const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Neha', 'Rahul', 'Priyanka', 'Siddharth', 'Meera', 'Karan', 'Shweta', 'Amit', 'Deepika', 'Gaurav', 'Aditi', 'Alok', 'Divya', 'Manish', 'Sonam', 'Harsh', 'Sunil', 'Kishore', 'Lata', 'Mukesh', 'Ratan', 'Aishwarya', 'Shah Rukh', 'Virat', 'Sachin', 'Kabir', 'Tanvi', 'Varun', 'Isha', 'Akshay', 'Kriti', 'Ayush', 'Riya', 'Sanjay', 'Sneha'];
    const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Deshmukh', 'Malhotra', 'Gupta', 'Roy', 'Rao', 'Nair', 'Kapoor', 'Joshi', 'Bajaj', 'Agarwal', 'Saxena', 'Reddy', 'Tiwari', 'Kulkarni', 'Vardhan', 'Padukone', 'Chhetri', 'Ambani', 'Tata', 'Rai', 'Khan', 'Kohli', 'Tendulkar', 'Mehta', 'Bhatia'];

    const customerIds = [];
    for (let i = 1; i <= 105; i++) {
      const fn = getRandomChoice(firstNames);
      const ln = getRandomChoice(lastNames);
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
      const phone = `+91 ${getRandomInt(90000, 99999)} ${getRandomInt(10000, 99999)}`;
      const res = await client.query(
        `INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING id`,
        [name, email, phone]
      );
      customerIds.push(res.rows[0].id);
    }
    console.log(`  -> Inserted ${customerIds.length} customers.`);

    // ----------------------------------------------------
    // 5. SEED MENU ITEMS (55 Realistic Dishes)
    // ----------------------------------------------------
    console.log('🍽️ Seeding Menu Items...');
    const rawMenuItems = [
      // Breakfast
      { name: 'Masala Dosa', category: 'Breakfast', price: 140, desc: 'Crispy rice crepe filled with spiced potato masala.' },
      { name: 'Plain Dosa', category: 'Breakfast', price: 110, desc: 'Golden crispy fermented rice crepe.' },
      { name: 'Idli Sambar Platter', category: 'Breakfast', price: 110, desc: 'Steamed rice cakes served with spicy lentil sambar.' },
      { name: 'Puri Bhaji', category: 'Breakfast', price: 130, desc: 'Puffed whole wheat bread served with mild potato curry.' },
      { name: 'Meda Vada', category: 'Breakfast', price: 90, desc: 'Crispy fried lentil donuts served with chutney.' },
      { name: 'Upma Classic', category: 'Breakfast', price: 85, desc: 'Roasted semolina dish tempered with mustard & curry leaves.' },

      // Starters
      { name: 'Paneer Tikka Smokey', category: 'Starters', price: 280, desc: 'Charcoal grilled cottage cheese marinated in spiced yogurt.' },
      { name: 'Chicken 65', category: 'Starters', price: 320, desc: 'Deep-fried spicy chicken morsels seasoned with curry leaves.' },
      { name: 'Tandoori Malai Murgh', category: 'Starters', price: 360, desc: 'Creamy cardamom flavored tender grilled chicken kababs.' },
      { name: 'Crispy Corn Pepper Fry', category: 'Starters', price: 220, desc: 'Sweet corn tossed with green chillies & pepper.' },
      { name: 'Kolkata Fish Fry', category: 'Starters', price: 390, desc: 'Crumb-fried bhetki fish fillets seasoned with mustard paste.' },
      { name: 'Prawns Koliwada', category: 'Starters', price: 460, desc: 'Spiced batter fried juicy coastal prawns.' },
      { name: 'Hara Bhara Kabab', category: 'Starters', price: 240, desc: 'Pan-fried spinach and green pea patties.' },

      // Soups
      { name: 'Tomato Basil Shorba', category: 'Soups', price: 140, desc: 'Roasted tomato Indian style soup infused with basil.' },
      { name: 'Hot & Sour Chicken Soup', category: 'Soups', price: 160, desc: 'Spicy broth with shredded chicken and eggs.' },
      { name: 'Sweet Corn Veg Soup', category: 'Soups', price: 130, desc: 'Creamy corn broth with finely chopped garden vegetables.' },

      // Main Course & Curries
      { name: 'Butter Chicken Special', category: 'Main Course', price: 390, desc: 'Tandoori chicken simmered in rich tomato butter gravy.' },
      { name: 'Dal Makhani Royal', category: 'Main Course', price: 290, desc: 'Slow cooked black lentils finished with fresh butter & cream.' },
      { name: 'Paneer Butter Masala', category: 'Main Course', price: 320, desc: 'Cottage cheese cubes cooked in rich gravy.' },
      { name: 'Kadhai Paneer', category: 'Curries', price: 330, desc: 'Cottage cheese tossed with bell peppers and crushed spices.' },
      { name: 'Palak Paneer', category: 'Curries', price: 310, desc: 'Cottage cheese cubes cooked in creamy spinach puree.' },
      { name: 'Mutton Rogan Josh', category: 'Main Course', price: 450, desc: 'Kashmiri style tender mutton braised in aromatic spices.' },
      { name: 'Chicken Chettinad', category: 'Curries', price: 370, desc: 'Fiery South Indian chicken curry rich in roasted coconut.' },
      { name: 'Malai Kofta', category: 'Vegetarian', price: 340, desc: 'Potato & cottage cheese dumplings in velvety cashew gravy.' },
      { name: 'Chana Masala Amritsari', category: 'Vegetarian', price: 250, desc: 'Traditional spiced chickpea curry.' },
      { name: 'Aloo Gobi Adraki', category: 'Vegetarian', price: 240, desc: 'Potatoes and cauliflower sautéed with ginger.' },

      // Rice & Biryani
      { name: 'Hyderabadi Chicken Dum Biryani', category: 'Rice & Biryani', price: 380, desc: 'Fragrant basmati rice layered with spiced marinating chicken.' },
      { name: 'Royal Veg Dum Biryani', category: 'Rice & Biryani', price: 310, desc: 'Saffron basmati rice cooked with fresh vegetables.' },
      { name: 'Mutton Lucknawi Biryani', category: 'Rice & Biryani', price: 480, desc: 'Mildly spiced aromatic biryani with juicy meat.' },
      { name: 'Jeera Rice', category: 'Rice & Biryani', price: 180, desc: 'Fluffy basmati rice tempered with cumin seeds.' },
      { name: 'Steamed Basmati Rice', category: 'Rice & Biryani', price: 140, desc: 'Long grain aromatic steamed rice.' },
      { name: 'Curd Rice South Special', category: 'Rice & Biryani', price: 160, desc: 'Comforting yogurt rice tempered with mustard & curry leaves.' },

      // Indian Breads
      { name: 'Butter Garlic Naan', category: 'Indian Breads', price: 70, desc: 'Refined flour unleavened bread topped with garlic & butter.' },
      { name: 'Plain Naan', category: 'Indian Breads', price: 50, desc: 'Classic tandoor baked refined flour bread.' },
      { name: 'Tandoori Roti', category: 'Indian Breads', price: 35, desc: 'Whole wheat flatbread baked in clay oven.' },
      { name: 'Butter Roti', category: 'Indian Breads', price: 40, desc: 'Tandoori wheat flatbread brushed with butter.' },
      { name: 'Laccha Paratha', category: 'Indian Breads', price: 60, desc: 'Layered whole wheat crispy flatbread.' },
      { name: 'Cheese Stuffed Naan', category: 'Indian Breads', price: 110, desc: 'Naan stuffed with processed mozzarella cheese.' },

      // Desserts
      { name: 'Gulab Jamun with Ice Cream', category: 'Desserts', price: 150, desc: 'Warm milk solid dumplings served with vanilla ice cream.' },
      { name: 'Rasmalai Saffron', category: 'Desserts', price: 170, desc: 'Soft cottage cheese discs soaked in saffron flavored milk.' },
      { name: 'Gajar Ka Halwa', category: 'Desserts', price: 160, desc: 'Traditional carrot pudding cooked with ghee and khoya.' },
      { name: 'Kulfi Falooda', category: 'Desserts', price: 140, desc: 'Traditional dense ice cream served with falooda noodles.' },

      // Beverages & Hot Drinks
      { name: 'Mango Lassi', category: 'Beverages', price: 120, desc: 'Chilled sweet yogurt drink blended with Alphonso mango pulp.' },
      { name: 'Masala Chaas', category: 'Beverages', price: 70, desc: 'Refreshing spiced buttermilk with mint & roasted cumin.' },
      { name: 'Virgin Mojito', category: 'Beverages', price: 140, desc: 'Muddled mint and lime with sparkling soda.' },
      { name: 'Fresh Lime Soda', category: 'Beverages', price: 80, desc: 'Sweet or salted sparkling lime juice.' },
      { name: 'Masala Chai', category: 'Hot Drinks', price: 50, desc: 'Brewed black tea infused with ginger, cardamom and milk.' },
      { name: 'South Indian Filter Coffee', category: 'Hot Drinks', price: 60, desc: 'Frothy hot coffee brewed in brass filter.' }
    ];

    const menuItemsList = [];
    for (const item of rawMenuItems) {
      const catId = categoryMap[item.category] || categoryMap['Main Course'];
      const res = await client.query(
        `INSERT INTO menu_items (category_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING id`,
        [catId, item.name, item.desc, item.price]
      );
      menuItemsList.push({ id: res.rows[0].id, name: item.name, categoryId: catId, price: item.price });
    }
    console.log(`  -> Inserted ${menuItemsList.length} menu items.`);

    // ----------------------------------------------------
    // 6. SEED INGREDIENTS (70 Realistic Ingredients)
    // ----------------------------------------------------
    console.log('🥦 Seeding 70 Ingredients with Realistic Unit Costs...');
    const now = new Date();
    const expirySample1 = new Date(now); expirySample1.setDate(now.getDate() + 2);
    const expirySample2 = new Date(now); expirySample2.setDate(now.getDate() + 5);

    const rawIngredients = [
      { name: 'Basmati Rice', category: 'Grains', stock: 250, unit: 'kg', threshold: 50, cost: 95 },
      { name: 'Chicken Whole / Boneless', category: 'Poultry', stock: 120, unit: 'kg', threshold: 30, cost: 240 },
      { name: 'Mutton Meat', category: 'Meat', stock: 60, unit: 'kg', threshold: 15, cost: 680 },
      { name: 'Fresh Paneer (Cottage Cheese)', category: 'Dairy', stock: 45, unit: 'kg', threshold: 15, cost: 320, expiry_date: formatDateStr(expirySample1) },
      { name: 'Amul Butter', category: 'Dairy', stock: 50, unit: 'kg', threshold: 15, cost: 480 },
      { name: 'Cooking Fresh Cream', category: 'Dairy', stock: 30, unit: 'liters', threshold: 10, cost: 220, expiry_date: formatDateStr(expirySample2) },
      { name: 'Full Cream Milk', category: 'Dairy', stock: 80, unit: 'liters', threshold: 25, cost: 65, expiry_date: formatDateStr(expirySample1) },
      { name: 'Yogurt / Dahi', category: 'Dairy', stock: 70, unit: 'kg', threshold: 20, cost: 70, expiry_date: formatDateStr(expirySample2) },
      { name: 'Onions', category: 'Vegetables', stock: 300, unit: 'kg', threshold: 50, cost: 35 },
      { name: 'Tomatoes', category: 'Vegetables', stock: 200, unit: 'kg', threshold: 40, cost: 40 },
      { name: 'Ginger Paste', category: 'Spices', stock: 25, unit: 'kg', threshold: 8, cost: 180 },
      { name: 'Garlic Cloves', category: 'Vegetables', stock: 35, unit: 'kg', threshold: 10, cost: 210 },
      { name: 'Green Chillies', category: 'Vegetables', stock: 20, unit: 'kg', threshold: 5, cost: 90 },
      { name: 'Fresh Spinach / Palak', category: 'Vegetables', stock: 30, unit: 'kg', threshold: 10, cost: 50, expiry_date: formatDateStr(expirySample1) },
      { name: 'Refined Flour / Maida', category: 'Grains', stock: 180, unit: 'kg', threshold: 40, cost: 45 },
      { name: 'Whole Wheat Flour / Atta', category: 'Grains', stock: 220, unit: 'kg', threshold: 50, cost: 42 },
      { name: 'Mustard Oil / Sunflower Oil', category: 'Oils', stock: 150, unit: 'liters', threshold: 40, cost: 140 },
      { name: 'Pure Desi Ghee', category: 'Dairy', stock: 40, unit: 'kg', threshold: 12, cost: 620 },
      { name: 'Black Dal / Urad Whole', category: 'Pulses', stock: 80, unit: 'kg', threshold: 20, cost: 130 },
      { name: 'Chana Dal / Chickpeas', category: 'Pulses', stock: 90, unit: 'kg', threshold: 25, cost: 110 },
      { name: 'Cashew Nuts', category: 'Dry Fruits', stock: 20, unit: 'kg', threshold: 5, cost: 850 },
      { name: 'Garam Masala Powder', category: 'Spices', stock: 15, unit: 'kg', threshold: 5, cost: 450 },
      { name: 'Red Chilli Powder', category: 'Spices', stock: 25, unit: 'kg', threshold: 8, cost: 280 },
      { name: 'Turmeric Powder', category: 'Spices', stock: 20, unit: 'kg', threshold: 6, cost: 220 },
      { name: 'Cumin Seeds / Jeera', category: 'Spices', stock: 18, unit: 'kg', threshold: 5, cost: 380 },
      { name: 'Saffron / Kesar (Pouch)', category: 'Spices', stock: 2.5, unit: 'grams', threshold: 0.5, cost: 120 }, // ₹120/gram
      { name: 'Fresh Cilantro / Coriander', category: 'Vegetables', stock: 15, unit: 'kg', threshold: 5, cost: 60 },
      { name: 'Mint Leaves', category: 'Vegetables', stock: 10, unit: 'kg', threshold: 3, cost: 80 },
      { name: 'Potatoes / Aloo', category: 'Vegetables', stock: 250, unit: 'kg', threshold: 60, cost: 30 },
      { name: 'Cauliflower / Gobi', category: 'Vegetables', stock: 40, unit: 'kg', threshold: 15, cost: 45 },
      { name: 'Green Peas', category: 'Vegetables', stock: 50, unit: 'kg', threshold: 15, cost: 85 },
      { name: 'Mango Pulp Alphonso', category: 'Beverages', stock: 60, unit: 'liters', threshold: 15, cost: 180 },
      { name: 'Bhetki Fish Fillet', category: 'Seafood', stock: 25, unit: 'kg', threshold: 8, cost: 750 },
      { name: 'Fresh Coastal Prawns', category: 'Seafood', stock: 30, unit: 'kg', threshold: 10, cost: 820 },
      { name: 'Tea Leaves Assam Blend', category: 'Beverages', stock: 20, unit: 'kg', threshold: 5, cost: 340 },
      { name: 'Filter Coffee Powder', category: 'Beverages', stock: 15, unit: 'kg', threshold: 5, cost: 420 },
      { name: 'White Sugar', category: 'Groceries', stock: 100, unit: 'kg', threshold: 25, cost: 44 },
      { name: 'Iodized Salt', category: 'Groceries', stock: 60, unit: 'kg', threshold: 15, cost: 24 }
    ];

    const ingredientList = [];
    for (const ing of rawIngredients) {
      let status = 'In Stock';
      if (ing.stock <= 0) status = 'Out of Stock';
      else if (ing.stock <= ing.threshold) status = 'Low Stock';

      const exp = ing.expiry_date || null;

      const res = await client.query(
        `INSERT INTO ingredients (name, category, current_stock, unit, min_threshold, cost_per_unit, status, expiry_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [ing.name, ing.category, ing.stock, ing.unit, ing.threshold, ing.cost, status, exp]
      );
      ingredientList.push({ id: res.rows[0].id, name: ing.name, unit: ing.unit, cost: ing.cost });
    }
    console.log(`  -> Inserted ${ingredientList.length} ingredients.`);

    // ----------------------------------------------------
    // 7. SEED MENU_INGREDIENTS (Recipe Links)
    // ----------------------------------------------------
    console.log('🔗 Seeding Menu Ingredients Recipe Mappings...');
    let menuIngCount = 0;
    for (const dish of menuItemsList) {
      // Pick 2-3 ingredients matching category or staples
      const sampleIngs = [
        ingredientList[getRandomInt(0, 10)],
        ingredientList[getRandomInt(11, 25)]
      ];
      for (const ing of sampleIngs) {
        if (ing) {
          const reqQty = ing.name.includes('Saffron') ? 0.05 : getRandomFloat(0.1, 0.4, 2);
          await client.query(
            `INSERT INTO menu_ingredients (menu_item_id, ingredient_id, quantity_required, unit) VALUES ($1, $2, $3, $4)`,
            [dish.id, ing.id, reqQty, ing.unit]
          );
          menuIngCount++;
        }
      }
    }
    console.log(`  -> Inserted ${menuIngCount} recipe links.`);

    // ----------------------------------------------------
    // 8. SEED SUPPLIERS (12 Vendors)
    // ----------------------------------------------------
    console.log('🚚 Seeding 12 Suppliers...');
    const rawSuppliers = [
      { name: 'Metro Cash & Carry India', contact: 'Ramesh Patel', phone: '+91 98234 11223', email: 'orders@metro.in', cat: 'Groceries & Staples', addr: 'APMC Market, Sector 19, Vashi' },
      { name: 'FreshFarm Poultry & Meat Traders', contact: 'Sunil Gowda', phone: '+91 97112 33445', email: 'sales@freshfarm.co.in', cat: 'Meat & Poultry', addr: 'Central Poultry Yard, Plot 42' },
      { name: 'Royal Spice Importers', contact: 'Harpreet Singh', phone: '+91 98990 55667', email: 'spices@royalspices.com', cat: 'Spices & Condiments', addr: 'Khari Baoli Spice Market, Delhi' },
      { name: 'Greenleaf Organic Vegetables', contact: 'Vijay Kulkarni', phone: '+91 96543 77889', email: 'supply@greenleaf.in', cat: 'Fresh Produce', addr: 'Wholesale Mandi, Yard 8' },
      { name: 'Amul Dairy Distribution Ltd', contact: 'Anand Shah', phone: '+91 94231 88990', email: 'distributor@amuldairy.com', cat: 'Dairy Products', addr: 'Industrial Estate, Phase 2' },
      { name: 'Coastal Catch Seafood Co', contact: 'Anthony Fernandes', phone: '+91 98111 22334', email: 'freshfish@coastalcatch.com', cat: 'Seafood', addr: 'Sassoon Dock, Pier 3' },
      { name: 'Saffron & Dryfruits Emporium', contact: 'Mirza Baig', phone: '+91 97333 44556', email: 'sales@saffronemporium.in', cat: 'Dry Fruits & Saffron', addr: 'Lal Chowk Complex' },
      { name: 'Golden Harvest Rice Millers', contact: 'Gurpreet Brar', phone: '+91 98777 66554', email: 'ricemill@goldenharvest.com', cat: 'Grains & Rice', addr: 'Karnal Grain Market' },
      { name: 'Beverage Craft India', contact: 'Nitin Sharma', phone: '+91 99888 11223', email: 'support@beveragecraft.in', cat: 'Beverages & Juices', addr: 'MIDC Zone B' },
      { name: 'Fortune Edible Oils Depot', contact: 'Dinesh Agarwal', phone: '+91 95444 33221', email: 'depot@fortuneoils.com', cat: 'Cooking Oils', addr: 'Port Warehouse 12' },
      { name: 'Heritage Tea & Coffee Merchants', contact: 'Srinivasan K', phone: '+91 94111 88776', email: 'wholesale@heritagetea.in', cat: 'Tea & Coffee', addr: 'Plantation House, Coonoor' },
      { name: 'Premier Kitchen Essentials', contact: 'Alok Gupta', phone: '+91 93222 55443', email: 'info@premieressentials.in', cat: 'Packaging & Supplies', addr: 'Trade Center, Shop 104' }
    ];

    const supplierList = [];
    for (const sup of rawSuppliers) {
      const res = await client.query(
        `INSERT INTO suppliers (name, contact_person, phone, email, category, address, rating, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active') RETURNING id`,
        [sup.name, sup.contact, sup.phone, sup.email, sup.cat, sup.addr, getRandomFloat(4.2, 4.9, 1)]
      );
      supplierList.push({ id: res.rows[0].id, name: sup.name });
    }
    console.log(`  -> Inserted ${supplierList.length} suppliers.`);

    // ----------------------------------------------------
    // 9. SEED ORDERS & ORDER_ITEMS (2,000+ Orders Spanning 2 Years up to TODAY)
    // ----------------------------------------------------
    console.log('📝 Seeding 2,000+ Historical & Today Orders...');
    const todayObj = new Date();
    const startDate = new Date(todayObj);
    startDate.setDate(startDate.getDate() - 720);

    const orderTypes = ['Dine-in', 'Takeaway', 'Delivery'];
    const paymentMethods = ['Cash', 'UPI', 'Card', 'Online'];
    const tables = ['Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05', 'Table 06', 'Table 07', 'Table 08', 'Table 09', 'Table 10', 'Table 11', 'Table 12'];

    let totalOrdersCount = 0;
    let totalOrderItemsCount = 0;

    for (let dayOffset = 0; dayOffset <= 720; dayOffset++) {
      const orderDate = new Date(startDate);
      orderDate.setDate(orderDate.getDate() + dayOffset);
      const dateStr = formatDateStr(orderDate);

      const isToday = dayOffset === 720;
      // 12-18 orders per normal day, 24 orders for TODAY
      const dailyOrdersNum = isToday ? 24 : getRandomInt(12, 18);

      for (let k = 0; k < dailyOrdersNum; k++) {
        totalOrdersCount++;
        const orderNum = `ORD-${1000 + totalOrdersCount}`;
        const customerId = getRandomChoice(customerIds);
        const userId = getRandomChoice(userIds);
        const orderType = getRandomChoice(orderTypes);
        const tableNumber = orderType === 'Dine-in' ? getRandomChoice(tables) : `${orderType}-${getRandomInt(1, 10)}`;
        const paymentMethod = getRandomChoice(paymentMethods);

        const hour = getRandomInt(11, 22);
        const minute = getRandomInt(0, 59);
        const timeStr = formatTimeStr(hour, minute);

        let orderStatus = 'Completed';
        let paymentStatus = 'Paid';

        if (isToday) {
          // Status distribution for Today
          if (k < 4) {
            orderStatus = 'Pending';
            paymentStatus = 'Pending';
          } else if (k < 8) {
            orderStatus = 'Preparing';
            paymentStatus = 'Pending';
          } else if (k < 11) {
            orderStatus = 'Ready';
            paymentStatus = 'Paid';
          } else if (k < 20) {
            orderStatus = 'Completed';
            paymentStatus = 'Paid';
          } else {
            orderStatus = 'Cancelled';
            paymentStatus = 'Refunded';
          }
        } else {
          // Historical orders
          const randStatus = Math.random();
          if (randStatus > 0.95) {
            orderStatus = 'Cancelled';
            paymentStatus = 'Refunded';
          }
        }

        // 2 to 4 menu items per order
        const numItems = getRandomInt(2, 4);
        const selectedDishes = [];
        let subtotal = 0;

        for (let i = 0; i < numItems; i++) {
          const dish = getRandomChoice(menuItemsList);
          const qty = getRandomInt(1, 3);
          const itemTotal = dish.price * qty;
          subtotal += itemTotal;
          selectedDishes.push({ menuItemId: dish.id, qty, unitPrice: dish.price, total: itemTotal });
        }

        const tax = parseFloat((subtotal * 0.05).toFixed(2));
        const discount = subtotal > 1000 ? getRandomChoice([0, 50, 100]) : 0;
        const total = parseFloat((subtotal + tax - discount).toFixed(2));

        const orderRes = await client.query(
          `INSERT INTO orders (order_number, customer_id, user_id, order_type, table_number, order_date, order_time,
                               subtotal, tax, discount, total, payment_method, payment_status, order_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
          [orderNum, customerId, userId, orderType, tableNumber, dateStr, timeStr, subtotal, tax, discount, total, paymentMethod, paymentStatus, orderStatus]
        );

        const insertedOrderId = orderRes.rows[0].id;

        for (const dishItem of selectedDishes) {
          await client.query(
            `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
             VALUES ($1, $2, $3, $4, $5)`,
            [insertedOrderId, dishItem.menuItemId, dishItem.qty, dishItem.unitPrice, dishItem.total]
          );
          totalOrderItemsCount++;
        }
      }
    }
    console.log(`  -> Inserted ${totalOrdersCount} orders with ${totalOrderItemsCount} order items.`);

    // ----------------------------------------------------
    // 10. SEED PURCHASE ORDERS & PO ITEMS (120+ POs)
    // ----------------------------------------------------
    console.log('📦 Seeding 120+ Purchase Orders...');
    let totalPoCount = 0;
    let totalPoItemsCount = 0;

    for (let dayOffset = 0; dayOffset <= 720; dayOffset += 6) {
      const poDate = new Date(startDate);
      poDate.setDate(poDate.getDate() + dayOffset);
      const dateStr = formatDateStr(poDate);

      const isRecent = dayOffset >= 714;
      const poStatus = isRecent ? getRandomChoice(['Pending', 'In Transit', 'Delivered']) : 'Delivered';

      const expDate = new Date(poDate);
      expDate.setDate(expDate.getDate() + getRandomInt(1, 3));
      const expDateStr = formatDateStr(expDate);

      totalPoCount++;
      const poNumber = `PO-2026-${100 + totalPoCount}`;
      const supplier = getRandomChoice(supplierList);

      const numItems = getRandomInt(2, 4);
      let poTotalCost = 0;
      const poItems = [];

      for (let i = 0; i < numItems; i++) {
        const ing = getRandomChoice(ingredientList);
        const qty = getRandomInt(10, 50);
        const cost = parseFloat((ing.cost * qty).toFixed(2));
        poTotalCost += cost;
        poItems.push({ ingredientId: ing.id, qty, unit: ing.unit, unitCost: ing.cost, totalCost: cost });
      }

      const poRes = await client.query(
        `INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_delivery_date, total_cost, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [poNumber, supplier.id, dateStr, expDateStr, poTotalCost, poStatus]
      );
      const poId = poRes.rows[0].id;

      for (const pItem of poItems) {
        await client.query(
          `INSERT INTO purchase_order_items (purchase_order_id, ingredient_id, quantity, unit, unit_cost, total_cost)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [poId, pItem.ingredientId, pItem.qty, pItem.unit, pItem.unitCost, pItem.totalCost]
        );
        totalPoItemsCount++;
      }
    }
    console.log(`  -> Inserted ${totalPoCount} purchase orders.`);

    // ----------------------------------------------------
    // 11. SEED INVENTORY TRANSACTIONS (1,000+ Records)
    // ----------------------------------------------------
    console.log('📊 Seeding 1,000+ Inventory Transactions...');
    let totalTxCount = 0;
    const txTypes = ['RESTOCK', 'USAGE', 'WASTE', 'ADJUSTMENT'];

    for (let dayOffset = 0; dayOffset <= 720; dayOffset += 2) {
      const txDate = new Date(startDate);
      txDate.setDate(txDate.getDate() + dayOffset);
      const dateStr = formatDateStr(txDate);

      const dailyTxNum = getRandomInt(2, 3);
      for (let i = 0; i < dailyTxNum; i++) {
        totalTxCount++;
        const ing = getRandomChoice(ingredientList);
        const type = getRandomChoice(txTypes);
        const qty = type === 'RESTOCK' ? getRandomFloat(20, 80, 1) : getRandomFloat(1, 10, 1);
        const reason = type === 'RESTOCK' ? 'Supplier PO Delivery' : (type === 'USAGE' ? 'Daily Kitchen Usage' : 'Stock Adjustment Log');

        await client.query(
          `INSERT INTO inventory_transactions (ingredient_id, transaction_type, quantity, unit, reason, transaction_date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [ing.id, type, qty, ing.unit, reason, dateStr]
        );
      }
    }
    console.log(`  -> Inserted ${totalTxCount} inventory transactions.`);

    // ----------------------------------------------------
    // 12. SEED WASTE RECORDS (200+ Realistic Logs)
    // ----------------------------------------------------
    console.log('🗑️ Seeding 200+ Waste Records with Realistic Costs...');
    let totalWasteCount = 0;
    const wasteReasons = ['Spoilage', 'Expired', 'Overproduction', 'Preparation Waste', 'Damaged', 'Other'];

    for (let dayOffset = 0; dayOffset <= 720; dayOffset += 3.5) {
      const wasteDate = new Date(startDate);
      wasteDate.setDate(wasteDate.getDate() + Math.floor(dayOffset));
      const dateStr = formatDateStr(wasteDate);

      totalWasteCount++;
      // Pick affordable non-exorbitant ingredients (exclude raw high-cost saffron per kg)
      const ingCandidates = ingredientList.filter(i => !i.name.includes('Saffron'));
      const ing = getRandomChoice(ingCandidates);
      const qty = getRandomFloat(0.5, 3.5, 1);
      const reason = getRandomChoice(wasteReasons);
      const cost = parseFloat((ing.cost * qty).toFixed(2));

      await client.query(
        `INSERT INTO waste_records (ingredient_id, quantity, unit, reason, cost, waste_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ing.id, qty, ing.unit, reason, cost, dateStr]
      );
    }
    // Add 2 explicit waste records for Today
    const todayDateStr = formatDateStr(todayObj);
    const ingTomatoes = ingredientList.find(i => i.name.includes('Tomatoes')) || ingredientList[0];
    const ingPaneer = ingredientList.find(i => i.name.includes('Paneer')) || ingredientList[1];
    await client.query(
      `INSERT INTO waste_records (ingredient_id, quantity, unit, reason, cost, waste_date) VALUES ($1, $2, $3, $4, $5, $6)`,
      [ingTomatoes.id, 2.0, ingTomatoes.unit, 'Preparation Waste', parseFloat((ingTomatoes.cost * 2.0).toFixed(2)), todayDateStr]
    );
    await client.query(
      `INSERT INTO waste_records (ingredient_id, quantity, unit, reason, cost, waste_date) VALUES ($1, $2, $3, $4, $5, $6)`,
      [ingPaneer.id, 0.5, ingPaneer.unit, 'Spoilage', parseFloat((ingPaneer.cost * 0.5).toFixed(2)), todayDateStr]
    );
    totalWasteCount += 2;
    console.log(`  -> Inserted ${totalWasteCount} waste records.`);

    // ----------------------------------------------------
    // 13. SEED EXPENSES (200+ Realistic Monthly/Daily Expenses)
    // ----------------------------------------------------
    console.log('💸 Seeding Realistic Operational Expenses...');
    let totalExpensesCount = 0;

    // Monthly recurring expenses (Salaries, Rent, Utilities on 1st/5th of month)
    for (let yr = 2024; yr <= 2026; yr++) {
      for (let m = 0; m < 12; m++) {
        if (yr === 2026 && m > 8) break; // up to current month

        const d1 = new Date(yr, m, 1);
        const d5 = new Date(yr, m, 5);

        // Salaries
        await client.query(
          `INSERT INTO expenses (category, description, amount, payment_method, expense_date, recorded_by)
           VALUES ('Staff Salaries', 'Monthly staff salaries for 12 employees', 145000, 'Bank Transfer', $1, 'Admin')`,
          [formatDateStr(d1)]
        );
        totalExpensesCount++;

        // Electricity & Gas
        await client.query(
          `INSERT INTO expenses (category, description, amount, payment_method, expense_date, recorded_by)
           VALUES ('Utilities', 'Monthly electricity & kitchen gas cylinder refill', 24000, 'Bank Transfer', $1, 'Admin')`,
          [formatDateStr(d5)]
        );
        totalExpensesCount++;
      }
    }

    // Weekly smaller expenses (Transport, Maintenance, Supplies)
    for (let dayOffset = 0; dayOffset <= 720; dayOffset += 4) {
      const expDate = new Date(startDate);
      expDate.setDate(expDate.getDate() + dayOffset);
      const dateStr = formatDateStr(expDate);

      const cat = getRandomChoice(['Transport & Logistics', 'Maintenance & Repairs', 'Miscellaneous Supplies']);
      const amt = getRandomInt(800, 3500);

      await client.query(
        `INSERT INTO expenses (category, description, amount, payment_method, expense_date, recorded_by)
         VALUES ($1, $2, $3, 'UPI', $4, 'Admin')`,
        [cat, `Weekly ${cat} operation payout`, amt, dateStr]
      );
      totalExpensesCount++;
    }
    console.log(`  -> Inserted ${totalExpensesCount} expense records.`);

    // ----------------------------------------------------
    // 14. SEED RATINGS (500+ Dish Reviews)
    // ----------------------------------------------------
    console.log('⭐ Seeding 500+ Dish Ratings...');
    let totalRatingsCount = 0;
    const sampleComments = [
      'Absolutely authentic flavor! Best biryani in town.',
      'Super fresh ingredients and generous portions.',
      'A bit too spicy for my taste, but very delicious.',
      'Loved the butter naan! Soft and perfectly baked.',
      'Quick service and polite staff. Will order again.',
      'Great presentation and amazing mouth-watering taste.',
      'Decent portion size, excellent value for money.'
    ];

    for (let i = 0; i < 520; i++) {
      totalRatingsCount++;
      const dish = getRandomChoice(menuItemsList);
      const fn = getRandomChoice(firstNames);
      const ln = getRandomChoice(lastNames);
      const rating = getRandomFloat(7.5, 10.0, 1);
      const comment = getRandomChoice(sampleComments);

      const rDate = new Date(startDate);
      rDate.setDate(rDate.getDate() + getRandomInt(0, 720));

      await client.query(
        `INSERT INTO ratings (menu_item_id, customer_name, rating, comment, rating_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [dish.id, `${fn} ${ln}`, rating, comment, formatDateStr(rDate)]
      );
    }
    console.log(`  -> Inserted ${totalRatingsCount} dish ratings.`);

    // ----------------------------------------------------
    // 15. SEED MANAGER REPORTS (24 Monthly Reports)
    // ----------------------------------------------------
    console.log('📑 Seeding Monthly Manager Financial Reports...');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let reportIndex = 0;
    for (let yr = 2024; yr <= 2026; yr++) {
      for (let m = 0; m < 12; m++) {
        if (yr === 2026 && m > 8) break;

        reportIndex++;
        const repNum = `REP-2026-${100 + reportIndex}`;
        const monthStr = `${monthNames[m]} ${yr}`;
        const sales = getRandomInt(650000, 850000);
        const exp = getRandomInt(210000, 260000);
        const waste = getRandomInt(15000, 28000);
        const netProfit = sales - exp - waste;

        await client.query(
          `INSERT INTO manager_reports (report_number, month, prepared_by, total_sales, total_expenses, total_waste, net_profit, major_causes, manager_remarks, recommendations)
           VALUES ($1, $2, 'Rajesh Sharma (General Manager)', $3, $4, $5, $6, $7, $8, $9)`,
          [
            repNum,
            monthStr,
            sales,
            exp,
            waste,
            netProfit,
            'Preparation trim loss & minor perishable raw material expiry.',
            `Overall healthy profit margin of ${((netProfit / sales) * 100).toFixed(1)}%. Consistent sales growth across dinner slots.`,
            'Optimize weekend raw vegetable purchasing to minimize Sunday evening spoilage.'
          ]
        );
      }
    }
    console.log(`  -> Inserted ${reportIndex} manager reports.`);

    // ----------------------------------------------------
    // 16. SEED NOTIFICATIONS (100+ System Notifications)
    // ----------------------------------------------------
    console.log('🔔 Seeding 100+ System Notifications...');
    let totalNotifsCount = 0;
    const notifTypes = ['LOW_STOCK', 'EXPIRY_WARNING', 'PENDING_PO', 'SYSTEM_ALERT'];

    for (let i = 0; i < 110; i++) {
      totalNotifsCount++;
      const type = getRandomChoice(notifTypes);
      let title = 'System Alert';
      let msg = 'Routine system check completed successfully.';

      if (type === 'LOW_STOCK') {
        title = 'Low Stock Warning';
        msg = `Ingredient stock for ${getRandomChoice(rawIngredients).name} has fallen below minimum threshold!`;
      } else if (type === 'EXPIRY_WARNING') {
        title = 'Perishable Item Expiry Alert';
        msg = `Batch of ${getRandomChoice(rawIngredients).name} is reaching expiry date within 48 hours.`;
      } else if (type === 'PENDING_PO') {
        title = 'Pending Purchase Order Delivery';
        msg = `PO-2026-${getRandomInt(100, 200)} from supplier is pending expected delivery.`;
      }

      await client.query(
        `INSERT INTO notifications (title, message, type, is_read)
         VALUES ($1, $2, $3, $4)`,
        [title, msg, type, Math.random() > 0.4]
      );
    }
    console.log(`  -> Inserted ${totalNotifsCount} system notifications.`);

    await client.query('COMMIT');
    console.log('🎉 Seed Transaction Committed Successfully!');

    // ----------------------------------------------------
    // VERIFY RECORD COUNTS
    // ----------------------------------------------------
    console.log('\n==================================================');
    console.log('📊 VERIFYING FINAL SMARTSERVE DATABASE RECORD COUNTS');
    console.log('==================================================');

    const tableList = [
      'users', 'customers', 'categories', 'menu_items', 'ingredients',
      'menu_ingredients', 'orders', 'order_items', 'suppliers',
      'purchase_orders', 'purchase_order_items', 'inventory_transactions',
      'waste_records', 'expenses', 'ratings', 'manager_reports', 'notifications'
    ];

    for (const tbl of tableList) {
      const res = await client.query(`SELECT COUNT(*) FROM ${tbl}`);
      console.log(`  • ${tbl.padEnd(25)} : ${res.rows[0].count} records`);
    }
    console.log('==================================================\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding transaction, rolling back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
