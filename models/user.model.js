const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSch = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    about: String,
    role: {
        type: String,
        enum: ['admin', 'guest'],
        default: 'guest',
        required: true
    },
    img: String

}, { timestamps: true })

module.exports = mongoose.model('User', userSch)