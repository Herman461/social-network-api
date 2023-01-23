import database from "../database/database.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const privateKey = '1a2b-3c4d-5e6f-7g8h'

class UsersModel {
    static async getMe() {
        // const user = await database.one('SELECT * FROM users WHERE id = $1', [1])
        const user = {}
        return user;
    }

    static async create(data) {
        const { password, email } = data

        const hashedPassword = bcrypt.hashSync(password, 10)

        await database.none(
            'INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})',
            {email, hashedPassword}
        )

        const result = await database.one('SELECT (id) FROM users WHERE email = $1', [email])
        console.log(result.id)

        const token = await jwt.sign(
            {
                userId: result.id,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            privateKey,
            { algorithm: 'HS256' },
            undefined
        )


        return token;
    }

}


export default UsersModel
