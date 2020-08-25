'use strict'

const mongoose = require('mongoose')

const MovieSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movieId:{
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: Number
    },
    cast: {
        type: String,
        trim: true
    },
    director: {
        type: String,
        trim: true
    },
    plot: {
        type: String,
        trim: true
    },
    opinion: {
        type: String,
        trim: true
    },
    lentTo:{
        type: String,
        trim: true
    },
    image:{
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('Movie', MovieSchema)