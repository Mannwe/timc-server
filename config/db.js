'use strict'

// Agregamos dotenv para trabajar con variables de entorno
require('dotenv').config({path: 'variables.env'})

// Nos conectamos a la base de datos a través de mongoose
const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('Base de datos conectada');
    }
    catch(error){
        console.log(error)
        process.exit(1) // Detenemos la aplicación
    }
}

module.exports = connectDB