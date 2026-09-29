const express = require('express');
const router = express.Router();
const {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder
} = require('../controllers/procurementController');

router.get('/purchase-orders', getAllPurchaseOrders);
router.get('/purchase-orders/:id', getPurchaseOrderById);
router.post('/purchase-orders', createPurchaseOrder);
router.put('/purchase-orders/:id', updatePurchaseOrder);

module.exports = router;
