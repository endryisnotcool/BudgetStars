const ReportModel = require('../database/reportModel');

class Report{
    constructor(userId, reportType, data){
        this._userId = userId;
        this._reportType = reportType;
        this._data = data;
    }

    async save() {
        const report = new ReportModel({
            userId: this._userId,
            reportType: this._reportType,
            data: this._data,
        });

        return await report.save();
    }

    static async findByUserId(userId){
        return await ReportModel.find({userId});
    }
}

module.exports = Report;