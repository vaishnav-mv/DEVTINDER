const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address"+ value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password not strong"+ value);
            }
        }

    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:['male','female','others'],
            message:`{value} is not a valid gender type`
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("gender is not valid");
        //     }
        // }
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/imgres?q=dummy%20%20photo&imgurl=https%3A%2F%2Fpinnacle.works%2Fwp-content%2Fuploads%2F2022%2F06%2Fdummy-image.jpg&imgrefurl=https%3A%2F%2Fpinnacle.works%2Fdummy-image%2F&docid=DNP0Mre_yiaEeM&tbnid=wNwYhuVmPXUBSM&vet=12ahUKEwjZgsemqrOJAxXGTmwGHVsDIQoQM3oECBUQAA..i&w=452&h=449&hcb=2&ved=2ahUKEwjZgsemqrOJAxXGTmwGHVsDIQoQM3oECBUQAA",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid URL"+ value);
            }
        }
    },
    about:{
        type:String,
        default:"This is the default description"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

userSchema.index({ emailId: 1 }, { unique: true });

userSchema.methods.getJWT = async function (){
    const user = this; //represent that particular user model

    const token = await jwt.sign({_id:user._id},"Dev@Tinder$77",{expiresIn:"1d"});  //hiding the userid inside the token

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash); //this order is important

    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);
module.exports = User;