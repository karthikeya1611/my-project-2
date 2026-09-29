const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const healthRoutes = require('./routes/healthRoutes');
const menuRoutes = require('./routes/menuRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const managerReportRoutes = require('./routes/managerReportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api', healthRoutes);
app.use('/api', menuRoutes);
app.use('/api', customerRoutes);
app.use('/api', orderRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', supplierRoutes);
app.use('/api', procurementRoutes);
app.use('/api', wasteRoutes);
app.use('/api', expenseRoutes);
app.use('/api', managerReportRoutes);
app.use('/api', notificationRoutes);
app.use('/api', dashboardRoutes);

// Root Fallback Route
app.get('/', (req, res) => {
  res.json({
    app: 'SmartServe REST API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/dashboard',
      menu: '/api/menu',
      categories: '/api/categories',
      customers: '/api/customers',
      orders: '/api/orders',
      inventory: '/api/inventory',
      suppliers: '/api/suppliers',
      purchase_orders: '/api/purchase-orders',
      waste: '/api/waste',
      expenses: '/api/expenses',
      manager_reports: '/api/manager-reports',
      notifications: '/api/notifications'
    }
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 SmartServe Backend Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
});
