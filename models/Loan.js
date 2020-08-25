'use strict'

const mongoose = require('mongoose')

const LoanSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    movieTitle: {
        type: String,
        trim: true,
        required: true
    },
    lendTo: {
        type: String,
        trim: true,
        required: true
    },
    loanDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    }
})

module.exports = mongoose.model('Loan', LoanSchema)