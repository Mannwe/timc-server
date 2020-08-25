'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/movieController')
const auth = require('../middleware/auth')

// Crear película
router.post('/', 
    auth,
    controller.createMovie
)

// Obtener películas
router.get('/',
    auth,
    controller.getMovies
)

// Contar número de películas
router.get('/count/',
    auth,
    controller.countMovies
)

// Actualizar película
router.put('/:id',
    auth,
    controller.updateMovie
)

// Borramos la película
router.delete('/:id',
    auth,
    controller.deleteMovie
)
    
module.exports = router
