const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const User = require('./models/user.js');

app.post("/signup",async (req,res)=>{
    const userObj = {
        firstName:"Vaishnav",
        lastName: "M V",
        emailId:"vaishanv@abc.com",
        password:"123",
        age:22,
        gender:"male"
    }
    const user = new User(userObj); //creating a new instance of the User model
    try{
        await user.save(); //saves into database.also returns a promise
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("error in saving the data")
    }
})

connectDB()
.then(()=>{
    console.log("database connection estsblished successfully");
    app.listen(8000,()=>{
        console.log("listening to port 8000");
    });
})
.catch(()=>{
    console.log("database connection not established");
})
