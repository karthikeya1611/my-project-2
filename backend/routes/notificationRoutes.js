const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markNotificationAsRead
} = require('../controllers/notificationController');

router.get('/notifications', getAllNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

module.exports = router;
