const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    message: {
        type:String
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
    },
    senderId: {
        type: String,
        required: true,
    },
    senderProfile:{
        type:String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    filedata:{
        type: Object,
        default: {}
    }
})
module.exports = mongoose.model('Chat', ChatSchema)