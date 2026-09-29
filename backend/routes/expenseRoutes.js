const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseSummary,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.get('/expenses', getAllExpenses);
router.get('/expenses/summary', getExpenseSummary);
router.get('/expenses/:id', getExpenseById);
router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

module.exports = router;
