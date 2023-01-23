import UsersModel from "./UsersModel.js";
import * as EmailValidator from 'email-validator';

class UsersController {

    static async getMe(req, res) {
        return res.send(200)
        // return await UsersModel.getMe()
    }

    static async create(req, res) {
        const { email, password, verifiedPassword } = req.body;

        if (
            typeof email !== 'string'
            || !EmailValidator.validate(email)
            || email.length > 512
        ) return res.status(400).send("Error!")

        if (
            typeof password !== 'string'
            || typeof verifiedPassword !== 'string'
            || verifiedPassword !== password
            || password.length > 512
        ) return res.status(400).send("Error!")


        const user = await UsersModel.create({email, password})

        return res.json(user)
    }

    static uploadAvatar(req, res) {
        return res.sendStatus(200)
    }

    static async getPage(req, res) {
        return res.render('users')
    }
}

export default UsersController
