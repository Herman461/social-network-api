import UsersModel from "./UsersModel.js";

class UsersController {

    static async getMe(req, res) {
        return await UsersModel.getMe()
    }

    static uploadAvatar(req, res) {
        return res.sendStatus(200)
    }

    static async getPage(req, res) {
        return res.render('users')
    }
}

export default UsersController
