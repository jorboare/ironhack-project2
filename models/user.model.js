const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSch = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    name: String,
    about: String,
    role: {
        type: String,
        enum: ['admin', 'guest'],
        default: 'guest',
        required: true
    },
    img: String,
    watchlist: {
        movies: [{
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }], series: [{
            type: Schema.Types.ObjectId,
            ref: 'Series'
        }]
    },
    seen: {
        movies: [{
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }], series: [{
            type: Schema.Types.ObjectId,
            ref: 'Series'
        }]
    },
    likes: {
        movies: [{
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }], series: [{
            type: Schema.Types.ObjectId,
            ref: 'Series'
        }]
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSch)