const mongoose = require('mongoose')

const ChannelSchema = new mongoose.Schema({
    channelName: {
        type:String,
        default: 'New Server'
    },
    channelType:{
        type:String,
        default:'text'
    },
    parent:{
        type : String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Channel', ChannelSchema)