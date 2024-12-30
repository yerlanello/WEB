const Transaction = require('../models/transaction');

// GET all transactions for the authenticated user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transactions', error: err });
  }
};

// POST a new transaction for the authenticated user
const createTransaction = async (req, res) => {
  const { description, amount, type, category } = req.body;

  const newTransaction = new Transaction({
    description,
    amount,
    type,
    category,
    userId: req.user._id,
  });

  try {
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: 'Error creating transaction', error: err });
  }
};

// Other methods (updateTransaction, deleteTransaction) remain similar but should verify ownership
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category } = req.body;

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id }, // Ensure the user owns the transaction
      { description, amount, type, category },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Error updating transaction', error: err });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
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
  deleteTransaction,
};
