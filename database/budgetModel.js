import mongoose from "mongoose";

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

export const BudgetModel = mongoose.model("Budget", budgetSchema);
//module.exports = mongoose.model("Budget", budgetSchema);
