const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const User = require('./models/user.js');
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const user = new User(req.body); //creating a new instance of the User model
    try{
        await user.save(); //saves into database.also returns a promise
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("error in saving the data")
    }
})

app.get("/users",async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId:userEmail}); //user is an array. user.length can be used to handle empty array
        if(user.length===0){
            res.status(404).send("user not found");
        }else{
            res.status(400).send(user);
        }
        
    }catch(err){
        console.log("something went wrong");
    }
})

//feed api to get all users from the database
app.get("/feed",async (req,res)=>{
    try{
        const user = await User.find({})
        if(!user){
            res.send("user not found");
        }else{
            res.send(user)
        }
    }catch(err){
        console.log("something went wrong");
    }
})

app.delete("/users",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }catch(err){
        res.status(404).send("user not found");
    }
})

app.patch("/users",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after",
            runValidators:true
        });
        res.send("user updated successfully");
    }catch(err){
        res.status(404).send("update failed"+err.message);
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
