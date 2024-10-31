const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req,res,next)=>{
    try{
        //Read the cookie from req cookies
        const {token} = req.cookies;

        if(!token){
            throw new Error("token is not valid");
        }

        const decodedObj = await jwt.verify(token,"Dev@Tinder$77");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }

        req.user = user;
        next();


        //validate the token

        //find the user
        }catch(err){
            res.status(400).send("error: "+ err.message);
        }

};

module.exports={userAuth};