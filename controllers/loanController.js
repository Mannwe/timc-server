'use strict'

const Loan = require('../models/Loan')
const Movie = require('../models/Movie')

exports.createLoan = async (req, res) => {
    const newLoan = new Loan(req.body)
    const { movieTitle, loanDate } = newLoan

    try {

        // Buscamos el id de la película a la que pertenece el préstamo
        const movie = await Movie.findOne({ title: movieTitle })

        if(!movie){
            return res.status(404).json({ msg: 'No se ha encontrado la película de este préstamo'})
        }
        const { _id: movieId } = movie

        // Validamos que no exista ya el préstamo en la misma fecha
        let loan = await Loan.find({ movieTitle, loanDate })
        if(loan && loan.length > 0){
            return res.status(500).json({ msg: `Ya existe un préstamo de ${movieTitle} para esa fecha`})
        }
        
        // Validamos que la película esté prestada y no la hayan devuelto
        loan = await Loan.find({ 
            movieTitle, 
            $and:[
                { loanDate: {$ne: null} },
                { returnDate: {$eq: null} } 
            ]
        })

        if(loan && loan.length > 0){
            return res.status(500).json({ msg: `${movieTitle} está prestada y no ha sido devuelta`})
        }

        newLoan.movieId = movieId
        newLoan.userId = req.user.id

        await newLoan.save()
        res.json({ msg: 'Préstamo creado'})
    } catch (error) {
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}

exports.getLoans = async (req, res) => {

    // Extraemos los filtros de los parámetros
    const filters = {...req.query}

    if(filters.skip) delete filters.skip
    if(filters.limit) delete filters.limit
    
    filters.userId = req.user.id

    // Extraemos los valores de la paginación
    const { skip, limit } = req.query

    try {
        const loans = await Loan.find(filters).sort({ movieTitle: 1, loanDate: 1}).limit(parseInt(limit)).skip(parseInt(skip))
        res.status(200).json({ loans })
    } catch (error) {
        console.log(error.response.data.msg)
        res.status(500).json({ msg: 'Se ha producido un error' })
    } 
}

/*exports.getLoansByMovie = async (req, res) => {
    try {
        const { movieId } = req.query

        // Verificamos que exista la película
        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({ msg: 'No se ha encontrado la película de este préstamo'})
        }

        // Extraemos los filtros de los parámetros
        const filters = {...req.query}

        if(filters.skip) delete filters.skip
        if(filters.limit) delete filters.limit
        
        filters.userId = req.user.id
        filters.movieId = movieId

        // Extraemos los valores de la paginación
        const { skip, limit } = req.query

        const loans = await Loan.find(filters).sort({ movieTitle: 1, loanDate: -1}).limit(parseInt(limit)).skip(parseInt(skip))
        //const loans = await Loan.find({ movieId }).sort({ movieTitle: 1, loanDate: -1})
        res.status(200).json({ loans })
        
    } catch (error) {
        console.log(error.response.data.msg)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}*/

exports.getLastLoan = async(req, res) => {
    try {
        const { movieId } = req.query
        
        // Comprobamos que exista la película
        const movie = await Movie.findById(movieId)

        if(!movie){
            return res.status(404).json({ msg: 'No se ha encontrado la película de los préstamos'})
        }
        const filter = {movieId, returnDate: { $eq: null } }

        // Obtenemos los resultados
        const loan = await Loan.findOne(filter).sort({ loanDate: -1})
        console.log(loan)
        res.status(200).json({ loan })
    } catch (error) {
        console.log(error.response.data.msg)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}

exports.updateLoan = async (req, res) => {

    const newLoan = {}

    const { movieId, movieTitle, lendTo } = req.body
    let { loanDate, returnDate } = req.body

    try {
        // Comprobamos que el préstamo exista
        let loan = await Loan.findById(req.params.id) 

        if(!loan){
            return res.status(404).json({ msg: 'El préstamo no existe'})
        }

        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({ msg: 'No se ha encontrado la película de este préstamo'})
        }

        if(!(new Date(loanDate) instanceof Date)) loanDate = null
        if(!(new Date(returnDate) instanceof Date)) returnDate = null

        newLoan.movieTitle = movieTitle
        newLoan.lendTo = lendTo
        newLoan.loanDate = loanDate
        newLoan.returnDate = returnDate

        loan = await Loan.findByIdAndUpdate({_id: req.params.id}, {$set: newLoan}, {new: true})
        res.status(200).json({ loan })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}

exports.deleteLoan = async (req, res ) => {

    try {
        // Comprobamos que el registro exista
        let loan = await Loan.findById(req.params.id)

        if(!loan){
            return res.status(404).json({ msg: 'El préstamo no existe'})
        }

        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({ msg: 'No se ha encontrado la película de este préstamo'})
        }

        await Loan.findByIdAndRemove({ _id: req.params.id })
        res.status(200).json({ msg: 'Registro eliminado' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
    
}

exports.countLoans = async (req, res) => {
    const filters = req.query
    filters.userId = req.user.id
    
    // Si no se utilizan filtros, no mostramos nada
    if(Object.keys(filters).length !== 0){        
        try {
            await Loan.find(filters).sort({ title: 1 }).countDocuments((err, count) => {
                res.status(200).json({ count })
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: 'Se ha producido un error' })
        }
    }
}