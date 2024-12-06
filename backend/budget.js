import {BudgetModel} from "../database/budgetModel.js";

export class Budget {
    constructor(amount, categories){
        this._amount = amount;
        this._categories = categories;
    }

    async save(userId){
        const budget = new BudgetModel ({
            userId,
            totalBudget: this._amount,
            categories: this._categories,
        });

        return await budget.save();
    }

    static async findByUserId(userId){
        return await BudgetModel.findOne(userId);
    }
}
