const Budget = require('../models/budget');

// Create a new budget limit
const createBudget = async (req, res) => {
  const { category, limit } = req.body;
  const newBudget = new Budget({ userId: req.user._id, category, limit });

  try {
    await newBudget.save();
    res.status(201).json({ message: 'Budget limit created successfully', budget: newBudget });
  } catch (err) {
    res.status(500).json({ message: 'Error creating budget limit', error: err });
  }
};

// Get all budget limits for the authenticated user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving budget limits', error: err });
  }
};

// Update an existing budget limit
const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { category, limit } = req.body;

  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { category, limit },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget limit not found or unauthorized' });
    }

    res.status(200).json(updatedBudget);
  } catch (err) {
    res.status(500).json({ message: 'Error updating budget limit', error: err });
  }
};

// Delete a budget limit
const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget limit not found or unauthorized' });
    }

    res.status(200).json({ message: 'Budget limit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget limit', error: err });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
