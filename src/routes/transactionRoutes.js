const express = require('express');
const router = express.Router();
const BalanceController = require('../controllers/transactionController');

// Get balance between two users
router.get('/fetch_balance', BalanceController.getBalanceBetweenUsers);
router.get('/fetch_balance_group', BalanceController.getBalanceBetweenUsersforGroup);
router.get('/transactions/fetch', BalanceController.getUsersTransactions)

// Update balance as settled
router.put('/settle_for_group', BalanceController.settleGroupBalance);
router.put('/settle_all', BalanceController.settleBalance);



module.exports = router;
