'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/loanController')
const auth = require('../middleware/auth')

router.post('/', 
    auth,
    controller.createLoan
)

/*router.get('/all',
    auth,
    controller.getLoans
)*/

router.get('/last',
    auth,
    controller.getLastLoan
)

router.get('/',
    auth,
    controller.getLoans
)

router.get('/count/',
    auth,
    controller.countLoans
)

router.put('/:id',
    auth,
    controller.updateLoan
)    

router.delete('/:id',
    auth,
    controller.deleteLoan
)

module.exports = router