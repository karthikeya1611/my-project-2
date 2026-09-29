const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getExpiryTracking,
  getAllMovements,
  getIngredientMovements,
  recordInventoryMovement,
  updateInventoryItem
} = require('../controllers/inventoryController');

router.get('/inventory/expiry', getExpiryTracking);
router.get('/inventory/movements', getAllMovements);
router.get('/inventory', getAllInventory);
router.get('/inventory/:id/movements', getIngredientMovements);
router.post('/inventory/movements', recordInventoryMovement);
router.put('/inventory/:id', updateInventoryItem);

module.exports = router;

