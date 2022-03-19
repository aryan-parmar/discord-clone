const mongoose = require('mongoose')

const ActiveVoiceChat = new mongoose.Schema({
    channelId: {
        type:String,
        required:true
    },
    members:{
        type:Array,
    }
})
module.exports = mongoose.model('ActiveVoiceChat', ActiveVoiceChat)