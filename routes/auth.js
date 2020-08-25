'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const auth = require('../middleware/auth')

// Iniciamos sesión
router.post('/', controller.login)
router.get('/', 
    auth,   // Le añadimos el middleware para obtener la id del usuario a partir del token
    controller.getUser
)

module.exports = router