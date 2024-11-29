const express = require('express')
const authRouter = express.Router()

const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');


authRouter.post("/signup",async (req,res)=>{
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

authRouter.post("/login",async (req,res)=>{
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

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logout successful")
})


module.exports = authRouter