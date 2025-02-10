const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
}, { collection: "budgets" });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
