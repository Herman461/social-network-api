'use strict';

import express from "express";

import cors from "cors";
import pug from "pug";

import usersRouter from "./users/UsersRouter.js";

const app = express()
const port = 8000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.use('/users', usersRouter)

app.engine('pug', pug.__express)
app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('./public'))
