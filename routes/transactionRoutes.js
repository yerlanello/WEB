const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET all transactions
router.get('/', transactionController.getTransactions);

// POST a new transaction
router.post('/', transactionController.createTransaction);

// PUT update a transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE a transaction
router.delete('/:id', transactionController.deleteTransaction);
    
module.exports = router;
