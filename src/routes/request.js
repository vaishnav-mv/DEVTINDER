const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user');
const { connection } = require('mongoose');

const sendEmail=require("../utils/sendEmail")

requestRouter.post("/send/:status/:toUserId",userAuth,async (req,res)=>{
    try {
        const fromUserId = req.user._id  //fromUserId comes from loggedin user through userAuth as it adds it to the req object
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ['interested','ignored']
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"invalid status type: "+ status})    // if you dont write return the code will move ahead
        }


        const toUser = await User.findById(toUserId)  //to check whether the person we are sending the request is present in the db
        if(!toUser){
            return res.status(404).json({message:"user not found"})
        }



        //if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("Message: connection request already exist") // it is also handled in the schema level
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()

        const emailRes=await sendEmail.run()

        res.json({
            message:req.user.firstName +" is "+status +" in "+ toUser.firstName,
            data
        })

    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
})

requestRouter.post("/review/:status/:requestId",userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user
        const {status,requestId} =req.params

        //validate the status
        const allowedStatus = ['accepted','rejected']
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"})
        }

        
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId, //make sure requestId is valid
            toUserId : loggedInUser._id, //check loggedIn userId is toUserId
            status:"interested" //check if status is interested
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"})
        }
        
        connectionRequest.status = status  //if it satisfies the conditions, change the status 

        const data = await connectionRequest.save() //data gives you the modified connection request

        res.json({message:"connection request "+status,data})


    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
    
})


module.exports = requestRouter