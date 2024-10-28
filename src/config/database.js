const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://NamasteDev:NamasteDev@devtinder.prj0e.mongodb.net/devTinder")
}

module.exports = connectDB;