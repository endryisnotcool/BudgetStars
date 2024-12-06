const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBudget: { type: Number, required: true },
  categories: {
    Food: { type: Number, required: true },
    Clothing: { type: Number, required: true },
    Education: { type: Number, required: true },
    Entertainment: { type: Number, required: true },
    Health: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
