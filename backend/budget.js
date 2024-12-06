const BudgetModel = require('../database/budgetModel');

class Budget {
    constructor(amount, categories){
        this._amount = amount;
        this._categories = {};
    }

    async save(userId){
        const budget = new BudgetModel ({
            userId,
            totalAmount: this._amount,
            categories: this._categories,
        });

        return await budget.save();
    }

    static async findByUserId(userId){
        return await BudgetModel.findOne(userId);
    }
}

module.exports = Budget;