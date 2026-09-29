const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllCategories,
  getMenuItemRatings,
  getAllRatings,
  createMenuItemRating
} = require('../controllers/menuController');

// Menu Categories Route
router.get('/categories', getAllCategories);

// Menu CRUD Routes
router.get('/menu', getAllMenuItems);
router.get('/menu/:id', getMenuItemById);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Menu Ratings Routes
router.get('/ratings', getAllRatings);
router.get('/menu/:id/ratings', getMenuItemRatings);
router.post('/menu/:id/ratings', createMenuItemRating);

module.exports = router;
