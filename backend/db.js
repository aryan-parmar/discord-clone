var mongoose = require('mongoose');
let uri = process.env.MONGO_DB_URI+"/discordClone"
const mongo = async ()=>{
    try{
        const conn = await mongoose.connect(uri,{
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