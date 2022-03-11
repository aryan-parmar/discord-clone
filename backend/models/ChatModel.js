const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    message: {
        type:String,
        required: true
    },
    channel:{
        type:String,
        required: true
    },
    time:{
        type : Date,
        default: Date.now
    },
    by: {
        type: String,
        required: true,
    },
    senderProfile:{
        type:String,
        default: ''
    }
})
module.exports = mongoose.model('Chat', ChatSchema)