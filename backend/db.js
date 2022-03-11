var mongoose = require('mongoose');

const mongo = async ()=>{
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/discordClone',{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('DATABASE CONNECTED')
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = mongo