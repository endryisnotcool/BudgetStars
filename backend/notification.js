const NotificationModel = require('../database/notificationModel');

class Notification{
    constructor(userId, type, message){
        this._userId = userId;
        this._type = type;
        this._message = message;
    }

    async save() {
        const notification = new NotificationModel ({
            userId: this._userId,
            type: this._type,
            message: this._message,
        })
    }

    static async findByUserId(userId){
        return await NotificationModel.find(userId);
    }
}

module.exports = Notification;