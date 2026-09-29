const express = require('express');
const router = express.Router();
const {
  getAllWasteRecords,
  getWasteSummary,
  getWasteRecordById,
  createWasteRecord,
  updateWasteRecord,
  deleteWasteRecord
} = require('../controllers/wasteController');

router.get('/waste', getAllWasteRecords);
router.get('/waste/summary', getWasteSummary);
router.get('/waste/:id', getWasteRecordById);
router.post('/waste', createWasteRecord);
router.put('/waste/:id', updateWasteRecord);
router.delete('/waste/:id', deleteWasteRecord);

module.exports = router;
