const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const User = require('./models/user.js');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
    try{
        //validation of data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password} = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

        //creating a new instance of the User model
        const user = new User({firstName,lastName,emailId,password:passwordHash}); 

        await user.save(); //saves into database.also returns a promise
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("error in saving the data: "+err.message);
    }
})

app.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        //add a validator here

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
    

        if(isPasswordValid){

            //Create a JWT token
            const token = await user.getJWT();

            //Add the token to the cookie and send the response back to the user
            res.cookie("token",token);

            res.send("login successful");
        }else{
            throw new Error("Invalid credentials");
        }



    }catch(err){
        res.status(400).send("ERROR: "+err.message);    
    }
})

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;

        res.send(user);

    }catch(err){
        res.status(400).send("error: "+err.message);
    }
})

app.post("/sendConnectionRequest",userAuth,(req,res)=>{
    const user = req.user;
    console.log("sending connection request");
    res.send(user.firstName +" send the connection request");
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

app.patch("/users/:userId",async(req,res)=>{
    const userId = req.params?.userId; //if we give req.body.userId we should provide it in the body 
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["firstName","lastName","password","age","gender","photoUrl","about","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        if(data.skills.length>10){
            throw new Error("Max limit for adding skills exceeded"); //this is api level validation. you can also do this at db level
        }

        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after",
            runValidators:true
        });
        res.send("user updated successfully");
    }catch(err){
        res.status(404).send("update failed: "+err.message);
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
