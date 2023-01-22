import express from 'express'
import {uploadImages} from "../plugins/multer.js";
import UsersController from "./UsersController.js";

const router = express.Router();

router.get('/', UsersController.getPage)
router.get('/im', UsersController.getMe)
router.post('/upload-avatar', uploadImages.single('avatar'), UsersController.uploadAvatar)

export default router;
