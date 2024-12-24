
const Transaction = require('../models/transaction');

// GET all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transactions', error: err });
  }
};

// POST a new transaction
const createTransaction = async (req, res) => {
  const { description, amount, type, category } = req.body;
  
  const newTransaction = new Transaction({ description, amount, type, category });
  
  try {
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: 'Error creating transaction', error: err });
  }
};

// PUT update an existing transaction by ID
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category } = req.body;
  
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, { description, amount, type, category }, { new: true });
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Error updating transaction', error: err });
  }
};

// DELETE a transaction by ID
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting transaction', error: err });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
