const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true,
        default: 'user.jpg'
    },
    userConfirmed:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    servers:{
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('user', UserSchema)