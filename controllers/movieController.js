'use strict'

const Movie = require('../models/Movie')

exports.createMovie = async (req, res) => {
    try {
        // Creamos una nueva película
        const movie = new Movie(req.body)
        const { title } = movie

        // Recuperamos el id del usuario desde el middleware si se ha validado el token
        movie.userId = req.user.id

        // No puede haber dos películas con el mismo título
        const sameTitleMovie = await Movie.find({ title })
        if (sameTitleMovie && sameTitleMovie.length > 0){
            return res.status(500).json({ msg: 'Ya existe una película con ese título' })
        }

        // Guardamos la película
        await movie.save()
        res.json({msg: 'Película creada'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}

exports.getMovies = async (req, res) => {

    // Extraemos los filtros de los parámetros
    const filters = {...req.query}

    if(filters.skip) delete filters.skip
    if(filters.limit) delete filters.limit
    
    filters.userId = req.user.id

    // Extraemos los valores de la paginación
    const { skip, limit } = req.query

    try {
        const movies = await Movie.find(filters).sort({ title: 1 }).limit(parseInt(limit)).skip(parseInt(skip))
        res.status(200).json({ movies })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Se ha producido un error' })
    }
}

exports.updateMovie = async (req, res) => {
    
    const newMovie = {}

    // Obtenemos los campos de la película actualizada
    const { title, year, director, cast, plot, opinion, lentTo } = req.body
    let { loanDate } = req.body

    try {
        // Validamos que la película exista
        let movie = await Movie.findById(req.params.id)

        if(!movie){
            return res.status(404).json({ msg: 'La película no existe '})
        }

        // Validamos que el usuario actual coincida con el de la autenticación
        if(movie.userId.toString() !== req.user.id){
            return res.status(500).json({ msg: 'Error en la autenticación del usuario' })
        } 

        if(!(new Date(loanDate) instanceof Date)) loanDate = null

        // Actualizamos valores en el nuevo objeto y guardamos
        newMovie.title = title
        newMovie.year = year
        newMovie.director = director
        newMovie.cast = cast
        newMovie.plot = plot
        newMovie.opinion = opinion
        newMovie.lentTo = lentTo
        newMovie.loanDate = loanDate

        movie = await Movie.findByIdAndUpdate({_id: req.params.id}, {$set: newMovie}, {new: true})
        res.status(200).json({ movie })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Se ha producido un error '})
    }
}

exports.deleteMovie = async (req, res) => {

    // Validamos que la película exista
    let movie = await Movie.findOne({ _id: req.params.id })

    if(!movie){
        return res.status(404).json({ msg: 'La película no existe' })
    }

    // Comprobamos que el usuario de la película a eliminar sea el mismo que se ha autenticado
    if(movie.userId.toString() !== req.user.id){
        return res.status(500).json({ msg: 'Error en la autenticación del usuario' })
    }

    try {

        await Movie.findOneAndRemove({_id: req.params.id})
        return res.status(200).json({ msg: 'Registro eliminado' })
    } catch (error) {
        console.log(error)
        res.status.send(500).json({ msg: 'Se ha producido un error' })
    }

}

exports.countMovies = async (req, res) => {
    const filters = req.query
    filters.userId = req.user.id
    
    // Si no se utilizan filtros, no mostramos nada
    if(Object.keys(filters).length !== 0){        
        try {
            await Movie.find(filters).sort({ title: 1 }).countDocuments((err, count) => {
                res.status(200).json({ count })
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: 'Se ha producido un error' })
        }
    }
}