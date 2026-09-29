-- SmartServe Database Schema Definition
-- Creates all 17 core tables with proper primary keys, foreign keys, and indexes.

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS manager_reports CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS waste_records CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_ingredients CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (Admin, Manager, Waiters, Cashiers)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Menu Items Table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Ingredients Table
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    unit VARCHAR(20) NOT NULL,
    min_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10,
    cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'In Stock',
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Menu Ingredients Junction Table (Dish Recipe Mapping)
CREATE TABLE menu_ingredients (
    id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 2) NOT NULL CHECK (quantity_required > 0),
    unit VARCHAR(20) NOT NULL
);

-- 7. Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('Dine-in', 'Takeaway', 'Delivery')),
    table_number VARCHAR(20),
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax NUMERIC(10, 2) NOT NULL CHECK (tax >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Cash', 'UPI', 'Card', 'Online')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
    order_status VARCHAR(20) NOT NULL DEFAULT 'Completed' CHECK (order_status IN ('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- 9. Suppliers Table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    category VARCHAR(50),
    address TEXT,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Purchase Orders Table
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id INT REFERENCES suppliers(id) ON DELETE CASCADE,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'Delivered' CHECK (status IN ('Draft', 'Pending', 'In Transit', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Purchase Order Items Table
CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE SET NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost >= 0)
);

-- 12. Inventory Transactions Table
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('RESTOCK', 'USAGE', 'WASTE', 'ADJUSTMENT')),
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    reason TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Waste Records Table
CREATE TABLE waste_records (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('Spoilage', 'Expired', 'Overproduction', 'Preparation Waste', 'Damaged', 'Other')),
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    waste_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Expenses Table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Bank Transfer', 'UPI', 'Cash', 'Card', 'Cheque')),
    expense_date DATE NOT NULL,
    recorded_by VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Ratings & Reviews Table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    customer_name VARCHAR(100),
    rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 10.0),
    comment TEXT,
    rating_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Manager Reports Table
CREATE TABLE manager_reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(20) UNIQUE NOT NULL,
    month VARCHAR(20) NOT NULL,
    prepared_by VARCHAR(100) NOT NULL,
    total_sales NUMERIC(10, 2) NOT NULL,
    total_expenses NUMERIC(10, 2) NOT NULL,
    total_waste NUMERIC(10, 2) NOT NULL,
    net_profit NUMERIC(10, 2) NOT NULL,
    major_causes TEXT,
    manager_remarks TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('LOW_STOCK', 'EXPIRY_WARNING', 'PENDING_PO', 'SYSTEM_ALERT')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Query Performance
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_inventory_tx_ingredient ON inventory_transactions(ingredient_id);
CREATE INDEX idx_ratings_menu_item ON ratings(menu_item_id);
