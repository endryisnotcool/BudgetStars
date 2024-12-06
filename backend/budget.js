const BudgetModel = require('../database/budgetModel');

class Budget {
    constructor(userId, amount, categories){
        this._userId = userId;
        this._amount = amount;
        this._categories = categories;
    }

    async save(userId){
        const budget = new BudgetModel ({
            userId: userId,
            totalBudget: this._amount,
            categories: this._categories,
        });

        return await budget.save();
    }

    static async findByUserId(userId){
        return await BudgetModel.findOne(userId);
    }
}

module.exports = Budget;