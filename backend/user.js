import UserModel from '../database/userModel'

export class User {
    constructor(username, password){
        this.username = username;
        this._password = password;
    }
    set password(p){
        this._password = p;
    }
    get password() {
        return this._password;
    }

    async save(){
        const user = new UserModel ({
            username: this.username,
            password: this._password,
        });

        return await user.save();
    }

    static async findByUsername(username){
        return await UserModel.findOne(username);
    }

}
