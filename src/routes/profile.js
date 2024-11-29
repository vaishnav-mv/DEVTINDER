const express = require('express')
const profileRouter = express.Router()

const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation')

profileRouter.get("/view",userAuth,async(req,res)=>{
    try{
        const user = req.user;

        res.send(user);

    }catch(err){
        res.status(400).send("error: "+err.message);
    }
})

profileRouter.patch("/edit",userAuth,async(req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }
        
        // do all other necessary validations

        const loggedInUser = req.user  // i get the user which the auth middleware has attached with the request
        

        Object.keys(req.body).forEach((key)=> (loggedInUser[key]=req.body[key]))
        
        await loggedInUser.save()  //save to db
        
        // res.send(`${loggedInUser.firstName} profile updataed successfully`)

        res.json({message:`${loggedInUser.firstName} profile updataed successfully`,data:loggedInUser}) //this is the good way of sending the response

    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
})

//write the forgot password api take existing pswd, take new pswd, validate the user, check new pswd is strong, no need to compare old pswd since the user is logged in

module.exports = profileRouter