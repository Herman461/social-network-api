import express from 'express'
import {uploadImages} from "../plugins/multer.js";
import UsersController from "./UsersController.js";
import jwt from "jsonwebtoken";

const privateKey = '1a2b-3c4d-5e6f-7g8h'

const router = express.Router();

router.use(express.urlencoded({ extended: false }))
router.use(express.json())

router.use((req, res, next) => {

    if (!req.headers.authorization) return res.redirect(301, '/')

    // Verify user
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        privateKey,
        (err, payload) => {
            if (err) return res.redirect(301, '/')

            next()
        },
        undefined
    )
})


router.get('/', UsersController.getPage)
router.get('/im', UsersController.getMe)
// router.get('/auth', UsersController.auth)
router.post('/create', UsersController.create)
router.post('/upload-avatar', uploadImages.single('avatar'), UsersController.uploadAvatar)



export default router;
