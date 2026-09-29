const express = require('express');
const router = express.Router();
const { getDashboardOverview, syncLiveSimulation } = require('../controllers/dashboardController');

router.get('/dashboard', getDashboardOverview);
router.post('/dashboard/sync', syncLiveSimulation);

module.exports = router;

