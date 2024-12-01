const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

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
        res.json({
            message:req.user.firstName +" is "+status +" in "+ toUser.firstName,
            data
        })

    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
})


module.exports = requestRouter