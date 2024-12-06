const ExpenseModel = require('../database/expenseModel');

export class Expense{
    constructor(userId, amount, category, description = ''){
        this._userId = userId
        this._amount = amount;
        this._category = category;
        this._description = description;
        this._date = new Date();
    }

    async save() {
        const expense = new ExpenseModel({
            userId: this._userId,
            amount: this._amount,
            category: this._category,
            description: this._description,
            date: this._date,
        })
        return await expense.save()
    }

    static async findByUsername(userId){
        return await ExpenseModel.find({userId});
    }

    static async findByCategory(userId, category){
        return await ExpenseModel.find({userId, category});
    }
}
