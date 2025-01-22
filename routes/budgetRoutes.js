const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/authMiddleware');

// POST a new budget limit
router.post('/', authenticate, budgetController.createBudget);

// GET all budget limits for the authenticated user
router.get('/', authenticate, budgetController.getBudgets);

// PUT update an existing budget limit
router.put('/:id', authenticate, budgetController.updateBudget);

// DELETE a budget limit
router.delete('/:id', authenticate, budgetController.deleteBudget);

module.exports = router;
