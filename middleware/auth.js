'use strict'

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    // Leemos el token del header
    const token = req.header('x-auth-token')

    // Validamos si hay token
    if(!token){
        return res.status(401).json({ msg: 'No existe autenticación del usuario. No se ha podido conectar' })
    }

    // Validamos que el token sea correcto
    try {
        const encoding = jwt.verify(token, process.env.SECRET)
        req.user = encoding.user
        next() // Para que continúe por el siguiente middleware
    } catch (error) {
        console.log(error.response)
        return res.status(401).json({ msg: 'Ha fallado la autenticación' })        
    }

}