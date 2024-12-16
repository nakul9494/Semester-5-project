require('dotenv').config();
const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

var connection = mongoose.connection

connection.on('error', ()=>{
    console.log('MONGO DB CONNECTION FAILED')
})

connection.on('connected', ()=>{
    console.log('MONGO DB CONNECTION SUCCESSFUL')
})

module.exports = mongoose
//db