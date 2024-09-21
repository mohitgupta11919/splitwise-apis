const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.post('/add', expenseController.addExpense);
router.post('/update/:id', expenseController.updateExpense);
router.get('/fetch', expenseController.getAllExpenseGroup)

module.exports = router;
