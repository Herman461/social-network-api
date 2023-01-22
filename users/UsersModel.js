import database from "../database/database.js";

class UsersModel {
    static async getMe() {
        const user = await database.one('SELECT * FROM users WHERE id = $1', [1])

        return user;
    }
}


export default UsersModel
