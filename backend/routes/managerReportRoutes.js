const express = require('express');
const router = express.Router();
const {
  getAllManagerReports,
  getManagerReportById,
  createManagerReport
} = require('../controllers/managerReportController');

router.get('/manager-reports', getAllManagerReports);
router.get('/manager-reports/:id', getManagerReportById);
router.post('/manager-reports', createManagerReport);

module.exports = router;
