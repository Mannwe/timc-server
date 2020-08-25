'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')

// Crear usuarios
router.post('/', controller.createUser)

module.exports = router

